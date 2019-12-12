const loginRoutes = require("./login");
const createRoutes = require("./create");
const signupRoutes = require("./signup");
const userRoutes = require("./user");

const data = require("../data");
const postData = data.posts;

const contructorMethod = app => {

    app.use("/login", loginRoutes);    
    app.use("/create", createRoutes);
    app.use("/signup", signupRoutes);
    app.use("/user", userRoutes);
    
    app.get("/", async (req, res) => {
        try{
            arr = await postData.getTen(0);
            res.render('pages/home', {title: Home, posts: arr});
        }catch(e){
            res.status(500).json({error: e});
        }  
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