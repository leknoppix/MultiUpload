const express = require('express');
const multer = require('multer');

const app = express();

app.use('/uploads', express.static(__dirname + '/uploads'));

const fileFilter = function(req, file, cb) {
    const allowedTypes  = ["image/jpeg", "image/png", "image/gif"];
    if(!allowedTypes.includes(file.mimetype)){
        const error = new Error("Mauvais type de fichier");
        error.code = "LIMIT_FILE_TYPES";
        return cb(error, false);
    }
    cb(null, true);
}

const upload = multer({
    dest: './uploads/',
    fileFilter
})

const pureupload = multer({
    dest: './uploads/'
})


app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file});
})

app.post('/multiple', upload.array('files'), (req, res) => {
    res.json({ files: req.files});
})
app.post('/dropzone', pureupload.single('file'), (req, res) => {
    res.json({ file: req.file});
})

app.use(function (err, req, res) {
    if (err.code === "LIMIT_FILE_TYPES"){
        res.status(422).json({ error: "Seul les fichiers images sont acceptés"});
        return;
    }

})
app.listen(3344,() => console.log('Running on localhost:3344'));