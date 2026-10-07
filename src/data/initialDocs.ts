import { DocumentItem } from '../types/document';

export const STAFF_LIST = [
  { name: 'Phan Văn Hùng', role: 'Chủ tịch UBND xã', department: 'Lãnh đạo UBND' },
  { name: 'Nguyễn Văn Thái', role: 'Phó Chủ tịch UBND (Phụ trách KT-XH)', department: 'Lãnh đạo UBND' },
  { name: 'Lê Thị Bích', role: 'Phó Chủ tịch HĐND xã', department: 'Thường trực HĐND' },
  { name: 'Huỳnh Phú Kính', role: 'Giám đốc TT Hành chính công', department: 'Bộ phận Một cửa' },
  { name: 'Đỗ Minh Tuấn', role: 'Công chức Văn phòng - Thống kê', department: 'Văn phòng HĐND & UBND' },
  { name: 'Trần Anh Đức', role: 'Công chức Địa chính - Xây dựng', department: 'Địa chính - Nông nghiệp' },
  { name: 'Phạm Hồng Ngọc', role: 'Công chức Tư pháp - Hộ tịch', department: 'Tư pháp' },
  { name: 'Hoàng Văn Quý', role: 'Chỉ huy trưởng Ban CHQS xã', department: 'Quân sự' },
  { name: 'Lê Thu Hương', role: 'Văn thư - Lưu trữ', department: 'Văn phòng HĐND & UBND' }
];

export const DEPARTMENTS = [
  'Văn phòng HĐND & UBND',
  'Bộ phận Một cửa',
  'Địa chính - Nông nghiệp',
  'Tư pháp',
  'Quân sự',
  'Lãnh đạo UBND',
  'Thường trực HĐND'
];

export interface VGCACertificate {
  id: string;
  name: string;
  role: string;
  unit: string;
  issuer: string;
  serial: string;
  type: 'personal' | 'organization';
}

export const VGCA_CERTIFICATES: VGCACertificate[] = [
  {
    id: 'cert-superadmin',
    name: 'Huỳnh Phú Kính',
    role: 'Giám đốc Trung tâm Hành chính công (SUPER_ADMIN)',
    unit: 'ỦY BAN NHÂN DÂN XÃ TÂN AN',
    issuer: 'Ban Cơ yếu Chính phủ (VGCA)',
    serial: '5409:VGCA:SUPER:2026',
    type: 'personal'
  },
  {
    id: 'cert-1',
    name: 'Phan Văn Hùng',
    role: 'Chủ tịch UBND xã',
    unit: 'Ủy ban nhân dân Xã Tân An',
    issuer: 'Ban Cơ yếu Chính phủ (VGCA)',
    serial: '5401:B18A:44F0:91A2',
    type: 'personal'
  },
  {
    id: 'cert-2',
    name: 'Nguyễn Văn Thái',
    role: 'Phó Chủ tịch UBND xã',
    unit: 'Ủy ban nhân dân Xã Tân An',
    issuer: 'Ban Cơ yếu Chính phủ (VGCA)',
    serial: '5404:A28B:99F1:C03E',
    type: 'personal'
  },
  {
    id: 'cert-3',
    name: 'Ủy ban nhân dân Xã Tân An',
    role: 'Dấu điện tử cơ quan',
    unit: 'Ủy ban nhân dân Xã Tân An',
    issuer: 'Ban Cơ yếu Chính phủ (VGCA)',
    serial: '5400:CC19:88D2:E410',
    type: 'organization'
  },
  {
    id: 'cert-4',
    name: 'Huỳnh Phú Kính',
    role: 'Giám đốc TT Hành chính công',
    unit: 'Bộ phận Tiếp nhận & Trả kết quả',
    issuer: 'Ban Cơ yếu Chính phủ (VGCA)',
    serial: '5409:F31A:66C2:B521',
    type: 'personal'
  }
];

