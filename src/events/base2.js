// 优化继承逻辑

/**================================== 实现 **/
function EventEmit() {
  this._events = {};
}

EventEmit.prototype.on = function (key, callback) {
  if (!this._events) {
    this._events = {};
    // 继承 EventEmit 的构造函数内部，不需要写
    // EventEmit.call(this);
    // 因为 this 是动态的，完全可以在调用原型对象时，给 this 动态添加
    // this 执行 new 出来的实例
  }

  if (!this._events[key]) {
    this._events[key] = [];
  }
  this._events[key].push(callback);
};
EventEmit.prototype.emit = function (key, ...args) {
  // 安全起见，要是先调用 emit 了呢？
  if (!this._events) {
    this._events = {};
  }

  if (!this._events[key]) {
    return;
  }

  this._events[key].forEach((cb) => cb(...args));
};

/**================================== 继承（不灵活） **/
function Girl() {
  // EventEmit.call(this);
}

Girl.prototype.__proto__ = EventEmit.prototype;
// Object.setPrototypeOf(Girl.prototype, EventEmit.prototype); // 等效于上面的
// Girl.prototype = Object.create(EventEmit.prototype) // 这样不好，修改了 Girl 的构造函数了

/**================================== 测试 EventEmit **/
let e1 = new EventEmit();

e1.on("open", (data) => {
  console.log("open1", data);
});
e1.on("open", (data) => {
  console.log("open2", data);
});
e1.emit("open", "hhhh 参数");

/**================================== 测试继承 **/
let g1 = new Girl();
g1.on("open", (data) => {
  console.log("g- open1", data);
});
g1.on("open", (data) => {
  console.log("g- open2", data);
});
g1.on("open", (data) => {
  console.log("g- open3", data);
});
g1.emit("open", "g- hhhh 参数");
