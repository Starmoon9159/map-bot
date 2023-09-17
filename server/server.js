const express = require('express');
const port = '5000';
const app = express();

app.get("/api",(req,res) =>{
    res.json({users:["userOne","userTwo","userThree"]})
})

app.listen(port,() =>{
    console.log(`Sever started on port ${port}`)
})
