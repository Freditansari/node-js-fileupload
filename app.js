const express = require('express')
const app = express();
let multer = require('multer');
let cors = require('cors');
const path = require('path');

const port = 3000

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
      }

})

let upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).array('file');

function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /3gp|aa|aac|aax|act|aiff|alac|amr|ape|au|awb|dct|dss|dvf|flac|gsm|m4a|m4b|m4b|mmf|mp3|mpc|msv|nsf|ogg|oga|mogg|ra|rm|wav|wma|wv|webm/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Audio Only!');
    // return res.status(500).json({message: "audio only"})
  }
}

app.post('/upload',cors(), (req, res)=> {
    
    upload(req, res, function (err) {
     
        if (err instanceof multer.MulterError) {
            console.log('multer error')
            return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
            console.log('unknown error')
            return res.status(500).json(err)
          // An unknown error occurred when uploading.
        } 
        
        return res.status(200).send(req.file)
        // Everything went fine.
      })
});


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))