import React, { useState, useEffect } from 'react';
import { X, Save, Paperclip, AlertCircle, Sparkles, Lightbulb } from 'lucide-react';
import {
  DocumentItem,
  DocType,
  DocCategory,
  UrgencyLevel,
  DocStatus
} from '../types/document';
import { STAFF_LIST, generateSmartSuggestion } from '../data/initialDocs';
import { TODAY_ISO } from '../utils/dateUtils';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Partial<DocumentItem>) => void;
  editDocument?: DocumentItem | null;
  currentUserRole: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editDocument,
  currentUserRole
}) => {
  const [docType, setDocType] = useState<DocType>('Đến');
  const [code, setCode] = useState('');
  const [date, setDate] = useState(TODAY_ISO);
  const [category, setCategory] = useState<DocCategory>('Công văn');
  const [urgent, setUrgent] = useState<UrgencyLevel>('Bình thường');
  const [summary, setSummary] = useState('');
  const [agency, setAgency] = useState('');
  const [selectedStaffCombined, setSelectedStaffCombined] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<DocStatus>('Mới tiếp nhận');
  const [suggestion, setSuggestion] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-calculate default due date (+7 days)
  const getDefaultDueDate = () => {
    const d = new Date(TODAY_ISO);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (editDocument) {
      setDocType(editDocument.type);
      setCode(editDocument.code);
      setDate(editDocument.date);
      setCategory(editDocument.category);
      setUrgent(editDocument.urgent);
      setSummary(editDocument.summary);
      setAgency(editDocument.agency || (editDocument.type === 'Đi' ? 'UBND Xã Tân An' : 'Văn phòng HĐND & UBND Huyện'));
      setDueDate(editDocument.dueDate);
      setStatus(editDocument.status);
      setSuggestion(editDocument.suggestion || generateSmartSuggestion(editDocument.summary, editDocument.category));
      setFileName(editDocument.fileName || editDocument.attachments?.[0]?.name || '');
      setFileSize(editDocument.fileSize || editDocument.attachments?.[0]?.size || '');
      
      const foundStaff = STAFF_LIST.find((s) => s.name === editDocument.assignee);
      if (foundStaff) {
        setSelectedStaffCombined(`${foundStaff.name}__${foundStaff.role}__${foundStaff.department}`);
      } else {
        setSelectedStaffCombined(`${STAFF_LIST[0].name}__${STAFF_LIST[0].role}__${STAFF_LIST[0].department}`);
      }
      setErrorMsg('');
    } else {
      // Default reset
      setDocType('Đến');
      setCode(`.../UBND-${new Date().getFullYear()}`);
      setDate(TODAY_ISO);
      setCategory('Công văn');
      setUrgent('Bình thường');
      setSummary('');
      setAgency('Văn phòng HĐND & UBND Huyện');
      setSelectedStaffCombined(`${STAFF_LIST[3].name}__${STAFF_LIST[3].role}__${STAFF_LIST[3].department}`); // Huỳnh Phú Kính
      setDueDate(getDefaultDueDate());
      setStatus('Mới tiếp nhận');
      setSuggestion('Đang phân tích nội dung để xuất phương án tham mưu...');
      setFileName('');
      setFileSize('');
      setErrorMsg('');
    }
  }, [editDocument, isOpen]);

  // Update suggestions dynamically as summary or category changes
  const handleSummaryChange = (val: string) => {
    setSummary(val);
    setSuggestion(generateSmartSuggestion(val, category));
  };

  const handleCategoryChange = (val: DocCategory) => {
    setCategory(val);
    setSuggestion(generateSmartSuggestion(summary, val));
  };

  // Handle file attachment input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setErrorMsg('Vui lòng nhập Số / Ký hiệu văn bản.');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('Vui lòng nhập Trích yếu nội dung văn bản.');
      return;
    }
    if (!selectedStaffCombined) {
      setErrorMsg('Vui lòng chọn cán bộ & chức vụ phụ trách.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Vui lòng chọn Hạn xử lý.');
      return;
    }

    const [staffName, staffRole, staffDept] = selectedStaffCombined.split('__');

    const payload: Partial<DocumentItem> = {
      type: docType,
      code: code.trim(),
      date,
      category,
      urgent,
      summary: summary.trim(),
      agency: agency.trim() || (docType === 'Đi' ? 'UBND Xã Tân An' : 'Văn phòng HĐND & UBND Huyện'),
      department: staffDept,
      assignee: staffName,
      role: staffRole,
      dueDate,
      status,
      suggestion: suggestion.trim(),
      fileName: fileName || `${code.replace(/[^a-zA-Z0-9]/g, '_') || 'VB'}_Van_ban.pdf`,
      fileSize: fileSize || '1.2 MB'
    };

    if (fileName) {
      payload.attachments = [
        {
          name: fileName,
          size: fileSize || '1.2 MB',
          type: fileName.endsWith('.xlsx') ? 'xlsx' : fileName.endsWith('.docx') ? 'docx' : 'pdf'
        }
      ];
    }

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-gray-300 overflow-hidden my-6">
        {/* Modal Title Header */}
        <div className="bg-[#8b0000] text-white px-5 py-3 flex items-center justify-between">
          <div className="font-bold text-sm md:text-base flex items-center gap-2">
            <span>
              {editDocument
                ? `Cập Nhật Hồ Sơ: ${editDocument.code}`
                : 'Tiếp Nhận & Đính Kèm Tệp Văn Bản'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[85vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Row 1: Loại văn bản & Số Ký hiệu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Loại văn bản:
              </label>
              <select
                value={docType}
                onChange={(e) => {
                  const val = e.target.value as DocType;
                  setDocType(val);
                  if (val === 'Đi') {
                    setAgency('UBND Xã Tân An');
                  } else {
                    setAgency('Văn phòng HĐND & UBND Huyện');
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
              >
                <option value="Đến">Văn bản đến</option>
                <option value="Đi">Văn bản đi</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Số / Ký hiệu: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: 145/UBND-VP"
                className="w-full p-2 border border-gray-300 rounded font-mono font-bold focus:border-[#b71c1c] focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Form Row 2: Hình thức & Độ khẩn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Hình thức văn bản:
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as DocCategory)}
                className="w-full p-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
              >
                <option value="Công văn">Công văn</option>
                <option value="Tờ trình">Tờ trình</option>
                <option value="Quyết định">Quyết định</option>
                <option value="Thông báo">Thông báo</option>
                <option value="Kế hoạch">Kế hoạch</option>
                <option value="Báo cáo">Báo cáo</option>
                <option value="Chỉ thị">Chỉ thị</option>
                <option value="Giấy mời">Giấy mời</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Độ khẩn:</label>
              <select
                value={urgent}
                onChange={(e) => setUrgent(e.target.value as UrgencyLevel)}
                className="w-full p-2 border border-gray-300 rounded font-bold focus:border-[#b71c1c] focus:outline-hidden"
              >
                <option value="Bình thường">Bình thường</option>
                <option value="KHẨN">KHẨN</option>
                <option value="HỎA TỐC">HỎA TỐC</option>
              </select>
            </div>
          </div>

          {/* Trích yếu nội dung */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Trích yếu nội dung: <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="Nhập tóm tắt nội dung để nhận gợi ý xử lý tự động..."
              className="w-full p-2.5 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden font-medium leading-relaxed"
              required
            />
          </div>

          {/* Hộp gợi ý xử lý tự động trong modal */}
          <div className="bg-[#f0fdf4] border-l-4 border-[#16a34a] p-3 rounded-r text-xs text-[#166534]">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-[#15803d]">
              <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Gợi ý tham mưu & xử lý:</span>
            </div>
            <div className="leading-relaxed font-medium">
              {suggestion || 'Đang phân tích nội dung để xuất phương án...'}
            </div>
          </div>

          {/* Form Row 3: Cán bộ & Chức vụ phụ trách + Hạn xử lý */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Cán bộ & Chức vụ phụ trách: <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedStaffCombined}
                onChange={(e) => setSelectedStaffCombined(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-semibold focus:border-[#b71c1c] focus:outline-hidden"
                required
              >
                <option value="">-- Chọn cán bộ thụ lý --</option>
                {STAFF_LIST.map((s) => (
                  <option
                    key={s.name}
                    value={`${s.name}__${s.role}__${s.department}`}
                  >
                    {s.name} - {s.role} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Hạn xử lý: <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono font-bold focus:border-[#b71c1c] focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Cơ quan ban hành & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Cơ quan ban hành / Nơi gửi:
              </label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="VD: Văn phòng HĐND & UBND Huyện"
                className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Trạng thái tiến độ:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DocStatus)}
                className="w-full p-2 border border-gray-300 rounded font-bold focus:border-[#b71c1c] focus:outline-hidden"
              >
                <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Đính kèm tệp văn bản */}
          <div className="border border-dashed border-gray-300 p-3 rounded bg-gray-50/60">
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
              <span>Đính kèm tệp văn bản (PDF, Word, Scan):</span>
            </label>
            <input
              type="file"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.xlsx"
              className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs cursor-pointer"
            />
            {fileName && (
              <div className="mt-1.5 text-[11px] text-blue-700 font-mono font-medium flex items-center gap-1">
                <span>📎 Đã chọn: {fileName}</span>
                {fileSize && <span className="text-gray-500">({fileSize})</span>}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b71c1c] hover:bg-[#a01515] text-white rounded font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Vào Hệ Thống</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
