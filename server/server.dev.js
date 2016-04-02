import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import routes from './routes';
import config from '../webpack.dev';

const app   = new (require('express'))();
const port  = 5678;

const compiler = webpack(config);
app.use(webpackDevMiddleware(
  compiler,
  { noInfo: true, publicPath: config.output.publicPath }
));
app.use(webpackHotMiddleware(compiler));

routes(app);


app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
