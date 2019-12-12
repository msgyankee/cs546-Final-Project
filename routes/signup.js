const express = require('express');
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcryptjs");
const uuidv1 = require('uuid/v1');
const userData = data.users;

router.get('/', async (req,res) => {
   try{
        if(req.session.loginStatus){
            const user = userData.userBySession(req.session.loginStatus);
            if(user !== null) res.redirect(`pages/user/${user._id}`);
        } 

        res.render('pages/signup', {title: "Signup"});
    } catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/', async (req,res) => {
    try{
        if(!req.body.username || !req.body.password) res.render("pages/signup", {title: "Signup", reqForms});
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        userID = await userData.create(req.body.username, hashedPassword);

        const uuid = uuidv1();
        request.session.loginStatus = uuid;
        await userData.setSession(userID, uuid);
        res.redirect(`/user/${userID}`);
    } catch(e){
        res.status(500).json({error: e});
    }
});

module.exports = router;