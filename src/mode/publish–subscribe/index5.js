// 真实的DEMO —— 网站登录
// 一个商场网站，有 header 头部、nav 导航、消息列表、购物车，这些模块渲染都有一个嵌套
// 就是必须先用 ajax 异步请求获取用户的登录信息，比如 header 头部模块需要显示名字，nav需要展示头像。
// 而这两个字段都来自于 ajax 请求后返回的数据。

/**================================== 登录组件（模块） **/
getUserData().then((userInfo) => {
  header.setAvatar(userInfo.avatar);
  nav.setAvatar(userInfo.avatar);
  message.refresh(); // 刷新消息列表
  card.refresh(); // 刷新购物车列表
});
// 分析：
// 登录模块中，需要手动引入 header、nav、message、card 模块，
// 并且需要知道到底调用那个方法， 最起码在「登录模块」和 「header」、「nav」 等模块 很耦合，需要知道调用哪些方法。

// 假如哪天，又有新的模块 —— 收货地址管理模块，
getUserData().then((userInfo) => {
  header.setAvatar(userInfo.avatar);
  nav.setAvatar(userInfo.avatar);
  message.refresh();
  card.refresh();

  address.refresh(); // 新增
});

/**================================== 发布-订阅模式后的方式 **/
// 登录组件
getUserData().then((userInfo) => {
  // header.setAvatar(userInfo.avatar);
  // nav.setAvatar(userInfo.avatar);
  // message.refresh(); // 刷新消息列表
  // card.refresh(); // 刷新购物车列表

  login.trigger('loginSuccess', userInfo);
});
//

// header 组件
function Header() {
  login.listen('loginSuccess', (userInfo) => {
    header.setAvatar(userInfo.avatar);
    // 做一些事
  });
}

// address 组件
const address = (() => {
  login.listen('loginSuccess', (userInfo) => {
    address.refresh(userInfo.avatar);
  });

  return {
    refresh(avatar) {
      // 做一些事情
    },
  };
})();

// 可以看到，header 、address 组件（模块）内部的方法名，都是由对应的人负责维护，
// 登录组件（模块）完全不需要知道，谁依赖我，还要一个个写他们的方法名。 setAvatar，refresh 等等。
