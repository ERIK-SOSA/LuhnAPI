const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
  number: String,
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Number', numberSchema);
