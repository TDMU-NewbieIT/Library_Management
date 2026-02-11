const { Book, Borrow, News, ActivityLog } = require("../models/index");

const createLog = async (data) => {
  try {
    const newLog = new ActivityLog(data);
    await newLog.save();
  } catch (error) {
    console.error('Failed to save activity log:', error);
  }
};

// --- Book Management Section ---

exports.getAllBooks = async (req, res) => {
  try {
    // Get start of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const books = await Book.aggregate([
      {
        $lookup: {
          from: 'borrows',
          let: { bookId: '$bookId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$bookId', '$$bookId'] },
                    { $gte: ['$borrowDate', startOfDay] },
                    { $lte: ['$borrowDate', endOfDay] }
                  ]
                }
              }
            }
          ],
          as: 'dailyBorrows'
        }
      },
      {
        $addFields: {
          dailyBorrowCount: { $size: '$dailyBorrows' },
          stock: { $ifNull: ['$stock', 20] } // Default to 20 if stock is missing
        }
      },
      {
        $addFields: {
          // Temporarily override stock with available count for frontend compatibility
          // Real logic: stock is the LIMIT. available is LIMIT - COUNT.
          // But frontend expects 'stock' to be the available amount.
          // Let's keep 'stock' as the LIMIT in the DB, but send 'stock' as AVAILABLE to frontend?
          // No, better to send 'stock' as LIMIT and 'availableToday' as available.
          // But for now to avoid breaking frontend immediately:
          availableToday: { $subtract: ['$stock', '$dailyBorrowCount'] }
        }
      }
    ]);
    
    // Map to ensure availableToday is not negative (though it shouldn't be)
    const processedBooks = books.map(b => ({
      ...b,
      // Frontend uses 'stock' to display "Còn X cuốn". 
      // We should probably send 'stock' as the remaining available slots for today if we want minimal frontend changes?
      // Or better, let's update frontend to use availableToday if present, or just swap it here.
      // Let's swap it: Send `stock` as the AVAILABLE AMOUNT today.
      // And send `limit` as the CONFIG LIMIT.
      dailyLimit: b.stock, 
      stock: Math.max(0, b.stock - b.dailyBorrowCount),
      totalQuantity: b.totalQuantity // Unlimited/Display only
    }));

    res.status(200).json(processedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    let book;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      book = await Book.findById(id);
    } else {
      book = await Book.findOne({ bookId: id });
    }
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookContent = async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Format response for Reader frontend
    const response = {
      title: book.title,
      author: typeof book.author === 'string' ? book.author : (book.author?.name || 'Unknown Author'),
      chapters: book.chapters && book.chapters.length > 0 ? book.chapters : [
        // Fallback if no chapters exist
        {
          title: "Giới thiệu",
          content: book.contentSummary || "Nội dung đang được cập nhật...",
          image: book.imageUrl
        }
      ]
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    await createLog({ user: req.user?.name || 'Admin', userId: req.user?._id || savedBook._id, action: 'CREATE_BOOK', category: 'BOOK', detail: `Thêm sách mới: ${savedBook.title} (${savedBook.bookId})`, status: 'SUCCESS' });
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedBook;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updatedBook = await Book.findOneAndUpdate({ bookId: id }, req.body, { new: true });
    }
    
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    await createLog({ user: req.user?.name || 'Admin', userId: req.user?._id || updatedBook._id, action: 'UPDATE_BOOK', category: 'BOOK', detail: `Cập nhật thông tin sách: ${updatedBook.title} (${updatedBook.bookId})`, status: 'SUCCESS' });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    let deletedBook;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deletedBook = await Book.findByIdAndDelete(id);
    } else {
      deletedBook = await Book.findOneAndDelete({ bookId: id });
    }

    if (!deletedBook) {
        console.warn(`Attempted to delete book but not found: ${id}`);
        return res.status(404).json({ message: "Book not found" });
    }
    
    await createLog({ user: req.user?.name || 'Admin', userId: req.user?._id || deletedBook._id, action: 'DELETE_BOOK', category: 'BOOK', detail: `Xóa sách: ${deletedBook.title} (${deletedBook.bookId})`, status: 'SUCCESS' });
    console.log(`Successfully deleted book: ${deletedBook.title} (${deletedBook.bookId})`);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(`Error deleting book ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query, genre, author, sortBy } = req.query;
    let filter = {};
    if (query) {
      filter.$or = [{ title: { $regex: query, $options: 'i' } }, { alternativeTitle: { $regex: query, $options: 'i' } }, { 'author.name': { $regex: query, $options: 'i' } }, { keywords: { $in: [new RegExp(query, 'i')] } }];
    }
    if (genre) filter.genre = { $regex: genre, $options: 'i' };
    if (author) filter['author.name'] = { $regex: author, $options: 'i' };

    let sort = {};
    switch (sortBy) {
      case 'title-asc': sort = { title: 1 }; break;
      case 'title-desc': sort = { title: -1 }; break;
      case 'year-asc': sort = { yearOfCreation: 1 }; break;
      case 'year-desc': sort = { yearOfCreation: -1 }; break;
      default: sort = { title: 1 };
    }
    const books = await Book.find(filter).sort(sort);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUniqueAuthors = async (req, res) => {
  try {
    const authors = await Book.aggregate([
      {
        $group: {
          _id: "$author.name",
          data: { $first: "$author" }
        }
      },
      {
        $replaceRoot: { newRoot: "$data" }
      },
      {
        $sort: { name: 1 }
      }
    ]);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Borrow Management Section ---

exports.borrowBook = async (req, res) => {
  try {
    const { bookId, userId, fee } = req.body;
    const book = await Book.findOne({ bookId });
    if (!book) return res.status(404).json({ message: "Sách không tồn tại" });

    // Check DAILY borrow limit
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dailyCount = await Borrow.countDocuments({
      bookId,
      borrowDate: { $gte: startOfDay }
    });

    const dailyLimit = book.stock || 20; // Default 20 if not set

    if (dailyCount >= dailyLimit) {
      return res.status(400).json({ message: `Hôm nay đã hết lượt mượn cho sách này (Giới hạn ${dailyLimit}/ngày). Vui lòng quay lại vào ngày mai.` });
    }

    const existingBorrow = await Borrow.findOne({ userId, bookId, status: 'borrowing' });
    if (existingBorrow) return res.status(400).json({ message: "Bạn đang mượn sách này rồi" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyBorrowCount = await Borrow.countDocuments({ userId, borrowDate: { $gte: sevenDaysAgo } });
    if (weeklyBorrowCount >= 20) return res.status(400).json({ message: "Bạn đã đạt giới hạn mượn tối đa 20 cuốn sách trong tuần này. Vui lòng quay lại sau." });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const borrow = new Borrow({ userId, bookId, bookTitle: book.title, dueDate, fee: fee || 0, status: 'borrowing' });
    
    // DO NOT Decrement stock permanently. Stock is now the Daily Limit.
    // just save borrow
    await borrow.save();
    res.status(201).json({ message: "Mượn sách thành công!", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) return res.status(404).json({ message: "Không tìm thấy bản ghi mượn sách" });

    const now = new Date();
    let lateFee = 0;
    if (now > borrow.dueDate) {
      const daysLate = Math.ceil((now - borrow.dueDate) / (1000 * 60 * 60 * 24));
      lateFee = daysLate * 5000;
    }

    borrow.returnDate = now;
    borrow.status = 'returned';
    borrow.lateFee = lateFee;
    await borrow.save();

    // Increment stock - REMOVED because stock is now daily limit
    // const book = await Book.findOne({ bookId: borrow.bookId });
    // if (book) {
    //   book.stock += 1;
    //   book.isAvailable = true;
    //   await book.save();
    // }

    res.json({ message: "Trả sách thành công!", borrow, lateFee: lateFee > 0 ? `Phí trễ hạn: ${lateFee.toLocaleString()} VND` : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBorrows = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    let filter = { userId };
    if (status && status !== 'all') filter.status = status;
    const borrows = await Borrow.find(filter).sort({ borrowDate: -1 });
    const now = new Date();
    for (let borrow of borrows) {
      if (borrow.status === 'borrowing' && now > borrow.dueDate) {
        borrow.status = 'overdue';
        await borrow.save();
      }
    }
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find().populate('userId', 'name email').sort({ borrowDate: -1 });
    
    // Auto-update overdue status
    const now = new Date();
    let updated = false;
    for (let borrow of borrows) {
      if (borrow.status === 'borrowing' && now > borrow.dueDate) {
        borrow.status = 'overdue';
        await borrow.save();
        updated = true;
      }
    }
    
    // If updates happened, we might want to refetch or just return the modified array (which is already modified in memory)
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- News Management Section ---

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ isPinned: -1, createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    const savedNews = await news.save();
    await createLog({ user: req.user?.name || 'Admin', userId: req.user?._id || savedNews._id, action: 'CREATE_NEWS', category: 'NEWS', detail: `Đăng tin tức mới: ${savedNews.title}`, status: 'SUCCESS' });
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { title, content, summary, imageUrl, author, tags, type, isPinned, isPublished } = req.body;
    const news = await News.findByIdAndUpdate(req.params.id, { title, content, summary, imageUrl, author, tags, type, isPinned, isPublished }, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });
    await createLog({ user: req.user?.name || 'Admin', userId: req.user?._id || news._id, action: 'UPDATE_NEWS', category: 'NEWS', detail: `Cập nhật tin tức: ${news.title}`, status: 'SUCCESS' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    await createLog({ user: req.user?.name || 'Admin', userId: req.user?._id || news._id, action: 'DELETE_NEWS', category: 'NEWS', detail: `Xóa tin tức: ${news.title}`, status: 'SUCCESS' });
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
