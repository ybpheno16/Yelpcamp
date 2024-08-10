const express = require('express');
const app = express();
const morgan = require('morgan');


app.use(morgan('dev'));

app.use((req,res,next)=>{
    req.requestTime=Date.now();
    console.log(req.method,req.path);
    next();
})

app.use('/dogs',(req,res,next)=>{
    console.log("i love dogs");
    next();
})

const verifyPassword = (req,res,next)=>{
    const {password} = req.query;
    if(password==='chickennugget'){
        next();
    }
    res.send("sorry you need a password to acess!!");
}
// app.use((req,res,next)=>{
//     console.log("this is my first middleware!!");
//     return next();
//     console.log("this is my first middleware after calling");
// })
// app.use((req,res,next)=>{
//     console.log("this is my second middleware");
//     return next();
// })
// app.use((req,res,next)=>{
//     console.log("this is my third middleware before calling");
//     return next();
// })

app.get('/',(req,res)=>{
    console.log(`request date:${req.requestTime}`);
    res.send('home page');
})
app.get('/dogs',(req,res)=>{
    console.log(`request date: ${req.requestTime}`);
     res.send('woof woof');
})

app.get('/secret',verifyPassword,(req,res)=>{
    res.send("my secret is: sometimes i wear headphones in public so i dont have to talk to anyone");
})

app.use((req,res)=>{
    res.status(404).send('NOT FOUND!');
})

app.listen(3000,()=>{
    console.log('app is running on localhost:3000');
})
