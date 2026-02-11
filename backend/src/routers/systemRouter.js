const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Book, News, User, Borrow, ActivityLog } = require('../models/index');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

// Helper to seed news data (mirrors seedNews.js logic)
const newsData = [
    {
        title: "Ngày hội đọc sách 2026: Kết nối di sản văn học",
        summary: "Sự kiện lớn nhất năm thu hút hàng ngàn độc giả tham gia với các hoạt động triển lãm sách quý hiếm và thảo luận cùng các chuyên gia.",
        content: "Chúng tôi hân hạnh thông báo Ngày hội đọc sách 2026 sẽ diễn ra vào tháng tới. Đây là cơ hội để các bạn tiếp cận với những bản thảo cổ và các tác phẩm di sản chưa từng được công bố rộng rãi. Chương trình bao gồm các buổi tọa đàm về bảo tồn văn học và workshop sáng tác trẻ.",
        type: 'event',
        isPinned: true,
        author: 'Ban tổ chức'
    },
    {
        title: "Khai trương phòng đọc kỹ thuật số LiteraryHub",
        summary: "Trải nghiệm không gian đọc sách hiện đại với hàng ngàn đầu sách e-book và audio book chất lượng cao hoàn toàn miễn phí.",
        content: "Từ ngày 15/02, LiteraryHub chính thức đi vào hoạt động phòng đọc kỹ thuật số. Độc giả có thể mượn máy tính bảng và sử dụng thư viện điện tử của chúng tôi ngay tại chỗ. Đây là bước tiến quan trọng trong việc hiện đại hóa thư viện di sản.",
        type: 'notice',
        isPinned: true,
        author: 'Admin'
    },
    {
        title: "Giao lưu cùng Tác giả trẻ: Hơi thở đương đại trong văn thơ",
        summary: "Buổi gặp gỡ thân mật cùng các cây bút trẻ đang làm mới nền văn học Việt Nam.",
        content: "Tham gia buổi giao lưu để lắng nghe những chia sẻ về hành trình sáng tác và cách các tác giả trẻ lồng ghép yếu tố di sản vào tác phẩm hiện đại. Buổi giao lưu sẽ có phần ký tặng sách và thảo luận tự do.",
        type: 'event',
        isPinned: false,
        author: 'Phòng nội dung'
    },
    {
        title: "Ra mắt bộ sưu tập sách di sản 'Hồi ức Thăng Long'",
        summary: "Bộ sách tập hợp những tư liệu hiếm về đời sống và văn hóa Thăng Long xưa qua các thời kỳ.",
        content: "LiteraryHub vừa tiếp nhận và hoàn tất số hóa bộ sưu tập 'Hồi ức Thăng Long'. Các tập sách này hiện đã có sẵn trên kệ và trong thư mục đọc trực tuyến của chúng tôi. Mời các bạn đón đọc.",
        type: 'newbook',
        isPinned: false,
        author: 'Thủ thư'
    }
];

