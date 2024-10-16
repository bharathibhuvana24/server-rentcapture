import bcrypt from 'bcryptjs';
import User from '../model/user.model.js';

export const createTemporaryAdmin = async (req, res) => {
  console.log('Creating temporary admin');
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role: 'admin' });
    await newUser.save();
    res.status(201).json({ message: 'Temporary admin created successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed!' });
  }
};
