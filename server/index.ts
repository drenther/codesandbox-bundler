import * as Koa from 'koa';
import * as router from 'koa-route';
import * as parser from 'koa-bodyparser';

import * as resolveRoute from './bundle';

const app = new Koa();

app.use(async (ctx, next) => {
  const start = +new Date();
  await next();
  const ms = +new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(parser());

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.status = e.status || 500;
    ctx.body = { error: e.message };
    ctx.app.emit('error', e, ctx);
  }
})

// Routes
app.use(router.get('/', (ctx: Koa.Context) => ctx.body = 'Hello!'));
app.use(router.post('/bundle', resolveRoute.default));


app.listen(2000, () => {
  console.log('Server started on port 2000!');
});