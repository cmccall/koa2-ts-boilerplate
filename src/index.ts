import { createLogger } from 'bunyan';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as _ from 'lodash';
import * as config from './config.json';

const app = new Koa();
const port = _.get(config, 'server.port', 3000);
const logger = createLogger({
    name: 'index-logger',
    level: _.get(config, 'server.logLevel', 'info')
});

app.use(bodyParser());

// per request audit log middleware
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date().getMilliseconds() - start.getMilliseconds();
    logger.trace({
        method: ctx.method,
        url: ctx.url,
        ms }, 'request processed');
});

app.use((ctx) => {
  ctx.body = 'Hello World';
});

app.on('error', (err: any) =>
  logger.error('server error', err)
);

app.listen(port, () => logger.debug(`Koa server listening on port ${port}`));

export default app;
