var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var mammoth = require("mammoth");
const fs = require('fs');
app.use(cors())

// configuring env files to pull in
const dotenv = require('dotenv');
dotenv.config();




// amy b's nlu code 
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.NLU_API_KEY}`,
  }),
  serviceUrl: `${process.env.NLU_API_URL}`,
});

// amy h + milly assistant code
const AssistantV2 = require('ibm-watson/assistant/v2');

const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.ASSISTANT_API_KEY}`,
  }),
  serviceUrl: `${process.env.ASSISTANT_API_URL}`,
});

let sessID = create_session_id();
// a new session should be created for every new interview
async function create_session_id(){
    assistant.createSession({
        assistantId: `${process.env.ASSISTANT_ID}`
      })
        .then(res => {
            //console.log(res.result);
            sessID = res.result.session_id;
            console.log(JSON.stringify(res.result, null, 2));
            return sessID;
        })
        .catch(err => {
          console.log(err);
        });

};

// used to read the data passed from the front end to the backend
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// non intelligently filtering for languages rn, hard coding to pull out these ones
function filter_langs(lang_list) {
    const lang = ['python', 'java', 'ruby', 'golang', 'react', 'sql', 'c','javascript','kotlin'];
    // filter the resume text to just the languages that match those above
    var final_filter = lang.filter(value => lang_list.includes(value));

    return final_filter;

}

// this storage is used to store the resum upload in the /public folder
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // folder to store resume in
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
      // this will grab the file extension, which should always be .docx
      let extention = (file.originalname).split('.')[1]
      // every resume will just be uploaded as 'resume.docx to make it easier for initial parsing
      cb(null, 'resume.' +  extention)
  }
})

// multer module used to store the resum
var upload = multer({ storage: storage }).single('file')

// ENDPOINT /delete will delete the resume from the local code base
app.get('/delete', function(req, res) {
    try {
        // unlink will remove the file
        fs.unlinkSync('public/resume.docx');
        // create new session ID for potential new interview
        sessID = create_session_id();
        return res.status(200).send('File deleted');
        //file removed
      } catch(err) {
        console.error(err)
      }
    }
);

// ENDPOINT /upload will upload the resume to the local code base 
app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
        // multer is the module used for the upload
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
           // since it is uploaded to the same place everytime, just grab it from public/resume.docx
           mammoth.extractRawText({path: "public/resume.docx"}).then(function (resultObject) {
            //console.log(resultObject.value);
            let resume_text = resultObject.value;
            const delim = [' ','  ', '.', ',', ':', ';', '(', ')', '%', '@', '|', '/'];
            // filter out random delims in resume text
            let filtered_resume_text = resume_text.toLowerCase().replace(/[*_#:@,.()/]/g, ' ');

            // llist of languages recignized
            let langs_to_ask = filter_langs(filtered_resume_text);
            console.log(langs_to_ask);
            // this will randomize the languages to ask about each interview
            langs_to_ask = langs_to_ask.sort(() => Math.random() - 0.5)
            console.log(langs_to_ask);
            langs_to_ask = [langs_to_ask[0],langs_to_ask[1],langs_to_ask[2],langs_to_ask[3]]
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

                  // make sure the results of entities recignized are not nothing
                  if (analysisResults.result.entities != null) {
                    // get just the organization entities
                    var orgs_list = analysisResults.result.entities.filter(function (entry) {
                        return entry.type === 'Organization';
                    });
                    // get just the company entities
                    var company_list = analysisResults.result.entities.filter(function (entry) {
                        return entry.type === 'Company';
                    });
                   
                      // will get organizations that only contain clubs
                      var max_org = orgs_list.filter(function (entry) {
                        return entry.text.indexOf('club') !== -1;
                    });
                      console.log(max_org);
                      // this will choose the most relevant company on the resume
                      var max_company = company_list.filter( x => x["relevance"] == Math.max(...company_list.map(x => x["relevance"])) )
                      console.log(max_company);
    
                      // adding the orgs and company to the entities to ask the user about
                      langs_to_ask.push('' + max_org[0].text);
                      langs_to_ask.push('' + max_company[0].text);
                      langs_to_ask.push('end');
                      console.log(langs_to_ask);
                      // send the entities to ask about back to the front end
                      return res.status(200).send(langs_to_ask);

                  } else{
                    return res.status(400).send('No data to retrieve');
                  }

                })
                .catch(err => {
                  console.log('error:', err);
                });

          })
    })

});


// ENDPPOINT /bettyresp will send entities or responses from user to the assistant 
app.post('/bettyresp', function (req, res) {
    // logs the data sent from the front end
    console.log('Got body:', req.body);
    console.log(req.body.incomingMessage);
    // fs.appendFile('responses.txt', req.body.incomingMessage + '\n', (err) => {
    //     if(err) throw err;
    //     console.log('Data appended to file');
    //   });
    //console.log(res);


    // sends message to betty
    assistant.message({
        assistantId: `${process.env.ASSISTANT_ID}`,
        sessionId: sessID,
        input: {
          'message_type': 'text',
          'text': req.body.incomingMessage
          }
        })
        .then(resp => {
          //console.log(JSON.stringify(res.result, null, 2));
          console.log(JSON.stringify(resp.result));
          console.log(JSON.stringify(resp.result.output.generic[0].text));
          // sends response from betty back to the frontend
          return res.status(200).send(JSON.stringify(resp.result.output.generic[0].text));
        })
        .catch(err => {
          console.log(err);
        });
});

// starts app listening on the port of the frontend
app.listen(process.env.PORT, function() {

    ('App running ');

});