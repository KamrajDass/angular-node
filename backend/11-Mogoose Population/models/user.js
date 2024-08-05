var mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Plugin for Passport-Local Mongoose
UserSchema.plugin(passportLocalMongoose);

const Users = mongoose.model("User", UserSchema);
module.exports = Users;
