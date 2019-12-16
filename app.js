
const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      flash       = require("connect-flash"),
      passport    = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      Campground  = require("./models/campground"),
      Comment     = require("./models/comment"),
      User        = require("./models/user"),
      seedDB      = require("./seeds")
    
//requring routes
const commentRoutes    = require("./routes/comments"),
	  reviewRoutes     = require("./routes/reviews"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index"),
      about            = require("./routes/info")
     

const url = process.env.DATABASEURL || "mongodb://localhost:27017/camp_fire"   
mongoose.connect(url, { useNewUrlParser: true });



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is a review!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/about", about);


app.listen(process.env.PORT || 3000, process.env.IP, () => {

  console.log("server is listening...");

});