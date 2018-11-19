var express = require("express");
var router = express.Router({mergeParams: true});  //to pass req.params through router
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===============
// COMMENTS ROUTES
// ===============


// comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if (err) console.log("findcampground: ",err)
        else
        res.render("comments/new",{campground});
    });


// comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log("Find campground by id..",err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment,function(err,comment){
                if (err) {
                    console.log("save comment error:", err);
                    req.flash("error","Something went wrong... Comment not added.");
                    res.redirect("/campgrounds");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log("User ",req.user, "comment");
                    console.log("saved comment: ", comment);
                    console.log("campground to update...", campground);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","New comment added");
                    res.redirect(`/campgrounds/${campground._id}`);
                    
                }
            })
        }
        
    })
})
    
});

//comments edit

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,comment){
        if (err) {
            console.log (err);
            req.flash("error",err.message);
        
        } else
        res.render("comments/edit",{campground_id: req.params.id, comment}); //req.params.id is passed in app.js -> app.use("/campgrounds/:id/comments",commentRoutes);
    })
    
});
// comments update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
        if (err) {
            console.log("Comment update err:", err);
            req.flash("error",err.message);
            res.redirect("back");
            
        } else {
            console.log("updated comment", updatedComment);
            req.flash("success","Comment updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
    
});
// comments destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if (err) {
            console.log("Error deleting comment: ",err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            console.log("Comment deleted");
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
        
    })
    
})

//middleware




module.exports = router;
