// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// // const routes = require('./routes');

// const { ApolloServer } = require('apollo-server-express');
// const { typeDefs, resolvers } = require('./schemas'); //commented out because i don't have these yet


// const app = express();
// const PORT = process.env.PORT || 3003;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const startApolloServer = async (typeDefs, resolvers) => {

//   const server = new ApolloServer({ typeDefs, resolvers });

//   await server.start();
//   server.applyMiddleware({ app, path: '/graphql' }); //not the correct path?
  
//   db.once('open', () => {
//     app.listen(PORT, () => {
//       console.log(`🌍 Now listening on localhost:${PORT}`)
//       console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
//     })
//   })
// };
// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/'));
// })


// // app.use(routes);

// startApolloServer(typeDefs, resolvers);





// Copied


const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3003;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'));
})


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
startApolloServer();
