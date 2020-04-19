//this is router
var express = require('express');
var router = express.Router();
const {check, validationResult} = require("express-validator");
var User = require("../model/users");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

/* GET users listing. */
router.get('/', enSureAuthenticated, function(req, res, next) {
  res.render("landing.ejs");
});

function enSureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/");
  }
}

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//รับข้อมูล register
router.post('/register',[
  check("email", "อีเมลไม่ถูกต้อง").isEmail(),
  check("usr", "กรุณาป้อนชื่อผู้ใช้งาน").not().isEmpty(),
  check("pwd", "กรุณาป้อนชื่อรหัสผ่าน").not().isEmpty(),
], function(req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  //เช็คว่าป้อนถูกไหม
  if(!result.isEmpty()){
    res.render("register", {errors : errors});
  }
  //ส่งข้อมูลลง DB
  else{
    var n_usr = req.body.usr;
    var n_pwd = req.body.pwd;
    var n_email = req.body.email;
    var newUser = new User({usr:n_usr,pwd:n_pwd,email:n_email});
    User.createUser(newUser,function(err,newdata){
        if(err){
            throw error;
        }
        else{
            res.location("/");
            res.redirect("/");
        }
    })
  }
});

router.post('/login', passport.authenticate("local",{
  //ถ้า fail ให้กลับไปหน้าแรก
  failureRedirect: "/register",
  failureFlash: false
}), function(req, res, next) {
  res.redirect("/");
});

passport.serializeUser(function(user, done){
  //ถ้า fail return null ถ้า success จะได้ user.id
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});

//หา username
passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByName(username, function(err, user){
    if(err) throw error;
    if(!user){
      //ไม่พบผู้ใช้งาน
      return done(null, false);
    }
    else{
      return done(null, user);
      //เทียบ passsword
      User.comparePassword(passport, user.pwd, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }
        else return done(null, false);
      });
    }
  });
  
}));

module.exports = router;
