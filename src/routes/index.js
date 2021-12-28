const express = require("express");
const router = express.Router();

const M_publicacion = require("../models/publications");


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
