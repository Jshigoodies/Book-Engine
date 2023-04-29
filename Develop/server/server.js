const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas'); //commented out because i don't have these yet


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' }); //not the correct path?
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

startApolloServer(typeDefs, resolvers);
