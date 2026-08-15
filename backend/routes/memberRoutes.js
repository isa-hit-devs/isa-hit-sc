const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', getMembers);
router.get('/:id', getMemberById);

router.post('/', protect, adminOnly, createMember);
router.put('/:id', protect, adminOnly, updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;
