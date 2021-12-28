const express = require("express");
const router = express.Router();

const M_publicacion = require("../models/publications");
const M_user = require("../models/users");

router.get("/*", async(req, res) => {
    if(req.user){
        const currentUser = await M_user.findOne(req.user).lean();
        
    }
})

router.get("/", async(req, res) => {
    
    const publications = await M_publicacion.find().lean().sort({date: "desc"});
    let userIds = null;
    let objuser = null
    if(req.user){
        userIds = JSON.parse(JSON.stringify(req.user));
        userIds = userIds._id;
        objuser = req.user;
    }
    res.render("index", { publications, userIds, objuser });

});

router.get("/chat", (req, res) =>{

    res.render("chat");

});

module.exports = router;