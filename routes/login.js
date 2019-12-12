const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const users = require("../data/users")

router.get("/", (req,res) => {
    try{
        if(req.session.loginStatus){
            const user = users.userBySession(req.session.loginStatus);
            res.redirect(`/user/${user._id}`);
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
        res.status(401).render("pages/login",{title:"Login",error:true});
        return;
    }    
    try{
        if(!users.userCollection[req.body.username]){
            res.status(401).render("pages/login",{title:"Login",error:true});
            return;
        }
        inputUser = users.userCollection[req.body.username];
        let samePassword = await bcryptjs.compare(req.body.password,inputUser["password"]);
        if(samePassword){
                req.session.loginStatus = true; 
                inputUser["validSessionAccessors"].push(req.session.id);
                res.redirect(`/user/${user._id}`);
        }
        else{
            res.status(401).render("pages/login",{title:"Login",error:true});
            return;
        }
    }
    catch(e){
        res.sendStatus(500);
    }
});

module.exports = router