export function generateSmartSuggestion(summary: string, category: string): string {
  const text = (summary || '').toLowerCase();

  if (text.includes('đất đai') || text.includes('địa chính') || text.includes('cấp sổ') || text.includes('trích lục') || text.includes('ranh giới')) {
    return 'Đề xuất tham mưu: Chuyển đồng chí Trần Anh Đức (Địa chính) phối hợp xác minh thực địa và thẩm định hồ sơ theo Nghị định 101/2024/NĐ-CP; lập biên bản kiểm tra ranh giới thửa đất.';
  }
  if (text.includes('số hóa') || text.includes('chuyển đổi số') || text.includes('hành chính công') || text.includes('một cửa') || text.includes('dịch vụ công')) {
    return 'Đề xuất tham mưu: Chuyển TT Hành chính công (Đ/c Huỳnh Phú Kính) đôn đốc tiếp nhận hồ sơ trên Cổng DVC, rà soát thiết bị số hóa và báo cáo kết quả trước 03 ngày so với hạn chót.';
  }
  if (text.includes('an ninh') || text.includes('trật tự') || text.includes('quân sự') || text.includes('triều cường') || text.includes('phòng chống thiên tai') || text.includes('cứu nạn')) {
    return 'Đề xuất tham mưu: Giao Ban Chỉ huy Quân sự xã (Đ/c Hoàng Văn Quý) kích hoạt phương án 4 tại chỗ, bố trí lực lượng trực ban 24/24 và phối hợp Công an xã tuần tra địa bàn.';
  }
  if (text.includes('hộ tịch') || text.includes('chứng thực') || text.includes('kết hôn') || text.includes('khai sinh') || text.includes('tư pháp')) {
    return 'Đề xuất tham mưu: Giao Đ/c Phạm Hồng Ngọc (Tư pháp) đối soát cơ sở dữ liệu dân cư trên hệ thống VNeID và Nghị định 23/2015/NĐ-CP về cấp bản sao từ sổ gốc.';
  }
  if (category === 'Tờ trình') {
    return 'Đề xuất tham mưu: Soát xét dự thảo dự toán kinh phí, lấy ý kiến Phòng Tài chính - Kế hoạch huyện trước khi trình Chủ tịch UBND xã Phan Văn Hùng ký duyệt ban hành.';
  }
  if (category === 'Quyết định') {
    return 'Đề xuất tham mưu: Rà soát căn cứ pháp lý còn hiệu lực, kiểm tra thể thức văn bản hành chính theo chuẩn Nghị định 30/2020/NĐ-CP của Chính phủ.';
  }
  if (category === 'Kế hoạch') {
    return 'Đề xuất tham mưu: Phân công rõ trách nhiệm từng ấp, định lượng cụ thể chỉ tiêu hoàn thành và phân kỳ thời gian kiểm tra đôn đốc theo từng giai đoạn.';
  }
  if (category === 'Giấy mời') {
    return 'Đề xuất tham mưu: Chuẩn bị danh sách đại biểu, maket hội trường, tài liệu tham luận và thông báo các thành viên đúng quy định tiếp xúc cử tri.';
  }

  return 'Căn cứ quy chế làm việc UBND xã: Phân công chuyên viên chuyên môn lập phiếu trình xử lý, dự thảo văn bản trả lời đúng thẩm quyền.';
}

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 1,
    code: '142/UBND-VP',
    date: '2026-10-01',
    receivedDate: '2026-10-01',
    type: 'Đến',
    category: 'Công văn',
    urgent: 'KHẨN',
    summary: 'V/v đôn đốc triển khai nhiệm vụ chuyển đổi số và số hóa 100% hồ sơ TTHC',
    agency: 'Văn phòng HĐND & UBND Huyện',
    recipient: 'UBND Xã Tân An',
    department: 'Văn phòng HĐND & UBND',
    assignee: 'Đỗ Minh Tuấn',
    role: 'Công chức Văn phòng - Thống kê',
    dueDate: '2026-10-15',
    status: 'Đang xử lý',
    fileName: '142_UBND_Chuyendoiso.pdf',
    fileSize: '1.2 MB',
    suggestion: 'Kế thừa kế hoạch số hóa quý 3; phối hợp Bộ phận Một cửa rà soát thiết bị quét văn bản; dự thảo báo cáo hoàn thành trước 12/10.',
    attachments: [
      { name: '142_UBND_Chuyendoiso.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Phu_luc_chi_tieu_so_hoa_2026.xlsx', size: '480 KB', type: 'xlsx' }
    ],
    history: [
      {
        id: 'h-101',
        time: '2026-10-01 08:30',
        actor: 'Lê Thu Hương (Văn thư)',
        action: 'Tiếp nhận văn bản đến vào sổ theo dõi điện tử',
        statusAfter: 'Mới tiếp nhận'
      },
      {
        id: 'h-102',
        time: '2026-10-01 10:15',
        actor: 'Phan Văn Hùng (Chủ tịch UBND)',
        action: 'Bút phê chỉ đạo & Chuyển giao chuyên viên thụ lý',
        note: 'Giao VP-TK tham mưu văn bản chỉ đạo chi tiết',
        statusAfter: 'Đang xử lý'
      }
    ]
  },
  {
    id: 2,
    code: '58/QĐ-UBND',
    date: '2026-10-02',
    receivedDate: '2026-10-02',
    type: 'Đi',
    category: 'Quyết định',
    urgent: 'Bình thường',
    summary: 'Quyết định về việc kiện toàn Tổ công tác Đề án 06 và chuyển đổi số xã Tân An',
    agency: 'UBND Xã Tân An',
    recipient: 'Các thành viên Tổ công tác Đề án 06',
    department: 'Bộ phận Một cửa',
    assignee: 'Huỳnh Phú Kính',
    role: 'Giám đốc TT Hành chính công',
    dueDate: '2026-10-10',
    status: 'Chờ duyệt',
    fileName: '58_QD_KienToanToCongTac.docx',
    fileSize: '420 KB',
    suggestion: 'Kiểm tra danh sách thành viên mới thay thế; trình Chủ tịch UBND xã ký duyệt số trước ngày 08/10.',
    attachments: [
      { name: '58_QD_KienToanToCongTac.docx', size: '420 KB', type: 'docx' }
    ],
    history: [
      {
        id: 'h-201',
        time: '2026-10-02 08:45',
        actor: 'Huỳnh Phú Kính',
        action: 'Hoàn thiện dự thảo quyết định kiện toàn và trình Lãnh đạo UBND',
        statusAfter: 'Chờ duyệt'
      }
    ]
  },
  {
    id: 3,
    code: '89/TB-UBND',
    date: '2026-09-28',
    receivedDate: '2026-09-28',
    type: 'Đi',
    category: 'Thông báo',
    urgent: 'Bình thường',
    summary: 'Thông báo tiếp nhận và trả kết quả thủ tục hành chính ngày thứ Bảy phục vụ Nhân dân',
    agency: 'UBND Xã Tân An',
    recipient: 'Toàn thể Nhân dân và 6 ấp trên địa bàn',
    department: 'Bộ phận Một cửa',
    assignee: 'Huỳnh Phú Kính',
    role: 'Giám đốc TT Hành chính công',
    dueDate: '2026-10-02',
    status: 'Hoàn thành',
    fileName: '89_TB_UBND_Lich_lam_viec_thu_bay.pdf',
    fileSize: '1.2 MB',
    suggestion: 'Đã hoàn tất niêm yết tại Bộ phận Một cửa và truyền thanh xã phát sóng rộng rãi theo lịch.',
    attachments: [
      { name: '89_TB_UBND_Lich_lam_viec_thu_bay.pdf', size: '1.2 MB', type: 'pdf' }
    ],
    digitalSignature: {
      isSigned: true,
      signerName: 'Nguyễn Văn Thái',
      signerRole: 'Phó Chủ tịch UBND Xã Tân An',
      signedTime: '2026-09-28 14:20:15',
      certIssuer: 'Ban Cơ yếu Chính phủ - Cục Chứng thực số và Bảo mật thông tin (VGCA)',
      serialNumber: '5404:A28B:99F1:C03E',
      validFrom: '2024-01-01',
      validTo: '2029-01-01',
      signatureType: 'personal',
      tamperStatus: 'valid'
    },
    history: [
      {
        id: 'h-301',
        time: '2026-09-28 09:00',
        actor: 'Huỳnh Phú Kính',
        action: 'Khởi tạo thông báo và trình ký',
        statusAfter: 'Mới tiếp nhận'
      },
      {
        id: 'h-302',
        time: '2026-09-28 14:20',
        actor: 'Nguyễn Văn Thái (Phó Chủ tịch)',
        action: 'Ký duyệt ban hành thông báo chính thức',
        statusAfter: 'Hoàn thành'
      }
    ]
  },
  {
    id: 4,
    code: '178/STNMT-VP',
    date: '2026-09-29',
    receivedDate: '2026-09-30',
    type: 'Đến',
    category: 'Công văn',
    urgent: 'KHẨN',
    summary: 'V/v rà soát hiện trạng sử dụng đất công và xử lý dứt điểm các trường hợp lấn chiếm hành lang đê điều',
    agency: 'Phòng Tài nguyên & Môi trường Huyện',
    recipient: 'UBND Xã Tân An',
    department: 'Địa chính - Nông nghiệp',
    assignee: 'Trần Anh Đức',
    role: 'Công chức Địa chính - Xây dựng',
    dueDate: '2026-10-03', // Overdue
    status: 'Đang xử lý',
    fileName: '178_STNMT_Ra_soat_dat_cong.pdf',
    fileSize: '2.8 MB',
    suggestion: 'Đề xuất: Chuyển đồng chí Trần Anh Đức phối hợp Tổ quản lý trật tự đô thị kiểm tra thực địa, lập biên bản xác nhận mốc giới và báo cáo khẩn Lãnh đạo UBND xã.',
    attachments: [
      { name: '178_STNMT_Ra_soat_dat_cong.pdf', size: '2.8 MB', type: 'pdf' }
    ],
    history: [
      {
        id: 'h-401',
        time: '2026-09-30 08:15',
        actor: 'Lê Thu Hương (Văn thư)',
        action: 'Vào sổ công văn đến khẩn',
        statusAfter: 'Mới tiếp nhận'
      },
      {
        id: 'h-402',
        time: '2026-09-30 09:30',
        actor: 'Phan Văn Hùng (Chủ tịch UBND)',
        action: 'Giao Địa chính thụ lý khẩn cấp',
        statusAfter: 'Đang xử lý'
      }
    ]
  },
  {
    id: 5,
    code: '56/TTr-ĐC',
    date: '2026-10-03',
    receivedDate: '2026-10-03',
    type: 'Nội bộ',
    category: 'Tờ trình',
    urgent: 'Bình thường',
    summary: 'Tờ trình về việc phê duyệt phương án đo đạc chỉnh lý biến động đất nông nghiệp khu vực ấp Tân Hưng',
    agency: 'Bộ phận Địa chính - Nông nghiệp',
    recipient: 'Chủ tịch UBND Xã Tân An',
    department: 'Địa chính - Nông nghiệp',
    assignee: 'Trần Anh Đức',
    role: 'Công chức Địa chính - Xây dựng',
    dueDate: '2026-10-08',
    status: 'Chờ duyệt',
    fileName: 'To_trinh_do_dac_ap_Tan_Hung.pdf',
    fileSize: '1.9 MB',
    suggestion: 'Đề xuất: Soát xét dự thảo kinh phí, kiểm tra bản đồ trích lục địa chính trước khi trình Chủ tịch UBND xã Phan Văn Hùng ký duyệt.',
    attachments: [
      { name: 'To_trinh_do_dac_ap_Tan_Hung.pdf', size: '1.9 MB', type: 'pdf' }
    ],
    history: [
      {
        id: 'h-501',
        time: '2026-10-03 11:00',
        actor: 'Trần Anh Đức',
        action: 'Nộp tờ trình kèm hồ sơ kỹ thuật thửa đất',
        statusAfter: 'Chờ duyệt'
      }
    ]
  },
  {
    id: 6,
    code: '104/UBND-VP',
    date: '2026-10-04',
    receivedDate: '2026-10-04',
    type: 'Đến',
    category: 'Công văn',
    urgent: 'HỎA TỐC',
    summary: 'Công điện khẩn: Chủ động ứng phó đợt triều cường rằm tháng Tám âm lịch và gia cố hệ thống cống đập ngăn mặn',
    agency: 'Ban Chỉ huy Phòng chống thiên tai & TKCN Tỉnh',
    recipient: 'UBND các xã ven sông',
    department: 'Quân sự',
    assignee: 'Hoàng Văn Quý',
    role: 'Chỉ huy trưởng Ban CHQS xã',
    dueDate: '2026-10-05',
    status: 'Mới tiếp nhận',
    fileName: 'Cong_dien_04_PCTT_trieu_cuong.pdf',
    fileSize: '1.5 MB',
    suggestion: 'Đề xuất: Kích hoạt phương án 4 tại chỗ, bố trí lực lượng dân quân tự vệ kiểm tra 100% các cống ngăn mặn xung yếu ngay trong ngày.',
    attachments: [
      { name: 'Cong_dien_04_PCTT_trieu_cuong.pdf', size: '1.5 MB', type: 'pdf' }
    ],
    history: [
      {
        id: 'h-601',
        time: '2026-10-04 07:15',
        actor: 'Lê Thu Hương (Văn thư)',
        action: 'Vào sổ công điện hỏa tốc và báo cáo Thường trực UBND',
        statusAfter: 'Mới tiếp nhận'
      }
    ]
  }
];
