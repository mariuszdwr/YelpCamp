var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



router.get("/",function(req,res){
    console.log("remote IP: ", req.ip);
    res.render("landing");
});






// Auth routes

// show register form

router.get("/register", function(req,res){
   res.render("register"); 
});
router.post("/register", function(req,res){
        var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err, user){ //hash password and save user to DB
       if (err) {
           console.log(err);
           req.flash("error", err.message);
           return res.redirect("/register");
       } else {
           passport.authenticate("local")(req,res,function(){
               req.flash("success",`Welcome to YelpCamp! You have been registered as ${user.username}`);
               res.redirect("/campgrounds");
           });
       }
      
   });
});

// show login form

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login",passport.authenticate("local", //same 'passport.authenticate' like in 'registher function'
            {
                successRedirect: "/campgrounds",
                failureRedirect: "/login"
                
            }),function(req,res){
   
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!")
    res.redirect("/campgrounds");
});



module.exports = router;

