/**================================== 测试 —— 中间件顺序 **/
const Koa = require('koa');
const app = new Koa();

// ERROR, 为什么要到最前面

app.use((ctx, next) => {
  console.log('11');

  console.log('--11');
});

app.use(async (ctx, next) => {
  console.log('22');

  console.log('--22');
});

app.use(async (ctx, next) => {
  console.log('33');

  console.log('--33');

  ctx.body = 'TEST';
});

app.listen(8899, () => {
  console.log('--8899 server go');
});

// 好家伙
