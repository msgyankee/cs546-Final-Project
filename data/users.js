const collections = require('./collections');
const postData = require('./posts');
const users = collections.users;
var ObjectID = require('mongodb').ObjectID;
const bcrypt = require("bcryptjs");



module.exports = {

    async create(username, hashedPassword) {
        if(!username || typeof username !== 'string') return Promise.reject('Must provide valid username');
        if(!hashedPassword) return Promise.reject('Must provide a valid password');

        if(await this.userExists(username)) return Promise.reject('Username already in use');

        const userCollection = await users();
        let newUser = {
            username: username,
            hashedPassword: hashedPassword,
            sessionID: "",
            posts: [],
            favorites: []
        };
        const insertInfo = await userCollection.insertOne(newUser);

        if(insertInfo.insertedCount === 0) return Promise.reject(`Could not add user ${username}`);

        return insertInfo.insertedId;
    },

    async getAllUsers(){
        const userCollection = await users();

        const arr = await userCollection.find({}).toArray();
        return arr;
    },

    async getUser(userID){
        if(!userID) return Promise.reject('ID is required for get');

        try{
        const id = new ObjectID(userID);
        } catch(e){
            return null;
        }
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return null;
        return user;
    },

    async setSession(userID, sessionID){
        if(!userID) return Promise.reject('Must provide a user ID to set session');
        if(!sessionID && sessionID !== "") return Promise.reject('Must provide Session ID to set Session ID');
        
        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');
        
        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: sessionID,
            posts: user.posts,
            favorites: user.favorites
        };

        const updatedInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
        if(updatedInfo.modifiedCount === 0) return Promise.reject('Could not update session ID successfully');
        return id;
    },

    async addPost(userID, postID){
        if(!userID) return Promise.reject('Must provide a user ID to add post');
        if(!postID) return Promise.reject('Must provide post ID to add post');
        
        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');
        
        const arr = user.posts;
        arr.push(postID);

        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: user.sessionID,
            posts: arr,
            favorites: user.favorites
        };


        const updatedInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
        if(updatedInfo.modifiedCount === 0) return Promise.reject('Could not update user posts successfully');
        return id;
    },

    async addFavorite(userID, postID){
        if(!userID) return Promise.reject('Must provide a user ID to add favorite');
        if(!postID) return Promise.reject('Must provide post ID to add favorite');
        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');
        let arr = user.favorites;
        arr.push(postID);
            
        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: user.sessionID,
            posts: user.posts,
            favorites: arr
        };

        console.log("Add Favorite Result: "+updatedUser.favorites);

        const updatedInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
        if(updatedInfo.modifiedCount === 0) return Promise.reject('Could not update user favorites successfully');
        return id;
    },

    async remFavorite(userID, postID){
        if(!userID) return Promise.reject('Must provide a user ID to remove favorite');
        if(!postID) return Promise.reject('Must provide post ID to remove favorite');
        
        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');
        
        let arr = user.favorites;
        arr.splice(arr.indexOf(postID), 1);

        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: user.sessionID,
            posts: user.posts,
            favorites: arr
        };

        const updatedInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
        if(updatedInfo.modifiedCount === 0) return Promise.reject('Could not update user favorites successfully');
        return id;
    },

    async login(usernameInput, password){
        if(!usernameInput || typeof usernameInput !== 'string') return Promise.reject('Must provide valid username');
        if(!password || typeof password !== 'string') return Promise.reject('Must provide a valid password');

        const userCollection = await users();
        const user = await userCollection.findOne({username: usernameInput});
        if(user == null) return null;
        const compare = await bcrypt.compare(password, user.hashedPassword);
        if(compare == false) return null;
        return user._id;
    },

    async getUserPosts(userID){
        //try {
        if(!userID) return Promise.reject('ID is required for get');

        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');
        arr = user.posts;
        let posts = [];
        let i = 0;
        for(i = 0; i < arr.length;i++){
            posts.push(await postData.getPost(arr[i]));
        }
        //const posts = await arr.map( async function (postID) { return await postData.getPost(postID)});
        return posts;
        //} catch(e) {
        //    return Promise.reject("invalid userID")
        //}
        
    },

    async getUserFavorites(userID){
        try {
            if(!userID) return Promise.reject('ID is required for get');

            const id = new ObjectID(userID);
            const userCollection = await users();

            const user = await userCollection.findOne({_id: id});
            if(user === null) return Promise.reject('User not found');

            arr = user.favorites;
            let posts = [];
            let i = 0;
            for(i = 0; i < arr.length;i++){
                posts.push(await postData.getPost(arr[i]));
            }
            //const arr = user.posts.map( postID => postData.getPost(postID));

            return posts;
        } catch(e) {
            return Promise.reject("invalid userID");
        }
    },

    async userExists(username){
        if(!username || typeof username !== 'string') return Promise.reject('Must provide valid username');
        
        const userCollection = await users(); 
        const user = await userCollection.findOne({username:username});
        if(user == null) return false;
        return true;
    },

    async userBySession(sessionID){
        if(!sessionID) return Promise.reject('Must provide sessionID to search');
        const userCollection = await users();

        const user = await userCollection.findOne({sessionID:sessionID});        
        return user;
    },
     
    async isFavorite(userID, postID){
        if(!userID) return Promise.reject('Must provide a user ID to add favorite');
        if(!postID) return Promise.reject('Must provide post ID to add favorite');
        
        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');

        return user.favorites.includes(postID);
    }
}