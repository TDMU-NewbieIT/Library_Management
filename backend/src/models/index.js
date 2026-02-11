const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'librarian'], default: 'user' },
  phone: String,
  address: String,
  idCard: String,
  bio: String,
  avatar: String,
  readingGoal: { type: Number, default: 12 },
  booksRead: { type: Number, default: 0 },
  favoriteBooks: [{ type: String }],
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Book Schema
const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  alternativeTitle: String,
  author: {
    name: { type: String, required: true },
    birthYear: Number,
    deathYear: Number,
    era: String,
    portraitUrl: String
  },
  yearOfCreation: String,
  genre: String,
  imageUrl: String,
  literaryPeriod: String,
  language: { type: String, default: 'Tiếng Việt' },
  contentSummary: String,
  artisticValue: String,
  ideologicalValue: String,
  historicalContext: String,
  curriculumLevel: String,
  keywords: [String],
  stock: { type: Number, default: 20 }, // Daily borrow limit
  totalQuantity: { type: Number, default: 1 },
  isAvailable: { type: Boolean, default: true },
  pdfUrl: String,
  chapters: [{
    title: String,
    content: String,
    image: String
  }]
}, { timestamps: true });

// Borrow Schema
const borrowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['borrowing', 'returned', 'overdue'], default: 'borrowing' },
  fee: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 }
}, { timestamps: true });

// News Schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: String,
  author: { type: String, default: 'Ban quản trị' },
  tags: [String],
  type: { type: String, enum: ['news', 'event', 'notice', 'newbook'], default: 'news' },
  isPinned: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// ActivityLog Schema
const activityLogSchema = new mongoose.Schema({
    user: { type: String, required: true },
    userId: { type: String, required: true }, // Store ID as string for easy querying
    action: { type: String, required: true }, // e.g., 'LOGIN', 'BORROW_BOOK', 'UPDATE_PROFILE'
    category: { type: String, required: true }, // e.g., 'AUTH', 'USER', 'BOOK', 'ADMIN'
    detail: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Borrow = mongoose.model('Borrow', borrowSchema);
const News = mongoose.model('News', newsSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = { User, Book, Borrow, News, ActivityLog };
