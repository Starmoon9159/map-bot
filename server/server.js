const express = require('express');
const port = '5000';
const app = express();
const maps = require('./configs/maps.json')

app.listen(port, () => {
    console.log(`Sever started on port ${port}`)
})

app.get("/api", (req, res) => {
    let maps_count = Object.keys(maps).length;
    res.json({
        "Maps": maps,
        "count":maps_count
    })
})

