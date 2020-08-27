const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const edicionSchema = new Schema;

const RevistaSchema = Schema({
  name: { type: String, required: true },   
  zone: { type: String, required: false },   
  description: { type: String, required: false },
  edicion: [edicionSchema],
  status: {type: Boolean,default: true },
  date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('revistas', RevistaSchema);
