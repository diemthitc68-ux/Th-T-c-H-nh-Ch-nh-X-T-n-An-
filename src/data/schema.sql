-- ====================================================================
-- HỆ THỐNG QUẢN LÝ VĂN BẢN & ĐIỀU HÀNH TÁC NGHIỆP - UBND XÃ TÂN AN
-- CƠ SỞ DỮ LIỆU CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP & ĐỀ ÁN 06
-- ====================================================================

-- 1. BẢNG TÀI KHOẢN CÁN BỘ & ĐỊNH DANH ĐIỆN TỬ (users)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL COMMENT 'Họ và tên cán bộ công chức',
  username VARCHAR(64) NOT NULL UNIQUE COMMENT 'Tên đăng nhập hệ thống',
  email VARCHAR(150) NOT NULL UNIQUE COMMENT 'Hộp thư điện tử công vụ',
  password_hash VARCHAR(256) NOT NULL COMMENT 'Băm mật khẩu bảo mật chuẩn SHA-256',
  position VARCHAR(150) NOT NULL COMMENT 'Chức vụ, chức danh công tác',
  department VARCHAR(150) NOT NULL COMMENT 'Phòng ban, đơn vị trực thuộc',
  role VARCHAR(64) NOT NULL DEFAULT 'OFFICER' COMMENT 'Vai trò công vụ (SUPER_ADMIN, CHAIRMAN, OFFICER, v.v.)',
  can_sign_vgca TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Quyền ký số chuyên dùng Ban Cơ yếu Chính phủ (1: Có, 0: Không)',
  is_verified TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái xác thực danh tính điện tử / OTP',
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'Trạng thái tài khoản (ACTIVE, LOCKED)',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm khởi tạo tài khoản',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. KHỞI TẠO TÀI KHOẢN QUẢN TRỊ VIÊN TỐI CAO (SUPER ADMIN)
INSERT INTO users (
  full_name, 
  username, 
  email, 
  password_hash, 
  position, 
  department, 
  role, 
  can_sign_vgca, 
  created_at
) VALUES (
  'Huỳnh Phú Kính',
  'hpkinh.tanan',
  'hpkinh.tanan@angiang.gov.vn',
  SHA2('hpkinh1909@', 256), -- Băm mật khẩu bảo mật chuẩn SHA-256
  'Giám đốc Trung tâm Hành chính công',
  'Bộ phận Tiếp nhận và Trả kết quả',
  'SUPER_ADMIN',
  1,
  NOW()
);

-- 3. BẢNG SỔ QUẢN LÝ VĂN BẢN (documents)
CREATE TABLE IF NOT EXISTS documents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL COMMENT 'Số và ký hiệu văn bản',
  doc_date DATE NOT NULL COMMENT 'Ngày ban hành',
  received_date DATE NOT NULL COMMENT 'Ngày đến / vào sổ',
  doc_type ENUM('Đến', 'Đi', 'Nội bộ') NOT NULL COMMENT 'Loại hình sổ văn bản',
  category VARCHAR(100) NOT NULL COMMENT 'Thể loại văn bản (Công văn, Quyết định, Tờ trình...)',
  urgent_level ENUM('Bình thường', 'Khẩn', 'Thượng khẩn', 'Hỏa tốc') NOT NULL DEFAULT 'Bình thường',
  summary TEXT NOT NULL COMMENT 'Trích yếu nội dung văn bản',
  agency VARCHAR(255) NOT NULL COMMENT 'Cơ quan ban hành hoặc nơi nhận',
  department VARCHAR(150) NOT NULL COMMENT 'Đơn vị chủ trì thụ lý',
  assignee VARCHAR(150) NOT NULL COMMENT 'Cán bộ thụ lý chính',
  due_date DATE NOT NULL COMMENT 'Hạn giải quyết văn bản',
  status VARCHAR(50) NOT NULL DEFAULT 'Mới tiếp nhận' COMMENT 'Tiến độ xử lý hồ sơ',
  is_vgca_signed TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Đã ký số VGCA Ban Cơ yếu',
  vgca_signer_name VARCHAR(150) NULL COMMENT 'Người ký số',
  vgca_serial VARCHAR(100) NULL COMMENT 'Mã Serial chứng thư số VGCA',
  vgca_signed_time DATETIME NULL COMMENT 'Dấu thời gian TSA ký số',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG NHẬT KÝ KIỂM TOÁN AN NINH (audit_logs)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  user_name VARCHAR(150) NOT NULL,
  role VARCHAR(64) NOT NULL,
  action VARCHAR(255) NOT NULL,
  target VARCHAR(255) NULL,
  status ENUM('Thành công', 'Từ chối', 'Cảnh báo') NOT NULL DEFAULT 'Thành công',
  ip_address VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
