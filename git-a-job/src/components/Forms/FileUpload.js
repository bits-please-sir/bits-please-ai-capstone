import React, { Component } from "react";
import axios from 'axios';

export default class FileUpload extends Component {
//     state = {users: []}

//   componentDidMount() {
//     fetch('/users')
//       .then(res => res.json())
//       .then(users => this.setState({ users }));
//   }

//   render() {
//     return (
//       <div className="App">
//         <h1>Users</h1>
//         {this.state.users.map(user =>
//           <div key={user.id}>{user.username}</div>
//         )}
//       </div>
//     );
//  }
//   constructor(props) {
//     super(props);

//     this.state = {
//       resumeURL: '',
//     };

//     this.handleUploadDocx = this.handleUploadDocx.bind(this);
//   }

//   handleUploadDocx(ev) {
//     ev.preventDefault();

//     const data = new FormData();
//     data.append('file', this.uploadInput.files[0]);
//     data.append('filename', this.fileName.value);

//     fetch('http://localhost:3001/fileupload', {
//       method: 'POST',
//       body: data,
//     }).then((response) => {
//       response.json().then((body) => {
//         this.setState({ resumeURL: `http://localhost:3001/${body.file}` });
//       });
//     });
//   }

//   render() {
//     return (
//       <form onSubmit={this.handleUploadDocx}>
//         <div>
//           <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
//         </div>
//         <div>
//           <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
//         </div>
//         <br />
//         <div>
//           <button>Upload</button>
//         </div>
//         <img src={this.state.resumeURL} alt="img" />
//       </form>
//     );
//   }
constructor(props) {
    super(props);
      this.state = {
        selectedFile: null
      }
   
  }
// onChangeHandler=event=>{

//     console.log(event.target.files[0])

// }
onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }
  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    axios.post("http://localhost:8000/upload", data, { 
       // receive two    parameter endpoint url ,form data
    }).then(res => { // then print response status
        console.log(res.statusText)
    })
    }
  render(){
      return(
        <div>
        <input type="file" name="file" onChange={this.onChangeHandler}/>
        <h4>Once your desired Resume is choosen, please click upload</h4>
        <div>
        <button type="button" class="btn btn-success" onClick={this.onClickHandler}>Upload</button> 
        </div>
        </div>
      );
  }
    
}