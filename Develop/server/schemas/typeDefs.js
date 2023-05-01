const { gql } = require('apollo-server-express');

// they didn't tell me to add the getUserbyID. It's not a mutation, it's a query

const typeDefs = gql`
    type Query {
        me: User
    }
  
    type Mutation {
        login(email: String!, password: String!): Auth


        createUser(username: String!, email: String!, password: String!): Auth


        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
  
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
  
    input BookInput {
        authors: [String]!
        description: String!
        title: String!
        bookId: String!
        image: String
        link: String
    }
  
    type Book {
        bookId: String!
        authors: [String]!
        description: String!
        title: String!
        image: String
        link: String
    }
  
    type Auth {
        token: String!
        user: User
    }
`;

module.exports = typeDefs;