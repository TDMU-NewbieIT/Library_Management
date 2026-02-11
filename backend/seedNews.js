require('dotenv').config();
const mongoose = require('mongoose');
const { News } = require('./src/models/index');

const seedNews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library');
        console.log('Connected to MongoDB');

        // Optional: clear existing news for a fresh look as requested "đưa tin tức... và hoàn thiện chúng"
        // await News.deleteMany({});

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

        for (const item of newsData) {
            // Use findOneAndUpdate to avoid duplicates if running multiple times
            await News.findOneAndUpdate(
                { title: item.title },
                item,
                { upsert: true, new: true }
            );
        }

        console.log('News and Events seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding news:', error);
        process.exit(1);
    }
};

seedNews();
