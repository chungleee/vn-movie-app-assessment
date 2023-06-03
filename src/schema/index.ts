export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    movies: [Movie]
  }
  type Query {
    _empty:String
  }
`;
