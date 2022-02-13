const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const objUser = require("../models/users");
const objPublication = require("../models/publications")
const multer = require("multer");
const storage = require("../config/diskStorage");
const upload = multer({storage: storage});
const { isAuthenticated } = require("../helpers/auth");

router.get("/signup", (req,res) => {

    res.render("users/signup");

});

router.post("/signup", async (req, res) => {

    const { user, password, confirmPassword, email } = req.body;
    const drive = require("../config/googleAPI");
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
            const fileMetadata = {
                'name': userId,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': ['1-PRGl6OPxvGb0X5mkeNd8sULHrILm2vo']
            }
            const folder =  await drive.files.create({
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
            res.redirect("/")
        }
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

router.put("/profile/editsuccess", upload.single("image"), async (req,res) => {

    const { user, description, imgDim} = req.body;
    const drive = require("../config/googleAPI")
    const objUser = require("../models/users");
    const publications = require("../models/publications");
    const actualUser = await objUser.findOne({id: req.user.id});
    upload.single("image");
    let error = false;

    // Profile Photo

    if(req.file) {
        console.log(req.file)
        const ext = req.file.filename.split('.').pop();
        const originalFile = path.join(__dirname, '..', 'public', 'img', 'users', 'temp', req.file.filename);

        //save and crop image
        if(fs.existsSync(originalFile)){
            const rawData = imgDim.split(" ");
            const data = rawData.map(elem => parseInt(elem,10));
            const outputImg = `temp${req.user.id}.${ext}`
            const imgDir = path.join(__dirname, '..', 'public', 'img', 'users', 'temp', outputImg);
            await sharp(originalFile).extract({left: data[0], top: data[1], width: data[2], height: data[2]}).toFile(imgDir)
                .then(() =>{
                    console.log("imagen cortada!");
                }).catch(err => console.error(err));

        }

        //Save file in Google Drive

        console.log("subiendo...")
        
        const filePath = path.join(__dirname, '..','public','img', 'users','temp', `temp${req.user.id}.${ext}`);
    
        if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){

            const file = await drive.files.create({
                requestBody: {
                    name: `profilePhoto.${ext}`,
                    mimeType: `image/${ext}`,
                    role: 'reader',
                    type: 'anyone',
                    parents: [req.user.Google.drivePath]
                },
                media: {
                    mimeType: `image/${ext}`,
                    body:fs.createReadStream(filePath)
                            .on('end', () => console.log('imagen lista'))
                            .on('error', err => console.error(err))
                }
            })
            .catch(console.error);

            /*if(req.user.Google.profilePicId != ''){
                await drive.files.delete({
                    'fileId': req.user.Google.profilePicId
                })
            }*/
         
            const profilePicId = file.data.id;
            const Google = {
                profilePicId: profilePicId,
                drivePath: req.user.Google.drivePath
            }
            objUser.findByIdAndUpdate(req.user.id, {Google}, (err, result) => {
                if (err) console.log("hubo un error al actualizar el objeto usuario: \n",err);
                else console.log('el archivo se subió de forma exitosa');
            })
            fs.unlinkSync(filePath);
            fs.unlinkSync(originalFile);

        }else{

            error = true;
            req.flash("errorMsg", "El formato de imagen debe ser .jpg, .jpeg o .png");
            res.redirect("/profile/edit");
        }
    }


    // Description
    actualUser.description = description;

    // Username
    if(actualUser.user != user){
        actualUser.user = user;
    }

    await objUser.findByIdAndUpdate(req.user.id, {user, description});
    await publications.findOneAndUpdate({userId: req.user.id}, {user: user});
    
    if(!error){
        req.flash("successMsg", "Foto de perfil guardada con éxito!")
        res.redirect("/profile")
    }
});

router.get("/user/*", isAuthenticated, async(req, res) => {

    const urlParse = req.url.split("/").pop();
    const user = await objUser.findOne({user: urlParse}).lean();
    const currentUser = await objUser.findOne(req.user).lean();

    if(user){
        const publications = await objPublication.find({ user: urlParse}).lean().sort({date: "desc"});
        res.render("publications/allPublications", { publications, user, currentUser });
    }else res.send("Usuario no encontrado.")
});

module.exports = (router);