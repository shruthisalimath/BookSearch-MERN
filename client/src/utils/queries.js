//setup for react and Apollo client
import { gql } from "@appolo/client";

// setup for User data and any saved book data
// loads in 'SavedBooks.js'
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      password
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;