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
} = require('../data/db')

const router = express.Router()

router.post('/posts', async (req, res, next) => {
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

router.post('/posts/:id/comments', async (req, res, next) => {
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

router.get('/posts', async (req, res, next) => {
    try {
        const posts = await find()

        res.json(posts)
    } catch (e) {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    }
})

router.get('/posts/:id', async (req, res, next) => {
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

router.get('/posts/:id/comments', async (req, res, next) => {
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

router.delete('/posts/:id', async (req, res, next) => {
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

router.put('/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const foundPost = await findById(id)
        console.log('foundPost', foundPost)

        if (foundPost.length === 0) {
            return res.status(404).json({ message: "The post with the specified ID does not exist." })
        }

        const { title, contents } = req.body
        console.log('req.body', req.body)
        if (!title || !contents) {
            return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }

        const updated = await update(id, req.body)
        console.log('update', updated)
        const updatedPost = await findById(id)
        console.log('updatedPost', updatedPost)
        return res.json(updatedPost)
    } catch (e) {
        next(e)
    }
})

module.exports = router