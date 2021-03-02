import React, { Component } from "react";
import axios from 'axios';

function filter_langs(lang_list) {
    const lang = ['python', 'java', 'ruby', 'golang', 'react', 'sql', 'c', 'c++', 'c#'];
    const delim = [' ', '.', ',', ':', ';', '(', ')', '%', '@', '|', '/'];
    var filter_delim_str = lang_list.toLowerCase().replace(/[*_#:@,.()/]/g, ' ');
    console.log(filter_delim_str);
    const final_filter = lang.filter(value => filter_delim_str.includes(value));
    console.log(final_filter);
    // this.setState({
    //   languages: final_filter
    // }, () => {
    //           // this.afterSetStateFinished();
    //           //.filter(e => lang.indexOf(e) !== -1)
    // });
    var scrapped_langs;
    final_filter.forEach(function(item){
      scrapped_langs += item + ' ';

    })
    console.log("HIIIIIIIIIIIIII")
    console.log(scrapped_langs);
    return scrapped_langs;

}

export default class FileUpload extends Component {

constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        fileDisplay: '',
        languages: [],
        watson: null,
        isActive: false,
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
        //console.log(text);

        this.setState({
              fileDisplay: text
          }, () => {
              // this.afterSetStateFinished();
          });
    })

    // console.log(this.state.fileDisplay);
    // var send_langs = filter_langs(this.state.fileDisplay);
    // console.log(send_langs);

    
    this.setState({
      isActive: true
          }, () => {
              // this.afterSetStateFinished();
          });
  // <script>
    // window.watsonAssistantChatOptions = {
    //       integrationID: "72f47ba6-cd17-4bab-8a81-9fe1834075f9", // The ID of this integration.
    //       region: "us-east", // The region your integration is hosted in.
    //       serviceInstanceID: "9fd7c9e6-2576-4831-9a1e-abd52ed19068", // The ID of your service instance.
    //     onLoad: function(instance) { 
    //         function handler(obj) {
    //           console.log(obj.type, obj.data);
    //         }
    //         //instance.writeableElements.welcomeNodeBeforeElement.innerHTML = '<div class="my-awesome-class">Disclaimer text...</div>';

    //         // let sendObject = {
    //         //   "input": {
    //         //     "message_type": "text",
    //         //     "text": "java"
    //         //   }
    //         // };
    //         const sendOptions = {
    //           "silent": true
    //           //"silent": false
    //         }

    //         // instance.send(sendObject,sendOptions).catch(function(error) {
    //         //   console.error('This message did not send!');
    //         // });

    //         let sendObject = {
    //           "input": {
    //             "message_type": "text",
    //             "text": scrapped_langs
    //           }
    //         };

    //             // setTimeout(function(){
    //             //   instance.off({ type: "send", handler: handler});
    //             // }, 30000);

    //             instance.send(sendObject,sendOptions).catch(function(error) {
    //               console.error('This message did not send!');
    //             });

    //             instance.render(); 

    //           }
    //   };
    // setTimeout(function(){
    //   const t=document.createElement('script');
    //   t.src="https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
    //   document.head.appendChild(t);

    // });

    // this.setState({
    //   fileDisplay: text,
    // })

    }

    onClickHandlerWidget = () => {

    console.log(this.state.fileDisplay);
    var send_langs = filter_langs(this.state.fileDisplay);
    console.log(send_langs);


        window.watsonAssistantChatOptions = {
          integrationID: {integrationID}, // The ID of this integration.
          region: "us-east", // The region your integration is hosted in.
          serviceInstanceID: {serviceINstanceID}, // The ID of your service instance.
        onLoad: function(instance) { 
            function handler(obj) {
              console.log(obj.type, obj.data);
            }
            //instance.writeableElements.welcomeNodeBeforeElement.innerHTML = '<div class="my-awesome-class">Disclaimer text...</div>';

            let sendObject = {
              "input": {
                "message_type": "text",
                "text": "java test"
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
                "text": send_langs
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


    }



  render(){
      return(
        <div>
        <input type="file" name="file" className="btn btn-secondary" onChange={this.onChangeHandler}/>
        <h4>Once your desired Resume is choosen, please click upload</h4>
        <div>
        <button type="button" className="btn btn-success" onClick={this.onClickHandler}>Upload</button> 
        </div>
        <div>
        {/* <p>{this.state.fileDisplay}</p> */}
        {this.state.isActive ?(
              // <HideButton onClick={this.handleHide}/>
              <div>
              <h4>Resume Upload Success, click below to chat with a hiring manager</h4>
              <button type="button" className="btn btn-info" onClick={this.onClickHandlerWidget}>Chat with Betty!</button>
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