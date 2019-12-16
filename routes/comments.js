const express = require("express");
const router  = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn, (req, res) => {
   //lookup campground using ID
   Campground.findById(req.params.id, (err, campground) => {
       if(err){
           console.log(err);
           req.flash("error", "Something Went Wrong");
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, (err, comment) => {
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               console.log(comment);
               req.flash("success", "Comment Successfully Added");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//edit comments 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect("back")
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
    }
  })
})

//commente update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err){
      res.redirect("back")
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

//comment desttroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err){
      res.redirect("back")
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

/*
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// comment ownership 

function checkCommentOwnership(req, res, next){
     if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back")
        } else {
            //does user own the campground
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                res.redirect("back")
            }        
        }
    })
    } else {
        res.redirect("back")
    }
} */


module.exports = router;