const { default:mongoose } = require('mongoose')

const credentialSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    provider: {
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
    }
  },
  {
    collection: "MailCredentials", // Specify the collection name
    versionKey: false, // Disable the version key
  }
);
// Create the User model based on the schema
const MailCredentials = mongoose.model("MailCredentials", credentialSchema)

module.exports = {
  MailCredentials
}