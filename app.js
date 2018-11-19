var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground.js"),
    Comment = require("./models/comment.js"),
    User = require("./models/user.js"),
    seedDB = require("./seeds.js");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    



mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash()); // must be before passport configuration
app.use(bodyParser.urlencoded({extended: true}));
// __dirname - directory where script is running (safer)
app.use(express.static(__dirname+"/public"));
// ======================================================================================
// ++++++++++++++++++++++++++++++++++ ORDER IMPORTANT +++++++++++++++++++++++++++++++++++
// ======================================================================================
// Some Common problems to watch out for,
// Middleware setup order (express-session > pass.initialize > pass.session )(and while you do that CHECK YOUR SYNTAX).
// Serialize and Deserialize methods needs to pass user on the request.(For more info I've posted an answer on this link.. Basics of Passport Session (expressjs)-why do we need to serialize and deserialize? ) if there's no user on request then isAuthenticated would return false.... and redirect to the PATH defined ......when false....AND... ONCE AGAIN.....CHECK YOUR SYNTAX.
// The getUserById or findById function defined in the model(user.js) needs to have a User.findById (and not User.findOne Again CHECK YOUR.. WAIT FOR IT..SYNTAX) function defined.(this function would load user on the request in every session)
app.use(expressSession({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//middleware to pass currentUser to every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



passport.use(new LocalStrategy(User.authenticate())); //User.authenticate comes from userSchema.plugin(passportLocalMongoose);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//use routefiles
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//seedDB();

//schema setup

 


// var campgrounds = [
//     {name: "Salomon Creek", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f0c279afe9b1bf_340.jpg"},
//     {name: "Granite Creek", image: "https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144595f3c171a3e9b2_340.jpg"},
//     {name: "Mountain Goot", image: "https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104491f0c279afe9b1bf_340.jpg"},
//     {name: "Dawson Creek", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f0c279afe9b1bf_340.jpg"},
//     {name: "Brokenback Mountain", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f0c279afe9b1bf_340.jpg"}
    
//     ];


// campgrounds.forEach(function(campground){
        
//     Campground.create(campground,function(err,campground){
//         if (err) console.log("Something went wrong...", err)
//         else
//         console.log("saved:",campground);
//     });

//     });








// error page (must be last)
app.get("*",function(req,res){
    res.send("Sorry, no page here....")
    
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp Server Has Started!")
    
});