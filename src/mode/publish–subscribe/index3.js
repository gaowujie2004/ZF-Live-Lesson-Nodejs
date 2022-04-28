// 8.5 发布-订阅模式的通用实现

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

// 给任意对象都动态安装发布-订阅功能。
function installEvent(obj) {
  Object.entries(_event).forEach(([key, val]) => {
    obj[key] = val;
  });
}

let salesOffices = {}; // 售楼处，发布者
installEvent(salesOffices); // 给当前售楼处动态添加 发布-订阅功能

// A订阅，88平方米的房子
salesOffices.listen('squareMeter88', (price) => {
  console.log('A，收到了通知，房子信息', `价格：${price} —— 88平方，`);
});
salesOffices.listen('squareMeter88', (price) => {
  console.log('A1，收到了通知，房子信息', `价格：${price} —— 88平方，`);
});
salesOffices.listen('squareMeter88', (price) => {
  console.log('A2，收到了通知，房子信息', `价格：${price} —— 88平方，`);
});

// B订阅
salesOffices.listen('squareMeter100', (price) => {
  console.log('B，收到了通知，房子信息', `价格：${price} —— 100平方，`);
});

// 通知
salesOffices.trigger('squareMeter88', 9000);

salesOffices.trigger('squareMeter100', 80000);
