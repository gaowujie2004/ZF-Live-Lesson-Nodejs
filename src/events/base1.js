/**================================== 实现 **/

function EventEmit() {
  this._events = {};
}

EventEmit.prototype.on = function (key, callback) {
  const callbacks = this._events[key] || [];
  callbacks.push(callback);
  this._events[key] = callbacks;

  // if (!this._events[key]) {
  //   this._events[key] = []
  // }
  // this._events[key].push(callback)
};
EventEmit.prototype.emit = function (key, ...args) {
  if (!this._events[key]) {
    return;
  }

  this._events[key].forEach((cb) => cb(...args));
};

/**================================== 继承（不灵活） **/
function Girl() {
  EventEmit.call(this);
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
g1.emit("open", "g- hhhh 参数");
