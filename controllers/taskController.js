const Task = require('../models/Task');
const nodemailer = require('nodemailer');

exports.createTask = async (req, res) => {
  try {
    const { taskName, frequency } = req.body;
    const task = new Task({ taskName, frequency });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendEmail = async (taskName) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Task Scheduler" <${process.env.EMAIL_USER}>`,
      to: 'recipient@example.com',
      subject: 'Scheduled Task Reminder',
      text: `Reminder: ${taskName}`,
    });

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Email Error:', error);
  }
};