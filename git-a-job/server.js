var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var mammoth = require("mammoth");
const { textChangeRangeNewSpan } = require('typescript');

app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
    //cb(null, 'src/components/Forms')
  },
  filename: function (req, file, cb) {
      //console.log(file.originalname)
      let extention = (file.originalname).split('.')[1]
      //console.log(extention) 
      // every resume will just be uploaded as 'resume.docx to make it easier for initial parsing
      cb(null, 'resume.' +  extention)
  }
})



var upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
        
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
           var text = '';
           mammoth.extractRawText({path: "public/resume.docx"}).then(function (resultObject) {
            console.log(resultObject.value);
            //res.send(resultObject.value);
            text.concat(resultObject.value)
            return res.status(200).send(resultObject.value);

          })

      //return res.status(200).send(req.file);

    })

});

app.get('/resumetext', function(req, res) {

    var text = '';
    mammoth.extractRawText({path: "public/resume.docx"}).then(function(result){
    text.concat(result.value); // The raw text
    return result.value;
     });

     return res.send(text);

});

app.listen(8000, function() {

    console.log('App running on port 8000');

});