const express = require("express");
const { isAuthenticated } = require("../helpers/auth");
const router = express.Router();
const jwt = require('jsonwebtoken')

const objPublication = require("../models/publications");
const objUsers = require("../models/users");

router.get('/api/getPubs', async (req, res) => {
    const results = await objPublication.find().lean().sort({date: "desc"});
    res.json({status: 'ok',results})
});

router.get("/api/upload", (req,res) => {

    res.render("publications/newPublications")

});

router.post("/api/upload", isAuthenticated, async(req, res) => {

    let {publication} = req.body;
    let errors = [];
    if(!publication){
        errors.push("la publicacion no puede estar vacia.")
    }
    if(errors.length > 0)
    {
        res.json({errors})
    }else{
        const userdb = await objUsers.findById(req.user);
        
        const newPublication = new objPublication({publication});
        newPublication.userId = userdb.id;
        newPublication.user = userdb.user;
        if(userdb.Google.profilePicId) newPublication.profilePic = userdb.Google.profilePicId;
        await newPublication.save();
        res.status(203).json({status: 'ok'})

    }
    
});

router.get("/api/edit/:id", async(req, res) => {

    const editNote = await objPublication.findById(req.params.id).lean();
    res.render("publications/editPublications", { editNote });

});

router.put("/api/editSuccess/:id", async(req, res) => {

    const {publication } = req.body;
    console.log(req.body);
    console.log(req.headers);
    await objPublication.findByIdAndUpdate(req.params.id, {publication});
    res.redirect("/");

});

router.delete("/api/delete/:id", async(req,res) => {

    await objPublication.findByIdAndDelete(req.params.id);
    res.redirect(`/`)

});

router.post('/api/like', isAuthenticated, async(req, res) => {
    const publication = await objPublication.findOne({_id: req.body.pubID});
    const userdb = await objUsers.findById(req.user);

    if(!publication.likes) publication.likes = [];
    if(!userdb.likes) userdb.likes = [];
    const userLikes = userdb.likes;
    const likes = publication.likes;

    if(!likes.includes(req.user)){
        likes.push(req.user);
        userLikes.push(req.body.pubID);
    }else{
        for(let i = 0;i<likes.length;i++){
            if(likes[i] == req.user){
                likes.splice(i,1);
            }
        }
        for(let i = 0; i<userLikes.length;i++){
            if(userLikes[i] == req.body.pubID){
                userLikes.splice(i,1);
            }
        }
    }
    publication.likes = likes;
    userdb.likes = userLikes;
    await objPublication.findOneAndUpdate({_id:req.body.pubID},publication);
    await objUsers.findByIdAndUpdate(req.user, userdb)
    res.json({totalLikes: likes});
})

module.exports = router;