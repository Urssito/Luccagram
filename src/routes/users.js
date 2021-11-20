const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis")

const objUser = require("../models/users");
const multer = require("multer");
const storage = require("../config/diskStorage");
const { db } = require("../models/users");
const upload = multer({storage: storage});
const drive = require("../config/googleAuth");
const { ajax } = require("jquery");

router.get("/signup", (req,res) => {

    res.render("users/signup");

});

router.post("/signup", async(req,res) => {

    const { user, password, confirmPassword, email } = req.body;
    const errors = []
    if(password && confirmPassword && password != confirmPassword){
        errors.push({text: "las contraseñas no coinciden"});
    }
    if(password && password.length < 4){
        errors.push({text: "la contraseña debe tener mas de 4 caracteres"});
    }
    if(!user){
        errors.push({text: "debe ingresar un usuario"});
    }
    if(!password){
        errors.push({text: "debe ingresar una contraseña"});
    }
    if(password && !confirmPassword){
        errors.push({text: "debe confirmar su contraseña"});
    }
    if(!email){
        errors.push({text: "debe ingresar un correo"});
    }
    if(errors.length > 0){
        res.render("users/signup", {errors, user, email, password, confirmPassword});
    }else{
        const errors = [];
        var err = false;
        const emailUser = await objUser.findOne({email:email});
        const userUser = await objUser.findOne({user:user});
        if(emailUser || userUser){
            if(emailUser) errors.push({text: "el email ya está en uso"});
            if(userUser) errors.push({text: "el nombre de usuario ya esta en uso"});
            res.render("users/signup", {errors, user, email, password, confirmPassword})
            err = true;
        }
        if(!err){
            const errors = []
            const newUser = await new objUser({user, password, email}).save();
            newUser.password = await newUser.encryptPassword(password);
            newUser.save();
            const userId = newUser.id;
            const dir = path.join(__dirname, "..", "public", "img", "users", userId)
            const fileMetadata = {
                'name': userId,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': ['1-PRGl6OPxvGb0X5mkeNd8sULHrILm2vo']
            }
            await drive.files.create({
                resource: fileMetadata,
                fields: 'id'
            }, async function (err, file) {
                if(err) {
                    console.error(err);
                    objUser.remove({user:user});
                    errors.push({text: "Ocurrió un error al crear su cuenta, intentelo de nuevo."});
                    res.render("users/signup", {errors, user, email, password, confirmPassword})

                }else{
                    console.log('Folder Id: ', file.data.id);
                    newUser.Google.drivePath = file.data.id;
                    await newUser.save();
                }
            })
            req.flash("successMsg", "cuenta creada exitosamente!");
            res.redirect("/profile");}
        }

});

/*router.get("/login", (req, res) => {

    res.render("users/login");

});*/

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

router.get("/logout", (req,res) => {

    req.logOut();
    res.redirect("/");
    
});

router.get("/profile/edit", (req, res) => {

    res.render("users/editProfile");

});

router.put("/profile/edit", upload.single("image"), async(req,res) => {

    const { user, description} = req.body;
    const objUser = require("../models/users");
    const publications = require("../models/publications");
    const userId = req.user.id;
    console.log("usuario: ", user, "\ndescripcion: ", description);

    // Profile Photo
    if(req.file){
        const ext = req.file.filename.split('.').pop();
        const filePath = path.join(__dirname, '..','public','img','temp', `profile${req.user.id}.${ext}`);
        console.log(req.file);
        
        if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            const response = await drive.files.create({
                requestBody: {
                    name: 'profilePhoto.' + ext,
                    mimeType: 'image/jpg',
                    parents: [req.user.Google.drivePath]
                },
                media: {
                    mimeType: 'image/jpg',
                    body: fs.createReadStream(filePath)
                }
            });
            const userDb = objUser.findById(user.id);
            userDb.profilePhoto.parents = [req.user.Google.drivePath];
            userDb.profilePhoto.ext = ext;
            fs.unlinkSync(filePath);

        }else{
            errors = []
            errors.push({text: "la imagen debe ser en formato jpg, jpeg o png."});
            res.render("users/signup", {errors, user, email, password, confirmPassword});
        }
        
        console.log(response.data);

    }

    // Description
    const actualUser = await objUser.findOne({id: userId});
    actualUser.description = description;

    // Username
    if(actualUser.user != user){
        actualUser.user = user;
    }

    await objUser.findByIdAndUpdate(req.user.id, {user, description});
    await publications.findOneAndUpdate({userId: req.user.id}, {user: user})

    res.redirect("/profile");
});

module.exports = (router);