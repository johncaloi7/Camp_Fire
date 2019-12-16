const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");

//root route
router.get("/", (req, res) => {
    res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
   res.render("register"); 
});

//handle sign up logic
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, bday: req.body.bday, terms: req.body.terms});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, () => {
           req.flash("success", "Successfully Created Your Account")
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", (req, res) => {
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), (req, res) => {

});

// logout route
router.get("/logout", (req, res) => { 
   req.logout();
   req.flash("success", "Logged You Out")
   res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;