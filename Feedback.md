Khi khóa tính năng ở trạng thái Chỉ đọc (Read-only) và tập trung vào Giám sát & Cảnh báo, phân hệ Kho trên Mobile Admin sẽ được thiết kế tinh giản, sạch sẽ theo đúng cấu trúc dưới đây:

🔍 1. Thanh Tìm Kiếm & Bộ Lọc Nhanh (Search & Filter)
Đặt ở đỉnh trang giúp Admin tra cứu nhanh tình trạng một mã phụ tùng khi khách hỏi tại quầy hoặc khi thợ kỹ thuật báo thiếu đồ:

Thanh tìm kiếm thông minh: Gõ nhanh theo Tên sản phẩm hoặc Mã SKU (Ví dụ: "Nhớt Motul", "Má phanh SH").

Bộ lọc nhanh dạng Tab (Quick Filters): Phân loại nhanh để quét danh sách: [ Tất cả ] | [ Phụ tùng ] | [ Phụ kiện ] | [ Xe nguyên chiếc ].

🚨 2. Khối Cảnh Báo "Hàng Dưới Ngưỡng An Toàn" (Low Stock Alerts)
Đây là khu vực mang lại giá trị lớn nhất cho Admin trên mobile. Hệ thống tự động quét và gom tất cả các sản phẩm có số lượng tồn kho chạm hoặc dưới ngưỡng tối thiểu (Safety Stock Level) đẩy lên trên cùng.

Cách hiển thị: Các thẻ sản phẩm ở mục này sẽ có nhãn màu Đỏ Coral hoặc Cam Neon để gây chú ý mạnh.

Nội dung mô tả trực quan:

Lọc gió Honda Winner X: Còn 2 cái (Ngưỡng an toàn: 10 cái) ➔ ⚠️ Nguy cấp.

Nhớt máy Castrol Power1 1L: Còn 5 chai (Ngưỡng an toàn: 20 chai) ➔ ⚠️ Sắp hết.

📦 3. Danh Sách Tồn Kho Showroom (Stock List Rows)
Hiển thị danh sách toàn bộ hàng hóa trong kho Biên Hòa theo dạng các dòng danh sách (List Rows) mỏng, tối giản không gian, loại bỏ hoàn toàn các nút bấm Thêm/Sửa/Xóa.

Các thông tin hiển thị trên một dòng:

Ảnh thumbnail nhỏ của sản phẩm.

Tên sản phẩm + Mã SKU hành chính.

Con số tồn kho hiển thị lớn ở góc phải: Chữ màu xanh mint nếu tồn kho an toàn (Ví dụ: Còn 45).

🎨 Trực quan hóa giao diện Kho trên Mobile Admin
Plaintext
┌────────────────────────────────────────┐
│ ❮  Tra Cứu Tồn Kho Biên Hòa            │  ◄── Read-only Mode (Không có nút "+")
├────────────────────────────────────────┤
│ 🔍 Tìm tên sản phẩm, mã SKU...         │
├────────────────────────────────────────┤
│ [ Tất cả ]  [ Phụ tùng ]  [ Phụ kiện ]  │  ◄── Bộ lọc nhanh dạng Tab chạm
├────────────────────────────────────────┤
│ 🚨 CẢNH BÁO HÀNG SẮP HẾT (3)           │
│ ┌────────────────────────────────────┐ │
│ │ 🛠️ Lọc gió Winner X  [⚠️ Nguy cấp]   │ │  ◄── Thẻ cảnh báo viền đỏ phát sáng
│ │ SKU: PT-LG-WN01    | Tồn kho: 02   │ │
│ └────────────────────────────────────┘ │
├────────────────────────────────────────┤
│ 📦 DANH SÁCH HÀNG HÓA                  │
│ • 🧴 Nhớt Motul Scooter 1L   Tồn: 85  │  ◄── Chữ số tồn kho lớn, màu xanh an toàn
│   SKU: PK-N-MT02                       │
│                                        │
│ • 🪞 Gương chiếu hậu SH      Tồn: 14  │
│   SKU: PT-G-SH2025                     │
├────────────────────────────────────────┤
│ 💡 Mọi thao tác Thêm, Sửa, Xóa và Nhập │  ◄── Dòng nhắc nhở phân quyền hệ thống
│ kho vui lòng thực hiện trên Web Admin. │
└────────────────────────────────────────┘
⚙️ Thiết kế trang Chi tiết Sản phẩm trên Mobile (View Details Only)
Khi Admin bấm vào một dòng sản phẩm, App sẽ trượt mở một Bottom Sheet hiển thị sâu hơn các thông số quản trị (vẫn ở chế độ chỉ xem):

Giá vốn / Giá bán niêm yết.

Vị trí vị trí kệ kho: (Ví dụ: Kệ A - Tầng 3 để Admin hướng dẫn nhân viên ra lấy đồ nhanh).

Nhà cung ứng: Tên đơn vị cấp hàng và số điện thoại liên hệ nhanh khi cần giục hàng gấp.

Sự tinh chỉnh này giúp phân hệ Kho trên Mobile trở thành một công cụ kiểm tra dữ liệu cực kỳ bén, giúp quản lý showroom luôn nắm chắc "sức khỏe" hàng hóa trong lòng bàn tay mà không làm phình to kiến trúc phần mềm trên thiết bị di động.