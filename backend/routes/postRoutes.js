const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', protect, adminOnly, createPost);
router.put('/:id', protect, adminOnly, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

module.exports = router;