import React from "react";
import FileUpload from "../components/Forms/FileUpload.js";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";

function TableList() {
  return (
    <>
      <Container fluid>
        
        <FileUpload/>
      {/* <Form>
        <Form.Group>
        <div className="mb-3">
          <Form.File id="formcheck-api-regular">
            <Form.File.Label>Please Upload a .pdf Resume/CV</Form.File.Label>
            <Form.File.Input />
          </Form.File>
        </div>
        </Form.Group>
      </Form> */}
        
      </Container>
    </>
  );
}

export default TableList;
