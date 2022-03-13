const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const M_publicacion = require("../models/publications");
const M_users = require("../models/users");
const passport = require('passport');
const { default: cluster } = require("cluster");

router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html")), function(err) {
        if (err) res.status(500).send(err);
    }
})

router.get("/api/home", async(req, res) => {

    console.log(passport.authenticate('session'));
    const mongodata = path.join(__dirname,'..','mongoData.json')

    if(!fs.existsSync(mongodata)){
            
        const drive = require("../config/googleAPI");

        drive.files.get({
            fileId: '1weAzflppbIqXxLYi4hVCHqAmo5l3FFaS',
            alt: 'media'
        }).then(function(success){

            let uri = success.data;
            
            if(req.hostname.split(':')[0] != 'localhost'){
                uri = uri.uri.splice(0,1);
            }


            fs.writeFileSync(mongodata, JSON.stringify(uri));
        });
    }

    require("../database")
    if(req.user){
    const publications = await M_publicacion.find().lean().sort({date: "desc"});
    let user = null
    
    user = JSON.parse(JSON.stringify(req.user));
    return res.json({ publications, objuser });
    }else{
        return res.json({});
    }
});

router.post('/api/home', async (req,res) => {

    // Search Querie
    if(req.body.query){
        searchQ = req.body.query.toLowerCase();
    }

    if(req.body.query && searchQ.length > 0){
        let hint = ''
        let result = ''

        M_users.find((err,results) => {
            if(err) console.error;

            let limit = 0
            results.forEach((result)=>{
                if(result.user.indexOf(searchQ) != -1 && limit < 5){
                    hint = hint + `<a class="a-normalize searchResult" href="/user/${result.user}">${result.user}</a>\n`
                    limit += 1;
                }

            });
            if(hint == ''){
                result = 'usuario no encontrado';
            }else{
                result = hint;
            }

            res.json({response: result});

        });
    }

    // Likes count
    if(req.body.user){
        const publication = await M_publicacion.findOne({_id: req.body.pubID});
        if(!publication.likes){
            publication.likes = [];
        }
        const likes = publication.likes;
        if(!likes.includes(req.body.user)){
            likes.push(req.body.user);
        }else{
            for(let i = 0;i<likes.length;i++){
                if(likes[i] == req.body.user){
                    likes.splice(i,1);
                }
            }
        }
        publication.likes = likes
        await M_publicacion.findOneAndUpdate({_id:req.body.pubID},publication);
        res.json({totalLikes: likes})
    }else{
        res.json({nombre: 'lucca'})
    }
});

router.get("/api/authenticate", (req, res) => {
    res.json({user: 'urssito'})
});

router.get("/chat", (req, res) =>{

    res.render("chat");

});
module.exports = router;
