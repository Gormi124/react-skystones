const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/textdb');
const cors = require('cors');

const port = 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (request, response) => {
  response.send('Hallo Welt!');
});

app.get('/games', (request, response) => {
  const data = db.getAll();
  const jsonData = JSON.stringify(data);
  response.send(jsonData);
});

app.get('/games/:id', (request, response) => {
  const data = db.getById(Number(request.params.id));
  const jsonData = JSON.stringify(data);
  response.send(jsonData);
});

app.post('/games', (request, response) => {
  const data = request.body;
  db.create(data);
  response.send("Game has been created.\n"+JSON.stringify(data));
});

app.delete('/games/:id', (request, response) => {
  const deleted = db.remove(Number(request.params.id));
  if (deleted == true)  {
    response.sendStatus(204);
  } else {
    response.status(404).send("Game not found.");
  }
});

app.patch('/games/:id', (request, response) => {
  const data = request.body;
  db.patch(data);
  response.send("Game has been patched.");
});

app.listen(port, () => console.log('Server running on port 5000!'));
