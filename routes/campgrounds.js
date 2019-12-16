const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    } 
    const newCampground = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findById(req.params.id,(err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground})
     })
 });


//update campground site
router.put("/:id", middleware.checkCampgroundOwnership, (req, res ) => {
    //find and update correct campgrounds
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    }) 
    //redirect somewhere
})

// destroy campground site
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

/*

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


function checkCampgroundOwnership(req, res, next){
     if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back")
        } else {
            //does user own the campground
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else {
                res.redirect("back")
            }        
        }
    })
    } else {
        res.redirect("back")
    }
}  */


module.exports = router;


