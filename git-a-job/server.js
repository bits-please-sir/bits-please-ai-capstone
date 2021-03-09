var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var mammoth = require("mammoth");
const fs = require('fs');
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


const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
let sessID;

const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey: '0mkcToFBYkhrcIKC_YjdrmmUOha5ByD0s3tnUQQ4Ih5P',
  }),
  //serviceUrl: 'https://api.us-east.assistant.watson.cloud.ibm.com/instances/9fd7c9e6-2576-4831-9a1e-abd52ed19068',
  serviceUrl: 'https://api.us-east.assistant.watson.cloud.ibm.com/instances/9fd7c9e6-2576-4831-9a1e-abd52ed19068',
});
assistant.createSession({
    assistantId: '52a4f52e-30c8-45f9-b848-94f94438fd00'
  })
    .then(res => {
        //console.log(res.result);
        sessID = res.result.session_id;
      console.log(JSON.stringify(res.result, null, 2));
    })
    .catch(err => {
      console.log(err);
    });
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/bettyresp', function (req, res) {
    //console.log(req);
    console.log('Got body:', req.body);
    console.log(req.body.incomingMessage);
    fs.appendFile('responses.txt', req.body.incomingMessage + '\n', (err) => {
        if(err) throw err;
        console.log('Data appended to file');
      });
    //console.log(res);
    assistant.message({
        assistantId: '52a4f52e-30c8-45f9-b848-94f94438fd00',
        sessionId: sessID,
        input: {
          'message_type': 'text',
          'text': req.body.incomingMessage
          }
        })
        .then(resp => {
          //console.log(JSON.stringify(res.result, null, 2));
          console.log(JSON.stringify(resp.result.output.generic[0].text));
          return res.status(200).send(JSON.stringify(resp.result.output.generic[0].text));
        })
        .catch(err => {
          console.log(err);
        });

    //res.send('GET request to the homepage')

});

app.listen(8000, function() {

    ('App running on port 8000');

});