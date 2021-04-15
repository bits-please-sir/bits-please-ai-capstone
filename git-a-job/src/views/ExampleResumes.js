import React, {Component} from "react";
import ReactDOM from "react-dom";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";


import ChatWindow from "./ChatWindow";
import ChatComposer from "./ChatComposer";

export default class App extends Component {
  constructor(props) {
      super(props);
  };
  
  render(){
    return(
      <div>
         <h1>
        Example Resumes
        </h1>
        <h4>
        You can even download to try them out!
        </h4>
        <iframe src="https://drive.google.com/file/d/1Uf8VvvpsMfNYaAiRoQgeCSNX9-JhR1En/preview" width="320" height="360"></iframe>
        <iframe src="https://drive.google.com/file/d/1g5vuDF2xzURlbYQJJaLXLh3vfNvYgze5/preview" width="320" height="360"></iframe>   
        <iframe src="https://drive.google.com/file/d/1aS0XgQa7jGd6JcH-RLSz0w6_h35vOuR-/preview" width="320" height="360"></iframe>    
        <iframe src="https://drive.google.com/file/d/1kTqbY-5hiBIIkK1C_2B668TxZH7HefGh/preview" width="320" height="360"></iframe>
        <iframe src="https://drive.google.com/file/d/1UCXsv8PY_ZuKigLpnKHKo2fiFVFuMzOY/preview" width="320" height="360"></iframe>
        <div/>
        <a href="https://www.cmu.edu/career/documents/sample-resumes-cover-letters/sample-resumes_scs.pdf">Sources</a>
      </div>
    );
  }
}
// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

  //return (
   // <>
     // <Container fluid>
      //<h1>Betty The HR Rep</h1>
       // {/* send stored messages as props to chat window */}
       // <ChatWindow messagesList={messages} />
       // {/* send submitted props to chat composer */}
       // <ChatComposer submitted={} />
        /* <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Light Bootstrap Table Heading</Card.Title>
                <p className="card-category">
                  Created using Montserrat Font Family
                </p>
              </Card.Header>
              <Card.Body>
                <div className="typography-line">
                  <h1>
                    <span>Header 1</span>
                    The Life of Light Bootstrap Dashboard React
                  </h1>
                </div>
                <div className="typography-line">
                  <h2>
                    <span>Header 2</span>
                    The Life of Light Bootstrap Dashboard React
                  </h2>
                </div>
                <div className="typography-line">
                  <h3>
                    <span>Header 3</span>
                    The Life of Light Bootstrap Dashboard React
                  </h3>
                </div>
                <div className="typography-line">
                  <h4>
                    <span>Header 4</span>
                    The Life of Light Bootstrap Dashboard React
                  </h4>
                </div>
                <div className="typography-line">
                  <h5>
                    <span>Header 5</span>
                    The Life of Light Bootstrap Dashboard React
                  </h5>
                </div>
                <div className="typography-line">
                  <h6>
                    <span>Header 6</span>
                    The Life of Light Bootstrap Dashboard React
                  </h6>
                </div>
                <div className="typography-line">
                  <p>
                    <span>Paragraph</span>I will be the leader of a company that
                    ends up being worth billions of dollars, because I got the
                    answers. I understand culture. I am the nucleus. I think
                    that’s a responsibility that I have, to push possibilities,
                    to show people, this is the level that things could be at.
                  </p>
                </div>
                <div className="typography-line">
                  <span>Quote</span>
                  <blockquote>
                    <p className="blockquote blockquote-primary">
                      "I will be the leader of a company that ends up being
                      worth billions of dollars, because I got the answers. I
                      understand culture. I am the nucleus. I think that’s a
                      responsibility that I have, to push possibilities, to show
                      people, this is the level that things could be at."{" "}
                      <br></br>
                      <br></br>
                      <small>- Noaa</small>
                    </p>
                  </blockquote>
                </div>
                <div className="typography-line">
                  <span>Muted Text</span>
                  <p className="text-muted">
                    I will be the leader of a company that ends up being worth
                    billions of dollars, because I got the answers...
                  </p>
                </div>
                <div className="typography-line">
                  <span>Primary Text</span>
                  <p className="text-primary">
                    I will be the leader of a company that ends up being worth
                    billions of dollars, because I got the answers...
                  </p>
                </div>
                <div className="typography-line">
                  <span>Info Text</span>
                  <p className="text-info">
                    I will be the leader of a company that ends up being worth
                    billions of dollars, because I got the answers...
                  </p>
                </div>
                <div className="typography-line">
                  <span>Success Text</span>
                  <p className="text-success">
                    I will be the leader of a company that ends up being worth
                    billions of dollars, because I got the answers...
                  </p>
                </div>
                <div className="typography-line">
                  <span>Warning Text</span>
                  <p className="text-warning">
                    I will be the leader of a company that ends up being worth
                    billions of dollars, because I got the answers...
                  </p>
                </div>
                <div className="typography-line">
                  <span>Danger Text</span>
                  <p className="text-danger">
                    I will be the leader of a company that ends up being worth
                    billions of dollars, because I got the answers...
                  </p>
                </div>
                <div className="typography-line">
                  <h2>
                    <span>Small Tag</span>
                    Header with small subtitle <br></br>
                    <small>Use "small" tag for the headers</small>
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
      //  </Row> */
      //</Container>
    //</>
  //);
//}


