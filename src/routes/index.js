const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../helpers/auth");

const M_publicacion = require("../models/publications");
const objUsers = require("../models/users");

router.get("/api/home", async(req, res) => {
    if(req.user){
    const publications = await M_publicacion.find().lean().sort({date: "desc"});
    let user = null
    
    return res.json({ publications });
    }else{
        return res.json({});
    }
});

router.post('/api/home', async (req,res) => {

    // Search Querie|
    if(req.body.query){
        searchQ = req.body.query.toLowerCase();
    }

    if(req.body.query && searchQ.length > 0){
        let hint = ''
        let result = ''

        objUsers.find((err,results) => {
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
                    break;
                }
            }
        }
        publication.likes = likes
        await M_publicacion.findOneAndUpdate({_id:req.body.pubID},publication);
        res.json({totalLikes: likes})
        console.log(likes)
    }else{
        res.json({nombre: 'lucca'})
    }
});

router.get("/api/authenticate", isAuthenticated, async (req, res) => {
    const userdb = await objUsers.findById(req.user);
    let resUser = null;
    if(userdb){
        resUser = await JSON.parse(JSON.stringify(userdb));
        delete resUser['password'];
        delete resUser['_id']
        delete resUser['Google']

        res.json({status: 'ok', resUser});
    }
    else res.json({status: 'error', error: 'usuario no encontrado'});
});

router.get("/chat", (req, res) =>{

    res.render("chat");

});
module.exports = router;
