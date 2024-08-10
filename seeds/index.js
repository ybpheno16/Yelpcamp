const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const campground = require('../models/campground');
mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

// array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author: '63b3a8b128b0c1e7c98b5287',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude,
                cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dkiybckfc/image/upload/v1672721439/YelpCamp/bdekcrhwqpsgbznetgwz.jpg',
                    filename: 'YelpCamp/bdekcrhwqpsgbznetgwz'
                    //   _id: new ObjectId("63b3b4192a4d9890edd9e089")
                },
                {
                    url: 'https://res.cloudinary.com/dkiybckfc/image/upload/v1672721440/YelpCamp/ntgxytxd3zsihtmshbok.jpg',
                    filename: 'YelpCamp/ntgxytxd3zsihtmshbok'
                    //   _id: new ObjectId("63b3b4192a4d9890edd9e08a")
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
    .catch(err => {
        console.log(err);
    })
