import React, { Component } from "react";
import axios from 'axios';

export default class FileUpload extends Component {

constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        fileDisplay: ''
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