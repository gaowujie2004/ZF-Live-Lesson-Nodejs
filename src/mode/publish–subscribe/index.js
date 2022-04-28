let salesOffices = {}; // 售楼处，发布者

salesOffices.client = []; // 缓存列表，存放订阅者回调函数（购买者）

// 增加 订阅者回调函数
salesOffices.listen = function (fn) {
  this.client.push(fn);
};

// 发布者，发布消息
salesOffices.trigger = function (...args) {
  this.client.forEach((fn) => fn.call(this, ...args));
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

// A  和  B 购买者，收到相同的消息
// 存在以下问题，我们看到订阅者接收到了发布者的每个消息，虽然 B同学想买 200 平方米的房子，但是发布者吧 100 平方米的信息也推给了 B同学，
// 这对小明来说是不必要的困扰。所以有必要添加一个标识 key，让订阅者只订阅自己感兴趣的消息
