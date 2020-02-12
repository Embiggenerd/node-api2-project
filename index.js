const express = require('express')
const {
    find,
    findById,
    insert,
    update,
    remove,
    findPostComments,
    findCommentById,
    insertComment,
} = require('./data/db')
const server = express();
const apiRouter = require('./api')
// const hubsRouter = require('./hu')

server.use(express.json());

// server.use('/api/db', hubsRouter)

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

server.use('/api', apiRouter)

server.use((err, req, res, next) => {
    res.status(err.httpStatusCode || 500).json({
        errorMessage: err.message
    })
})

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

server.listen(4000, () => {
    console.log('\n*** Server Running on http://localhost:4000 ***\n');
});
