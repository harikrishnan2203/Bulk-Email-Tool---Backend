const mongoose = require('mongoose');
require('dotenv').config();

const connectToDB = async () => {
    try {
        // Construct the MongoDB connection URI using environment variables
        // const DB_URI = `mongodb+srv://harikrishnan2285:411GKtQcrjdkQQuJ@bulkemailtool.qw3a2ax.mongodb.net/Bulk-Email-Tool`;
        const DB_URI = `mongodb://127.0.0.1:27017/Bulk-Email-Tool`;
        // Connect to the MongoDB database
        await mongoose.connect(DB_URI);

        // console.log("Hari")
        // Check if the connection is successful or not
        if (mongoose.connection.readyState === 1) {
            console.log('Database connection successful');
        } else {
            // Log any errors that occur during the connection process
            console.log('Could not establish connection');
        }
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
};

module.exports = {
    connectToDB,
};
