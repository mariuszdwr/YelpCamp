var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // directory is required, it takes index.js 

// route "/campgrounds" defined in router (app.use("/campgrounds", capmgroundRoutes)
router.get("/",function(req, res) {
    
    Campground.find({},function(err,campgrounds){
        if (err) console.log("/compgrounds, something went wrong: ", err)
        else
        res.render("campgrounds/index",{campgrounds, currentUser: req.user}); //passport gives current user (req.user) / can be removed now -> middleware above sends it to every route
    })
    
    
});

router.post("/",middleware.isLoggedIn,function(req,res){
    // get data from form and add to campground array
    
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create({name,image,description,author,price},function(err, campground){
        if (err) {
            console.log("POST, something went wrong:  ",err)
            req.flash("error",err.message);
        }
        else {
            req.flash("success","Added new campground");
            console.log("Saved: ", campground);
        }
        
    });
    res.redirect("/campgrounds");
    
    // redirect back to campground
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    
    res.render("campgrounds/new");
});
// order important -> this has to be after /campground/new
router.get("/:id",function(req,res){
    //find the campground with provided ID
    //and show template with that campground
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,campground){
        if (err) {
            console.log("Show details, something went wrong...", err);
            res.redirect("/campgrounds");
        } else {
        console.log("Show description of: ",campground);
        res.render("campgrounds/show",{campground});
        }
    })
    
});

//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
   
   Campground.findById(req.params.id,function(err,campground){
            if (err) {
                console.log(err);
                req.flash("error",err.message);
            }
            res.render("campgrounds/edit",{campground});
                  
    });
});


//update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampGround){
       if (err) console.log("Find and update campground: ", err)
       else {
           console.log("Update campground: ", updatedCampGround);
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) 
});

//delete campground route

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        if (err) {
            console.log("Delete campground, ", err);
            req.flash("error", err.message);
        }
        else {
            req.flash("success","Campground deleted.");
            console.log("Deleted campground.");
            res.redirect("/campgrounds");
        }
    })
})







module.exports = router;