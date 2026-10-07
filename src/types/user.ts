export type PermissionKey =
  | 'doc_receive'    // Tiếp nhận & vào sổ văn bản
  | 'doc_edit'       // Sửa đổi thông tin văn bản
  | 'doc_delete'     // Xóa / Hủy văn bản
  | 'doc_sign'       // Ký số Ban Cơ Yếu (VGCA)
  | 'doc_approve'    // Phê duyệt & Bút phê chỉ đạo
  | 'doc_dispatch'   // Luân chuyển & Giao nhiệm vụ
  | 'doc_export'     // In sổ văn bản & Xuất Excel
  | 'admin_roles'    // Phân quyền quản trị hệ thống
  | 'admin_users';   // Quản lý & cấp tài khoản cán bộ

export interface PermissionMeta {
  key: PermissionKey;
  name: string;
  category: 'Văn bản' | 'Ký số & Chỉ đạo' | 'Báo cáo' | 'Quản trị';
  description: string;
}

export const PERMISSION_LIST: PermissionMeta[] = [
  {
    key: 'doc_receive',
    name: 'Tiếp nhận văn bản',
    category: 'Văn bản',
    description: 'Quyền tiếp nhận, vào sổ văn bản đến và khởi tạo văn bản đi mới'
  },
  {
    key: 'doc_edit',
    name: 'Chỉnh sửa hồ sơ',
    category: 'Văn bản',
    description: 'Cập nhật trích yếu, tệp đính kèm, hạn xử lý và phân công thụ lý'
  },
  {
    key: 'doc_delete',
    name: 'Xóa / Thu hồi văn bản',
    category: 'Văn bản',
    description: 'Thu hồi hoặc xóa văn bản khỏi sổ theo dõi hành chính'
  },
  {
    key: 'doc_sign',
    name: 'Ký số Ban Cơ Yếu (VGCA)',
    category: 'Ký số & Chỉ đạo',
    description: 'Ký số chuyên dùng công vụ của Ban Cơ Yếu Chính phủ trên văn bản điện tử'
  },
  {
    key: 'doc_approve',
    name: 'Phê duyệt & Cho ý kiến chỉ đạo',
    category: 'Ký số & Chỉ đạo',
    description: 'Ghi ý kiến chỉ đạo, duyệt kết quả xử lý hồ sơ của cấp dưới'
  },
  {
    key: 'doc_dispatch',
    name: 'Luân chuyển & Giao việc',
    category: 'Văn bản',
    description: 'Phân công nhiệm vụ, cập nhật trạng thái tiến độ giải quyết'
  },
  {
    key: 'doc_export',
    name: 'In sổ & Xuất Excel',
    category: 'Báo cáo',
    description: 'In sổ văn bản đến/đi, in phiếu xử lý và trích xuất bảng kê'
  },
  {
    key: 'admin_roles',
    name: 'Phân quyền hệ thống',
    category: 'Quản trị',
    description: 'Cấu hình ma trận quyền hạn, phân bổ vai trò và chính sách bảo mật'
  },
  {
    key: 'admin_users',
    name: 'Quản lý tài khoản cán bộ',
    category: 'Quản trị',
    description: 'Cấp mới, khóa tài khoản và thiết lập thông tin định danh công chức'
  }
];

export interface RoleConfig {
  id: string;
  name: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  permissions: PermissionKey[];
  isSystem?: boolean;
}

