const EventEmit = require('../base4');
const event = new EventEmit();

event.on('click', (ev) => {
  console.log('触发11');
  ev.one = '111添加的';
});

event.on('click', (ev) => {
  console.log('触发2222');
  ev.two = '2222222添加的';
});

event.on('click', (ev) => {
  console.log('触发3333333，看看加上没');
  console.log(ev);
});

event.emit('click', {});
// 输出结果
// 触发11
// 触发2222
// 触发3333333，看看加上没
// { one: '111添加的', two: '2222222添加的' }
