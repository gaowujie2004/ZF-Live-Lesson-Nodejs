// 订阅者只订阅感兴趣的

let salesOffices = {}; // 售楼处，发布者
// 现在这个 销售员升级了，一个人管多个房子，不同的房子，通知不同的订阅人。

salesOffices.clientMap = {}; // 缓存列表，存放订阅者回调函数（购买者）+

// 增加 订阅者回调函数，只订阅感兴趣的
salesOffices.listen = function (key, fn) {
  if (!salesOffices.clientMap[key]) {
    // 第一次订阅，需要创建一个 该类型的 缓存列表
    salesOffices.clientMap[key] = [];
  }

  salesOffices.clientMap[key].push(fn); // 订阅的消息，添加到特定的 一类缓存列表中。
};

// 发布者，发布消息
salesOffices.trigger = function (key, ...args) {
  this.clientMap[key].forEach((fn) => fn.call(this, ...args));
  // 售楼处给购房者发布的短信内容 args
};

/**================================== Test **/
// A订阅，88平方米的房子
salesOffices.listen('squareMeter88', (price) => {
  console.log('A，收到了通知，房子信息', `价格：${price} —— 88平方`);
});
salesOffices.listen('squareMeter88', (price) => {
  console.log('A1，收到了通知，房子信息', `价格：${price} —— 88平方`);
});
salesOffices.listen('squareMeter88', (price) => {
  console.log('A2，收到了通知，房子信息', `价格：${price} —— 88平方`);
});

// B订阅
salesOffices.listen('squareMeter100', (price) => {
  console.log('BB，收到了通知，房子信息', `价格：${price} —— 100平方}`);
});

salesOffices.trigger('squareMeter88', 9000);

salesOffices.trigger('squareMeter100', 80000);
