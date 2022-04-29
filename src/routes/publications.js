const express = require("express");
const { isAuthenticated } = require("../helpers/auth");
const router = express.Router();

const objPublication = require("../models/publications")

router.get('/api/getPubs', (req, res) => {
    let pubs = [];
    objPublication.find((err, results) => {
        if(err) console.error;

        res.json({status: 'ok', results});
    }).limit(20);
});

router.get("/api/upload", (req,res) => {

    res.render("publications/newPublications")

});

router.post("/api/upload", async(req, res) => {

    let {publication} = req.body;
    console.log(req.get('auth-token'))
    let errors = [];
    if(!publication){
        errors.push("la publicacion no puede estar vacia.")
    }
    if(errors.length > 0)
    {
        res.json({errors})
    }else{
        
        const newPublication = new objPublication({publication});
        newPublication.userId = req.user.id;
        newPublication.user = req.user.user;
        if(req.user.Google.profilePicId) newPublication.profilePic = req.user.Google.profilePicId;
        await newPublication.save();
        console.log(newPublication);
        res.redirect(`/`);

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

module.exports = router;