/** Trigger a browser download of an in-memory text file. */
export function downloadTextFile(
  filename: string,
  text: string,
  type = "application/json;charset=utf-8"
) {
  downloadBlobFile(filename, new Blob([text], { type }));
}

/** Trigger a browser download of an in-memory blob (zip bundles). */
export function downloadBlobFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
