import r from 'rethinkdb';
import nconf from 'nconf';


const dbConfig = nconf.get('rethinkdb');

export function createConnection(req, res, next) {
  r.connect(dbConfig).then( conn => {
    // Attach the connection to the request.
    req._rdbConn = conn;
    next();
  }).error( err => {
    console.error("Problem connecting to Rethinkdb on request", err);
    res.status(500).send({ error: err.message });
  })
}

export function closeConnection(req) {
  console.log("Connection closed!")
  req._rdbConn.close();
}

export function getConnection(req) {
  return req._rdbConn;
}

export function setupStructureIfRequired(callback) {
  r.connect(dbConfig, (err, conn) => {
    if ( err ) {
      console.error("Problem connecting to Rethinkdb on server start", err);
      process.exit(1);
    }

    r.table('artists').indexWait('createdAt').run(conn).then( () => {
      // If that worked, it means we already have our structure. We're done!
      console.info("Table and index already available!");
      callback();
    }).error( err => {
      // The table is not available! This means it's the first time running
      // with this DB. Let's create 'em.
      r.dbCreate(dbConfig.db).run(conn)
        .finally( () => r.tableCreate('artists').run(conn) )
        .finally( () => r.table('artists').indexCreate('createdAt').run(conn) )
        .finally( () => r.table('artists').indexWait('createdAt').run(conn) )
        .then( () => {
          console.info("Table and index have been created.");
          conn.close();
          callback();
        }).error( err => {
          console.error("Some sort of problem creating the table/index", err);
          process.exit(1);
        });
    });
  });
}
