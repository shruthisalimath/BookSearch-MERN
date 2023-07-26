
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
  const userData = data?.me || [];

  // define remove book mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // call remove book
      const { data } = await removeBook({
        variables: { bookId },
      });
      console.log(data);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        {/* use graphql loading paradigm */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2 className="pt-5">
              {userData.savedBooks.length
                ? `Viewing ${userData.savedBooks.length} saved ${
                    userData.savedBooks.length === 1 ? "book" : "books"
                  }:`
                : "You have no saved books!"}
            </h2>
            <Row>
              {userData.savedBooks.map((book) => {
                return (
                  <Col md="4">
                  <Card key={book.bookId} border="dark">
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
                );
              })}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default SavedBooks;