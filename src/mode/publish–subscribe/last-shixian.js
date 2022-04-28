const _Event = (function () {
  const global = this;
  let Event,
    _default = 'default';

  Event = (function () {
    var _listen,
      _trigger,
      _remove,
      namespaceCache = {},
      _create;

    _listen = (key, fn, cache) => {
      if (!cache[key]) {
        // 第一次订阅，需要创建一个 该类型的 缓存列表
        cache[key] = [];
      }

      cache[key].push(fn); // 订阅的消息，添加到特定的
    };

    _remove = (key, cache, fn) => {
      if (cache[key]) {
        if (fn) {
          cache[key].forEach((item, i) => {
            if (item === fn) {
              cache[key].splice(i, 1);
            }
          });
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = (cache, key, ...args) => {
      const stack = cache[key];
      if (!stack || !stack._listen) {
        return;
      }

      // todo: 想干嘛？
      return;
    };

    _create = (namespace = _default) => {
      const cache = {},
        offlineStack = [], // 离线事件
        ret = {
          listen(key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              // todo:
              each(offlineStack, function () {
                this();
              });
            }

            offlineStack = null;
          },

          one(key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },

          remove(key, fn) {
            _remove(key, cache, fn);
          },

          trigger(...args) {
            args = [cache, ...args];
            let fn = () => {
              return _trigger.apply(this, args);
            };

            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          },
        };
      if (namespace === _default) {
        return ret;
      } else {
        // 传递了
        if (namespaceCache[namespace]) {
          return namespaceCache[namespace];
        } else {
          namespaceCache[namespace] = ret;
          return ret;
        }
      }
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
      trigger(...args) {
        const event = this.create();
        event.trigger.apply(this, args);
      },
    };
  })();
  return Event;
})();
