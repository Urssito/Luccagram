const express = require("express");
const router = express.Router();

const M_publicacion = require("../models/publications");
const user = require("../models/users");
const { isAuthenticated } = require("../helpers/auth");

router.get("/", async(req, res) => {
    
    const publications = await M_publicacion.find().lean().sort({date: "desc"});
    let userIds = null;
    if(req.user){
        userIds = JSON.parse(JSON.stringify(req.user));
        userIds = userIds._id;
    }
    res.render("index", { publications, userIds });

});

router.get("/chat", (req, res) =>{

    res.render("chat");

});

module.exports = router;