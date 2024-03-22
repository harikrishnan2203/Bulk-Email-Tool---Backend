const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const jwt = require('jsonwebtoken');
const { User } = require("../Model/userModel");
const { SessionToken } = require("../Model/SessionTokenModel");
const {sendEmail} = require("../Nodemailer/SendEmail")
// const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
const saltRounds = 10;

const API = "https://bulk-email-tool-22.netlify.app";
// const API = "http://localhost:3000";
// create a new user
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = await User.create({
      email,
      emailVerified: null,
      password: hashedPassword,
      name,
    });

    // Create a verification token
    let token = randomstring.generate();

    // Save the token to the database
    await SessionToken.create({
      email: email,
      token: token,
      DateTime: new Date(),
    });

    // Send verification email
    const authMail = await sendEmail(email, "verification token", `${API}/emailverify/${token}`);
    // console.log(authMail)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    // Return a server error response if an internal error occurs
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Verify user
const verifyUser = async (req, res) => {
  try {
    const {id} = req.params;
    // console.log(id)
    const tokenExist = await SessionToken.findOneAndDelete({ token: id });
    // console.log(tokenExist);
    if (tokenExist) {
      await User.findOneAndUpdate(
        { email: tokenExist.email },
        { $set: { emailVerified: "yes" } }
      );
      res.status(200).json({
        message: "verified successful",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(404).json({
        success: false,
        message: "User not Found",
        error: error.message,
      })
    }
    if (userExists) {
      // Create a verification token
      let token = randomstring.generate();

      // Save the token to the database
      await SessionToken.create({
        email: email,
        token: token,
        DateTime: new Date(),
      });

      // Send verification email
      const mail = await sendEmail(
        email,
        "Reset Password",
        `${API}/update-password/${token}`
      );
      // console.log(mail)
      res.status(200).json({
        success: true,
        message: "Reset link send to your registered Email",
        mail: mail,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User not Found",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Check User
const checkUser = async(req, res) => {
  try {
    const { string } = req.params;
    // console.log(string)
    const userExists = await SessionToken.findOne({token: string})
    // console.log(userExists)
    if (userExists) {
      res.status(200).json({
        success: true,
        email: userExists.email
      })
    } else {
      res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Change Password
const changePassword = async (req, res) => {
  try {
    const { string } = req.params;
    const { password } = req.body;

    if (string === null || string === undefined) {
      return res.status(404).json({
        success: false,
        message: "Token not provided",
      });
    }

    const sessionToken = await SessionToken.findOne({ token: string });
    if (!sessionToken) {
      return res.status(404).json({
        success: false,
        message: "Token not found or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const deletionCount = await SessionToken.deleteOne({ token: string });

    if (deletionCount.deletedCount === 1) {
      const user = await User.findOneAndUpdate(
        { email: sessionToken.email },
        { $set: { password: hashedPassword } }
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Token not found or expired",
      });
    }
  } catch (error) {
    console.error("Error in changing password:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Verify Token

const verifyToken = async (req, res) => {
  try {
    const token = req.header("Auth-Token");
    if (!token) {
      res.status(401).json({
        success: false,
        message: "No token provided, Authentication denied",
      });
    }
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    if (decodeToken) {
      res.status(200).json({
        success: true,
        message: "Token verified successfully",
      });
    } else {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired, please log in again" });
      }
      res.status(401).json({ message: "Token is not valid" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Login
const login = async(req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({email});
    // console.log(req.body)
    if(!findUser){
      res.status(404).json({
        success: false,
        message: "User not Found"
      })
    }else{
      if (findUser.emailVerified == "yes") {
        const checkPassword = await bcrypt.compare(password, findUser.password)
        // console.log(checkPassword)
        if (checkPassword) {
          const token = jwt.sign({userId: findUser._id}, process.env.SECRET_KEY, { expiresIn: '1h' } )
          res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token,
            _id: findUser._id.toString()
          })
        }else{
          res.status(404).json({
            success: false,
            message: "Wrong Password"
          })
        }
      }else{
        const token = await randomstring.generate();
        await SessionToken.create({
          email: email,
          token: token,
          DateTime: new Date()
        })
        await sendEmail(email, "Verification Token", `${API}/emailverify/${token}`)
        res.status(200).json({
          success: false,
          message:"Verification link send to your registered email"
        })
      }
    }
    
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
module.exports = {
  createUser,
  verifyUser,
  resetPassword,
  checkUser,
  changePassword,
  login,
  verifyToken,
};
