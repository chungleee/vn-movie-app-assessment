export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    movies: [Movie]
  }
  
   type Movie {
    id: String!
    movieName: String!
    description: String!
    directorName: String!
    releaseDate: String
    movieOwner: User
  }

  type RegisteredOrLoginUser {
    id: String!
    username:String!
    email:String!
    token: String
  }

  type Query {
    _empty:String
  }

  type Mutation {
    register(username: String, email: String, password: String): RegisteredOrLoginUser!
  }
`;
