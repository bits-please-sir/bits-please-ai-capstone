import React from "react";

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
  Table,
} from "react-bootstrap";

function Icons() {
  return (
    <>
      <Container fluid>
        <h1> Suggested Resources for Prep</h1>
        <p>Definitely check out the book link below 👇 it is an awesome resource</p>
        <a href="https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850">Cracking the Coding Interview</a>
        <p/>
        <div className="row">
          <div className="col-3">
          <img src="https://pbs.twimg.com/media/ETI02hIXYAAFBtG.jpg" alt="Interview Meme" width="330" height="380"></img>
          </div>
          <div className="col-5">
          <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Challenge</th>
                      <th className="border-0">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Two Sum</td>
                      <td><a href="https://leetcode.com/problems/two-sum/">Link</a></td>
                    </tr>
                    <tr>
                    <td>Reverse Integer</td>
                      <td><a href="https://leetcode.com/problems/reverse-integer/">Link</a></td>
                    </tr>
                    <tr>
                    <td>Container With Most Water</td>
                      <td><a href="https://leetcode.com/problems/container-with-most-water/">Link</a></td>
                    </tr>
                    <tr>
                    <td>Merge k Sorted Lists</td>
                      <td><a href="https://leetcode.com/problems/merge-k-sorted-lists/">Link</a></td>
                    </tr>
                    <tr>
                    <td>Valid Sudoku</td>
                      <td><a href="https://leetcode.com/problems/valid-sudoku/">Link</a></td>
                    </tr>
                    <tr>
                    <td>Wild Card Matching</td>
                      <td><a href="https://leetcode.com/problems/wildcard-matching/">Link</a></td>
                    </tr>
                    <tr>
                    <td>Longest Palindromic String</td>
                      <td><a href="https://leetcode.com/problems/longest-palindromic-substring/">Link</a></td>
                    </tr>
                  </tbody>
                </Table>
                </div>
        </div>
        <p>In memory of Thomas Yoder</p>
                <span>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/GBuHSRDGZBY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/ld0cvWnrVsU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>     
                <iframe width="560" height="315" src="https://www.youtube.com/embed/wwIysnVmAUg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/FowJZqVggCU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </span>
                </Container>
    </>
  );
}

export default Icons;
