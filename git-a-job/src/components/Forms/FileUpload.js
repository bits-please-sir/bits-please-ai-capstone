import React, { Component } from "react";
import axios from 'axios';

export default class FileUpload extends Component {

constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        fileDisplay: '',
        languages: [],
        watson: null,
      }
   
  }


onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    var text = 'resume text: '
    axios.post("http://localhost:8000/upload", data, {
       // receive two    parameter endpoint url ,form data
    }).then(res => { // then print response status
        text = res.data;
        console.log(text);

        this.setState({
              fileDisplay: text
          }, () => {
              // this.afterSetStateFinished();
          });
    })
    const lang = ['python', 'java', 'ruby', 'javascript', 'golang', 'react', 'sql', 'c', 'c++', 'c#'];
    const delim = [' ', '.', ',', ':', ';', '(', ')', '%', '@', '|', '/'];
    var string = this.state.fileDisplay.toLowerCase().replace(/[*_#:@,.()/]/g, ' ');
    console.log("hi");
    const c = lang.filter(value => string.includes(value));
    this.setState({
      languages: c
    }, () => {
              // this.afterSetStateFinished();
              //.filter(e => lang.indexOf(e) !== -1)
    });
    var l;
    c.forEach(function(item){
      l += item + ' ';

    })
    this.setState({
      watson: 'yes'
          }, () => {
              // this.afterSetStateFinished();
          });
  // <script>
    window.watsonAssistantChatOptions = {
        integrationID: "{integrationID}", // The ID of this integration.
        region: "us-east", // The region your integration is hosted in.
        serviceInstanceID: "{serviceID}", // The ID of your service instance.
        onLoad: function(instance) { 
            function handler(obj) {
              console.log(obj.type, obj.data);
            }
            //instance.writeableElements.welcomeNodeBeforeElement.innerHTML = '<div class="my-awesome-class">Disclaimer text...</div>';

            let sendObject = {
              "input": {
                "message_type": "text",
                "text": "java"
              }
            };
            const sendOptions = {
              "silent": true
              //"silent": false
            }

            instance.send(sendObject,sendOptions).catch(function(error) {
              console.error('This message did not send!');
            });

            sendObject = {
              "input": {
                "message_type": "text",
                "text": l
              }
            };

                // setTimeout(function(){
                //   instance.off({ type: "send", handler: handler});
                // }, 30000);

                instance.send(sendObject,sendOptions).catch(function(error) {
                  console.error('This message did not send!');
                });

                instance.render(); 

              }
      };
    setTimeout(function(){
      const t=document.createElement('script');
      t.src="https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
      document.head.appendChild(t);

    });

    // this.setState({
    //   fileDisplay: text,
    // })

    }

  render(){
      return(
        <div>
        <input type="file" name="file" onChange={this.onChangeHandler}/>
        <h4>Once your desired Resume is choosen, please click upload</h4>
        <div>
        <button type="button" className="btn btn-success" onClick={this.onClickHandler}>Upload</button> 
        </div>
        <div>
        <p>{this.state.fileDisplay}</p>
        </div>
        </div>

        
      );
  }
    
}