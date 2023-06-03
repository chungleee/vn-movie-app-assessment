import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// prisma client setup and export
export const prisma = new PrismaClient();
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`Server ready at ${url}`);
