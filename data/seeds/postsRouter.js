const express = require('express');

const Posts = require('../db')

const router = express.Router();

router.post('/', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.insert(req.body)
            .then((post) => {
                res.status(201).json(post)
            }).catch(error => {
                console.log(error)
                res.status(500).json({ errorMessage: "There was an error while saving the post to the database" })
            })
    }
})

router.post('/:id/comments', (req, res) => {
    const newComment = req.body;
    if (!newComment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Posts.insertComment(req.body)
            .then((post) => {
                if (post) {
                    res.status(201).json(post)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            }).catch(error => {
                console.log(error)
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    }
})

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        }).catch(error => {
            console.log(error);
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.paramas.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }).catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }).catch(error => {
            console.log(error);
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json(count)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }).catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" })
        })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    !changes.title || !changes.contents ?
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        : Posts.update(req.params.id, changes)
            .then((post) => {
                if (post) {
                    res.status(200).json(post)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            }).catch(error => {
                console.log(error)
                res.status(500).json({ error: "The post information could not be modified." })
            })
})

module.exports = router;