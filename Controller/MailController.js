const { MailCredentials } = require("../Model/MailCredentialsModel");
const { SentItems } = require('../Model/SendMailModel');
const { User } = require("../Model/userModel");
const { sendBulkEmail } = require("../Nodemailer/SendBulkEmail");
const { ObjectId } = require('mongoose').Types;

const createCred = async(req, res) => {
    try {
        const user = req.header("user")
        const { email, password } = req.body;
        const credExist = await MailCredentials.findOne({user})
        // console.log(credExist)
        if (credExist) {
            const updateCred = await MailCredentials.updateOne(
                {user: user},
                {$set: {email: email, password: password}})
                // console.log(updateCred)
                res.status(200).json({
                    success: true,
                    message: "Update Success",
                    updateUser: updateCred
                })
        } else {
            const newCred = await MailCredentials.create({
                email: email,
                password: password,
                user: user
            })
            // console.log(newCred)
            res.status(200).json({
                success:true,
                message: "Credential Created",
                Credential: newCred
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    }
}

const getCred = async (req, res) => {
    try {
        const user = req.header("user");
        // console.log(user);
        const userCred =  await MailCredentials.findOne({user: user});
        // console.log(userCred);
        if (!userCred) {
            res.status(404).json({
                success: false,
                message: "User credential not found"
            });
            return; // Return here to exit the function
        }
        const result = {
            email: userCred.email,
            password: userCred.password
        };
        // console.log(result);
        res.status(200).json({
            success: true,
            userCred: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


// Delition credentila
const deletionCred = async(req, res) => {
    try {
        const userId = req.header('user')
        const deletionCred = await MailCredentials.deleteOne({user: userId})
        // console.log(deletionCred)
        if (deletionCred.deletedCount == 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Deleted",
                deletionCred: deletionCred
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

// Send Mail
    const sendMail = async (req, res) => {
        try {
        const newMail = req.body;
        // console.log(req.header("user"))
        const activeUser = req.header("user");
        //   const activeUser = newMail.user;
        const activeUserCred = await MailCredentials.findOne({user: activeUser});
        if (activeUserCred === null) {
            let userEmail = process.env.USER
            // console.log(userEmail)
            // If user credentials not found, use default credentials;
            let password = process.env.PASS;
            const result = await sendBulkEmail(newMail.recipients, newMail.subject,newMail.body,userEmail, password );
            // console.log(result);

            const sentitem = await SentItems.create({
                user: activeUser,
                from: userEmail,
                recipients: newMail.recipients,
                subject: newMail.subject,
                body: newMail.body,
                accepted: result.accepted || [],
                rejected: result.rejected || [],
                time: new Date(),
            });
            // const sentRes = await SendMailModel.
            res.status(200).json({
                success: true,
                message: "Email sent Successfully",
                result: sentitem
            })
        } else {
            const result = await sendBulkEmail(newMail.recipients, newMail.subject,newMail.body,activeUserCred.email,activeUserCred.password);
            // console.log(result);
            const sentitem = {
            user: activeUser,
            from: activeUserCred.email,
            recipients: newMail.recipients,
            subject: newMail.subject, 
            body: newMail.body,
            accepted: result.accepted || [],
            rejected: result.rejected || [],
            time: new Date(),
            };
            const snetRes = await SentItems.create(sentitem)
            res.status(200).json({
                success: true,
                message: "Email sent Successfully",
                result: snetRes
            })
        }
        } catch (error) {
        res.status(500).json({
            message: "Internal error",
            error: error.message,
        });
        }
    }

// Get Logs
const getLogs = async(req, res) => {
    try {
        const userId = req.header('user')
        // console.log(userId)  
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        } else {
            const resultentLogs = await SentItems.find({user: userId})
            res.status(200).json({
                success: true,
                message: "Mails fetched Successfully",
                count: resultentLogs.length,
                mails : resultentLogs
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

// Count today

const countToday = async(req, res) => {
    try {
        const userId = req.header('user')
        const start = new Date(new Date().toDateString())
        const end = new Date(new Date(start).setDate(new Date().getDate()+1))
        // console.log(userId, start, end)
        const userLog = await SentItems.find(
            {user: userId, 
            time: {$gt: new Date(start), $lt: new Date(end)}})
            // console.log(userLog)
        const userName = await User.findOne({ _id: new ObjectId(userId) });
        // console.log(userName)
        // let count = 0;
        res.status(200).json({
            success: true,
            count: userLog.length,
            name: userName.name
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

// Chart Data

const chartLogs = async (req, res) => {
  try {
    const user = req.header("user");
    const { startDate, endDate } = req.body;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(23, 59, 59, 999);

    const resData = await SentItems.find({
      user: user,
      time: { $gte: new Date(startDateObj), $lte: new Date(endDateObj) },
    });
    let arr = [];
    resData.forEach(e => arr.push({
        time: e.time,
        mailCount: e.accepted.length
    }))

    res.status(200).json({
        success: true,
        message: "Chart data fetched successfully",
        data: arr
    })
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


module.exports ={
    createCred,
    getCred,
    deletionCred,
    getLogs,
    sendMail,
    countToday,
    chartLogs
}