const express = require("express");
const router = express.Router();

const objPublication = require("../models/publications")
const { isAuthenticated } = require("../helpers/auth");

router.get("/upload", isAuthenticated, (req,res) => {

    res.render("publications/newPublications")

});

router.post("/upload", isAuthenticated, async(req, res) => {

    let { title, publication } = req.body;
    let errors = [];
    if(!title){
        errors.push({text: "inserte un titulo."})
    }
    if(!publication){
        errors.push({text: "la publicacion no puede estar vacia."})
    }
    if(errors.length > 0)
    {
        res.render("publications/newPublications", {errors, title, publication})
    }else{
        
        const newPublication = new objPublication({title, publication});
        newPublication.userId = req.user.id;
        newPublication.user = req.user.user;
        if(req.user.Google.profilePicId) newPublication.profilePic = req.user.Google.profilePicId;
        await newPublication.save();
        req.flash("successMsg", "Nota agregada exitosamente!");
        res.redirect("/profile");

    }
    
});

router.get("/edit/:id", isAuthenticated, async(req, res) => {

    const editNote = await objPublication.findById(req.params.id).lean();
    res.render("publications/editPublications", { editNote });

});

router.put("/editSuccess/:id", isAuthenticated, async(req, res) => {

    const { title, publication } = req.body;
    console.log(req.body);
    console.log(req.headers);
    await objPublication.findByIdAndUpdate(req.params.id, {title, publication});
    res.redirect("/profile");

});

router.delete("/delete/:id", isAuthenticated, async(req,res) => {

    await objPublication.findByIdAndDelete(req.params.id);
    res.redirect("/profile")

});

module.exports = router;