const loginRoutes = require("./login");
const createRoutes = require("./create");
const signupRoutes = require("./signup");
const userRoutes = require("./user");
const randomRoute = require("./random");
const postRoute = require("./post");
const searchRoute = require("./search");

const data = require("../data");
const postData = data.posts;
const userData = data.users;

const constructorMethod = app => {

    //Pages w/ multiple routes go into separate files.
    app.use("/login", loginRoutes);    
    app.use("/create", createRoutes);
    app.use("/signup", signupRoutes);
    app.use("/user", userRoutes);
    app.use("/random", randomRoute);
    app.use("/post", postRoute);
    app.use("/search", searchRoute);
    
    //Homepage route
    app.get("/", async (req, res) => {
        try{
            let login = true;
            let userID = "";
            if(!req.session.loginStatus) login = false;
            else try{
                const user = await userData.userBySession(req.session.loginStatus);
                if(user !== null){
                    userID = user._id;
                }
            } catch(e){
                login = false
                userID = false;
            }
            let arr = await postData.getTen(0);
            //let disabled = 

            if(login)res.render('pages/home', {title: "Home", login: true, userID: userID, posts: arr});
            else{ res.render('pages/home', {title: "Home", posts: arr}); }
        }catch(e){
            res.status(500).json({error: e});
        }  
    });

    //Logout automatically redirects back to home.
    app.get("/logout", async (req, res) => {
        await userData.setSession((await userData.userBySession(req.session.loginStatus))._id, "");
        const anHourAgo = new Date();
        anHourAgo.setHours(anHourAgo.getHours() - 1);
        res.cookie("AuthCookie", "", { expires: anHourAgo });
        res.clearCookie('AuthCookie');
        res.redirect('/');
    });

    //Dynamic route can overwrite others, so its at the bottom 
    app.get('/:id', async (req, res) => {
        if(!req.params.id) res.redirect('/');
        else try{
            
            let login = true;
            let userID = "";
            if(!req.session.loginStatus) login = false;
            else try{
                const user = await userData.userBySession(req.session.loginStatus);
                if(user !== null){
                    userID = user._id;
                }
            } catch(e){
                login = false
                userID = false;
            }
            
            const pageNum = parseInt(req.params.id);
            const postCount = await postData.getPostNum();
            if(pageNum < 0) res.redirect('/');
            else if(pageNum >= Math.floor(postCount/10)) res.redirect(`/${Math.floor(postCount/10)}`);
            else{
                arr = await postData.getTen(pageNum*10);
                res.render('pages/home', {title: 'Home', login: login, userID: userID, posts: arr})
            }
        } catch(e){
            res.status(500).json({error: e});
        }
    });

    //All undefined pages get sent 404. Make error page?
    app.get("*", (req,res) => {
        res.sendStatus(404); 
    });
}
module.exports = constructorMethod;
















