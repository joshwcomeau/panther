import express  from 'express';
import bodyParser           from 'body-parser';

import routes   from './routes';


const app   = new express();
const port  = 8001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('dist'));


routes(app);


app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
