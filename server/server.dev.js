import express              from 'express';
import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser           from 'body-parser';

import routes from './routes';
import config from '../webpack.dev';
import { setupStructureIfRequired } from './database';


const app   = new express();
const port  = 5678;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const compiler = webpack(config);
app.use(webpackDevMiddleware(
  compiler,
  { noInfo: true, publicPath: config.output.publicPath }
));
app.use(webpackHotMiddleware(compiler));

routes(app);

setupStructureIfRequired( () => {
  app.listen(port, function(error) {
    if (error) {
      console.error(error);
    } else {
      console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
    }
  });
});
