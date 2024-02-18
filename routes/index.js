var express = require('express');
var router = express.Router();
const userModel = require("./users");
const fs = require('fs');

const passport =require('passport');

const localStrategy =require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/admin', function(req, res, next) {
  res.render('eight', { title: 'Express' });
});
router.get('/eleven', function(req, res, next) {
  res.render('eleven', { title: 'Express' });
});
router.get('/student', function(req, res, next) {
  res.render('seven', { title: 'Express' });
});
router.get('/status',  function(req, res, next) {
  res.render('ten', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true // If you want to use flash messages for login failure
}));
router.get('/profile', isLoggedIn, function(req,res,next) {
  res.render('nine', { title: 'Express' });
});

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password, function (err, user) {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }

    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.get("/logout", function(req,res){
  req.logout(function(err) {
    if (err) {return next(err);}
    res.redirect('/');
  });
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())   {
    return next();
  }
  res.redirect("/");
};
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'uploads')); // This ensures that the files are stored in the 'public/uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/submit_pdf", upload.single("pdfInput"), function (req, res) {
  // You can access the uploaded file details using req.file
  // For example, req.file.filename will give you the filename

  // Save the file information to your database if needed

  // Redirect or render your response
  res.redirect('/'); // Change this to the appropriate destination
});
router.get('/download-pdf', function(req, res) {
  const file = path.join(__dirname, 'public', 'uploads', 'pdfInput-1708175336298.pdf');
  console.log('File path:', file);
  
  // Check if the file exists
  if (fs.existsSync(file)) {
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=pdfInput-1708175336298.pdf');
    
    // Pipe the file stream to the response
    const fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
  } else {
    // If the file doesn't exist, send a 404 response
    res.status(404).send('File not found');
  }
});



module.exports = router;
