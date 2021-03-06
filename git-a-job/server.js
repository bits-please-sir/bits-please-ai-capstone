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



// tone analyzer init
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.TONE_API_KEY}`,
  }),
  serviceUrl: `${process.env.TONE_API_URL}`,
});


// amy b's nlu code 
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.NLU_API_KEY}`,
  }),
  serviceUrl: `${process.env.NLU_API_URL}`,
});

// amy h + milly assistant code
const AssistantV2 = require('ibm-watson/assistant/v2');

const bettyAssistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.BETTY_API_KEY}`,
  }),
  serviceUrl: `${process.env.BETTY_URL}`,
});

const karenAssistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey: `${process.env.KAREN_API_KEY}`,
  }),
  serviceUrl: `${process.env.KAREN_URL}`,
});

let bettySessID = create_betty_session_id();
let karenSessID = create_karen_session_id();
// a new session should be created for every new interview
async function create_betty_session_id(){
  console.log("creating session")
    bettyAssistant.createSession({
        assistantId: `${process.env.BETTY_ID}`
      })
        .then(res => {
            //console.log(res.result);
            bettySessID = res.result.session_id;
            console.log(JSON.stringify(res.result, null, 2));
            return bettySessID;
        })
        .catch(err => {
          console.log(err);
        });

};

// a new session should be created for every new interview
async function create_karen_session_id(){
  console.log("creating session")
    karenAssistant.createSession({
        assistantId: `${process.env.KAREN_ID}`
      })
        .then(res => {
            //console.log(res.result);
            karenSessID = res.result.session_id;
            console.log(JSON.stringify(res.result, null, 2));
            return karenSessID;
        })
        .catch(err => {
          console.log(err);
        });

};

// used to read the data passed from the front end to the backend
const bodyParser = require('body-parser');
const { match } = require('assert');
app.use(bodyParser.urlencoded({ extended: true }));

// non intelligently filtering for languages rn, hard coding to pull out these ones
function filter_langs(lang_list) {
    const lang = [' python ', ' java ', ' ruby ', ' golang ', ' react ', ' sql ', ' c ',' javascript ',' kotlin ', ' perl ',' c# ',' scala ',' swift ',' unity ',' angular ',' matlab '];
    // filter the resume text to just the languages that match those above
    var final_filter = lang.filter(value => lang_list.includes(value));

    return final_filter;

}



// check if they are a B.S. or B.A.
function check_bachelors_degree(resume_text){
  const degree = ['b.s.','bachelor of science','b.a.','bachelor of arts']

  var degree_text = degree.filter(value => resume_text.includes(value));

  if (degree_text.length != 0){
    return degree_text[0];
  } else {
    return '';
  }

}

// filter for GPA 
function filter_GPA(input) {
    //match input to this regex expression 
    var match = input.match(/(^| )[0-4]\.\d{1,3}/);
    return match ? match[0].trim() : '';
}
// filter for graduation year, assuming it's in May 
function graduation_year(input) {
    //const months = [' january ', ' february ', ' march ', ' april ', ' may ', ' june ', ' july ', ' august ', ' september ', ' october ', ' november ', ' december ', ' jan ', ' feb ', ' mar ', ' apr ', ' jun ', ' jul ', ' aug ', ' sept ', ' oct ', ' nov ', ' dec '];
    var date = input.match(/ 20[1-2][0-9]/)
    if (date) var ret = date[0].substring(1);
    return date ? ret : '';
  }


// check volunteer
function check_volunteering(resume_text){
  const volunteer = ['volunteer']

  var volunteer_text = volunteer.filter(value => resume_text.includes(value));

  if (volunteer_text.length != 0){
    return volunteer_text[0];
  } else {
    return '';
  }

}

// check for Ivies
function check_Ivies(resume_text){
  const ivies = ['columbia university', 'brown university', 'university of pennsylvania', 'yale university','harvard university', 'princeton university', 'cornell university', 'dartmouth university']
  
  var ivy_text = ivies.filter(value => resume_text.includes(value));

  if (ivy_text.length != 0){
    return ivy_text[0];
  } else {
    return '';
  }

}

// check for community college
function check_community_college(resume_text){
  const community_college = ['community college']

  var community_college_text = community_college.filter(value => resume_text.includes(value));

  if (community_college_text.length != 0){
    return community_college_text[0];
  } else {
    return '';
  }

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
function deleteRes(){
  try {
    // unlink will remove the file
    fs.unlinkSync('public/resume.docx');
    // create new session ID for potential new interview
    // sessID = create_session_id();
    // return res.status(200).send('File deleted');
    //file removed
  } catch(err) {
    console.error(err)
  }

}
app.get('/delete', function(req, res) {
    try {
        // unlink will remove the file
        //fs.unlinkSync('public/resume.docx');
        // create new session ID for potential new interview
        // should really pass body and check which one to do
        bettySessID = create_betty_session_id();
        karenSessID = create_karen_session_id();
        return res.status(200).send('File deleted');
        //file removed
      } catch(err) {
        console.error(err)
      }
    }
);

// for checking white space
String.prototype.trim = function () {
  return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

// ENDPOINT /upload will upload the resume to the local code base 
app.post('/upload',function(req, res) {
  // console.log("req body: " + req.get(assistantNum))
  console.log("idk: "+ JSON.stringify(req.headers.assistantnum))
  console.log(typeof(JSON.stringify(req.headers.assistantnum)))

  var ass_num = JSON.stringify(req.headers.assistantnum);
  console.log("num: " + ass_num)
     
    upload(req, res, function (err) {
     // sessID = create_session_id();
        // multer is the module used for the upload
           if (err instanceof multer.MulterError) {
               return res.status(500).json('File upload error: ' + err)
           } else if (err) {
               return res.status(500).json('File upload error: ' + err)
           }

           // since it is uploaded to the same place everytime, just grab it from public/resume.docx
           mammoth.extractRawText({path: "public/resume.docx"}).then(function (resultObject) {
            //console.log(resultObject.value);
            let resume_text = resultObject.value;
            //console.log(resume_text);
            // resume_text = resume_text+"nothing";
            if (resume_text.trim().length == 0) {
              console.log('ZERO TEXT');
              deleteRes();
              var non_data = ["NODATACOLLECTEDERROR"];
              return res.status(200).send(non_data);
            }

            
            const delim = [' ','  ', ',', ':', ';', '(', ')', '%', '@', '|', '/'];

            // find gpa
            let gpa = filter_GPA(resume_text);
            console.log("gpa: " + gpa);
            
            // filter out random delims in resume text
            let filtered_resume_text = resume_text.toLowerCase().replace(/[*_:@,()/]/g, ' ');

            console.log(filtered_resume_text);

            // filtering for bachelor degree 
            let user_bachelors = check_bachelors_degree(filtered_resume_text)
            console.log("scraped bachelor: " + user_bachelors)

            // find graduation month and year
            let grad_date = graduation_year(filtered_resume_text)
            console.log("grad year: " + grad_date);

            // filtering for volunteering 
            let user_volunteer = check_volunteering(filtered_resume_text)
            console.log("scraped volunteer: " + user_volunteer)

            // filtering for ivies
            let user_ivies = check_Ivies(filtered_resume_text)
            console.log("scraped Ivies: " + user_ivies)

             // filtering for community college
             let user_community_college = check_community_college(filtered_resume_text)
             console.log("scraped community college: " + user_community_college)

            // list of languages recignized
            let entities_to_ask_about = filter_langs(filtered_resume_text);

            
            //delete res 
            deleteRes();
            // if there are languages, pick 4 at random
            if (entities_to_ask_about.length > 0){
              //delete res 
              console.log(entities_to_ask_about);
              // this will randomize the languages to ask about each interview
              entities_to_ask_about = entities_to_ask_about.sort(() => Math.random() - 0.5)
              console.log(entities_to_ask_about);
              // ask about 4 random languages or however many thay have
              if(entities_to_ask_about.length < 3){
                // just keep them all shuffled
                entities_to_ask_about = entities_to_ask_about
              } else {
                entities_to_ask_about = [entities_to_ask_about[0],entities_to_ask_about[1],entities_to_ask_about[2]]
              }
              console.log(entities_to_ask_about);
            } else {
              //delete res 
              console.log("no languages");
            }
            console.log("assss: " + ass_num)

            if(ass_num == "\"2\""){
              if(gpa.length != 0){
                entities_to_ask_about.push(gpa)
              }

            }
            
            if(ass_num === "\"2\""){
            if(user_bachelors.length != 0){
              entities_to_ask_about.push(user_bachelors)
            }
          }

          if(ass_num == "\"2\""){
            if(grad_date.length != 0){
              entities_to_ask_about.push(grad_date)
            }
          }
          if(ass_num == "\"2\""){
            if(user_ivies.length != 0 ){
              entities_to_ask_about.push(user_ivies);
            }
          }
          if(ass_num == "\"2\""){
            if(user_community_college.length !=0){
              entities_to_ask_about.push(user_community_college);
            }
          }
           
            // calling NLU to get entities
            const analyzeParams = {
                'text': filtered_resume_text,
                'language': 'en', // english language specifier so we dont have to check 100< characters 
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
                  console.log(analysisResults.result.entities);

                  // make sure the results of entities recignized are not nothing
                  if (analysisResults.result.entities.length != 0) {
                    // get just the organization entities
                    var orgs_list = analysisResults.result.entities.filter(function (entry) {
                        return entry.type === 'Organization';
                    });
                    // get just the company entities
                    var company_list = analysisResults.result.entities.filter(function (entry) {
                        return entry.type === 'Company';
                    });

                    // get just the sport entities
                    var sport_list = analysisResults.result.entities.filter(function (entry) {
                      return entry.type === 'Sport';
                  });
                   
                      // will get organizations that only contain clubs
                      var club_orgs = orgs_list.filter(function (entry) {
                        return entry.text.indexOf('club') !== -1;
                    });

                      
                      
                      if (club_orgs.length != 0){
                          // adding the orgs and company to the entities to ask the user about
                          entities_to_ask_about.push('' + club_orgs[0].text);
                      }

                      if (sport_list.length != 0){
                        entities_to_ask_about.push('' + sport_list[0].text);
                      }
                    
                      if (company_list.length != 0){
                        // this will choose the most relevant company on the resume
                          var max_company = company_list.filter( x => x["relevance"] == Math.max(...company_list.map(x => x["relevance"])) )
                          console.log(max_company);
                          entities_to_ask_about.push('' + max_company[0].text);
                      }
                      
                      entities_to_ask_about.push('end');
                      console.log(entities_to_ask_about);
                      
                      // send the entities to ask about back to the front end
                      return res.status(200).send(entities_to_ask_about);

                      // aka both have nothing - no languages or entities
                  } else if(entities_to_ask_about.length == 0){
                    console.log("no data at all");
                    return res.status(200).send(['NODATACOLLECTEDERROR']);
                    // aka still has languages to return
                  } else {
                    console.log("just entities no languages");
                    return res.status(200).send(entities_to_ask_about);
                  }

                })
                .catch(err => {
                  console.log('NLU error:', err);
                });

          })
    })

});

// ENDPOINT /toneanalyzer will evaluate tone of user response
app.post('/toneanalyzer', function (req, res) {

  console.log('Got body:', req.body);
  console.log(req.body.incomingMessage);

  const toneParams = {
    toneInput: { 'text': req.body.incomingMessage },
    contentType: 'application/json',
  };

  toneAnalyzer.tone(toneParams)
  .then(toneAnalysis => {

    console.log(JSON.stringify(toneAnalysis.result.document_tone.tones));
    var max_tone_score = 0
    var max_tone_name = ""
    var max_tone_id = ""
    var list_of_max = [];
    if(toneAnalysis.result.document_tone.tones.length == 0){
      list_of_max = ["", ""];
    }else{
      var tones_recignized = toneAnalysis.result.document_tone.tones // should be list
      var i;
      for (i = 0; i < tones_recignized.length; i++){
        console.log(tones_recignized[i])
        if (tones_recignized[i].score > max_tone_score){
          max_tone_score = tones_recignized[i].score
          max_tone_id = tones_recignized[i].tone_id
          max_tone_name = tones_recignized[i].tone_name
        }
      
      }
      list_of_max = [max_tone_id, max_tone_name];

    }

    
    console.log("max tone: " + list_of_max);

    var tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F928`) + " *unknown" + "*";
    if(list_of_max[0] !== "" && list_of_max[1] !== ""){
      switch(list_of_max[0]) {
        case "anger":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F621`) + " *" + list_of_max[1] + "*"
          // code block
          break;
        case "fear":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F630`) + " *" +  list_of_max[1] + "*"
          // code block
          break;
        case "joy":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F917`) + " *" +  list_of_max[1] + "*"
            // code block
          break;
        case "sadness":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F614`) + " *" +  list_of_max[1] + "*"
          // code block
          break;
        case "analytical":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F913`) + " *" +  list_of_max[1] + "*"
            // code block
          break;
        case "confident":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F4AA`) + " *" + list_of_max[1] + "*"
            // code block
          break;
        case "tentative":
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F615`) + " *" +  list_of_max[1] + "*"
            // code block
          break;
        default:
          tone_to_return = "*Tone:* " + String.fromCodePoint(`0x1F928`) + " *" + " unknown" + "*"
          // code block
      }

    }

    return res.status(200).send(tone_to_return);
    
  })
  .catch(err => {
    console.log('Tone error:', err);
  });

});

// ENDPPOINT /bettyresp will send entities or responses from user to the assistant 
app.post('/bettyresp', function (req, res) {
    // logs the data sent from the front end
    console.log('Got body:', req.body);
    console.log(req.body.incomingMessage);
    console.log("assistant number: "+ req.body.assistantNum)
    // fs.appendFile('responses.txt', req.body.incomingMessage + '\n', (err) => {
    //     if(err) throw err;
    //     console.log('Data appended to file');
    //   });
    
    // 1 => Betty
    if (req.body.assistantNum == 1){
      // sends message to betty
    bettyAssistant.message({
      assistantId: `${process.env.BETTY_ID}`,
      sessionId: bettySessID,
      input: {
        'message_type': 'text',
        'text': req.body.incomingMessage
        }
      })
      .then(resp => {

      
        if( resp.result.output.generic.length == 0 ){
          console.log("no generic response TEXT found");
          if( req.body.messageType == 'Resp'){
            // sends response from betty back to the frontend
            return res.status(200).send("*I'm not sure what you said there... I'll just move on anyways*");
          // entity
          } else {
            return res.status(200).send("Could you tell me more about this " + req.body.incomingMessage + " part on your resume?");
          }
          
        } else if( typeof JSON.stringify(resp.result.output.generic[0].text) === 'undefined') {
          console.log("no generic response found - found SUGGESTION");
          if( req.body.messageType == 'Resp'){
            // sends response from betty back to the frontend
            return res.status(200).send("*I'm not sure what you said there... I'll just move on anyways*");
          // entity
          } else {
            return res.status(200).send("Could you tell me more about this " + req.body.incomingMessage + " part on your resume?");
          }
        } else {
          console.log("in regular eval")
          console.log(JSON.stringify(resp.result.output.generic[0].text));
          // sends response from betty back to the frontend
          return res.status(200).send(JSON.stringify(resp.result.output.generic[0].text));
        }
          
        
        
      })
      .catch(err => {
        console.log('Watson Assistant error: ' + err);
      });

      // Karen => 2
    } else if( req.body.assistantNum == 2) {

         // sends message to betty
      karenAssistant.message({
      assistantId: `${process.env.KAREN_ID}`,
      sessionId: karenSessID,
      input: {
        'message_type': 'text',
        'text': req.body.incomingMessage
        }
      })
      .then(resp => {

      
        if( resp.result.output.generic.length == 0 ){
          console.log("no generic response TEXT found");
          if( req.body.messageType == 'Resp'){
            // sends response from betty back to the frontend
            return res.status(200).send("*I'm not sure what you said there... I'll just move on anyways*");
          // entity
          } else {
            return res.status(200).send("Could you tell me more about this " + req.body.incomingMessage + " part on your resume?");
          }
          
        } else if( typeof JSON.stringify(resp.result.output.generic[0].text) === 'undefined') {
          console.log("no generic response found - found SUGGESTION");
          if( req.body.messageType == 'Resp'){
            // sends response from betty back to the frontend
            return res.status(200).send("*I'm not sure what you said there... I'll just move on anyways*");
          // entity
          } else {
            return res.status(200).send("Could you tell me more about this " + req.body.incomingMessage + " part on your resume?");
          }
        } else {
          console.log("in regular eval")
          console.log(JSON.stringify(resp.result.output.generic[0].text));
          // sends response from betty back to the frontend
          return res.status(200).send(JSON.stringify(resp.result.output.generic[0].text));
        }
          
        
        
      })
      .catch(err => {
        console.log('Watson Assistant error: ' + err);
      });

    } else {
      console.log("Assistant number ERROR from front end")
    }
    
});

// starts app listening on the port of the frontend
app.listen(process.env.PORT, function() {

    ('App running ');

});