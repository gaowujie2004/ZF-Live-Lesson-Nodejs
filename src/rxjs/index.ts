import { Observable } from 'rxjs';

const observable = new Observable(function (observer) {
  console.log('1111');
  observer.next('给订阅者的数据???');
  observer.next('给订阅者的数据??? 22');
});

// foo.subscribe((data) => {
//   console.log('foo.subscribe callback cell 1', data);
// });

// foo.subscribe((data) => {
//   console.log('foo.subscribe callback cell 2', data);
// });

let s = observable.subscribe();
s.unsubscribe();
