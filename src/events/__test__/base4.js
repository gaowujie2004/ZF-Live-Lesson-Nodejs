const Event = require('../base4.js');

let e = new Event();

e.on('newListener', (eventName) => {
  console.log('有新的监听', eventName);
});

// 这是同步的 - 就是发布-订阅模式
e.on('open', (data) => {
  console.log('打开了', data);
});

// 这是同步的
e.emit('open', 'data');
console.log('我是同步代码');
