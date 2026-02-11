const { User, Book, Borrow, ActivityLog } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createLog = async (data) => {
  try {
    const newLog = new ActivityLog(data);
    await newLog.save();
  } catch (error) {
    console.error('Failed to save activity log:', error);
  }
};

// --- Auth Section ---

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, idCard } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Người dùng đã tồn tại' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, phone, address, idCard });
    await user.save();
 
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }

    if (email === 'admin@library.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
 
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập' });
  }
};

// --- Profile Section ---

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId || req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, avatar, readingGoal } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { name, phone, address, bio, avatar, readingGoal }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Cập nhật thành công!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Favorites Section ---

exports.addFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    if (!user.favoriteBooks.includes(bookId)) {
      user.favoriteBooks.push(bookId);
      await user.save();
    }
    res.json({ message: "Đã thêm vào yêu thích!", favorites: user.favoriteBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    user.favoriteBooks = user.favoriteBooks.filter(id => id !== bookId);
    await user.save();
    res.json({ message: "Đã xóa khỏi yêu thích!", favorites: user.favoriteBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    
    // Get favorite bookIds
    const favoriteBookIds = user.favoriteBooks || [];

    // Get active borrowings using the user's ObjectId
    const activeBorrows = await Borrow.find({ 
      userId: user._id, 
      status: { $in: ['borrowing', 'overdue'] } 
    }).select('bookId');
    
    const borrowedBookIds = activeBorrows.map(b => b.bookId);

    // Combine and deduplicate
    const allBookIds = [...new Set([...favoriteBookIds, ...borrowedBookIds])];

    // Find all books that have these bookIds
    const books = await Book.find({ bookId: { $in: allBookIds } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Stats & Tracking Section ---

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const totalBorrows = await Borrow.countDocuments({ userId: req.params.userId });
    const currentBorrows = await Borrow.countDocuments({ userId: req.params.userId, status: 'borrowing' });
    const overdueBorrows = await Borrow.countDocuments({ userId: req.params.userId, status: 'overdue' });

    res.json({
      booksRead: user.booksRead,
      readingGoal: user.readingGoal,
      favoriteCount: user.favoriteBooks.length,
      totalBorrows,
      currentBorrows,
      overdueBorrows,
      memberSince: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHeartbeat = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { lastActive: Date.now() }, { new: true });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Heartbeat updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { avatar }, 
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    
    res.json({ message: "Cập nhật ảnh đại diện thành công!", avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
