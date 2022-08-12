const express = require('express');

const Post = require('../models/post.model');

const router = express.Router();

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched',
        posts: documents
      });
    })
    .catch(err => {
      console.log(err)
    });
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  })
})

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then(result => {
    res.status(201).json({
      message: 'Post added',
      postId: result._id
    })
  });
})

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne(
    {
      _id: req.params.id
    },
    post
  ).then(result => {
    console.log(result)
    res.status(200).json({ message: 'Update' })
  })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  })
    .then(result => {
      res.status(200).json({
        message: 'Post deleted'
      })
    })
});

module.exports = router;
