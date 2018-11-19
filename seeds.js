var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    //ObjectId("5be764d9d1985311a7ebae6d"), "username" : "mariusz.dw@gmail.com"


var data = [
    {   name: "Cloud's Rest",
        image: "https://www.uncovercolorado.com/wp-content/uploads/2013/05/2012-09-18-Twin-Lakes14-1000x500-650x325.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis leo eu egestas condimentum. Praesent mauris libero, malesuada eget sem id, tincidunt ultrices tellus. Sed volutpat, odio et lacinia sollicitudin, risus nisi fringilla nibh, non blandit tellus leo at massa. Quisque vestibulum tellus a sem malesuada sagittis. Curabitur eu pretium leo. Curabitur semper lacus eu lobortis consequat. Duis cursus, tellus eget ullamcorper venenatis, tortor leo pharetra tellus, vel accumsan tortor odio ullamcorper eros. Aenean varius nibh eget tortor blandit vulputate. Sed id mauris venenatis, faucibus velit a, aliquam turpis. Praesent tortor libero, posuere in sodales sed, tristique eget justo."
    },
    {   name: "Desert Mesa",
        image: "https://www.uncovercolorado.com/wp-content/uploads/2013/05/2012-08-15-Flat-Tops-Trail34-1000x500-650x325.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis leo eu egestas condimentum. Praesent mauris libero, malesuada eget sem id, tincidunt ultrices tellus. Sed volutpat, odio et lacinia sollicitudin, risus nisi fringilla nibh, non blandit tellus leo at massa. Quisque vestibulum tellus a sem malesuada sagittis. Curabitur eu pretium leo. Curabitur semper lacus eu lobortis consequat. Duis cursus, tellus eget ullamcorper venenatis, tortor leo pharetra tellus, vel accumsan tortor odio ullamcorper eros. Aenean varius nibh eget tortor blandit vulputate. Sed id mauris venenatis, faucibus velit a, aliquam turpis. Praesent tortor libero, posuere in sodales sed, tristique eget justo."
    },
    {   name: "Colorado Free Camping",
        image: "https://www.uncovercolorado.com/wp-content/uploads/2013/05/2012-10-07-Cottonwood-Pass03-1000x500-650x325.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis leo eu egestas condimentum. Praesent mauris libero, malesuada eget sem id, tincidunt ultrices tellus. Sed volutpat, odio et lacinia sollicitudin, risus nisi fringilla nibh, non blandit tellus leo at massa. Quisque vestibulum tellus a sem malesuada sagittis. Curabitur eu pretium leo. Curabitur semper lacus eu lobortis consequat. Duis cursus, tellus eget ullamcorper venenatis, tortor leo pharetra tellus, vel accumsan tortor odio ullamcorper eros. Aenean varius nibh eget tortor blandit vulputate. Sed id mauris venenatis, faucibus velit a, aliquam turpis. Praesent tortor libero, posuere in sodales sed, tristique eget justo."
    }];



function seedDB(){
    // remove all campgrounds
        Campground.remove({},function(err){
            if(err) console.log("romove: ", err)
            else
            console.log("removed campgrounds");
            
            // add a few campgrounds
            data.forEach(function(seed){
               Campground.create(seed,function(err,campground){
                   if (err) console.log("seeding: ",err)
                   else
                   console.log("created: ",campground);
                   // add a few comments
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment){
                            if (err) console.log("seed comment: ",err)
                            else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("comment saved:", comment);
                            }
                        });
               }); 
            });
            
            
            
        });
        
    
    
    
    
    
};

module.exports = seedDB;