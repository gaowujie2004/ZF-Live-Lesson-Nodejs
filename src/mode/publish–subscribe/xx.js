const Event = (function () {
  // 默认的命名空间
  const _default = 'default';

  const Event = (function () {
    let _listen, _trigger, _remove, _create;
    const _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      // 命名空间对象
      namespaceCache = {},
      /*
       * 将 fn 函数的 this 绑定到 ary 的每一个元素上，绑定的同时依次执行
       * 返回值是 fn 绑定 ary 最后一个元素执行的返回结果
       */
      each = function (ary, fn) {
        let ret;
        for (let i = 0, l = ary.length; i < l; i++) {
          const n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };
    // cache 为命名空间，值形如 namespaceCache[namespace]
    _listen = function (key, fn, cache) {
      // cache 命名空间下没有 key 类的事件数组则创建一个
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };
    /*
     * 移除 cache 命名空间下 key 类事件中的 fn 事件
     * 若 fn 不传，则清空 cache[key] 事件中的所有事件
     */
    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (let i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };
    // 执行 cache[key] 下的所有事件
    _trigger = function () {
      const cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        stack = cache[key];
      if (!stack || !stack.length) {
        return;
      }
      return each(stack, function () {
        return this.apply(_self, args);
      });
    };
    _create = function (namespace) {
      let offlineStack = []; // 离线事件任务
      const _namespace = namespace || _default,
        cache = {},
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }

            /*
             * 如果有 'last' 参数,则执行最新发布的一条消息
             * 否则将所有的离线事件执行一遍
             */
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              each(offlineStack, function () {
                this();
              });
            }

            // 销毁离线事件栈
            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            let fn, args;
            // this 被绑定到 Event 对象
            const _self = this;
            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          },
        };
      return namespaceCache[_namespace] ? namespaceCache[_namespace] : (namespaceCache[_namespace] = ret);
    };
    return {
      create: _create,
      one(key, fn, last) {
        const event = this.create();
        event.one(key, fn, last);
      },
      remove(key, fn) {
        const event = this.create();
        event.remove(key, fn);
      },
      listen(key, fn, last) {
        const event = this.create();
        event.listen(key, fn, last);
      },
      trigger() {
        const event = this.create();
        event.trigger.apply(this, arguments);
      },
    };
  })();
  return Event;
})();

/* test code */
/************** 先发布后订阅 ********************/
Event.trigger('click', 123);

setTimeout(() => {
  Event.listen(
    'click',
    function (a) {
      console.log('1', a); // 输出：1
    },
    function (a) {
      console.log('2', a); // 输出：1
    }
  );
  // Event.listen('click', function (a) {
  //   console.log('2', a); // 输出：1
  // });
}, 2000);
/************** 使用命名空间 ********************/
// Event.create('namespace1').listen('click', function (a) {
//   console.log(a); // 输出：1
// });
// Event.create('namespace1').trigger('click', 1);
// Event.create('namespace2').listen('click', function (a) {
//   console.log(a); // 输出：2
// });
// Event.create('namespace2').trigger('click', 2);
