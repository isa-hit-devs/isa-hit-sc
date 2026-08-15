const Member = require('../models/member');

const getMembers = async (req, res) => {
  try {
    const { category, position } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (position) filter.position = position;

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch member' });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, image, category, position } = req.body;

    if (!name || !image || !category || !position) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const member = await Member.create({ name, image, category, position });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete member' });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
