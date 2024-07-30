var mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

// Plugin for Passport-Local Mongoose
UserSchema.plugin(passportLocalMongoose);

const Users = mongoose.model("User", UserSchema);
module.exports = Users;
