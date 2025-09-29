const User = require('../models/User');
const Scan = require('../models/Scan');


// Get all users
exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};


// Delete a user
exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
};



  

// Toggle admin status
exports.toggleUserAdmin = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ message: `User is now ${user.isAdmin ? 'an Admin' : 'a Regular User'}` });
};


// Get all scans
exports.getAllScans = async (req, res) => {
    const scans = await Scan.find().populate('user', 'firstName lastName email');
    res.json(scans);
};


// Delete scan
exports.deleteScanById = async (req, res) => {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    await scan.deleteOne();
    res.json({ message: 'Scan deleted' });
};
