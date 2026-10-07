export type DocType = 'Đến' | 'Đi' | 'Nội bộ';

export type DocCategory =
  | 'Công văn'
  | 'Quyết định'
  | 'Tờ trình'
  | 'Kế hoạch'
  | 'Thông báo'
  | 'Báo cáo'
  | 'Chỉ thị'
  | 'Giấy mời'
  | 'Biên bản';

export type UrgencyLevel = 'Bình thường' | 'KHẨN' | 'HỎA TỐC' | 'THƯỢNG KHẨN';

export type DocStatus = 'Mới tiếp nhận' | 'Đang xử lý' | 'Chờ duyệt' | 'Hoàn thành';

export interface WorkflowEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
  note?: string;
  statusAfter: DocStatus;
}

export interface DigitalSignatureInfo {
  isSigned: boolean;
  signerName?: string;
  signerRole?: string;
  signedTime?: string;
  certIssuer?: string; // Ban Cơ yếu Chính phủ (VGCA)
  serialNumber?: string;
  validFrom?: string;
  validTo?: string;
  signatureType?: 'personal' | 'organization'; // Chữ ký số cá nhân / Dấu số cơ quan
  tamperStatus?: 'valid' | 'invalid';
}

export interface DocumentItem {
  id: number;
  code: string; // Số / Ký hiệu (e.g., 142/UBND-VP)
  date: string; // Ngày văn bản (YYYY-MM-DD)
  receivedDate?: string; // Ngày tiếp nhận
  type: DocType;
  category: DocCategory;
  urgent: UrgencyLevel;
  summary: string; // Trích yếu nội dung
  note?: string; // Ghi chú tóm tắt
  agency: string; // Cơ quan ban hành / Nơi gửi
  recipient?: string; // Nơi nhận / Địa chỉ gửi đến
  department: string; // Bộ phận chuyên môn (e.g. Văn phòng, Tư pháp, Địa chính...)
  assignee: string; // Cán bộ thụ lý
  role?: string; // Chức danh cán bộ
  dueDate: string; // Hạn xử lý (YYYY-MM-DD)
  status: DocStatus;
  directorInstruction?: string; // Ý kiến chỉ đạo của Lãnh đạo
  suggestion?: string; // Gợi ý tham mưu & tác nghiệp tự động
  fileName?: string; // Tệp đính kèm chính
  fileSize?: string; // Dung lượng tệp
  attachments?: {
    name: string;
    size: string;
    type: 'pdf' | 'docx' | 'xlsx';
  }[];
  digitalSignature?: DigitalSignatureInfo; // Chữ ký số chuyên dùng Ban Cơ Yếu Chính Phủ
  history: WorkflowEntry[];
}

export type StatFilterType = 'all' | 'new' | 'processing' | 'pending' | 'done' | 'overdue';
