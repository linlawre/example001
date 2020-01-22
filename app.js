var express = require("express");  
var app = express();
var mongoose = require("mongoose");                                             // database
var bodyPArser = require("body-parser");                                        // for neat form
var passport = require("passport");                                             // for login
var locol_passport = require("passport-local");                                 // for login
var local_passport_mongo = require("passport-local-mongoose");                  // for login
var method_override = require("method-override");                               // to overwrite the post
//var express_sanitizer = require("express-sanitizer");                         // to clean and safty
var flash = require("connect-flash");

//var seedDb = require("./seeds");                                              // seeding has some null error remenber come back to fix
//seedDb();

app.set("view engine", "ejs");                                                  // for lazyness
var user = require("./models/users");  
//var blog = require("./models/blog");          // include the file for clean page
app.use(bodyPArser.urlencoded({extended:true}));
//app.use(express_sanitizer());                                                  // remenber this one needs to be after the bodyparser

mongoose.connect("mongodb://localhost/auth", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(method_override("_method"));
app.use(flash());


app.use(require("express-session")({
    secret:"Rusty is the best",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new locol_passport(user.authenticate()));
passport.serializeUser(user.serializeUser());                       //encode
passport.deserializeUser(user.deserializeUser());                   //decode

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



var blog_schema = new mongoose.Schema({
  title:String,
  URL: {type : String, default: "https://akm-img-a-in.tosshub.com/sites/indiacontent/0/media/images/frontend/image-not-found.png"},
  content: String, 
  created: {type : Date, default: Date.now}
});

var blog = mongoose.model("blog", blog_schema);



//////////////////////
//      route
//////////////////////

app.get("/", function(req, res){
     blog.find({}, function(err, db){
        if (err){
            console.log(err);
        }
        else{
            res.render("home", {db : db});
        }
    });
});

app.post('/', function(req, res)
{
  var D_title = req.body.title;
  var U_name = req.body.URL;
  var U_Des = req.body.content;
  var new_temp = {title : D_title, URL:U_name, content:U_Des};

  blog.create(new_temp, 
  
    function(err, pd)
    {
      if (err)
      {
        console.log(err);
      }
      else
      {
        res.redirect("/");
      }
    }
  );
})

app.get('/new', function (req, res) {
   res.render("add_new");
});

app.get("/secret", is_login, function(req, res){
   res.render("secret");
});

//////////////////////
//    auth route
//////////////////////

app.get("/register", function(req, res){
   res.render("register");
});

app.post("/register", function(req, res){

    user.register(new user({username:req.body.username}), req.body.password, function(err, user){
       
        if (err)
        {
            console.log(err);
            return res.render("register");
        }
        
        passport.authenticate("local")(req, res, function(){
        res.redirect("/secret");
        
        });
    });
});

app.get("/login", function(req, res){
   res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function is_login(req, res, next){
    if (req.isAuthenticated())
    {
        return next();
    }
    
    res.redirect("/login");
}

app.delete('/:id', function (req, res) {
  blog.findByIdAndRemove(req.params.id, function(err){
      if (err)
      {
        res.redirect("/");
      }
      else
      {
        res.redirect("/");
      }
  });
});


app.get('/:id', function(req, res){
    blog.findById(req.params.id, function(err, db)
  {
      if (err)
      {
        res.redirect("/");
      }
      else
      {
        res.render("show", {db : db});
      }
      
  });
});


app.get('/:id/edit', is_login, function (req, res) {
  blog.findById(req.params.id, function(err, db){
      if (err)
      {
         res.redirect("/");
      }
      else
      {
        res.render("edit", {db : db});
      }
  });
});

app.put('/:id', function (req, res) {
/*
  console.log(req.body);
  req.body.blog.body =  req.sanitize(req.body.blog.body);
  console.log("================================================================");
  console.log(req.body);
*/
    
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updated_blog){
      
      if (err)
      {
         res.redirect("/");
      }
      else
      {
        res.redirect("/" + req.params.id);
      }
  });
});


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

app.get('*', function (req, res) {
  res.send('Wrong page man!');
});

app.listen(process.env.PORT, process.env.IP, function()
{
 console.log("Server has started!!");
});
