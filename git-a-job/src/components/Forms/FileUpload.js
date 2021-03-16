import React, { Component } from "react";
import axios from 'axios';
import { Widget, addResponseMessage, deleteMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';




// writeFile('responses.txt', " ", (err) => {
//   if(err) throw err;
//   console.log('File has been saved');
// });

export default class FileUpload extends Component {

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
onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }
  // for uploading file
  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    var text = 'resume text: '
    console.log(data)
    axios.post("http://localhost:8000/upload", data, {
       // receive two    parameter endpoint url ,form data
    }).then(res => { // then print response status
        text = res.data;
        //console.log(text);

        this.setState({
          resumeEntitiesList: text
          }, () => {
              // this.afterSetStateFinished();
          });
    })
    // make the interview chat show up
    this.setState({
      isActive: true
          }, () => {
              // this.afterSetStateFinished();
          });
      // send a hello to trigger the welcome node
      this.onSendQueMessage('HELLOO','');
 
    }

    getRespForPrev(message) {
      
    }

    onClickDelete = () => {
      axios.get("http://localhost:8000/delete").then(res => { // then print response status
      //text = res.data;
      //console.log(text)
      });
        // for the original hello
        deleteMessages(this.state.totalMessages);

        this.setState({
          openDelete: false,
          totalMessages: 0,
          }, () => {
              // this.afterSetStateFinished();
          });
    };

    onSendQueMessage = (quededQuestion, resp) => {
      console.log(quededQuestion);
      console.log(resp);
      if (quededQuestion === 'end'){
        console.log("in end");
        addResponseMessage('Sweet! Alright, I think those are all the questions I have - thanks for you time!');
        addResponseMessage('**end of interview, delete & upload to start another**');

        this.setState({
          openDelete: true,
          totalMessages: this.state.totalMessages + 1
          }, () => {
              // this.afterSetStateFinished();
          });
        // delete resume stored
      
        // this.setState({
        //   isActive: true
        //       }, () => {
        //           // this.afterSetStateFinished();
        //       }); --> maybe a solution? or record the results of evaluations
      } else if (quededQuestion === 'HELLOO' && resp === ''){
        //deleteMessages(1);
        const nextQuestion = `incomingMessage=${quededQuestion}`;
            
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
          
          // this.setState({
          //       fileDisplay: text
          //   }, () => {
          //       // this.afterSetStateFinished();
          //   });
      })
      }else{
        console.log("in else");
            //do the evaluation of previous response here
            const prevResp = `incomingMessage=${resp}`;
            
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
                
                // this.setState({
                //       fileDisplay: text
                //   }, () => {
                //       // this.afterSetStateFinished();
                //   });
            })
              
              // this.setState({
              //       fileDisplay: text
              //   }, () => {
              //       // this.afterSetStateFinished();
              //   });
          })
          //do next quesstion here
         
      }

    }
    // message will be the message that the user ACTUALLY sends, but arent using that right now
    // required by the Widget component, but want to send out own queued messages
    handleNewUserMessage = (message) => {
      //handleNewUserMessage(message);
      if(this.state.resumeEntitiesList.length > 0){
        // will send first entity from resume entities found
        var check = this.state.resumeEntitiesList.shift();
        this.onSendQueMessage(check, message);
      }
      

    }



  render(){
      return(
        <div>
        <h1>
        Hello & Welcome to Git-A-Job!
        </h1>
        <h4>
          Git-A-Job is a platform powered by knowledge-based systems to help YOU prep for those upcoming technical interviews. This application is geared towards undergraduate students in computer science or technology related fields.
          The first step is to upload your resume, and from there specific questions about the topics on your resume will be 
          asked by our hiring manager Betty. Betty will be there to chat through a widget pop-up in the bottom right corner 
          once you successfully upload your resume. Throughout the interview Betty will also give you feedback and suggests about your responses. Good luck! 
        </h4>
        <h4> Please upload a .docx file (word document)</h4>
        <input type="file" accept=".docx" name="file" className="btn btn-secondary" onChange={this.onChangeHandler}/>
        <h4>Once your desired Resume is choosen, please click upload</h4>
        <div>
        <button type="button" className="btn btn-success" onClick={this.onClickHandler}>Upload</button> 
        </div>
        <div>
        {/* <p>{this.state.resumeEntitiesList}</p> */}
        {this.state.isActive ?(
              // <HideButton onClick={this.handleHide}/>
              <div>
                <h4>Resume Upload Success, click on widget to chat with a hiring manager</h4>
                {/* //handleNewUserMessage={handleNewUserMessage(this.state.resumeEntitiesList.shift())} */}
                 <Widget title="Welcome to Git-A-Job's Interview Chat" subtitle="Type below to answer interview questions" handleNewUserMessage={this.handleNewUserMessage}/>
              {/* <h4>Resume Upload Success, click below to chat with a hiring manager</h4>
              <button type="button" className="btn btn-info" onClick={this.onClickHandlerWidget}>Chat with Betty!</button> */}
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