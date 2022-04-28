// 模块间通信

/**
 * 上一个，全局发布-订阅模式的实现，是基于全局的 Event 对象，我们利用它可以在两个封装良好的模块中通信，这两个模块可以完全不知道对方的存在。
 * 就如同有了中介公司之后，我们不再需要知道房子开始的消息来自于那个售楼处。
 *
 * 比如现在有两个模块，A模块（组件）里面有个按钮，每一次点击按钮之后，
 * B模块（组件）里的 div 都会显示按钮的总点击次数，我们用全局发布-订阅模式完成下面的代码，
 * 使得A模块和B模块可以在保持封装性的前提下，进行通信。
 *
 */

function aButton() {
  let count = 0;
  const btn = document.querySelector('button');
  btn.onclick = () => {
    _Event.trigger('button-add', ++count);
  };
}

function bView() {
  const divView = document.querySelector('div');
  _Event.listen('button-add', (count) => {
    divView.innerHTML = count;
  });
}

/**
 * 但是在这里我们要留意一个问题，模块直接如果用了太多的全局发布-订阅模式来通信，那么模块与模块之间的关系就被影藏到了背后。
 * 最终会搞不清消息来着那个模块，或者消息会流向哪些模块（通知订阅者）这又会给我吗的维护带来一些麻烦，
 * todo: 也许某个模块的作用就是暴露一些接口给其他模块调用。
 */
