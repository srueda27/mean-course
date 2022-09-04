const Post = require('../models/post.model');

function getAllPosts(req, res, next) {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find({}, {
    '__v': 0
  })
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .sort({
        createdAt: 'asc'
      })
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents.map(fetchedPost => {
        const post = { ...fetchedPost._doc }

        let canEdit = false
        if (req.userData && req.userData.userId == post.creator) {
          canEdit = true
        }

        delete post.creator
        post.canEdit = canEdit
        return post
      })

      return Post.count()
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(err => {
      console.log(err)
    });
}

function getPostById(req, res, next) {
  Post.findById(req.params.id, { '__v': 0 }).then(fetchedPost => {
    if (fetchedPost) {
      const post = { ...fetchedPost._doc }
      delete post.creator
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  })
}

function createPost(req, res, next) {
  if (!req.userData) {
    res.status(401).json({ message: 'You are not authorized' })
  }

  const url = `${req.protocol}://${req.get('host')}`

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId
  });

  post.save()
    .then(result => {
      res.status(201).json({
        message: 'Post added',
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath
        }
      })
    })
    .catch(error => {
      res.status(500).json({ message: 'Creating a post failed!' })
    });
}

function editPost(req, res, next) {
  if (!req.userData) {
    res.status(401).json({ message: 'You are not authorized' })
  }

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
      creator: req.userData.userId
    },
    post
  )
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Update succesful!' })
      } else {
        res.status(401).json({ message: 'Unauthorized User' })
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Updating a post failed!' })
    });
}

function deletePost(req, res, next) {
  if (!req.userData) {
    res.status(401).json({ message: 'You are not authorized' })
  }

  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Post deleted' })
      } else {
        res.status(401).json({ message: 'Unauthorized User' })
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Deleting a post failed!' })
    });
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  deletePost
}
