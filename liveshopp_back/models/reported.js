const mongoose = require('mongoose');

const Schema = new mongoose.Schema();

const reported = new mongoose.Schema(
  {
    flagger_id: { type: String },
    flagger_email: { type: String },
    flag_type: { type: String },
    flag_user_id: { type: String },
    flag_user_username: { type: String },
    flag_message: { type: String, default: '' },
    flag_livename: { type: String, default: '' },
    live_data: { type: Object },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Reported = mongoose.model('Reported', reported);

module.exports = Reported;
