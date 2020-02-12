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

// const hubsRouter = require('./hu')

server.use(express.json());

// server.use('/api/db', hubsRouter)

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

server.post('/api/posts', async (req, res, next) => {
    try {
        const { title, contents } = req.body
        if (!title || !contents) {
            const noTitleOrContents = new Error('Please provide title and contents for the post.')
            noTitleOrContents.httpStatusCode = 400
            throw noTitleOrContents
        }
        const { id } = await insert(req.body)

        const newPost = await findById(id)
        res.status(201).json(newPost)

    } catch (e) {
        if (e.httpStatusCode !== 500) {
            return next(e)
        }
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    }
})

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
