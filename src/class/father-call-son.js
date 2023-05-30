class Father {
  read() {
    this._read();
  }
}

class Son extends Father {
  _read() {
    console.log('son _read 被调用');
  }
}

let son = new Son();

son.read();

// 父类调用子类方法，本质是 this 是动态的。
