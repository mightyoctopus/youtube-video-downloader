// 3rd Update
// Video URL gets cleared after download -- Client Code Change with setTimeout
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const baseUrl = '/youtube-downloader';
app.use(baseUrl, express.static(path.join(__dirname, 'public')));

app.get(`${baseUrl}/`, (req, res) => {
    res.render('index', { baseUrl });
});

app.get(`${baseUrl}/download`, async (req, res) => {
    try {
        const url = req.query.url;
        console.log(url);
        const options = {
            quality: '18',
            filter: format => format.container === 'mp4' && format.hasAudio && format.hasVideo, 
        };

        //Get video info
        const videoInfo = await ytdl.getInfo(url);
        console.log(videoInfo);

        //Fetch Video ID metadata 
        const videoId = await ytdl.getURLVideoID(url);
        console.log("Video ID fetched:", videoId);

        //Set the content dispositon header to trigger download
        res.attachment(`${videoId}.mp4`);

        //Download and pipe the video stream
        const videoStream = ytdl(url, options);
        videoStream.pipe(res);

        videoStream.on('finish', () => {
            console.log("Video is downloaded.");
        });


    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});


app.listen(port, () => {
    console.log("Server is running on port:", port);
});








