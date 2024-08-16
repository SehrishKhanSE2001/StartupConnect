const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import the startup model
const Startup = require('./path-to-startup-model'); // Adjust the path as necessary

const incubatorSchema = new Schema({
  incubatorName: {
    type: String,
    required: true
  },
  mentorship: {
    type: [String],
    required: true
  },
  resources: {
    type: [String],
    required: true
  },
  successStories: {
    type: [String],
    required: true
  },
  facilities: {
    type: [String],
    required: true
  },
  startups: [{
    type: Schema.Types.ObjectId,
    ref: 'startups',
    required: true
  }],
  user:{
    type:Schema.Types.ObjectId,
    ref:'users',
    required:true
  }
  
});

const incubatorModel = mongoose.model('incubators', incubatorSchema);
module.exports = incubatorModel;
