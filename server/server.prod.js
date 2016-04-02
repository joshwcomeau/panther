import express from 'express';

import routes from './routes';

const app   = new express();
const port  = 80;

app.use('/static', express.static('dist'))
routes(app);


app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
