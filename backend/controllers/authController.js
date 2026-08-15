const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const googleLogin = async (req, res) => {
  try {
    const token = req.body.idToken || req.body.token;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const { sub: oauthId, email, name } = payload;

    let user = await User.findOne({ $or: [{ oauthId }, { email }] });

    if (!user) {
      let role = 'user';
      if (process.env.ADMIN_EMAILS) {
        const admins = process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase());
        if (admins.includes(email.toLowerCase())) {
          role = 'admin';
        }
      }

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        oauthId,
        role,
      });
    } else if (!user.oauthId) {
      user.oauthId = oauthId;
      await user.save();
    }

    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { googleLogin, getMe };