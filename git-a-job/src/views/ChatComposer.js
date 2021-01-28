import React, { Component } from "react";

// we are using class componen coz we need temp state here
export default class ChatComposer extends Component {
  // temp state to only store new single message
  state = {
    message: ''
  };
  /*submitted = getNewMessage => {
    if (getNewMessage != "") {
      // match the state format
      const newMessage = { text: getNewMessage };
      // merge new message in copy of state stored messages
      let updatedMessages = [...this.state.messages, newMessage];
      // update state
      this.setState({
        messages: updatedMessages
      });
    }
  }*/

  // if form was submitted, notify parent component
  submitted = event => {
    event.preventDefault();
    this.props.submitted(this.state.new)
    // send event value to parent component via calling props
    /*if(event != ""){
      const newMessage = {text: event};
      let updatedMessages = [...this.state.messages, newMessage];
      */
      this.setState({
        message: ""
      });
      //return updatedMessages;
    };
    //this.props.submitted(this.state.new);
    // remove single message stored in this component state
    // and empty input coz form was submitted
    
  

  // on input check if its not empty and store single message
  // in this component state
  handleCompose = event => {
    let typedValue = event.target.value;
    if (typedValue != "" && typedValue != " ") {
      // store new single message temporarily
      this.setState({
        message: event.target.value
      });
    }
  };

  render() {
    return (
      // dont use event => handle event below
      // binding won't work here
      <div className="chat-composer">
        <form onSubmit={this.submitted}>
          <input
            className="form-control"
            placeholder="Type & hit enter"
            onChange={this.handleCompose}
            value={this.state.new}
          />
        </form>
        
      </div>
    );
  }
}
