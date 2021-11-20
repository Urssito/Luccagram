const express = require("express");
const { findByIdAndDelete } = require("../models/publications");
const router = express.Router();

const M_publicacion = require("../models/publications")
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
        
        const newPublication = new M_publicacion({title, publication});
        newPublication.userId = req.user.id;
        newPublication.user = req.user.user;
        await newPublication.save();
        req.flash("successMsg", "Nota agregada exitosamente!");
        res.redirect("/profile");

    }
    
});

router.get("/profile", isAuthenticated, async(req, res) => {

    const publications = await M_publicacion.find({ userId: req.user.id}).lean().sort({date: "desc"});
    console.log("cookies: ", req.cookies);
    res.render("publications/allPublications", { publications });

});

router.get("/edit/:id", isAuthenticated, async(req, res) => {

    const editNote = await M_publicacion.findById(req.params.id).lean();
    res.render("publications/editPublications", { editNote });

});

router.put("/editSuccess/:id", isAuthenticated, async(req, res) => {

    const { title, publication } = req.body;
    await M_publicacion.findByIdAndUpdate(req.params.id, {title, publication});
    res.redirect("/profile");

});

router.delete("/delete/:id", isAuthenticated, async(req,res) => {

    await M_publicacion.findByIdAndDelete(req.params.id);
    res.redirect("/profile")

});
module.exports = router;