const helpers = {}
const jwt = require("jsonwebtoken");

helpers.isAuthenticated = async(req,res, next) =>{
    const token = req.get('auth-token');
    console.log('token: ', token)

    if(!token) return res.status(401).json({status: 'error', error: 'access denied'});
    try{
        const user = jwt.verify(token, 'banana123');
        console.log(user)
        let userdb = 2
        if(user){
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(400).json({status: 'error', error: 'invalid token'});
    }
};

module.exports = helpers;