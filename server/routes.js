import path from 'path';
import r from 'rethinkdb';

import { getConnection, createConnection, closeConnection } from './database';


export default function(app) {
  app.get('/searched_artist', createConnection, (req, res) => {
    if ( !req.query || !req.query.id ) {
      res.status(500).send({ error: 'Missing `id` query'});
    }

    const conn = getConnection(req);

    r.table('artists')
      .orderBy({ index: 'createdAt' })
      .limit(6)
      .run(conn)
      .then( artist => res.send(artist) )
      .error( error => res.status(500).send({ error }) )
      .finally( () => closeConnection(req) );
  });

  app.post('/searched_artist', createConnection, (req, res, next) => {
    if ( !req.body ) res.status(500).send({ error: 'Missing `body`'});

    const valid_keys = ['id', 'name'];
    const supplied_keys = Object.keys(req.body).sort();

    const conn = getConnection(req);

    if ( valid_keys.toString() !== supplied_keys.toString() ) {
      res.status(500).send({
        error: 'Please supply an `id` and a `name`, and nothing else.'
      });
    }

    const artist = {
      ...req.body,
      createdAt: r.now()
    };

    r.table('artists')
      .insert(artist)
      .run(conn)
      .then( () => res.send({ saved: true }) )
      .error( error => res.status(500).send({ error }) )
      .finally( () => closeConnection(req) );
  });

  app.get('*', function(req, res) {
    console.log("Got *")
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}
