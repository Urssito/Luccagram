const helpers = {}
const jwt = require("jsonwebtoken");

helpers.isAuthenticated = async(req,res, next) =>{
    const token = req.get('auth-token');

    try{
        const user = jwt.verify(token, 'banana123');
        req.user = user.auth;
        next();
    }catch(err){
        if(!token) {
            console.log('no hay token');
        }
        else{
            return res.status(400).json({status: 'error', error: 'invalid token'});
        }
    }
};

module.exports = helpers;