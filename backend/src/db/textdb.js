const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const samplePath = path.join(__dirname, 'sampleDB.json');
const dbPath = path.join('.', 'dbdata', 'gamesDB.json');

const safeAttributes = [
  'matchID',
  'playerCount',
  'stones',
  'rows',
  'hands',
  'turn',
  'winner',
  'options',
  'onCapture',
  'onStart',
  'height',
  'width',
  'handSize'
];

if (!fs.existsSync(dbPath)) {
   fs.copyFileSync(samplePath, dbPath);
  const gameData = JSON.parse(fs.readFileSync(samplePath));

  const cleanedData = gameData.map((p) => {
    p = _.pick(p, safeAttributes);
    return p;
  });

  fs.writeFileSync(dbPath, JSON.stringify(cleanedData));
}

const gameData = fs.readFileSync(dbPath);
let games = JSON.parse(gameData);

function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(games));
}

function getAll() {
  return games;
}

function getById(id) {
  const game = games.find(p => p.matchID == id);
  return game;
}

function create(data) {
  const cleanedData = _.pick(data, safeAttributes);
  games.push(cleanedData);
  saveDB();
}

function remove(id) {
  const target = getById(id);
  if (target != null) {
    //target ist weder null noch undefined
    newList = games.filter(tested => tested !== target);
    games = newList;
    saveDB();
    return true;
  } else {
    return false;
  }
}

function patch(data) {
  const id = data.matchID;
  remove(id);
  create(data);
  saveDB();
}

module.exports = { getAll, getById, create, remove, patch };
