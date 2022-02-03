const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers, db } = require("./index");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ db }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 schema ready at ${url}`);
});
