const express = require("express");
const router = express.Router();
const user = require("../data/users");
const uuidv1 = require('uuid/v1');



router.get("/", async (req,res) => {
    try{

        if(req.session.loginStatus){
            const users = await user.userBySession(req.session.loginStatus);
            res.redirect(`/user/${users._id}`);
        }
        else {
            res.render("pages/login",{title:"Login"});
        }
    }
    catch(e){
        res.sendStatus(500);
    }
});
router.post("/", async (req,res) => {
    if(!req.body.username || !req.body.password){
        res.status(401).render("pages/login",{title:"Login", reqFields:true});
    }    
    else try{
        const userID = await user.login(req.body.username, req.body.password);
        if(userID === null) res.render("pages/login", {title:"Login", badLogin: true});
        else{
            const uuid = uuidv1();
            req.session.loginStatus = uuid;
            await user.setSession(userID, uuid);
            res.redirect(`/user/${userID}`);
        }
    }catch(e){
        res.status(500).json({error: e});
    }
});

module.exports = router;