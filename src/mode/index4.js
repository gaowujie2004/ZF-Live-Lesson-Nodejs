// 取消订阅事件

const _event = {
  clientMap: {}, // 订阅列表

  listen(key, fn) {
    if (!salesOffices.clientMap[key]) {
      // 第一次订阅，需要创建一个 该类型的 缓存列表
      salesOffices.clientMap[key] = [];
    }

    salesOffices.clientMap[key].push(fn); // 订阅的消息，添加到特定的 一类缓存列表中。
  }, // 添加订阅者

  trigger(key, ...args) {
    this.clientMap[key].forEach((fn) => fn.call(this, ...args));
    // 售楼处给购房者发布的短信内容 args
  }, // 发布订阅
};

_event.remove = function (key, fn) {
  const fns = this.clientMap[key];
  if (!fns) {
    return false;
  }
  const fnIndex = fns.findIndex((f) => f === fn);
  if (fnIndex !== -1) {
    this.clientMap[key].splice(fnIndex, 1);
    return true;
  }
};

_event.removeAll = function (key) {
  this.clientMap[key].length && (this.clientMap[key].length = 0);
};

// 给任意对象都动态安装发布-订阅功能。
function installEvent(obj) {
  Object.entries(_event).forEach(([key, val]) => {
    obj[key] = val;
  });
}

let salesOffices = {}; // 售楼处，发布者
installEvent(salesOffices);

// A订阅，88平方米的房子
let A = (price) => {
  console.log('A，收到了通知，房子信息', `价格：${price} —— 88平方，`);
};
salesOffices.listen('squareMeter88', A);

salesOffices.removeAll('squareMeter88');

salesOffices.trigger('squareMeter88', 9000);

salesOffices.remove('squareMeter88', A);
salesOffices.trigger('squareMeter88', 9000);
