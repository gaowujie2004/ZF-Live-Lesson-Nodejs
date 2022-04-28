// 全局的发布-订阅对象
// 小明和售楼处还是有一定的耦合的，小明至少需要知道售楼处对象的名字是 salesOffices，才能顺利订阅到事件。
// 如下所示:

salesOffices.listen('square88', () => {}); // 小明订阅者

// 如果小明还关心 300 平方米的房子，而这套房子的卖家是 salesOffices2 ，这意味着小明要开始订阅 salesOffices2 对象。如下所示：
salesOffices2.listen('square300', () => {}); // 小明订阅者

/**
 * 其实现实中，买房子需要亲自去售楼处，我们只要把订阅的请求放到中介公司，
 * 而各大房产公司也只需要通过中介公司来发布房子信息。这样一来，我们不用关心消息是来着那个房产公司（售房处、发布者），
 * 我们在意的是能否顺利收到感兴趣的消息。当然，为了保证订阅者和发布者能顺利通信，订阅者和发布者都必须知道这个中介公司。
 *
 * 同样在程序中，发布-订阅模式可以用全局的 Event 对象来实现，订阅者不需要了解消息来着那个发布者，发布者也不知道消息会推送给哪些订阅者，
 * Event 作为一个类似“中介者”的角色，把订阅者们和发布者联系在一起。见如下代码：
 */

const _Event = (function () {
  let clientMap = {},
    listen,
    trigger,
    remove,
    removeAll;

  listen = (key, fn) => {
    if (!salesOffices.clientMap[key]) {
      // 第一次订阅，需要创建一个 该类型的 缓存列表
      clientMap[key] = [];
    }

    clientMap[key].push(fn); // 订阅的消息，添加到特定的
  };

  trigger = (key, ...args) => {
    clientMap[key].forEach((fn) => fn(...args));
  };

  remove = (key, fn) => {
    const fns = clientMap[key];
    if (!fns) {
      return false;
    }
    const fnIndex = fns.findIndex((f) => f === fn);
    if (fnIndex !== -1) {
      clientMap[key].splice(fnIndex, 1);
      return true;
    }
  };

  removeAll = (key) => {
    if (clientMap[key]) {
      clientMap[key].length = 0;
    }
  };

  return {
    clientMap,
    listen,
    trigger,
    remove,
  };
})();

// A同学 订阅消息
_Event.listen('square88', (info) => {
  console.log('--A同学关注的 80房子，有最新动态啦', info);
});

// A同学
_Event.listen('square300', (info) => {
  console.log('--A同学关注的 300平方米房子，有最新动态啦', info);
});

_Event.trigger('square88', 8000); // 售楼处发布消息，由中介处理
_Event.trigger('square300', 800000000);
