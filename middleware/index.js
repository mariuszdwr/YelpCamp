var Campground = require("../models/campground"),
    Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    
        if (req.isAuthenticated()){
        
            Campground.findById(req.params.id,function(err,campground){
            if (err) {
                req.flash("error", "Campground not found");
                console.log("err: Find campground by id", err);
                res.redirect("back");
                } else {
                    // does user own campground
                    // ===========================================
                    // campground.author.id is a mongoose object
                    // req.user._id is a String
                    // USE 'EQUALS' TO COMPARE THEM
                    // ===========================================
                    if (campground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        console.log("You don't have permission to do that");
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
                    
                }
            })
        
        } else {
            console.log("You are not logged in!");
            req.flash("error","You need to be logged in to do that");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    

    
        if (req.isAuthenticated()){
        
            Comment.findById(req.params.comment_id,function(err,comment){
            if (err) {
                console.log("err: Find comment by id", err);
                res.redirect("back");
                } else {
                    // does user own comment
                    // ===========================================
                    // comment.author.id is a mongoose object
                    // req.user._id is a String
                    // USE 'EQUALS' TO COMPARE THEM
                    // ===========================================
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        console.log("You don't have permission to do that");
                        res.redirect("back");
                    }
                    
                }
            })
        
        } else {
            console.log("You are not logged in!");
           res.redirect("back");
        }
    


}

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()) return next();
    req.flash("error","You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj