const Post = require('../models/post');

const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const posts = await Post.find(filter).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, image, description, category } = req.body;

    if (!title || !image || !description || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const post = await Post.create({ title, image, description, category });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};