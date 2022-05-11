// once API 是有问题的: 不能被删除了
// 解决他的问题

/**================================== 实现 **/
function EventEmit() {
  this._events = {};
}

EventEmit.prototype.on = function (key, callback) {
  if (!this._events) {
    this._events = {};
  }

  if (!this._events[key]) {
    this._events[key] = [];
  }

  this._events[key].push(callback);
};

EventEmit.prototype.emit = function (key, ...args) {
  if (!this._events) {
    this._events = {};
  }

  if (!this._events[key]) {
    return;
  }

  this._events[key].forEach((cb) => cb(...args));
};

EventEmit.prototype.off = function (key, cb) {
  if (!this._events || !this._events[key]) {
    return;
  }

  const callbacks = this._events[key];
  for (let i = callbacks.length - 1; i >= 0; i--) {
    if (callbacks[i] === cb || callbacks[i].origin === cb) {
      callbacks.splice(i, 1);
    }
  }
};

EventEmit.prototype.offAll = function (key) {
  if (!this._events || !this._events[key]) {
    return;
  }

  this._events[key] = [];
};

// todo: 注意了
// 就触发一次，
EventEmit.prototype.once = function (key, callback) {
  if (!this._events) {
    // 动态创建
    this._events = {};
  }

  if (!this._events[key]) {
    this._events[key] = [];
  }

  // 当 callback 被调用会，就删除掉

  // 高阶函数 one 充当 callback，包裹一下，有别的逻辑要处理
  const one = (...args) => {
    callback(...args);
    this.off(key, one);
  };
  // 能够被正确的删除
  one.origin = callback;
  this._events[key].push(one);
};

/**================================== 测试 EventEmit **/
let e1 = new EventEmit();

function open(data) {
  console.log("OPEN 被触发了", data);
}

e1.once("open", open);

// e1.off("open", open);
// open 被 包裹到了 one 中

e1.emit("open", "hhhh 参数1");
e1.emit("open", "hhhh 参数2");
