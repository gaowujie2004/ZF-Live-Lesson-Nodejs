/**================================== 测试 —— 中间件顺序 **/
const Koa = require('koa');
const app = new Koa();

// use 就是中间件
app.use(async (ctx, next) => {
  console.log('11');
  await next();
  console.log('--11');
});

app.use(async (ctx, next) => {
  console.log('22');
  await next();
  console.log('--22');
});

app.use(async (ctx, next) => {
  console.log('33');
  await next();
  console.log('--33');
  ctx.body = 'TEST';
});

app.listen(8899, () => {
  console.log('--8899 server go');
});

// 11 22 33 --33  --22  --11
// 对 next()，有没有 await 运算符，执行的顺序是一样的。
