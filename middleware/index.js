var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObject ={};

middlewareObject.checkCampgroundOwnership = function(req,res,next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCamp){
            if(err){
                res.rendirect("back");
            }else{
                if(foundCamp.author.id.equals(req.user._id)){//Lecture 310 .... in mongoose foundCamp.author.id is a object and req.user._id is a string
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};


middlewareObject.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.rendirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){//Lecture 310 .... in mongoose foundCamp.author.id is a object and req.user._id is a string
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};


module.exports = middlewareObject;