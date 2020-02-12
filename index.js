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

server.post('/api/posts/:id/comments', async (req, res, next) => {
    try {
        const { id } = req.params
        const { text } = req.body

        if (!text) {
            return res.status(400).json({ errorMessage: 'Please provide text for the comment.' })
        }

        const post = await findById(id)

        if (post.length === 0) {
            const noSuchPost = new Error('The post with the specified ID does not exist.')
            noSuchPost.httpStatusCode = 404
            throw noSuchPost
        }

        const newComment = await insertComment({ ...req.body, post_id: id })

        res.status(201).json(newComment)

    } catch (e) {
        if (e.httpStatusCode !== 500) {
            return next(e)
        }
        next(new Error('There was an error while saving the comment to the database'))
    }
})

server.get('/api/posts', async (req, res, next) => {
    try {
        const posts = await find()

        res.json(posts)
    } catch (e) {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    }
})

server.get('/api/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const post = await findById(id)

        if (post.length === 0) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." })
        }

        res.json(post)
    } catch (e) {
        res.statsu(500).json({ error: "The post information could not be retrieved." })
    }
})

server.get('/api/posts/:id/comments', async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await findById(id)

        if (post.length === 0) {
            return res.status(400).json({ message: "The post with the specified ID does not exist." })
        }

        const comments = await findCommentById(id)

        res.json(comments)
    } catch (e) {
        res.stats(500).json({ error: "The comments information could not be retrieved." })
    }
})

server.delete('/api/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const postToDelete = await findById(id)

        if (!id) {
            res.stats(404).json({ message: "The post with the specified ID does not exist." })
        }

        const removed = await remove(id)

        return res.json(postToDelete)

    } catch (e) {
        return res.stats(500).json({ error: "The post could not be removed" })
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
