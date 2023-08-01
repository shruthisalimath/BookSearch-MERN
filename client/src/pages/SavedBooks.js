import React from "react";
import {
  Container,
  Col,
  Row,
  Card,
  Button,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

// add apollo graphql
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutation";

const SavedBooks = () => {
  // define Get Me api call
  const { loading, data } = useQuery(GET_ME);
  console.log("LOADING: ", loading);
  console.log("DATA: ", data);
  let userData = data?.me || {};

  // define remove book mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async bookId => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.log("FALSE: ", false)
      return false;
    }

    try {
      // call remove book
      const { user } = await removeBook({
        variables: { bookId: bookId },
      });
      console.log(user);
      // upon success, remove book's id from localStorage
      userData = user;
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if(loading) {
    return <h2>LOADING...</h2>
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
          <>
            <h2 className="pt-5">
              {userData.savedBooks?.length
                ? `Viewing ${userData.savedBooks.length} saved ${
                    userData.savedBooks.length === 1 ? "book" : "books"
                  }:`
                : "You have no saved books!"}
            </h2>
            <Row>
              {userData.savedBooks?.map((book) => (
                //return (
                  <Col key={book.bookId} md="4">
                  <Card  border="dark">
                    {book.image ? (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className="small">Authors: {book.authors}</p>
                      <Card.Text>
                        {book.description}
                        <br />
                        <a href={book.link} target="_blank" rel="noreferrer">
                          Preview on Google Books
                        </a>
                      </Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                  </Col>
              ))}
            </Row>
          </>        
      </Container>
    </>
  );
};

export default SavedBooks;