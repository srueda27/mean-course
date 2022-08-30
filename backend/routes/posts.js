const express = require('express');
const multer = require('multer');

const Post = require('../models/post.model');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime type')

    if (isValid) {
      error = null
    }

    callback(error, "backend/images")
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched',
        posts: documents.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          }
        })
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

router.post('', multer({ storage }).single('image'), (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`
  });

  post.save().then(result => {
    res.status(201).json({
      message: 'Post added',
      post: {
        id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath,
      }
    })
  });
})

router.put('/:id', multer({ storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`
    imagePath = `${url}/images/${req.file.filename}`
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath
  });

  Post.updateOne(
    {
      _id: req.params.id,
    },
    post
  ).then(result => {
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
