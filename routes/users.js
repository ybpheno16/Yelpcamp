const User= require('../models/user');
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { application } = require('express');
const router= express.Router();
const passport= require('passport');
const users = require('../controllers/users');
// router.get('/register',(req,res)=>{
//     res.render('users/register');
// })

// router.post('/register',catchAsync(async(req,res,next)=>{
//     try{
//     const {email,username,password} = req.body;
//     const user= new User({email,username});
//     const hash = await User.register(user,password);
//     // console.log(hash);
//     req.login(hash,err=>{
//         if(err) return next(err);
//         req.flash('success','Welcome to Yelp Camp!');
//     res.redirect('/campgrounds');
//     })
    
//     } catch(e){
//         req.flash('error',e.message);
//         res.redirect('/register');
//     }
// }))

// router.get('/login',(req,res)=>{
//     res.render('users/login');
// })

// router.post('/login',passport.authenticate('local',{failureFlash: true,failureRedirect: '/login' }),(req,res)=>{
//     req.flash('success','Welcome to Yelp Camp');
//     const redirectUrl  = req.session.returnTo || '/campgrounds';
//     delete req.session.returnTo;
//     res.redirect('/campgrounds');
// })

// // router.get('/logout', (req, res) => {
// //     req.logout();
// //     req.flash('success', "Goodbye!");
// //     res.redirect('/campgrounds');
// // })

// router.get("/logout", (req, res) => {
//     req.logout(req.user, err => {
//       if(err) return next(err);
//       res.redirect("/campgrounds");
//     });
//   });

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;
