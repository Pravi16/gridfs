const mongoose = require('mongoose');
const mongodb = require('mongodb');
const express = require('express');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config()
const File = require('./File')
const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected"))

app.listen(3000, () => console.log('listening on port 3000'));

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return {
            filename: file.originalname
        };
    }
});
const upload = multer({ storage });


app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});
const conn = mongoose.connection;

// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// app.get('/download/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const readstream = gfs.createReadStream({ filename: filename });
  
//     readstream.on('error', () => {
//       res.status(404).send('File not found');
//     });
  
//     readstream.pipe(res);
//   });

app.get("/download/:filename", async (req, res) => {
    try {
        console.log("Here in the route")
        const file = await gfs.files.findOne({ filename: req.params.filename });
        !file && res.statusCode(404).json("No such file")
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);   
    } catch (error) {
        res.status(400).send("not found");
    }
}); 