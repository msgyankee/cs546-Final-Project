const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;

router.get('/', async (req,res) => {
   if(req.session.loginStatus){
       const user = userData.userBySession(req.session.loginStatus);
       if(user !== null) res.redirect(`user/${user._id}`);
   } 

   res.render('pages/signup', {title: "Signup"});
});

router.post('/', async (req,res) => {
    
});

module.exports = router;