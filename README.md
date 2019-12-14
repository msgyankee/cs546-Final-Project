# cs546-Final-Project

## Setup:  
   Bring terminal to root project folder. Run "npm install" to get requisite packages.  
   Run "node ./tasks/seed.js" to seed the database with example posts.  
   Run "npm start" to start the web server, and connect in a browser by going to localhost:3000.  
   
## Usage:  
  Homepage("/") - This page will display the last 10 posts submitted to the site. Use buttons at bottom of page to cycle to older posts.  
  Sign Up  ("/signup") - This allows users to create an account. Must provide a unique username.  
  Log in ("/login") - If you already have an account, provide your credentials here.  
  Create a Post ("/create") - Create a post to be displayed on the site. Must be logged in, or will redirect to the login page.  
  Random ("/random") - This page will redirect you automatically to a random post on the site.  
  My Profile ("/user/{id}") - This will show a user's authored posts and their favorites.  
  Post ("/post/{id}") - This page will show a single post, and if logged in, will display a button to add a post as a favorite.  
  Logout ("logout") - This will end the user's session and redirect them to the homepage.  
