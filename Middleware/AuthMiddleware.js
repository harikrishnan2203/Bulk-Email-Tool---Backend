//custom middleware
const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) =>{
    try{
        const token = req.header("Auth-Token");
        jwt.verify(token,process.env.SECRET_KEY);
            next(); //if error | next will be skiped
    }catch(err){
        res.status(401).send({
            message: err.message
        })
    }
}; 

module.exports ={
    AuthMiddleware
}