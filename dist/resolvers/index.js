import argon2 from "argon2";
import { prisma } from "../index.js";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
const UserMutations = {
    register: async (parent, { username, email, password }, contextValue) => {
        const hash = await argon2.hash(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hash,
            },
        });
        delete user.password;
        return user;
    },
    login: async (parent, { email, password }, contextValue) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (await argon2.verify(user.password, password)) {
                const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                console.log(token);
                return { ...user, token };
            }
            else {
                throw new GraphQLError("Email or password is incorrect", {
                    extensions: {
                        code: "BAD_REQUEST",
                    },
                });
            }
        }
        catch (error) {
            console.log("error: ", error);
            return error;
        }
    },
    updatePassword: async (parent, { oldPassword, newPassword }, contextValue) => {
        try {
            if (!contextValue.user) {
                throw new GraphQLError("Please log in");
            }
            const { password } = await prisma.user.findUnique({
                where: {
                    id: contextValue.user.id,
                },
                select: {
                    password: true,
                },
            });
            if (await argon2.verify(password, oldPassword)) {
                const updatedUser = await prisma.user.update({
                    where: {
                        id: contextValue.user.id,
                    },
                    data: {
                        password: await argon2.hash(newPassword),
                    },
                });
                return updatedUser;
            }
            else {
                throw new GraphQLError("Old password incorrect");
            }
        }
        catch (error) {
            return error;
        }
    },
};
const MovieMutations = {
    createMovie: async (parent, args, { user }) => {
        try {
            if (!user) {
                throw new GraphQLError("Please log in");
            }
            const newMovie = await prisma.movie.create({
                data: {
                    ...args,
                    releaseDate: new Date(args.releaseDate),
                    movieOwner: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
            return newMovie;
        }
        catch (error) {
            return error;
        }
    },
    updateMovie: async (parent, { movieId, ...args }, { user }) => {
        try {
            if (!user)
                throw new GraphQLError("Please log in");
            let fieldsToUpdate = {};
            for (let key in args) {
                console.log("key", key);
                if (args[key]) {
                    fieldsToUpdate[key] = args[key];
                }
            }
            const movie = await prisma.movie.findUnique({
                where: { id: parseInt(movieId) },
            });
            if (movie.movieOwnerId !== user.id) {
                throw new GraphQLError("You are not authorized");
            }
            const updatedMovie = await prisma.movie.update({
                where: {
                    id: parseInt(movieId),
                },
                data: {
                    ...fieldsToUpdate,
                },
                include: {
                    movieOwner: true,
                },
            });
            return updatedMovie;
        }
        catch (error) {
            return error;
        }
    },
    deleteMovieById: async (parent, { movieId }, { user }) => {
        try {
            if (!user)
                throw new GraphQLError("Please log in");
            console.log(user);
            const movie = await prisma.movie.findUnique({
                where: { id: parseInt(movieId) },
            });
            if (movie.movieOwnerId !== user.id) {
                throw new GraphQLError("You are not authorized");
            }
            const deletedMovie = await prisma.movie.delete({
                where: { id: parseInt(movieId) },
            });
            if (!deletedMovie)
                throw new GraphQLError("Movie not found");
            return deletedMovie;
        }
        catch (error) {
            return error;
        }
    },
};
export const resolvers = {
    Query: {
        _empty: () => {
            return "";
        },
    },
    Mutation: {
        ...UserMutations,
        ...MovieMutations,
    },
};
