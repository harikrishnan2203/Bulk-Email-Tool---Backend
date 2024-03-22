const express = require("express")
const bodyparser = require("body-parser")
const cors = require('cors')
const { connectToDB } = require("./Database/Database")
const UserRouter = require('./Routes/userRouter')
const MailRouter = require('./Routes/mailRouter')
require('dotenv').config(); 
const { AuthMiddleware } = require('./Middleware/AuthMiddleware')

const app = express()

app.use(express.json({ limit: '50mb' }));

// Middleware
// ENABLE CORS
app.use(cors());
// app.use(bodyparser.json())

const PORT = 5000;
  

//Iniating DB Connection
connectToDB()

// Use the defined router for all routes
app.use('/user', UserRouter)
app.use(AuthMiddleware)
app.use('/mail', MailRouter)


app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})

