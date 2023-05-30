class Father {
  constructor() {
    this.b = 'father'; // 实例对象
  }
  test() {
    console.log('--Father test()  this', this); // 实例对象
    window['fatherThis'] = this;
  }
}

class Son extends Father {
  constructor() {
    // console.log('son constructor: super', super)
  }

  name = 'son';
  test() {
    window['sonThis'] = this;

    super.test();
    console.log('son.test  this', this, super.b);
  }
}

let son = new Son();

son.test();

/**
 * super关键字：
 * 1、在子类构造函数中，super表示父类构造函数，在其他情况下不能使用super关键字
 * 2、在子类方法中，super不能单独使用，必须要 super.xxxx，此时super表示父类原型对象
 */

// fatherThis === sonThis
