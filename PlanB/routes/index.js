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

router.get('/blog/lotId=:id', async function(req, res, next) {
  const { id } = req.params;
  const product = await lot.findById(id);
  res.render("details",{ l : product });
});

//รับข้อมูล id ลงตะกร้า
router.post('/cart/', function(req, res){
  var lot_id = req.body.lot_id;
  var lot_qty = req.body.qty;
  //ถ้ามี session อยู่แล้วให้เพิ่ม ถ้าไม่มีให้สร้าง session เปล่า
  req.session.cart = req.session.cart || {};  
  var cart = req.session.cart; //ตะกร้า
  lot.find({ _id : lot_id },function(err, all){
    if(err){
      console.log(err);
    }
    else
    {
      //ซื้อซ้ำ
      if(cart[lot_id]){
        var new_value = parseInt(lot_qty);
        var cart_value = parseInt(cart[lot_id].qty);
        cart[lot_id].qty = new_value + cart_value;
      }
      //ซื้อครั้งแรก
      else{
        all.forEach(function(l){
          cart[lot_id] = {
          item : l._id,
          number : l.number,
	        price : l.price,
          qty : parseInt(lot_qty)
        }});
        }
    }
      console.log(cart);
      res.redirect("/");
    })
});

router.get('/lotcheck', function(req, res, next) {
  res.render('lotcheck');
});

router.get('/game', function(req, res, next) {
  res.render('game');
});

module.exports = router;
