const express = require('express');
const router = express.Router({ mergeParams: true });
const{validateReview , isLoggedIn, isReviewAuthor} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const campground = require('../models/campground');
const Review  = require('../models/review')
const {campgroundSchema , reviewSchema} = require('../schemas.js');
const reviews = require('../controllers/reviews');
// const validateCampground = (req,res,next)=>{
    
//     const {error} = campgroundSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400)
//     }
//     else{
//         next();
//     }
    
// }

// const validateReview = (req,res,next)=>{
//     const{error}  = reviewSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400)
//     }
//     else{
//         next();
//     }

// }


// router.post('/campgrounds/:id/reviews',isLoggedIn,validateReview, catchAsync(async (req, res) => {
//     const campground1 = await campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.author = req.user._id;
//     campground1.reviews.push(review);
//     await review.save();
//     await campground1.save();
//     req.flash('success', 'Created new review!');
//     res.redirect(`/campgrounds/${campground1._id}`);
// }))

// router.delete('/campgrounds/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash('success','Successfully deleted a review!');
//     res.redirect(`/campgrounds/${id}`);
// }))


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;