export const DEFAULT_ROLES: RoleConfig[] = [
  {
    id: 'SUPER_ADMIN',
    name: 'Quản trị viên tối cao (SUPER_ADMIN)',
    description: 'Toàn quyền quản trị hệ thống, quản lý tài khoản, phân vai trò, ký số VGCA và điều hành',
    badgeBg: 'bg-red-950',
    badgeText: 'text-amber-300 font-extrabold',
    permissions: [
      'doc_receive',
      'doc_edit',
      'doc_delete',
      'doc_sign',
      'doc_approve',
      'doc_dispatch',
      'doc_export',
      'admin_roles',
      'admin_users'
    ],
    isSystem: true
  },
  {
    id: 'admin',
    name: 'Quản trị hệ thống',
    description: 'Toàn quyền cấu hình, phân quyền, quản lý tài khoản và bảo mật hệ thống',
    badgeBg: 'bg-red-900',
    badgeText: 'text-white',
    permissions: [
      'doc_receive',
      'doc_edit',
      'doc_delete',
      'doc_sign',
      'doc_approve',
      'doc_dispatch',
      'doc_export',
      'admin_roles',
      'admin_users'
    ],
    isSystem: true
  },
  {
    id: 'chairman',
    name: 'Chủ tịch UBND xã',
    description: 'Lãnh đạo toàn diện UBND xã, phê duyệt quyết định, ký số phát hành và chỉ đạo',
    badgeBg: 'bg-[#8b0000]',
    badgeText: 'text-amber-300 font-bold',
    permissions: [
      'doc_receive',
      'doc_edit',
      'doc_sign',
      'doc_approve',
      'doc_dispatch',
      'doc_export'
    ]
  },
  {
    id: 'vice_chairman',
    name: 'Phó Chủ tịch UBND xã',
    description: 'Phụ trách khối Kinh tế - Đô thị / Văn hóa - Xã hội, duyệt và ký số theo ủy quyền',
    badgeBg: 'bg-red-800',
    badgeText: 'text-white',
    permissions: [
      'doc_receive',
      'doc_edit',
      'doc_sign',
      'doc_approve',
      'doc_dispatch',
      'doc_export'
    ]
  },
  {
    id: 'director',
    name: 'Giám đốc TT Hành chính công',
    description: 'Điều hành Bộ phận Tiếp nhận và Trả kết quả (Một cửa), giải quyết TTHC',
    badgeBg: 'bg-amber-600',
    badgeText: 'text-white',
    permissions: [
      'doc_receive',
      'doc_edit',
      'doc_sign',
      'doc_approve',
      'doc_dispatch',
      'doc_export'
    ]
  },
  {
    id: 'clerk',
    name: 'Văn thư - Lưu trữ',
    description: 'Tiếp nhận văn bản đến, vào sổ văn bản đi, cấp số ký hiệu, in sổ và lưu trữ',
    badgeBg: 'bg-blue-700',
    badgeText: 'text-white',
    permissions: ['doc_receive', 'doc_edit', 'doc_dispatch', 'doc_export']
  },
  {
    id: 'officer',
    name: 'Công chức Chuyên môn',
    description: 'Công chức Địa chính, Tư pháp, Văn phòng thực hiện xử lý nghiệp vụ theo phân công',
    badgeBg: 'bg-emerald-700',
    badgeText: 'text-white',
    permissions: ['doc_receive', 'doc_dispatch', 'doc_export']
  }
];

// Cấu hình tài khoản Quản trị viên tối cao (Super Admin) theo đặc tả người dùng & SQL Schema
export const adminAccount = {
  id: 1,
  fullName: 'Huỳnh Phú Kính',
  full_name: 'Huỳnh Phú Kính',
  email: 'hpkinh.tanan@angiang.gov.vn',
  username: 'hpkinh.tanan', // Tên đăng nhập chuẩn hóa từ email công vụ
  password: 'hpkinh1909@', // Mật khẩu bảo mật chuẩn SHA-256
  password_hash: 'f35ba770bfab6ded64241c764bc7aee31a9b61e6de7082ba2cea1a88230704f9', // SHA2('hpkinh1909@', 256)
  skipPassword: false, // Bắt buộc bảo mật mật khẩu
  position: 'Giám đốc Trung tâm Hành chính công',
  department: 'Bộ phận Tiếp nhận và Trả kết quả',
  agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
  role: 'SUPER_ADMIN',
  can_sign_vgca: 1,
  created_at: '2026-10-04 08:30:00',
  permissions: {
    canManageUsers: true,     // Toàn quyền thêm, sửa, xóa, duyệt tài khoản
    canManageRoles: true,     // Phân vai trò cán bộ
    canSignVGCA: true,        // Ký số Ban Cơ yếu Chính phủ / Con dấu điện tử
    canDispatchDoc: true,     // Phân công, luân chuyển văn bản phòng ban
    canDeleteDoc: true,       // Xóa hồ sơ văn bản
    canViewAllReports: true   // Xem toàn bộ thống kê chỉ số
  },
  vgcaCertInfo: {
    certSubject: 'HUỲNH PHÚ KÍNH - GIÁM ĐỐC TRUNG TÂM HÀNH CHÍNH CÔNG',
    issuer: 'Ban Cơ yếu Chính phủ (VGCA)',
    tsaService: 'http://ca.gov.vn/tsa',
    status: 'Active'
  },
  isVerified: true
};

