var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    //To get Data from Post Req
    bodyParser          = require("body-parser"),
    flash               = require("connect-flash"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    methodOverride      = require("method-override"),
    seedDB              = require("./seeds");
    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//Database Connect or make new Database :- yelp_camp
//mongoose.connect("mongodb://localhost/yelp_camp_Final");
mongoose.connect("mongodb://vaibhavs2204:password@ds143738.mlab.com:43738/yelpcampvai");
//mongodb://vaibhavs22:@Vaijbl22@ds143738.mlab.com:43738/yelpcampvai

//To use body parser i.e, to take input from forms
app.use(bodyParser.urlencoded({extended:true}));
// To explicitly tell that all our files will be of "ejs" format 
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//EveryTime we run the server we start seedDB 
//seedDB();

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for nav bars
//so that at every template current user is available
//also explained briefly at 311 near 4 mins mark....

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

// app.use(indexRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server started!!!");
});