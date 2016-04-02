import express  from 'express';
import r        from 'rethinkdb';

import routes   from './routes';

const app   = new express();
const port  = 8001;

app.use('/static', express.static('dist'));

app.use((req, res, next) => {
  r.connect()
})


routes(app);


app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
