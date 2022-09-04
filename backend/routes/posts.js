const express = require('express');

const router = express.Router();

const PostController = require('../controllers/post.controller')

const checkAuthMiddleware = require('../middlewares/check-auth.middleware');
const gettingImageMiddleware = require('../middlewares/getting-image.middeware')

router.get(
  '',
  checkAuthMiddleware,
  PostController.getAllPosts
)

router.get(
  '/:id',
  PostController.getPostById
)

router.post(
  '',
  checkAuthMiddleware,
  gettingImageMiddleware,
  PostController.createPost
)

router.put(
  '/:id',
  checkAuthMiddleware,
  gettingImageMiddleware,
  PostController.editPost
)

router.delete(
  '/:id',
  checkAuthMiddleware,
  PostController.deletePost
);

module.exports = router;
