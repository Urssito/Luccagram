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
            const newUser = await new userModel({user, password, email}).save();
            newUser.password = await newUser.encryptPassword(password);
            newUser.save();
            let resUser = await JSON.parse(JSON.stringify(newUser));
            delete resUser['password'];
            const token = jwt.sign({
                auth: newUser.id,
            },'banana123',{expiresIn:'24h'})

            res.status(201).json({
                msg: 'usuario creado correctamente!',
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
        delete resUser['password'];
        delete resUser['_id'];
        resUser.id = userdb.id
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
            auth: userdb.id
        },'banana123',{expiresIn:'24h'})

        res.json({status: 'ok', user: resUser, token})
    }

});

router.get("/profile/edit", (req, res) => {

    res.render("users/editProfile");

});

router.put("/profile/editsuccess", isAuthenticated, upload.single("image"), async (req,res) => {

    const { user, description, imgDim} = req.body;
    const errors = [];
    const userModel = require("../models/users");
    const publications = require("../models/publications");
    const actualUser = await userModel.findOne({id: req.user});
    let profilePic = actualUser.profilePhoto || '';

    // Profile Photo

    if(req.file) {
        const ext = req.file.filename.split('.').pop();
        const originalFile = path.join(__dirname,'..','public','uploads','profilePhotos', req.file.filename);

        //save and crop image
        if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            console.log(req.file)
            if(fs.existsSync(originalFile)){
                console.log('cortando...')
                const rawData = imgDim.split(",");
                const data = rawData.map(elem => parseInt(elem,10));
                const outputImg = `profile${req.user}.${ext}`
                const imgDir = path.join(__dirname,'..','public','uploads','profilePhotos', outputImg);
                await sharp(originalFile).extract({left: data[0], top: data[1], width: data[2], height: data[2]}).toFile(imgDir)
                    .then(() =>{
                        fs.unlinkSync(originalFile);
                        console.log("imagen cortada!");
                        profilePic = '/uploads/profilePhotos/'+outputImg;
                    }).catch(err => console.log(err));
    
            }
        }else{
            errors.push("El formato de imagen debe ser .jpg, .jpeg o .png");
            fs.unlinkSync(originalFile);
        }
    }

    await userModel.findByIdAndUpdate(req.user, {user, description, profilePic});
    await publications.updateMany({userId: req.user},{user, profilePic});
    
    if(errors.length > 0){
        res.json({errors})
    }else{
        res.json({user, description, profilePic})
    }
});

router.get("/api/users", async(req, res) => {

    const getUser = req.get('get-user');
    const token = req.get('auth-token');
    let user = null

    let urlParse = getUser.split("/");
    if(urlParse.length == 5){
        urlParse = urlParse.pop();
        const userdb = await userModel.findOne({user: urlParse}).lean();
        user = await JSON.parse(JSON.stringify(userdb));
    }

    if(user){

        const id = jwt.verify(token, 'banana123').auth;
        const userState = await JSON.parse(JSON.stringify(await userModel.findById(id)));
        delete userState['password'];
        delete userState['_id'];

        delete user.password;
        delete user.Google;
        const pubs = await pubModel.find({ user: urlParse}).lean().sort({date: "desc"});
        req.res.locals.user = user
        res.json({ pubs, user, userState });
    }else res.json({error: "Usuario no encontrado."})
});

router.post('/api/follow', isAuthenticated, async (req,res) => {
    const {user} = req.body;
    let followed = null;

    const userdb = await userModel.findById(req.user);
    const userToFollow = await userModel.findOne({user});
    let follower = userToFollow.followers;
    let follow = userdb.follows;

    if(follow.includes(userToFollow.id)){
        for(let i = 0;i<follow.length;i++){
            if(follow[i] === userToFollow.id){
                follow.splice(i,1);
                break;
            }
        }
        for(let i = 0;i<follower.length;i++){
            if(follower[i] === req.user){
                follower.splice(i,1);
                break;
            }
        }
        followed = false;
    }else{
        follow.push(userToFollow.id);
        follower.push(req.user);
        followed = true;
    }

    userdb.follows = follow;
    userToFollow.followers = follower;
    userdb.save();
    userToFollow.save();

    res.json({followed})
})

router.get('/api/follow', isAuthenticated, async (req, res) => {
    const userdb = await userModel.findById(req.user);
    const user = req.get('user');
    const userToFollow = await userModel.findOne({user});
    
    if(userdb.follows.includes(userToFollow.id)){
        res.json({followed: true})
    }else{
        res.json({followed: false})
    }
})

module.exports = (router);