const campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    // console.log(geoData.body.features);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const campground1 = new campground(req.body.campground);
    campground1.geometry = geoData.body.features[0].geometry;
    campground1.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground1.author = req.user._id;
    await campground1.save();
    console.log(campground1);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground1._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground1 = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground1);
    if (!campground1) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/show', { campground1 });
}

module.exports.renderEditForm = async (req, res) => {
    const{id}=req.params;
    const campground1 = await campground.findById(id)
    
    if(!campground1){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    

    res.render('campgrounds/edit', { campground1});
}

module.exports.updateCampground = async (req, res) => {
    const{id}=req.params;
    console.log(req.body);
    const campground1 = await campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground1.images.push(...imgs);
    await campground1.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground1.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${campground1._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrounds');
}
