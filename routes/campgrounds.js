var express         = require("express");
var router          = express.Router();
var Campground      = require("../models/campground");
var middleware      = require("../middleware");

//To get all the campsites

router.get("/",function(req,res){
        Campground.find({},function(err,allCampgrounds){
            if(err){
                console.log(err);
            }else{
                //before we used middleware we had to use req.user on every single link
                //res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser : req.user});
                res.render("campgrounds/index",{campgrounds:allCampgrounds});         
            }
        });
});

//Create: To set up new campsite that is provided by the input form
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var img = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {name:name, image:img,description:description,author:author};
    Campground.create(newCampGround,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//Input form to set up new campsite
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//show :- Shows more infpormation about the campsite
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        }else{ 
            res.render("campgrounds/show",{foundCamp:foundCamp});
        }
    });
});

//Edit
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
        Campground.findById(req.params.id,function(err,foundCamp){
            res.render("campgrounds/edit",{campground: foundCamp});
            
        });
    
});

//update
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }  
  });
});

//Destroy
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   });
});



module.exports = router;