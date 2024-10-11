const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/task', taskController.createTask);
router.get('/tasks', taskController.getTasks);

module.exports = router;