const loginRoutes = require("./login");
const createRoutes = require("./create");
const signupRoutes = require("./signup");
const userRoutes = require("./user");

const data = require("../data");
const postData = data.posts;
const userData = data.users;

const constructorMethod = app => {

    //Pages w/ multiple routes go into separate files.
    app.use("/login", loginRoutes);    
    app.use("/create", createRoutes);
    app.use("/signup", signupRoutes);
    app.use("/user", userRoutes);
    
    //Homepage routes
    app.get("/", async (req, res) => {
        console.log("Homepage");
        try{
            arr = await postData.getTen(0);
            res.render('pages/home', {title: "Home", posts: arr});
        }catch(e){
            res.status(500).json({error: e});
        }  
    });


    //These routes are singletons, so they were added here in index
    app.get('/post/:id', async (req, res) => {
        if(!req.params.id) res.redirect('/');
        else try{
            const postID =parseInt(req.params.id)
            const login = true;
            const status = false;
            if(!req.session.loginStatus) login = false;
            else try{
                const user = await userData.userBySession(req.session.loginStatus);
                if(user !== null){
                    status = await userData.isFavorite(user._id, postID);
                }
            } catch(e){
                status = false;
            }

            const post = await postData.getPost(postID);


            res.render('pages/post', {title: post.postTitle, post: post, login: login, favorite: status});
        } catch(e){
            res.status(500).json({error: e});   
        }
    });

    app.post('/search/:query', async (req,res) => {
        if(!req.body.query) res.redirect('/');
        try{
            const arr = await postData.searchPost(req.body.query);
            res.render("pages/search", {title: "Search Results", posts: arr});
        } catch(e){
            res.status(500).json({error: e});
        }
    });

    app.get('/random', async (req,res) => {
        try{
            const post = await postData.getRandom();
            res.redirect(`/post/${post}`);
        } catch(e){
            res.status(500).json({error: e}); 
        }
    });

    
    app.get("/logout", async (req, res) => {
        console.log("In logout");
        console.log(req.session.loginStatus);
        await userData.setSession((await userData.userBySession(req.session.loginStatus))._id, "");
        const anHourAgo = new Date();
        anHourAgo.setHours(anHourAgo.getHours() - 1);
        res.cookie("AuthCookie", "", { expires: anHourAgo });
        res.clearCookie('AuthCookie');
        console.log("Ready to redirect...");
        res.redirect('/');
    });

    app.get('/:id', async (req, res) => {
        if(!req.params.id) res.redirect('/');
        else try{
            const pageNum = parseInt(req.params.id);
            const postCount = await postData.getPostNum();
            if(pageNum < 0) res.redirect('/');
            else if(pageNum >= Math.floor(postCount/10)) res.redirect(`/${Math.floor(postCount/10)}`);
            else{
                arr = await postData.getTen(pageNum*10);
                res.render('pages/home', {title: 'Home', posts: arr})
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