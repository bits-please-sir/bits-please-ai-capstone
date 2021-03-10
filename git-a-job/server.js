var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var mammoth = require("mammoth");
const fs = require('fs');
app.use(cors())


// non intelligently filtering for languages rn
function filter_langs(lang_list) {
    const lang = ['python', 'java', 'ruby', 'golang', 'react', 'sql', 'c','javascript','kotlin'];
    //console.log(filter_delim_str);
    var final_filter = lang.filter(value => lang_list.includes(value));

    return final_filter;

}

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


// amy b's nlu code 
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: '{nluapikey}',
  }),
  serviceUrl: '{nluserviceurl}',
});


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
            //console.log(resultObject.value);
            var resume_text = resultObject.value;
            //res.send(resultObject.value);
            text.concat(resultObject.value);
            const delim = [' ','  ', '.', ',', ':', ';', '(', ')', '%', '@', '|', '/'];
            var filtered_resume_text = resume_text.toLowerCase().replace(/[*_#:@,.()/]/g, ' ');

            // llist of languages recignized
            var langs_to_ask = filter_langs(filtered_resume_text);
            // i dont think we need this
            //langs_to_ask.unshift('hello!');
            console.log(langs_to_ask);
            // calling NLU to get entities
            const analyzeParams = {
                'text': filtered_resume_text,
                'features': {
                  'entities': {
                    'sentiment': true,
                    'limit': 20
                  }
                }
              };
              
              naturalLanguageUnderstanding.analyze(analyzeParams)
                .then(analysisResults => {
                  //console.log(JSON.stringify(analysisResults, null, 2));
                  // list of entities recignized
                  var entity_list = JSON.stringify(analysisResults.result.entities, null, 2);
                  //console.log(analysisResults.result.entities[0]);
                  if (analysisResults.result.entities != null) {
                    var orgs_list = analysisResults.result.entities.filter(function (entry) {
                        return entry.type === 'Organization';
                    });
                    //console.log(orgs_list);
                    var company_list = analysisResults.result.entities.filter(function (entry) {
                        return entry.type === 'Company';
                    });
                    //console.log(company_list);
                      //console.log();
                      //var max_org = orgs_list.filter( x => x["relevance"] == Math.max(...orgs_list.map(x => x["relevance"])) )
                      // will get orgs that only contain clubs
                      var max_org = orgs_list.filter(function (entry) {
                        return entry.text.indexOf('club') !== -1;
                    });
                      console.log(max_org);
    
                      var max_company = company_list.filter( x => x["relevance"] == Math.max(...company_list.map(x => x["relevance"])) )
                      console.log(max_company);
    
                      //console.log(JSON.stringify(max_org[0].text,null,2));
                      langs_to_ask.push('' + max_org[0].text);
                      langs_to_ask.push('' + max_company[0].text);
                      langs_to_ask.push('end');
                      console.log(langs_to_ask);
    
                      return res.status(200).send(langs_to_ask);

                  } else{
                    return res.status(400).send('No data to retrieve');
                  }
                  





                })
                .catch(err => {
                  console.log('error:', err);
                });
                // filter langs ->
                //Company, Organization, 
              
            

          })

      //return res.status(200).send(req.file);

    })

});


const AssistantV2 = require('ibm-watson/assistant/v2');
//const { IamAuthenticator } = require('ibm-watson/auth');
let sessID;

const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey: '{assistantapi key}',
  }),
  serviceUrl: '{assistant service url}',
});
assistant.createSession({
    assistantId: '{assistantid}'
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
        assistantId: '{assistantid}',
        sessionId: sessID,
        input: {
          'message_type': 'text',
          'text': req.body.incomingMessage
          }
        })
        .then(resp => {
          //console.log(JSON.stringify(res.result, null, 2));
          console.log(JSON.stringify(resp.result))
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