const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  durationforuser: {type: String, required: true},
  duration: {type: Number, required: true},
  priority: {type: String, default: 'low'},
  status: {type: String, default: 'Pending'},
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Reference to the user who owns the task
});

module.exports = mongoose.model('Task', taskSchema);