export interface SystemUser {
  id?: number;
  user: string;
  username?: string;
  pass: string;
  password?: string;
  password_hash?: string;
  skipPassword?: boolean;
  name: string;
  fullName?: string;
  full_name?: string;
  role: string;
  roleId?: string;
  position?: string;
  dept?: string;
  department?: string;
  agency?: string;
  cccd?: string;
  phone?: string;
  email?: string;
  can_sign_vgca?: number | boolean;
  created_at?: string;
  isVerified?: boolean;
  status?: 'active' | 'locked' | 'pending';
  permissions?: {
    canManageUsers?: boolean;
    canManageRoles?: boolean;
    canSignVGCA?: boolean;
    canDispatchDoc?: boolean;
    canDeleteDoc?: boolean;
    canViewAllReports?: boolean;
  };
  vgcaCertInfo?: {
    certSubject: string;
    issuer: string;
    tsaService: string;
    status: string;
  };
  customPermissions?: PermissionKey[];
  lastLogin?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userName: string;
  role: string;
  action: string;
  target?: string;
  status: 'Thành công' | 'Từ chối' | 'Cảnh báo';
  ipAddress?: string;
}

export const SUPER_ADMIN_USER: SystemUser = {
  id: adminAccount.id,
  user: adminAccount.username,
  username: adminAccount.username,
  pass: adminAccount.password,
  password: adminAccount.password,
  password_hash: adminAccount.password_hash,
  skipPassword: false,
  name: adminAccount.fullName,
  fullName: adminAccount.fullName,
  full_name: adminAccount.full_name,
  email: adminAccount.email,
  position: adminAccount.position,
  role: 'Giám đốc Trung tâm Hành chính công (SUPER_ADMIN)',
  roleId: 'SUPER_ADMIN',
  dept: adminAccount.department,
  department: adminAccount.department,
  agency: adminAccount.agency,
  cccd: '079084001234',
  phone: '0918234567',
  can_sign_vgca: adminAccount.can_sign_vgca,
  created_at: adminAccount.created_at,
  permissions: adminAccount.permissions,
  vgcaCertInfo: adminAccount.vgcaCertInfo,
  isVerified: adminAccount.isVerified,
  status: 'active',
  customPermissions: [
    'doc_receive',
    'doc_edit',
    'doc_delete',
    'doc_sign',
    'doc_approve',
    'doc_dispatch',
    'doc_export',
    'admin_roles',
    'admin_users'
  ],
  lastLogin: '2026-10-04 08:30'
};

