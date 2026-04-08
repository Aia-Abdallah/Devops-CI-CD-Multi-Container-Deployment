const express = require('express');
const os = require('os');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const DB_URL = process.env.DB_URL || 'mongodb://db:27017';
const DB_NAME = 'tasksdb';
let tasksCollection;

async function connectDB() {
  const client = new MongoClient(DB_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  tasksCollection = db.collection('tasks');
  console.log('✅ Connected to MongoDB');

  const count = await tasksCollection.countDocuments();
  if (count === 0) {
    await tasksCollection.insertMany([
      { id: 1, name: 'Milk', status: 'done' },
      { id: 2, name: 'Eggs', status: 'done' },
      { id: 3, name: 'Bread', status: 'pending' },
      { id: 4, name: 'Butter', status: 'pending' },
      { id: 5, name: 'Orange juice', status: 'pending' },
      { id: 6, name: 'Tea', status: 'pending' },
    ]);
    console.log('✅ Database seeded');
  }
}

app.get('/', (req, res) => {
  res.json({
    app: 'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

app.get('/tasks', async (req, res) => {
  const tasks = await tasksCollection.find({}, { projection: { _id: 0 } }).toArray();
  const grouped = {
    done: tasks.filter(t => t.status === 'done'),
    pending: tasks.filter(t => t.status === 'pending'),
  };
  res.json(grouped);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('--------------------------------');
    console.log(' App started on port', PORT);
    console.log('--------------------------------');
  });
});





/*
const express = require('express');
const os = require('os');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'tasksdb';

let tasksCollection;

// Connect to MongoDB
async function connectDB() {
  const client = new MongoClient(DB_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  tasksCollection = db.collection('tasks');
  console.log('✅ Connected to MongoDB');
}

// Info route
app.get('/', (req, res) => {
  res.json({
    app: 'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

// Tasks route
app.get('/tasks', async (req, res) => {
  const tasks = await tasksCollection.find({}).toArray();

  const grouped = {
    done: tasks.filter(t => t.status === 'done'),
    pending: tasks.filter(t => t.status === 'pending'),
  };

  res.json(grouped);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('--------------------------------');
    console.log(' App started on port', PORT);
    console.log('--------------------------------');
  });
});

*/