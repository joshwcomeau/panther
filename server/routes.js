import path from 'path';


export default function(app) {
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}