export const INITIAL_USERS: SystemUser[] = [
  SUPER_ADMIN_USER,
  {
    user: 'admin',
    username: 'admin',
    pass: 'hpkinh1909@',
    password: 'hpkinh1909@',
    password_hash: 'f35ba770bfab6ded64241c764bc7aee31a9b61e6de7082ba2cea1a88230704f9',
    skipPassword: false,
    name: 'Quản trị viên (Admin)',
    fullName: 'Quản trị viên (Admin)',
    role: 'Quản trị hệ thống',
    roleId: 'admin',
    dept: 'Văn phòng HĐND & UBND',
    department: 'Văn phòng HĐND & UBND',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079096000001',
    phone: '0901234567',
    email: 'quantri.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-04 08:15'
  },
  {
    user: 'hungpv',
    username: 'hungpv',
    pass: '123456',
    password: '123456',
    name: 'Phan Văn Hùng',
    fullName: 'Phan Văn Hùng',
    role: 'Chủ tịch UBND xã',
    roleId: 'chairman',
    position: 'Chủ tịch UBND xã',
    dept: 'Lãnh đạo UBND',
    department: 'Lãnh đạo UBND',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079075003456',
    phone: '0903456789',
    email: 'hungpv.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-04 08:00'
  },
  {
    user: 'thainv',
    username: 'thainv',
    pass: '123456',
    password: '123456',
    name: 'Nguyễn Văn Thái',
    fullName: 'Nguyễn Văn Thái',
    role: 'Phó Chủ tịch UBND xã',
    roleId: 'vice_chairman',
    position: 'Phó Chủ tịch UBND xã',
    dept: 'Lãnh đạo UBND',
    department: 'Lãnh đạo UBND',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079080004567',
    phone: '0908765432',
    email: 'thainv.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-04 07:50'
  },
  {
    user: 'tuandm',
    username: 'tuandm',
    pass: '123456',
    password: '123456',
    name: 'Đỗ Minh Tuấn',
    fullName: 'Đỗ Minh Tuấn',
    role: 'Công chức Văn phòng - Thống kê',
    roleId: 'officer',
    position: 'Công chức Văn phòng - Thống kê',
    dept: 'Văn phòng HĐND & UBND',
    department: 'Văn phòng HĐND & UBND',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079090005678',
    phone: '0912348765',
    email: 'tuandm.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-03 16:30'
  },
  {
    user: 'ducta',
    username: 'ducta',
    pass: '123456',
    password: '123456',
    name: 'Trần Anh Đức',
    fullName: 'Trần Anh Đức',
    role: 'Công chức Địa chính - Xây dựng',
    roleId: 'officer',
    position: 'Công chức Địa chính - Xây dựng',
    dept: 'Địa chính - Nông nghiệp',
    department: 'Địa chính - Nông nghiệp',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079088006789',
    phone: '0934567890',
    email: 'ducta.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-04 08:10'
  },
  {
    user: 'ngocph',
    username: 'ngocph',
    pass: '123456',
    password: '123456',
    name: 'Phạm Hồng Ngọc',
    fullName: 'Phạm Hồng Ngọc',
    role: 'Công chức Tư pháp - Hộ tịch',
    roleId: 'officer',
    position: 'Công chức Tư pháp - Hộ tịch',
    dept: 'Tư pháp',
    department: 'Tư pháp',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079093007890',
    phone: '0978901234',
    email: 'ngocph.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-03 17:00'
  },
  {
    user: 'quyhv',
    username: 'quyhv',
    pass: '123456',
    password: '123456',
    name: 'Hoàng Văn Quý',
    fullName: 'Hoàng Văn Quý',
    role: 'Chỉ huy trưởng Ban CHQS xã',
    roleId: 'officer',
    position: 'Chỉ huy trưởng Ban CHQS xã',
    dept: 'Quân sự',
    department: 'Quân sự',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079082008901',
    phone: '0989012345',
    email: 'quyhv.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-04 07:30'
  },
  {
    user: 'huonglt',
    username: 'huonglt',
    pass: '123456',
    password: '123456',
    name: 'Lê Thu Hương',
    fullName: 'Lê Thu Hương',
    role: 'Văn thư - Lưu trữ',
    roleId: 'clerk',
    position: 'Văn thư - Lưu trữ',
    dept: 'Văn phòng HĐND & UBND',
    department: 'Văn phòng HĐND & UBND',
    agency: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    cccd: '079095009012',
    phone: '0945678901',
    email: 'huonglt.tanan@binhduong.gov.vn',
    isVerified: true,
    status: 'active',
    lastLogin: '2026-10-04 07:15'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-04 08:30:00',
    user: adminAccount.username,
    userName: adminAccount.fullName,
    role: 'SUPER_ADMIN',
    action: 'Đăng nhập phiên làm việc Quản trị viên tối cao',
    target: 'Hệ thống Quản lý Văn bản & Điều hành',
    status: 'Thành công',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-04 08:20:15',
    user: adminAccount.username,
    userName: adminAccount.fullName,
    role: 'SUPER_ADMIN',
    action: 'Kiểm tra trạng thái chứng thư số Ban Cơ yếu (VGCA)',
    target: adminAccount.vgcaCertInfo.certSubject,
    status: 'Thành công',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-04 08:15:42',
    user: 'hungpv',
    userName: 'Phan Văn Hùng',
    role: 'Chủ tịch UBND xã',
    action: 'Ký số chuyên dùng VGCA văn bản',
    target: 'Văn bản số 58/QĐ-UBND',
    status: 'Thành công',
    ipAddress: '192.168.1.25'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-04 08:05:11',
    user: adminAccount.username,
    userName: adminAccount.fullName,
    role: 'SUPER_ADMIN',
    action: 'Chuyển xử lý hồ sơ thủ tục hành chính Một cửa',
    target: 'Hồ sơ Một cửa 142/UBND-VP',
    status: 'Thành công',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log-5',
    timestamp: '2026-10-04 07:55:00',
    user: 'huonglt',
    userName: 'Lê Thu Hương',
    role: 'Văn thư - Lưu trữ',
    action: 'Vào sổ văn bản đến số 12/KH-STTTT',
    target: 'Kế hoạch chuyển đổi số xã 2026',
    status: 'Thành công',
    ipAddress: '192.168.1.15'
  }
];
