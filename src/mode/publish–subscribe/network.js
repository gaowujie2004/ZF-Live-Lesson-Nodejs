var event = (function () {
  // 全局的命名空间缓存数据
  var namesapceCaches = {};
  var _default = 'default';
  var shift = Array.prototype.shift;
  var hasNameSpace = function (namespace, key) {
    // 不存在命名空间
    if (!namesapceCaches[namespace]) {
      namesapceCaches[namespace] = {};
    }
    // 命名空间下不存在该key的订阅对象
    if (!namesapceCaches[namespace][key]) {
      namesapceCaches[namespace][key] = {
        // 该key下的订阅的事件缓存列表
        cache: [],
        // 该key下的离线事件
        offlineStack: [],
      };
    }
  };

  // 使用命名空间
  var _use = function (namespace) {
    var namespace = namespace || _default;
    return {
      // 订阅消息
      on: function (key, fn) {
        hasNameSpace(namespace, key);
        namesapceCaches[namespace][key].cache.push(fn);
        // 没有订阅之前，发布者发布的信息保存在offlineStack中,现在开始显示离线消息(只发送一次)
        var offlineStack = namesapceCaches[namespace][key].offlineStack;
        if (offlineStack.length === 0) {
          return;
        }

        for (var i = offlineStack.length - 1; i >= 0; i--) {
          // 一次性发送所有的离线数据
          fn(offlineStack[i]);
        }
        offlineStack.length = 0;
      },
      // 发布消息
      emit: function () {
        // 获取key
        var key = shift.call(arguments);
        hasNameSpace(namespace, key);
        // 获取该key对应缓存的订阅回调函数
        var fns = namesapceCaches[namespace][key].cache;
        if (fns.length === 0) {
          var data = shift.call(arguments);
          // 还没有订阅，保存发布的信息
          namesapceCaches[namespace][key].offlineStack.push(data);
          return;
        }
        for (var i = fns.length - 1; i >= 0; i--) {
          fns[i].apply(this, arguments);
          if (fns.onece) {
            fns.splice(i, 1);
          }
        }
      },
      remove: function (key, fn) {
        // 获取key
        var key = shift.call(arguments);
        // 不存在命名空间和订阅对象
        if (!namesapceCaches[namespace] || !namesapceCaches[namespace][key]) {
          return;
        }
        // 获取该key对应缓存的订阅回调函数
        var fns = namesapceCaches[namespace][key].cache;
        if (fns.length === 0) {
          return;
        }
        for (var i = fns.length - 1; i >= 0; i--) {
          if (fn === fns[i]) {
            fns.splice(i, 1);
          }
        }
      },
      onece: function (key, fn) {
        this.on(key, fn);
        fn.onece = true;
      },
    };
  };

  return {
    // 用户的命名空间
    use: _use,
    /**
     * 默认的命名空间
     * on,emit,remove,onece都为代理方法。
     */
    on: function (key, fn) {
      var event = this.use();
      event.on(key, fn);
    },
    emit: function () {
      var event = this.use();
      event.emit.apply(this, arguments);
    },
    remove: function (key, fn) {
      var event = this.use();
      event.remove(key, fn);
    },
    onece: function (key, fn) {
      var event = this.use();
      event.onece(key, fn);
    },
    show: function () {
      return namesapceCaches;
    },
  };
})();

// console.log('先发布后订阅测试');
// event.emit('111', '离线数据1');
// event.emit('111', '离线数据2');

event.on('111', function (data) {
  console.log(data);
});

event.on('111', function (data) {
  console.log(data);
});

event.emit('111', '离线数据1');

// setTimeout(function () {
//   event.on('111', function (data) {
//     console.log(data);
//   });
// }, 2000);
// setTimeout(function () {
//   event.emit('111', '在线数据');
// }, 3000);
