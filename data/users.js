const collections = require('./collections');
const postData = require('./posts');
const users = collections.users;
var ObjectID = require('mongodb').ObjectID;
const bcrypt = require("bcryptjs");



module.exports = {

    async create(username, hashedPassword) {
        console.log(username);
        console.log(typeof username);
        if(!username || typeof username !== 'string') return Promise.reject('Must provide valid username');
        if(!hashedPassword || typeof password !== 'string') return Promise.reject('Must provide a valid password');

        if(userExists(username)) return Promise.reject('Username already in use');

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

        const id = new ObjectID(userID);
        const userCollection = await users();

        const user = await userCollection.findOne({_id: id});
        if(user === null) return Promise.reject('User not found');
        return user;
    },

    async setSession(userID, sessionID){
        if(!userID) return Promise.reject('Must provide a user ID to set session');
        if(!sessionID) return Promise.reject('Must provide Session ID to set Session ID');
        
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
        
        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: user.sessionID,
            posts: user.posts.push(postID),
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
        
        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: user.sessionID,
            posts: user.posts,
            favorites: user.favorites.push(postID)
        };

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
        
        const updatedUser = {
            username: user.username,
            hashedPassword: user.hashedPassword,
            sessionID: user.sessionID,
            posts: user.posts,
            favorites: user.favorites.splice(user.favorites.indexOf(postID), 1)
        };

        const updatedInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
        if(updatedInfo.modifiedCount === 0) return Promise.reject('Could not update user favorites successfully');
        return id;
    },

    async login(username, password){
        if(!username || typeof username !== 'string') return Promise.reject('Must provide valid username');
        if(!password || typeof password !== 'string') return Promise.reject('Must provide a valid password');

        const userCollection = await users();
        console.log("username: "+username);
        const user = await userCollection.findOne({username: username});
        console.log(user);
        if(user == null) return null;
        const compare = await bcrypt.compare(password, user.hashedPassword);
        console.log(compare);
        console.log(password);
        if(compare == false) return null;
        return user._id;
    },

    async getUserPosts(userID){
        try {
            if(!userID) return Promise.reject('ID is required for get');

            const id = new ObjectID(userID);
            const userCollection = await users();

            const user = await userCollection.findOne({_id: id});
            if(user === null) return Promise.reject('User not found');
        
            const arr = user.posts.map( postID => postData.getPost(postID));

            return arr;
        } catch(e) {
            return Promise.reject("invalid userID")
        }
        
    },

    async getUserFavorites(userID){
        try {
            if(!userID) return Promise.reject('ID is required for get');

            const id = new ObjectID(userID);
            const userCollection = await users();

            const user = await userCollection.findOne({_id: id});
            if(user === null) return Promise.reject('User not found');

            const arr = user.posts.map( postID => postData.getPost(postID));

            return arr;
        } catch(e) {
            return Promise.reject("invalid userID");
        }
    },

    async userExists(username){
        if(!username || typeof username !== 'string') return Promise.reject('Must provide valid username');
        
        const userCollection = await users(); 

        const user = await userCollection.findOne({username:usermane});
        if(user === null) return true;
        return false;
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