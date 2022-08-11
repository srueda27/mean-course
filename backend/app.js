const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json())

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post)

  res.status(201).json({
    message: 'Post added'
  })
})

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'sdfln23',
      title: 'title',
      content: 'content',
    },
    {
      id: 'sdfs23423',
      title: 'title 2',
      content: 'content 2'
    }
  ]

  res.status(200).json({
    message: 'Posts fetched',
    posts
  });
})

module.exports = app;
