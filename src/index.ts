import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import "dotenv/config.js";

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// prisma client setup and export
export const prisma = new PrismaClient();

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		try {
			const token = req.headers.authorization || "";
			let user = {};

			if (!token) {
				return {};
			} else {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);

				user = await prisma.user.findUnique({
					where: {
						id: decoded.id,
					},
					select: { id: true, email: true },
				});
			}

			return { user };
		} catch (error) {
			throw new GraphQLError(error);
		}
	},
});

console.log(`Server ready at ${url}`);
