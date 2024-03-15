const { default:mongoose } = require('mongoose')

const SendMailSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    recipients: {
      type: Array,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    accepted: {
      type: Array,
      required: true,
    },
    rejected: {
      type: Array,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "SentItems", // Specify the collection name
    versionKey: false, // Disable the version key
  }
);
// Create the User model based on the schema
const SentItems = mongoose.model("SentItems", SendMailSchema)

module.exports = {
    SentItems
}