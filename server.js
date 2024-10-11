const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const connectDB = require('./config/db');
const taskController = require('./controllers/taskController');
const Task = require('./models/Task');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(express.static('views'));
connectDB();
app.use('/api', require('./routes/tasks'));

cron.schedule('* * * * *', async () => {
  const tasks = await Task.find();
  tasks.forEach(async (task) => {
    await taskController.sendEmail(task.taskName);
    task.lastExecuted = new Date();
    await task.save();
    console.log(`Task ${task.taskName} executed at ${task.lastExecuted}`);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});