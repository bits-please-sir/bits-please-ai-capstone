import React, { Component } from "react";
import axios from 'axios';
import { Widget, addResponseMessage, deleteMessages } from 'react-chat-widget';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import 'react-chat-widget/lib/styles.css';


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
        openDelete: false,
        totalMessages: 0,
      }
   
  }


// for file select
onChangeFileSelectHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  // for uploading file
  onClickUploadFileHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    var text = 'resume text: '
    console.log(data)
    trackPromise(
        // HITTING ENDPOINT /upload ->  since our port is 8000
        // receive two parameter endpoint url , and form data, which is the resume
        axios.post("http://localhost:8000/upload", data, {
          
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
             this.onSendQueMessage('HELLOOTHISISTHETRIGGERMESSAGE','');
              
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
      axios.get("http://localhost:8000/delete").then(res => { // then print response status

      });
        // clear the chat messages
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
    onSendQueMessage = (quededQuestion, resp) => {
      console.log('queded q: ' + quededQuestion);
      console.log('resp: ' + resp);
      // signifies end of interview, so last message queued
      if (quededQuestion === 'end'){
        console.log("in end");
        // addResponseMessage will add it to the chat box from 'Betty' side
        addResponseMessage('Sweet! Alright, I think those are all the questions I have - thanks for you time!');
        addResponseMessage('**end of interview, delete & upload to start another**');

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
              } else {
                  // putting data in a format to send to the backend ENDPOINT
              const nextQuestion = `incomingMessage=${quededQuestion}`;
                  
              // HITTING ENDPOINT, sending response from user to be evaluated
              axios.post("http://localhost:8000/bettyresp", nextQuestion, {
              // receive two    parameter endpoint url ,form data
                }).then(res => { // then print response status
                // text = res.data;
                console.log(res);
                // addResponseMessage will add it to the chat box from 'Betty' side
                addResponseMessage(res.data);
                this.setState({
                  totalMessages: this.state.totalMessages + 1
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
            const prevResp = `incomingMessage=${resp}`;
            
            // HITTING ENDPOINT, sending response from user to be evaluated
            axios.post("http://localhost:8000/bettyresp", prevResp, {
            // receive two    parameter endpoint url ,form data
              }).then(res => { // then print response status
              // text = res.data;
              console.log(res);
              addResponseMessage(res.data);

              this.setState({
                totalMessages: this.state.totalMessages + 1
                }, () => {
                    // this.afterSetStateFinished();
                });

              const nextQuestion = `incomingMessage=${quededQuestion}`;
            
              // HITTING ENDPOINT, sending queued entity in order to trigger Betty's next question
              axios.post("http://localhost:8000/bettyresp", nextQuestion, {
              // receive two    parameter endpoint url ,form data
                }).then(res => { // then print response status
                // text = res.data;
                console.log(res);
                addResponseMessage(res.data);
                this.setState({
                  totalMessages: this.state.totalMessages + 1
                  }, () => {
                      // this.afterSetStateFinished();
                  });
                
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
        // params are entity to ask about, and message from the user
        this.onSendQueMessage(next_entity, message);
      }
      

    }



  render(){
      return(
        <div>
        <h1>
        Hello & Welcome to Git-A-Job!
        </h1>
        <p>
          Git-A-Job is a platform powered by knowledge-based systems to help YOU prep for those upcoming technical interviews. This application is geared towards undergraduate students in computer science or technology related fields and only recignizes English text intelligently at this time.
          The first step is to upload your resume, and from there specific questions about the topics on your resume will be 
          asked by our hiring manager Betty. Betty will be there to chat through a widget pop-up in the bottom right corner 
          once you successfully upload your resume. Throughout the interview Betty will also give you feedback and suggests about your responses. Good luck! 
        </p>
        <p>Betty could ask you about:</p>
          <ul>
            <li>Knowledge/experience of programming languages</li>
            <li>A club or sport you are involved in</li>
            <li>A company you have worked at/with</li>
          </ul>  
        <a href="https://drive.google.com/file/d/1Uf8VvvpsMfNYaAiRoQgeCSNX9-JhR1En/view">Resume Format Example</a>
        <span>
        <h4> Please upload a .docx file (word document)</h4>
        <input type="file" accept=".docx" name="file" className="btn btn-secondary" onChange={this.onChangeFileSelectHandler}/>
        <h4>Once your desired Resume is choosen, please click upload</h4>
        <div>
        <button type="button" className="btn btn-success" onClick={this.onClickUploadFileHandler}>Start</button> 
        <LoadingIndicator/>
        </div>
        </span>
        <div>
        {/* this will display the first params versus the second depending on the state of isActive */}
        {this.state.isActive ?(
              // <HideButton onClick={this.handleHide}/>
              <div>
                <h4>Resume Upload Success, click on widget to chat with a hiring manager</h4>
                {/* //handleNewUserMessage={handleNewUserMessage(this.state.resumeEntitiesList.shift())} */}
                 <Widget title="Welcome to Git-A-Job's Interview Chat" subtitle="Type below to answer interview questions" handleNewUserMessage={this.handleNewUserMessage}/>
                 <h4>Restart, and click upload again to start another interview</h4>
                <button type="button" className="btn btn-warning" onClick={this.onClickDelete}>Restart</button> 
              {/* <h4>Resume Upload Success, click below to chat with a hiring manager</h4>
              <button type="button" className="btn btn-info" onClick={this.onClickUploadFileHandlerWidget}>Chat with Betty!</button> */}
              </div>
           ) : (
            //  <ShowButton onClick={this.handleShow}/>
            <p/>
           )}

        {this.state.openDelete ?(
              // <HideButton onClick={this.handleHide}/>
              <div>
                <h4>Delete Resume, and click upload again to start another interview</h4>
                <button type="button" className="btn btn-warning" onClick={this.onClickDelete}>Delete Resume</button> 
              </div>
           ) : (
            //  <ShowButton onClick={this.handleShow}/>
            <p/>
           )}
        
        </div>
        </div>

        
      );
  }
    
}