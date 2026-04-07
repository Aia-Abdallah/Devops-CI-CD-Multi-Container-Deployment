const express = require('express');
const os = require('os');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String,
});
const Task = mongoose.model('Task', taskSchema);

const seedTasks = [
  { id: 1, name: 'Milk', status: 'done' },
  { id: 2, name: 'Eggs', status: 'done' },
  { id: 3, name: 'Bread', status: 'pending' },
  { id: 4, name: 'Butter', status: 'pending' },
  { id: 5, name: 'Orange juice', status: 'pending' },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/lab8';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('  MongoDB connected:', MONGO_URI);
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(seedTasks);
      console.log('  Database seeded with sample tasks');
    }
  })
  .catch(err => {
    console.error('  MongoDB connection error:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json({
    app: 'CISC 886 Lab 6',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

app.get('/tasks', async (req, res) => {
  try {
    const allTasks = await Task.find({}, { _id: 0, __v: 0 });
    const grouped = allTasks.reduce((acc, task) => {
      const key = task.status;
      if (!acc[key]) acc[key] = [];
      acc[key].push({ id: task.id, name: task.name, status: task.status });
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`  CISC 886 Lab 6 — App started`);
  console.log(`  Port:  ${PORT}`);
  console.log(`  Mode:  ${process.env.MODE || 'local'}`);
  console.log(`  Node:  ${process.version}`);
  console.log(`  Host:  ${os.hostname()}`);
  console.log('--------------------------------------------------');
});