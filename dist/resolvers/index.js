import argon2 from "argon2";
import { prisma } from "../index.js";
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
