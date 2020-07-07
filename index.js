const express = require('express');
const postsRouter = require('./data/seeds/postsRouter.js')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`<h2>Blog Posts</h>`);
});

server.use('/api/posts', postsRouter);

server.listen(8000, () => {
    console.log('\n*** Server Running on http://localhost:8000 ***\n');
})