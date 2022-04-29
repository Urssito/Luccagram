const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { isAuthenticated } = require("../helpers/auth");

const userModel = require("../models/users");
const pubModel = require("../models/publications")
const multer = require("multer");
const storage = require("../config/diskStorage");
const upload = multer({storage: storage});

router.post("/api/signup", async (req, res) => {

    const { user, password, confirmPassword, email } = req.body;
    const drive = require("../config/googleAPI");
    const errors = []
    if(password && confirmPassword && password != confirmPassword){
        errors.push("las contraseñas no coinciden");
    }
    if(password && password.length < 4){
        errors.push("la contraseña debe tener mas de 4 caracteres");
    }
    if(!user){
        errors.push("debe ingresar un usuario");
    }
    if(!password){
        errors.push("debe ingresar una contraseña");
    }
    if(password && !confirmPassword){
        errors.push("debe confirmar su contraseña");
    }
    if(!email){
        errors.push("debe ingresar un correo");
    }
    if(errors.length > 0){
        res.status(401).json({errors});
    }else{
        const errors = [];
        let err = false;
        const emailUser = await userModel.findOne({email:email});
        const userUser = await userModel.findOne({user:user});
        if(emailUser || userUser){
            if(emailUser) errors.push("el email ya está en uso");
            if(userUser) errors.push("el nombre de usuario ya esta en uso");
            res.status(401).json({errors})
            err = true;
        }
        if(!err){
            const errors = []
            const newUser = await new userModel({user, password, email}).save();
            newUser.password = await newUser.encryptPassword(password);
            newUser.save();
            const userId = newUser.id;
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
                 userModel.remove({user:user});
                    errors.push("Ocurrió un error al crear su cuenta, intentelo de nuevo.");
                    res.status(401).json({errors})

                }else{
                    console.log('Folder Id: ', file.data.id);
                    newUser.Google.drivePath = file.data.id;
                    await newUser.save();
                }
            })
            let resUser = await JSON.parse(JSON.stringify(newUser));
            delete resUser['password'];
            delete resUser['Google'];
            const token = jwt.sign({
                user: resUser
            },'banana123',{expiresIn:'24h'})

            res.status(201).json({
                msg: 'usuario creado correctamente!',
                user: resUser,
                token
            });
        }
    }

});

router.post('/api/login', async (req, res) => {
    const {user, password} = req.body;
    const errors = [];

    const userdb = await userModel.findOne({user: user});
    let resUser = null;
    let match = null;

    if(userdb){

        resUser = await JSON.parse(JSON.stringify(userdb));
        resUser.profilePicId = resUser.Google.profilePicId;
        delete resUser['password'];
        delete resUser['Google']
        match = await bcrypt.compare(password, userdb.password);
    
    }else{
        errors.push('usuario o correo inexistente');
    }
    if(userdb && !match){
        errors.push('contraseña incorrecta');
    }
    
    if(errors.length > 0){
        res.json({errors})
    }
    else{
        const token = jwt.sign({
            user: resUser
        },'banana123',{expiresIn:'24h'})

        res.json({status: 'ok', user: resUser, token})
    }

});

router.get("/profile/edit", (req, res) => {

    res.render("users/editProfile");

});

router.put("/profile/editsuccess", upload.single("image"), async (req,res) => {

    const { user, description, imgDim} = req.body;
    const drive = require("../config/googleAPI")
    const userModel = require("../models/users");
    const publications = require("../models/publications");
    const actualUser = await userModel.findOne({id: req.user.id});
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
            await publications.findOneAndUpdate({userId: req.user.id}, {profilePic: profilePicId});
            const Google = {
                profilePicId: profilePicId,
                drivePath: req.user.Google.drivePath
            }

         userModel.findByIdAndUpdate(req.user.id, {Google}, (err, result) => {
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

    await userModel.findByIdAndUpdate(req.user.id, {user, description});
    await publications.findOneAndUpdate({userId: req.user.id}, {user: user});
    
    if(!error){
        req.flash("successMsg", "Foto de perfil guardada con éxito!")
        res.redirect("/profile")
    }
});

router.get("/api/users", async(req, res) => {

    const getUser = 'http://localhost:3000/user/urssito' //req.get('get-user');
    //console.log(getUser)

    const urlParse = getUser.split("/").pop();
    const userdb = await userModel.findOne({user: urlParse}).lean();
    const user = await JSON.parse(JSON.stringify(userdb));

    if(user){
        delete user.password;
        delete user.Google;
        const pubs = await pubModel.find({ user: urlParse}).lean().sort({date: "desc"});
        res.json({ pubs, user });
    }else res.json({error: "Usuario no encontrado."})
});

module.exports = (router);