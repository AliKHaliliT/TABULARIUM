// A minimal ZIP writer for text bundles: STORE method (no compression),
// UTF-8 names, one pass. Deliberately dependency-free, like the rest of the
// ecosystem's export code; content markdown is small enough that compression
// would buy nothing.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** MS-DOS date/time pair, the only timestamp format classic zip knows. */
function dosDateTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: (((d.getFullYear() - 1980) & 0x7f) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

/** One file destined for the archive: its path inside the zip, and its bytes. */
export interface ZipEntry {
  /** Forward-slash path inside the archive, e.g. "src/content/blog/post.md". */
  path: string;
  content: string;
}

/**
 * Packs entries into a zip archive with no compression and no dependency.
 *
 * Entries are stored rather than deflated, which keeps the writer small enough
 * to be worth owning; seed files are text and the archive is downloaded once.
 *
 * @param entries - The files to pack, each with its path inside the archive.
 *
 * @returns The archive as a blob, ready to hand to the browser.
 */
export function buildZip(entries: ZipEntry[], now: Date = new Date()): Blob {
  const encoder = new TextEncoder();
  const { time, date } = dosDateTime(now);
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  const u16 = (v: number) => [v & 255, (v >> 8) & 255];
  const u32 = (v: number) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];

  for (const entry of entries) {
    const name = encoder.encode(entry.path);
    const data = encoder.encode(entry.content);
    const crc = crc32(data);

    const local = new Uint8Array([
      ...u32(0x04034b50), // local file header signature
      ...u16(20),         // version needed
      ...u16(0x0800),     // flags: UTF-8 names
      ...u16(0),          // method: STORE
      ...u16(time), ...u16(date),
      ...u32(crc),
      ...u32(data.length), // compressed size (same: stored)
      ...u32(data.length), // uncompressed size
      ...u16(name.length),
      ...u16(0),           // extra length
      ...name,
    ]);
    localParts.push(local, data);

    centralParts.push(
      new Uint8Array([
        ...u32(0x02014b50), // central directory signature
        ...u16(20),         // version made by
        ...u16(20),         // version needed
        ...u16(0x0800),
        ...u16(0),
        ...u16(time), ...u16(date),
        ...u32(crc),
        ...u32(data.length),
        ...u32(data.length),
        ...u16(name.length),
        ...u16(0), ...u16(0), // extra, comment
        ...u16(0),            // disk number
        ...u16(0),            // internal attrs
        ...u32(0),            // external attrs
        ...u32(offset),       // local header offset
        ...name,
      ])
    );
    offset += local.length + data.length;
  }

  const centralSize = centralParts.reduce((n, p) => n + p.length, 0);
  const eocd = new Uint8Array([
    ...u32(0x06054b50),
    ...u16(0), ...u16(0),
    ...u16(entries.length), ...u16(entries.length),
    ...u32(centralSize),
    ...u32(offset),
    ...u16(0),
  ]);

  return new Blob([...localParts, ...centralParts, eocd] as BlobPart[], {
    type: "application/zip",
  });
}