const scholarlyBooks = [
    {
        bookId: "B001",
        title: "Truyện Kiều",
        alternativeTitle: "Đoạn Trường Tân Thanh",
        author: {
            name: "Nguyễn Du",
            birthYear: 1765,
            deathYear: 1820,
            era: "Lễ giáo phong kiến Trung đại"
        },
        yearOfCreation: "Đầu thế kỷ XIX (khoảng 1805-1809)",
        genre: "Truyện thơ Nôm",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
        literaryPeriod: "Văn học Trung đại",
        contentSummary: "Tác phẩm kể về cuộc đời 15 năm lưu lạc, chìm nổi của Thúy Kiều - một người con gái tài sắc vẹn toàn nhưng bị định mệnh nghiệt ngã vùi dập. Qua đó, Nguyễn Du phơi bày bộ mặt tàn bạo của xã hội phong kiến và đề cao khát vọng tự do, công lý.",
        artisticValue: "Bút pháp tả cảnh ngụ tình bậc thầy, ngôn ngữ Nôm đạt đến đỉnh cao rực rỡ, nghệ thuật xây dựng nhân vật sắc sảo.",
        ideologicalValue: "Tiếng khóc thương cho thân phận con người, đặc biệt là người phụ nữ; khát vọng tình yêu lứa đôi và sự công bằng trong xã hội.",
        stock: 20,
        totalQuantity: 50,
        isAvailable: true,
        keywords: ["Nguyễn Du", "Thúy Kiều", "Văn học Trung đại", "Tố Như"]
    },
    {
        bookId: "B002",
        title: "Lục Vân Tiên",
        author: {
            name: "Nguyễn Đình Chiểu",
            birthYear: 1822,
            deathYear: 1888,
            era: "Cận đại - Chống Pháp"
        },
        yearOfCreation: "Khoảng thập niên 1850",
        genre: "Truyện thơ Nôm",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
        literaryPeriod: "Văn học Cận đại",
        contentSummary: "Câu chuyện về người anh hùng Lục Vân Tiên thẳng thắn, chính trực, sẵn sàng cứu khốn phò nguy. Tác phẩm đề cao đạo lý làm người: trung, hiếu, tiết, nghĩa.",
        artisticValue: "Ngôn ngữ Nam Bộ mộc mạc, bình dị, dễ đi vào lòng người dân dã.",
        ideologicalValue: "Tuyên dương những tấm gương đạo đức sáng ngời, bài trừ cái ác, cái gian nịnh.",
        stock: 15,
        totalQuantity: 30,
        isAvailable: true,
        keywords: ["Đồ Chiểu", "Nam Bộ", "Đạo lý", "Chính nghĩa"]
    },
    {
        bookId: "B003",
        title: "Số Đỏ",
        author: {
            name: "Vũ Trọng Phụng",
            birthYear: 1912,
            deathYear: 1939,
            era: "Hiện đại (1930-1945)"
        },
        yearOfCreation: "1936",
        genre: "Tiểu thuyết trào phúng",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop",
        literaryPeriod: "Văn học Hiện đại",
        contentSummary: "Hành trình thăng tiến lạ lùng của Xuân Tóc Đỏ từ một kẻ nhặt banh quần vợt thành 'bậc vĩ nhân', qua đó giễu cợt sâu cay sự lố lăng của xã hội tư sản thành thị Hà Nội thời Pháp thuộc.",
        artisticValue: "Nghệ thuật trào phúng sắc sảo, ngôn từ phóng túng, xây dựng những hình tượng nhân vật bất tử.",
        ideologicalValue: "Phê phán lối sống 'âu hóa' rởm đời, sự giả dối và mục nát của xã hội thượng lưu nửa mùa.",
        stock: 25,
        totalQuantity: 40,
        isAvailable: true,
        keywords: ["Vũ Trọng Phụng", "Trào phúng", "Xuân Tóc Đỏ", "Âu hóa"]
    },
    {
        bookId: "B004",
        title: "Tắt Đèn",
        author: {
            name: "Ngô Tất Tố",
            birthYear: 1893,
            deathYear: 1954
        },
        yearOfCreation: "1937",
        genre: "Tiểu thuyết hiện thực",
        imageUrl: "https://images.unsplash.com/photo-1491841251911-c44c30c34548?q=80&w=1000&auto=format&fit=crop",
        literaryPeriod: "Văn học Hiện đại",
        contentSummary: "Bức tranh ngột ngạt về nông thôn Việt Nam dưới ách thống trị của thực dân phong kiến qua bi kịch sưu thuế của gia đình chị Dậu.",
        artisticValue: "Bút pháp hiện thực nghiêm ngặt, giàu kịch tính, khắc họa thành công hình tượng người nông dân mạnh mẽ.",
        ideologicalValue: "Tố cáo tội ác của chế độ cũ và ngợi ca vẻ đẹp tâm hồn, sức sống tiềm tàng của người phụ nữ nông dân.",
        stock: 10,
        totalQuantity: 20,
        isAvailable: true,
        keywords: ["Ngô Tất Tố", "Hiện thực", "Chị Dậu", "Sưu thuế"]
    },
    {
        bookId: "B005",
        title: "Vang Bóng Một Thời",
        author: {
            name: "Nguyễn Tuân",
            birthYear: 1910,
            deathYear: 1987
        },
        yearOfCreation: "1940",
        genre: "Tập truyện ngắn",
        imageUrl: "https://images.unsplash.com/photo-1474932430478-3a7fb0142a30?q=80&w=1000&auto=format&fit=crop",
        literaryPeriod: "Văn học Hiện đại",
        contentSummary: "Những câu chuyện về 'những con người tài hoa - nghệ sĩ' với những thú vui tao nhã đang dần mai một trước sự tấn công của lối sống mới.",
        artisticValue: "Ngôn từ giàu hình ảnh, trau chuốt, tinh tế; cách nhìn đời qua lăng kính văn hóa truyền thống.",
        ideologicalValue: "Hoài cổ về những giá trị thẩm mỹ truyền thống cao đẹp, lòng tự tôn dân tộc.",
        stock: 12,
        totalQuantity: 15,
        isAvailable: true,
        keywords: ["Nguyễn Tuân", "Tài hoa", "Truyền thống", "Tao nhã"]
    }
];

// POST /api/system/reset - Clear and re-seed data (Admin only)
router.post('/reset', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        console.log('System reset requested by:', req.user.email);
        
        // 1. Clear books and news
        await Book.deleteMany({});
        await News.deleteMany({});
        
        // 2. We don't delete users or borrows to avoid breaking sessions.

        // 3. Seed News
        for (const item of newsData) {
            await News.create(item);
        }

        // 4. Seed Scholarly Books
        for (const book of scholarlyBooks) {
            await Book.create(book);
        }

        res.json({ message: 'Hệ thống đã được reset và nạp dữ liệu mẫu (Sách & Tin tức) thành công.' });
    } catch (error) {
        console.error('System reset error:', error);
        res.status(500).json({ message: 'Lỗi khi reset hệ thống', error: error.message });
    }
});

module.exports = router;
