var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongoDB = 'mongodb://localhost:27017/PlanB';

let LotterySchema = new mongoose.Schema({
	number : String,
	image : String,
	price : String,
	discount : String
});

let lot = mongoose.model("lotteries", LotterySchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing');
});

router.get('/blogs', function(req, res, next) {
  lot.find({},function(err, all){
    if(err){
        console.log(err);
    }
    else
    {
        res.render("shop",{ Lottery : all});
    }
  })
});

router.get('/lotcheck', function(req, res, next) {
  res.render('lotcheck');
});

router.get('/game', function(req, res, next) {
  res.render('game');
});

module.exports = router;
