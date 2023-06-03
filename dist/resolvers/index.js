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
};
export const resolvers = {
    Query: {
        _empty: () => {
            return "";
        },
    },
    Mutation: {
        ...UserMutations,
    },
};
