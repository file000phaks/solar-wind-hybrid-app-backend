const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const livePath = path.join(__dirname, 'live.json');
const histPath = path.join(__dirname, 'hist.json');

let liveData = [];
let previousData = null;
let liveIndex = 0;
let histData = [];

// Load mock data once on server start
try {

    liveData = JSON.parse(fs.readFileSync(livePath));
    histData = JSON.parse(fs.readFileSync(histPath));

} catch (err) {

    console.error("Failed to load mock data:", err);

}

// Serve one entry at a time, cycling every 3 seconds
app.get('/api/live', (req, res) => {

    if (liveData.length === 0) return res.status(500).send({ error: 'No data available' });

    const currentData = liveData[liveIndex];

    previousData = liveData[liveIndex - 1];

    liveIndex = (liveIndex + 1) % liveData.length;  // loop

    res.json({
        data: currentData,
        previous: previousData || null,
    });   

})

app.get('/api/history', (req, res) => {

    if (histData.length === 0) return res.status(500).send({ error: 'No data available' });

    const currentData = histData[0];

    res.json(currentData);  

})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

