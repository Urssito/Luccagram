const helpers = {}

helpers.isAuthenticated = (req,res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("errorMsg", "No autorizado");
    res.redirect("/");
};

module.exports = helpers;