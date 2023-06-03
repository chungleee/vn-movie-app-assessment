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
    getAllMovies(searchByName: String, searchByDescription: String): [Movie]
    getMovieById(movieId: String): Movie!
  }

  type Mutation {
    register(username: String, email: String, password: String): RegisteredOrLoginUser!
    
    login(email: String, password: String): RegisteredOrLoginUser!

    updatePassword(oldPassword: String, newPassword:String): User

    createMovie(movieName: String, description: String, directorName: String, releaseDate: String): Movie!

    updateMovie(movieId: String, movieName: String, description: String): Movie!

    deleteMovieById(movieId: String): Movie
  }
`;
