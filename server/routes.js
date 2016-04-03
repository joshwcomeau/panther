import path from 'path';
import r from 'rethinkdb';

import { getConnection, createConnection, closeConnection } from './database';


export default function(app) {
  // TODO: Validations

  app.get('/searched_artists', createConnection, (req, res) => {
    let { orderBy, limit } = req.query;

    // Set up our query params to be used by RethinkDB (or, supply defaults).
    orderBy = { index: orderBy || 'createdAt' };
    limit   = Number(limit) || 10;

    const conn = getConnection(req);

    r.table('artists')
      .orderBy(orderBy)
      .limit(limit)
      .run(conn)
      .then( cursor => cursor.toArray() )
      .then( artist => res.send(artist) )
      .error( error => res.status(500).send({ error }) )
      .finally(  () => closeConnection(req) );
  });

  app.post('/searched_artists', createConnection, (req, res, next) => {
    if ( !req.body ) res.status(500).send({ error: 'Missing `body`'});

    const valid_keys = ['id', 'name'];
    const supplied_keys = Object.keys(req.body).sort();

    const conn = getConnection(req);

    if ( valid_keys.toString() !== supplied_keys.toString() ) {
      return res.status(500).send({
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
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}
