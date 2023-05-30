import EventEmitter from 'events';

const event = new EventEmitter();

event.on('newListener', (type) => {
  if (type !== 'data') return;
  event.emit(type);
});

// 第一次的 on
event.on('data', () => {
  console.log('data callback 1');
});
event.on('data', () => {
  console.log('data callback 2');
});
