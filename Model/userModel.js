const { default:mongoose } = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified:{
      type: String,
    }
  },
  {
    collection: "User", // Specify the collection name
    versionKey: false, // Disable the version key
  }
);
// Create the User model based on the schema
const User = mongoose.model("User", userSchema)

module.exports = {
  User
}