import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Widget, addResponseMessage, deleteMessages } from 'react-chat-widget';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import 'react-chat-widget/lib/styles.css';
import Speech from 'react-speech';
import {
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";

const speechStyle = {
  play: {
    button: {
      width: '28',
      height: '28',
      cursor: 'pointer',
      pointerEvents: 'none',
      outline: 'none',
      backgroundColor: 'yellow',
      border: 'solid 1px rgba(255,255,255,1)',
      borderRadius: 6
    },
  }
};

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && 
      <div
          style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
      >
        <Loader type="ThreeDots" color="#008080" height="100" width="100" />
       </div>
);  
}

const radios = [
  { name: 'Betty', value: '1' },
  { name: 'Karen', value: '2' },
];

// const [radioValue, setRadioValue] = useState('1');

export default class FileUpload extends Component {

  

  // these states are used to store the vars you want to trigger more events or use in different functions
constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        resumeEntitiesList: [],
        languages: [],
        watson: null,
        isActive: false,
        totalMessages: 0,
        startInt: false,
        radioValue: 1,
        currentSpeechMessage: '',
      }

    this.handleWatsonToggleChange = this.handleWatsonToggleChange.bind(this);
   
  }


// for file select
onChangeFileSelectHandler=event=>{
  console.log(event)
  console.log("selected file: " + event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0],
      radioValue: this.state.radioValue,
      loaded: 0,
    })
    // make sure user doesn't try to upload if no file is selected
    if (typeof event.target.files[0] !== 'undefined'){
      console.log("not undefined")
      this.setState({
        startInt: true,
      })
    } else {
      console.log("undefined")
      this.setState({
        startInt: false,
      })
    }
  }

  // for uploading file
  onClickUploadFileHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    console.log("Selected file in upload: " + this.state.selectedFile)
    console.log("Chosen assistant in upload: " + this.state.radioValue)
    var assistant_state = this.state.radioValue;
    var text = 'resume text: '
    console.log(data)
    //var params = `assistantNum=${this.state.radioValue}`;
    var params = {
      data: data,
      assistantNum: this.state.radioValue,
    }
    /// those three laoding dots
    trackPromise(
        // HITTING ENDPOINT /upload ->  since our port is 8000
        // receive two parameter endpoint url , and form data, which is the resume
        axios.post("http://localhost:8000/upload", data, {
          headers: {
            assistantNum: this.state.radioValue,
          }
        }).then(res => { // then print response status
            text = res.data;
            console.log(text);

            // update the entity list to what to send TO betty
            this.setState({
              resumeEntitiesList: text,
              isActive: true
              }, () => {
              });
              // send a hello to trigger the welcome node rom Betty
             this.onSendQueMessage('HELLOOTHISISTHETRIGGERMESSAGE','',assistant_state);
              
        }));
    // make the interview chat show up, so change this state
    // this.setState({
    //   isActive: true
    //       }, () => {
    //           // this.afterSetStateFinished();
    //       });

      
 
    }

    onClickDelete = () => {
      // HITTING ENDPOINT -> deleting the resume
      // don't need to send any data, so just do a get request
      this.setState({
        startInt: false,
      })
      
      axios.get("http://localhost:8000/delete").then(res => { // then print response status

      });
        // clear the chat messages
        addResponseMessage('**restarting interview**');
        deleteMessages(this.state.totalMessages);

        // trigger the delete button back off
        // set messages to 0, so start from begining
        this.setState({
          openDelete: false,
          totalMessages: 0,
          isActive: false,
          }, () => {

          });
    };

    // this needed to be abstracted out to send our entities versus the user responses
    // quededQuestion are the entities (Java,..,Club __, Company)
    // when resp is "Yes I experienced..."
    onSendQueMessage = (quededQuestion, resp, assistant_num) => {
      console.log('queded q: ' + quededQuestion);
      console.log('resp: ' + resp);
      console.log("Assistant chosen: " + assistant_num)
      // signifies end of interview, so last message queued
      if (quededQuestion === 'end'){
        console.log("in end");
        // evaluating one last time
         //do the evaluation of previous response here
         const prevResp = `incomingMessage=${resp}&messageType=Resp&assistantNum=${assistant_num}`;
            
         // HITTING ENDPOINT, sending response from user to be evaluated
         axios.post("http://localhost:8000/toneanalyzer", prevResp, {
         // receive two    parameter endpoint url ,form data
           }).then(res => { // then print response status
           // text = res.data;
           console.log("prev question: " + res);
           addResponseMessage(res.data);

           this.setState({
             totalMessages: this.state.totalMessages + 1
             }, () => {
                 // this.afterSetStateFinished();
             });

           // HITTING ENDPOINT, sending queued entity in order to trigger Betty's next question
           axios.post("http://localhost:8000/bettyresp", prevResp, {
           // receive two    parameter endpoint url ,form data
             }).then(res => { // then print response status
             // text = res.data;
             console.log("tone analysis: " + res);
             addResponseMessage(res.data);
             this.setState({
               totalMessages: this.state.totalMessages + 1
               
               }, () => {
                   // this.afterSetStateFinished();
               });
               // addResponseMessage will add it to the chat box from 'Betty' side
               if( this.state.radioValue == 2){
                addResponseMessage('Welp..Alright, I think those are all the questions I have - what a big waste of my time');
                this.setState({
                  currentSpeechMessage: 'Welp..Alright, I think those are all the questions I have - what a big waste of my time'
                  }, () => {
                      // this.afterSetStateFinished();
                  });

               }else{
                addResponseMessage('Sweet! Alright, I think those are all the questions I have - thank you for your time!');
                this.setState({
                  currentSpeechMessage: 'Sweet! Alright, I think those are all the questions I have - thank you for your time!'
                  }, () => {
                      // this.afterSetStateFinished();
                  });
               }
              
              addResponseMessage('**end of interview, click restart to interview again**');
             });
            });
        
        

        // add to toal messages sent, and open the delete option
        this.setState({
          openDelete: true,
          totalMessages: this.state.totalMessages + 1
          }, () => {
              // this.afterSetStateFinished();
          });

      // this signifies the first response, triggers hello, so only send the response, not the queued entity
      } else if (quededQuestion === 'HELLOOTHISISTHETRIGGERMESSAGE' && resp === ''){
        console.log("in the intro")
        console.log("resume entity list: " + this.state.resumeEntitiesList);
              if(this.state.resumeEntitiesList[0] === 'NODATACOLLECTEDERROR'){
                console.log("did not ID anything")
                var stand_str = "standard format?";
                addResponseMessage("Actually...I wasn't able to see any programming languages, clubs, or companies that stand out...maybe I should change my glasses - could you try uploading a resume similar to the examples provided?");
                this.setState({
                  resumeEntitiesList: []
                  }, () => {
                      // this.afterSetStateFinished();
                  });
              } else {
                  // putting data in a format to send to the backend ENDPOINT
              const nextQuestion = `incomingMessage=${quededQuestion}&messageType=Entity&assistantNum=${assistant_num}`;
                  
              // HITTING ENDPOINT, sending response from user to be evaluated
              axios.post("http://localhost:8000/bettyresp", nextQuestion, {
              // receive two    parameter endpoint url ,form data
                }).then(res => { // then print response status
                // text = res.data;
                console.log(res);
                // addResponseMessage will add it to the chat box from 'Betty' side
                addResponseMessage(res.data);
                this.setState({
                  totalMessages: this.state.totalMessages + 1,
                  currentSpeechMessage: res.data
                  }, () => {
                      // this.afterSetStateFinished();
                  });
                
                  })
              }
      
      }else{
        // this triggers not begining or end of interview messages
       // so need to send queued entity and response from user
        console.log("in else");
            //do the evaluation of previous response here
            const prevResp = `incomingMessage=${resp}&messageType=Resp&assistantNum=${assistant_num}`;
            
            // HITTING ENDPOINT, sending response from user to be evaluated
            axios.post("http://localhost:8000/toneanalyzer", prevResp, {
            // receive two    parameter endpoint url ,form data
              }).then(res => { // then print response status
              // text = res.data;
              console.log("prev question: " + res);
              addResponseMessage(res.data);

              this.setState({
                totalMessages: this.state.totalMessages + 1
                }, () => {
                    // this.afterSetStateFinished();
                });

              // HITTING ENDPOINT, sending queued entity in order to trigger Betty's next question
              axios.post("http://localhost:8000/bettyresp", prevResp, {
              // receive two    parameter endpoint url ,form data
                }).then(res => { // then print response status
                // text = res.data;
                console.log("tone analysis: " + res);
                addResponseMessage(res.data);
                this.setState({
                  totalMessages: this.state.totalMessages + 1,
                  }, () => {
                      // this.afterSetStateFinished();
                  });

                  const nextQuestion = `incomingMessage=${quededQuestion}&messageType=Entity&assistantNum=${assistant_num}`;
            
              // HITTING ENDPOINT, sending queued entity in order to trigger Betty's next question
              axios.post("http://localhost:8000/bettyresp", nextQuestion, {
              // receive two    parameter endpoint url ,form data
                }).then(res => { // then print response status
                // text = res.data;
                console.log("next question: " + res);
                addResponseMessage(res.data);
                this.setState({
                  totalMessages: this.state.totalMessages + 1,
                  currentSpeechMessage: res.data
                  }, () => {
                      // this.afterSetStateFinished();
                  });
                
            })
                
            })

              

          })
  
      }

    }

    // required by the Widget component, but want to send out own queued messages, which we do in onSendQueMessage
    handleNewUserMessage = (message) => {
      // makes sure there is a entity to ask about, or it is the begining or end of interview
      if(this.state.resumeEntitiesList.length > 0){
        // will send first entity from resume entities found
        var next_entity = this.state.resumeEntitiesList.shift();
        // will get the assistant num
        var assistant_num = this.state.radioValue;
        console.log("ass num: " + assistant_num);
        // params are entity to ask about, and message from the user
        this.onSendQueMessage(next_entity, message, assistant_num);
      } else {
        addResponseMessage('**please click restart interview**');
      }
      

    }

  

    handleWatsonToggleChange=val=> {
      console.log("event: " + val)
      this.setState({
        radioValue: val
        }, () => {
            // this.afterSetStateFinished();
        });
        ///console.log("watson toggle value: "+ this.radioValue)

    }



  render(){
      return(
        <div>
          <div className="row">
              <div className="col-3">
                <h1>
                Choose your fighter interviewer #GitFucked
                </h1>
                
              </div>
              <div className="col-4">
              <img src="https://img.memecdn.com/choose-your-fighter_o_7231641.jpg" alt="Interview Meme" width="380" height="230"></img>
            </div>
            <div className="col-5">
              <img src="http://www.shutupandtakemymoney.com/wp-content/uploads/2020/05/choose-your-fighter-susan-karen-brenda-meme-300x250.jpg" alt="Interview Meme" width="280" height="230"></img>
            </div>
        </div>
        <div/>
        <p/>
        <p>
        Choose your fighter interviewer is a platform powered by knowledge-based systems to help you prep for those upcoming technical interviews with a twist. 
        This application is geared towards undergraduate students in computer science or technology-related fields and only 
        recognizes English text intelligently at this time. The first step is to upload your resume, and from there specific 
        questions about the topics on your resume will be asked by our hiring manager Betty 👵 or Karen 👹. Betty is our HR department veteran 
        who is retiring soon (Easy). Karen is our mid-level HR specialist who is a little high strung (Hard). One of these ladies will be there to chat through 
        a widget pop-up in the bottom right corner once you successfully upload your resume. Throughout the interview, Betty & Karen will 
        also give you feedback and suggestions about your responses. You can also click on the text on the side to hear Betty or Karen speak their question. Good luck! 
        </p>
          <Link to="/admin/examples">Reference Resume Examples (Available for Download)</Link>
          <div/>
          <Link to="/admin/resources">Other Additional Helpful Resources</Link>
        <div className="row">
                  <div className="col-3">
                    <p>Betty/Karen could ask you about:</p>
                      <ul>
                        <li>Knowledge/experience of programming languages 🤖</li>
                        <li>A club or sport you are involved in ⚽️</li>
                        <li>A company you have worked at/with 🏢</li>
                      </ul>
                      </div>
                      <div className="col-4">
                    <p>Betty/Karen evaluates you on:</p>
                      <ul>
                        <li>Tone of your response - for this interview, you probably want to focus on 🤓 analytical and 💪 confident tones</li>
                        <li>Good introduction including your year in school 📓</li>
                        <li>Mentions of involvements/leadership/coursework 🥇</li>
                      </ul>
                      </div>
                <div className="col-5">
                  <p>Is Betty/Karen asking you inaccurate questions?</p>
                  <ul>
                    <li>check out the example resumes for a typical undergrad technology format 📋</li>
                    <li>Are you maybe highlighting something in your resume too much? 🔝</li>
                    <li>The resume parsing is also very preliminary at the moment 👶</li>
                  </ul>
                </div>
                <p>** 🙏 Betty/Karen respectfully requests you respond to questions in a single text bubble because she is an old lady and can only read one at a time 👵**</p>
          </div>
        

        <div>
        {/* this will display the first params versus the second depending on the state of isActive */}
        {this.state.isActive ?(
              // <HideButton onClick={this.handleHide}/>
              <div>
                <p>Resume Upload Success, click on widget to chat with a hiring manager</p>
                {/* //handleNewUserMessage={handleNewUserMessage(this.state.resumeEntitiesList.shift())} */}
                 <Widget title="Welcome to Git-A-Job's Interview Chat" subtitle="Type below to answer interview questions" handleNewUserMessage={this.handleNewUserMessage}/>
                 <p>click restart to trigger a new  interview</p>
                <button type="button" className="btn btn-warning" onClick={this.onClickDelete}>Restart</button> 
              {/* <h4>Resume Upload Success, click below to chat with a hiring manager</h4>
              <button type="button" className="btn btn-info" onClick={this.onClickUploadFileHandlerWidget}>Chat with Betty!</button> */}
              <p/>
              {this.state.radioValue === 1 ?(
                <div>
                  <p>Click to hear Betty's Question:</p>
                  <Speech textAsButton={true}  text={this.state.currentSpeechMessage} pitch="0.3"
                              rate="0.7"
                              volume="1"
                              lang="en-GB"
                              voice="Google UK English Female"/>
                              </div>
                              ) : (
                                <div>
                                  <p>Click to hear Karen's Question:</p>
                                    <Speech textAsButton={true} text={this.state.currentSpeechMessage} pitch="1"
                                  rate="1"
                                  volume="1"
                                  lang="en-GB"
                                  voice="Google UK English Female"/>
                                  
                                <p/>
                                </div>
                              )}
                         
                
              </div>
           ) : (
            <div>
                {/* <ButtonGroup toggle>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      type="radio"
                      variant="secondary"
                      name="radio"
                      value={radio.value}
                      checked={this.radioValue === radio.value}
                      onChange={(e) => this.setState({
                        radioValue: e.currentTarget.value
                        }, () => {
                            // this.afterSetStateFinished();
                        })}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup> */}
                <Speech textAsButton={true}  text="My name's Betty" pitch="0.3"
                              rate="0.7"
                              volume="1"
                              lang="en-GB"
                              voice="Google UK English Female"/>
                <Speech textAsButton={true}  text="My name's Karen" pitch="1"
                              rate="1"
                              volume="1"
                              lang="en-GB"
                              voice="Google UK English Female"/>
                              <p/>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1} value={this.state.radioValue} onChange={this.handleWatsonToggleChange}>
                    <ToggleButton variant="info" value={1}>Betty</ToggleButton>
                    <ToggleButton variant="info" value={2}>Karen</ToggleButton>
                  </ToggleButtonGroup>
                  <p/>
                <div className="row">
                  <div className="col-4">
                    <p> choose a .docx file </p>
                    <input type="file" accept=".docx" name="file" className="btn btn-secondary" onChange={this.onChangeFileSelectHandler}/>
                  </div>
                  {this.state.startInt ?(
                    <div className="col-6">
                    <p>click to start interview</p>
                    <button type="button" className="btn btn-success" onClick={this.onClickUploadFileHandler}>Start</button> 
                  </div>
                  ) : (
                    <div/>
                  )}
                  
                </div>
                <LoadingIndicator/>
                
                
            </div>
           )}
        
        </div>
        </div>

        
      );
  }
    
}