const express = require('express')
const app = express();
let multer = require('multer');
let cors = require('cors');
const port = 3000

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
      }

})

let upload = multer({storage: storage}).array('file');

app.post('/upload',function(req, res) {
    
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