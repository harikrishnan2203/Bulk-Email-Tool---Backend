const { default:mongoose } = require('mongoose')

const SessionTokensSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    DateTime:{
      type: Date,
      required: true
    }
  },
  {
    collection: "SessionToken", // Specify the collection name
    versionKey: false, // Disable the version key
  }
);
// Create the User model based on the schema
const SessionToken = mongoose.model("SessionToken", SessionTokensSchema)

module.exports = {
    SessionToken
}