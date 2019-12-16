const Campground = require("../models/campground")
const Review = require("../models/review")
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	 if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
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
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
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
}

middlewareObj.checkReviewOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, (err, foundReview) => {
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash("error", "Campground Not Found");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some((review) => {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You Already Wrote A Review.");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You Need To Login First");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First")
    res.redirect("/login");
}



module.exports = middlewareObj;