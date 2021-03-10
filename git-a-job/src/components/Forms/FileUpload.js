import React, { Component } from "react";
import axios from 'axios';
import { Widget, addResponseMessage } from 'react-chat-widget';
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
      this.onSendQueMessage("hello");
 
    }

    onSendQueMessage = (quededQuestion) => {
      if (quededQuestion === 'end'){
        console.log("in end");
        addResponseMessage('Alright, I think those are all the questions I have - thanks for you time!');
        // this.setState({
        //   isActive: true
        //       }, () => {
        //           // this.afterSetStateFinished();
        //       }); --> maybe a solution? or record the results of evaluations
      }else{
        console.log("in else");
            const body = {
              "incomingMessage": quededQuestion
            };
            const senderthing = `incomingMessage=${quededQuestion}`;
            console.log(body);
            axios.post("http://localhost:8000/bettyresp", senderthing, {
            // receive two    parameter endpoint url ,form data
              }).then(res => { // then print response status
              // text = res.data;
              console.log(res);
              addResponseMessage(res.data);
              
              // this.setState({
              //       fileDisplay: text
              //   }, () => {
              //       // this.afterSetStateFinished();
              //   });
          })
      }

    }
    // message will be the message that the user ACTUALLY sends, but arent using that right now
    // required by the Widget component, but want to send out own queued messages
    handleNewUserMessage = (message) => {
      //handleNewUserMessage(message);
      if(this.state.resumeEntitiesList.length > 0){
        // will send first entity from resume entities found
        var check = this.state.resumeEntitiesList.shift();
        this.onSendQueMessage(check);
      }
      

    }



  render(){
      return(
        <div>
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
        
        </div>
        </div>

        
      );
  }
    
}