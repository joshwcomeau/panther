import path       from 'path';
import express    from 'express';
import bodyParser from 'body-parser';
import nconf      from 'nconf';

import routes   from './routes';
import { setupStructureIfRequired } from './database';


const app   = new express();
const port  = nconf.get('port');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const distPath = path.join(__dirname, '../dist')
app.use( '/static', express.static(distPath) );


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
