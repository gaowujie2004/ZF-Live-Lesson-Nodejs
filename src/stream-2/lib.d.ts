import { createReadStream, createWriteStream } from 'fs';

declare namespace T {
  type ReadStreamOptions = Exclude<Parameters<typeof createReadStream>[1], BufferEncoding>;
  type WriteStreamOptions = Exclude<Parameters<typeof createWriteStream>[1], BufferEncoding>;

  interface FIFOCacheItem {
    chunk: Buffer;
    callback: () => void; // fs.write成功后的回调
  }

  type EventType = 'open' | 'data' | 'end' | 'close' | 'error';
}
