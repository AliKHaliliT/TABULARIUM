// A thin GitHub REST client: the panel's "git backend". The browser talks
// straight to api.github.com with a fine-grained personal access token
// (Contents read/write on the one site repo); there is no server in between,
// and the token never leaves this machine's localStorage.

/** Which repository to talk to, and the token that authorizes it. */
export interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

/** One file as the remote reports it: its path and its blob hash. */
export interface RemoteFile {
  path: string;
  sha: string;
}

/** Where a branch currently points, which is the base every sync plan needs. */
export interface RemoteHead {
  commitSha: string;
  treeSha: string;
}

const API = "https://api.github.com";

async function api<T>(cfg: RepoConfig, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = ((await res.json()) as { message?: string }).message ?? "";
    } catch {
      // a non-JSON error body adds nothing
    }
    if (res.status === 401) throw new Error("GitHub rejected the token. Check it (and its expiry).");
    if (res.status === 403) throw new Error(`GitHub refused: ${detail || "the token lacks access to this repository"}.`);
    if (res.status === 404) throw new Error("Repository or branch not found (private repos need the token to grant Contents access).");
    if (res.status === 409 || res.status === 422) throw new Error(detail || "The repository changed underneath the request.");
    throw new Error(`GitHub error ${res.status}: ${detail || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Reads where a branch currently points.
 *
 * @param config - The repository and the token to authorize with.
 *
 * @returns The branch head, which every sync plan uses as its "theirs" side.
 *
 * @throws Error When the request fails or the branch does not exist, carrying
 *   the status so a bad token reads differently from a bad branch name.
 */
export async function getHead(cfg: RepoConfig): Promise<RemoteHead> {
  const branch = await api<{ commit: { sha: string; commit: { tree: { sha: string } } } }>(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/branches/${encodeURIComponent(cfg.branch)}`
  );
  return { commitSha: branch.commit.sha, treeSha: branch.commit.commit.tree.sha };
}

/** Every blob under `prefix` at the given tree, path → blob sha. */
export async function getTreeFiles(
  cfg: RepoConfig,
  treeSha: string,
  prefix: string
): Promise<RemoteFile[]> {
  const tree = await api<{ tree: { path: string; type: string; sha: string }[]; truncated: boolean }>(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/git/trees/${treeSha}?recursive=1`
  );
  if (tree.truncated) {
    throw new Error("The repository tree is too large for the API to list; sync needs a smaller repo.");
  }
  return tree.tree
    .filter((t) => t.type === "blob" && t.path.startsWith(prefix))
    .map((t) => ({ path: t.path, sha: t.sha }));
}

/**
 * Reads one blob's contents.
 *
 * @param config - The repository and the token to authorize with.
 * @param sha - The blob hash to read.
 *
 * @returns The decoded text.
 *
 * @throws Error When the request fails, carrying the status.
 */
export async function getBlobText(cfg: RepoConfig, sha: string): Promise<string> {
  const blob = await api<{ content: string; encoding: string }>(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/git/blobs/${sha}`
  );
  if (blob.encoding !== "base64") throw new Error(`Unexpected blob encoding: ${blob.encoding}`);
  const bytes = Uint8Array.from(atob(blob.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** One commit with every change and deletion, atomically, via the Git Data
 *  API. The ref update is NOT forced: if the branch moved since `baseCommit`,
 *  GitHub rejects it and the caller re-plans against the new head. */
export async function commitFiles(
  cfg: RepoConfig,
  baseCommit: string,
  baseTree: string,
  message: string,
  changes: { path: string; content: string }[],
  deletions: string[]
): Promise<{ commitSha: string }> {
  const treeItems = [
    ...changes.map((c) => ({ path: c.path, mode: "100644", type: "blob", content: c.content })),
    ...deletions.map((path) => ({ path, mode: "100644", type: "blob", sha: null })),
  ];
  const newTree = await api<{ sha: string }>(cfg, `/repos/${cfg.owner}/${cfg.repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree: treeItems }),
  });
  const commit = await api<{ sha: string }>(cfg, `/repos/${cfg.owner}/${cfg.repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommit] }),
  });
  await api(cfg, `/repos/${cfg.owner}/${cfg.repo}/git/refs/heads/${encodeURIComponent(cfg.branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  return { commitSha: commit.sha };
}

/** The sha git itself would give this content as a blob, so local text can be
 *  compared against the remote tree without downloading anything. */
export async function gitBlobSha(content: string): Promise<string> {
  const body = new TextEncoder().encode(content);
  const header = new TextEncoder().encode(`blob ${body.length}\0`);
  const full = new Uint8Array(header.length + body.length);
  full.set(header);
  full.set(body, header.length);
  const digest = await crypto.subtle.digest("SHA-1", full);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
