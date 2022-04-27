let salesOffices = {}; // 售楼处，发布者
// 现在这个 销售员升级了，一个人管多个房子，不同的房子，通知不同的订阅人。

salesOffices.clientCollection = {}; // 缓存列表，存放订阅者回调函数（购买者）+

// 增加 订阅者回调函数，只订阅感兴趣的
salesOffices.listen = function (key, fn) {
  if (!salesOffices.clientCollection[key]) {
    // 第一次订阅，需要创建一个 该类型的 缓存列表
    salesOffices.clientCollection[key] = [];
  }

  salesOffices.clientCollection[key].push(fn); // 订阅的消息，添加到特定的 一类缓存列表中。
};

// 发布者，发布消息
salesOffices.trigger = function (key, ...args) {
  this.clientCollection.forEach((fn) => fn.call(this, ...args));
  // 售楼处给购房者发布的短信内容 args
};

/**================================== Test **/
// A订阅
salesOffices.listen((...args) => {
  console.log('A，收到了通知，房子信息', ...args);
});

// B订阅
salesOffices.listen((...args) => {
  console.log('B，收到了通知，房子信息', ...args);
});

salesOffices.trigger(2000, 110);
salesOffices.trigger(5000, 200);
