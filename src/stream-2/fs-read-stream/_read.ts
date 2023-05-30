import { Readable } from 'stream';

let index = 0;
let data = 64;

class MyReadable extends Readable {
  constructor() {
    super({ highWaterMark: 1000 });
  }
  _read(size: number): void {
    if (index > 3) {
      this.push(null);
      return;
    }

    let r1 = this.push(String.fromCharCode(++data), 'utf-8');
    let r2 = this.push(String.fromCharCode(++data), 'utf-8');
    let r3 = this.push(String.fromCharCode(++data), 'utf-8');
    let r4 = this.push(String.fromCharCode(++data), 'utf-8');
    console.log('r1 --- r4', r1, r2, r3, r4);

    index++;
  }
}

const myRead = new MyReadable();

myRead.on('readable', () => {
  console.log('看看');
  const res = myRead.read();
  console.log('readable res:', res?.toString());
});
