const express = require("express");
const router = express.Router();

const objPublication = require("../models/publications")
const { isAuthenticated } = require("../helpers/auth");

router.get('/api/getPubs', (req, res) => {
    let pubs = [];
    objPublication.find((err, results) => {
        if(err) console.error;

        res.json(results);
    }).limit(20);
});

router.get("/api/upload", isAuthenticated, (req,res) => {

    res.render("publications/newPublications")

});

router.post("/api/upload", isAuthenticated, async(req, res) => {

    let {publication} = req.body;
    let errors = [];
    if(!publication){
        errors.push({text: "la publicacion no puede estar vacia."})
    }
    if(errors.length > 0)
    {
        res.render("publications/newPublications", {errors, publication})
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

router.get("/api/edit/:id", isAuthenticated, async(req, res) => {

    const editNote = await objPublication.findById(req.params.id).lean();
    res.render("publications/editPublications", { editNote });

});

router.put("/api/editSuccess/:id", isAuthenticated, async(req, res) => {

    const {publication } = req.body;
    console.log(req.body);
    console.log(req.headers);
    await objPublication.findByIdAndUpdate(req.params.id, {publication});
    res.redirect("/");

});

router.delete("/api/delete/:id", isAuthenticated, async(req,res) => {

    await objPublication.findByIdAndDelete(req.params.id);
    res.redirect(`/`)

});

module.exports = router;