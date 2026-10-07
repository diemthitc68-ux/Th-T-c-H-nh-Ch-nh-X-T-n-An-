import React, { useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  User,
  Building,
  Paperclip,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  AlertTriangle,
  History,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';
import { DocumentItem, DocStatus } from '../types/document';
import { formatVNDate, getDueStatus } from '../utils/dateUtils';

interface DetailModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddHistoryEntry: (docId: number, action: string, note?: string) => void;
  onStatusChange: (id: number, newStatus: DocStatus) => void;
  onPrintRoutingSheet: (doc: DocumentItem) => void;
  onOpenDigitalSign: (doc: DocumentItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onAddHistoryEntry,
  onStatusChange,
  onPrintRoutingSheet,
  onOpenDigitalSign
}) => {
  const [newAction, setNewAction] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!isOpen || !doc) return null;

  const dueInfo = getDueStatus(doc.dueDate, doc.status);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    onAddHistoryEntry(doc.id, newAction.trim(), newNote.trim() || undefined);
    setNewAction('');
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl border border-gray-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                Hồ Sơ Văn Bản: <span className="font-mono">{doc.code}</span>
              </h3>
              <div className="text-[11px] text-amber-200">
                Sổ: Văn bản {doc.type} · Hình thức: {doc.category} · Ban hành/Tiếp nhận:{' '}
                {formatVNDate(doc.date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDigitalSign(doc)}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-950 px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Ký số chuyên dùng công vụ Ban Cơ Yếu"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-gray-950" />
              <span>{doc.digitalSignature?.isSigned ? 'Ký Lại / Ký Thêm VGCA' : 'Ký Số Ban Cơ Yếu'}</span>
            </button>

            <button
              onClick={() => onPrintRoutingSheet(doc)}
              title="In Phiếu giải quyết / Phiếu luân chuyển văn bản"
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Phiếu Xử Lý</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[82vh] overflow-y-auto text-xs">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Trạng thái hiện tại:</span>
              <select
                value={doc.status}
                onChange={(e) => onStatusChange(doc.id, e.target.value as DocStatus)}
                className={`font-bold text-xs px-2.5 py-1 rounded border ${
                  doc.status === 'Hoàn thành'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : doc.status === 'Chờ duyệt'
                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                    : doc.status === 'Đang xử lý'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-blue-50 text-blue-800 border-blue-300'
                }`}
              >
                <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Hạn xử lý:</span>
              <span className="font-mono font-bold text-gray-900 text-xs">
                {formatVNDate(doc.dueDate)}
              </span>
              {dueInfo.isOverdue ? (
                <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>{dueInfo.label}</span>
                </span>
              ) : dueInfo.isToday ? (
                <span className="font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                  Hạn hôm nay
                </span>
              ) : (
                <span className="text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded font-medium">
                  {dueInfo.label}
                </span>
              )}
            </div>
          </div>

          {/* Document Summary Box */}
          <div className="bg-red-50/30 p-3.5 rounded-lg border border-red-200/70">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#b71c1c] uppercase tracking-wide">
                Trích Yếu Nội Dung Văn Bản
              </span>
              {doc.urgent !== 'Bình thường' && (
                <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                  Độ khẩn: {doc.urgent}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-relaxed">
              {doc.summary}
            </p>
          </div>

          {/* AI / Regulatory Suggestion Box */}
          {doc.suggestion && (
            <div className="bg-[#f0fdf4] border-l-4 border-[#16a34a] p-3 rounded-r text-xs text-[#166534]">
              <div className="font-bold mb-1 flex items-center gap-1.5 text-[#15803d]">
                <span>💡 Gợi ý tham mưu & tác nghiệp tự động:</span>
              </div>
              <p className="leading-relaxed font-medium">
                {doc.suggestion}
              </p>
            </div>
          )}

          {/* VGCA Digital Signature Verification Card */}
          {doc.digitalSignature?.isSigned && (
            <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>CHỨNG THỰC CHỮ KÝ SỐ BAN CƠ YẾU CHÍNH PHỦ (VGCA)</span>
                </div>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  HỢP LỆ & NGUYÊN VẸN
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] bg-white p-2.5 rounded border border-emerald-200">
                <div>
                  <span className="text-gray-500 font-medium">Người ký:</span>{' '}
                  <strong className="text-gray-900">{doc.digitalSignature.signerName}</strong>{' '}
                  <span className="text-gray-600">({doc.digitalSignature.signerRole})</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Thời gian ký số:</span>{' '}
                  <span className="font-mono font-semibold text-gray-900">{doc.digitalSignature.signedTime}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Cơ quan cấp chứng thư:</span>{' '}
                  <span className="text-gray-800 font-medium">{doc.digitalSignature.certIssuer}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Mã Serial chứng thư:</span>{' '}
                  <span className="font-mono text-gray-800">{doc.digitalSignature.serialNumber}</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kiểm tra toàn vẹn: Văn bản gốc hợp lệ, không bị sửa đổi sau thời điểm ký số theo Nghị định 30/2020/NĐ-CP.</span>
              </div>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-gray-50/60 p-3.5 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Cơ quan ban hành / Nơi gửi:</div>
                  <div className="font-bold text-gray-800 text-xs">{doc.agency}</div>
                </div>
              </div>

              {doc.recipient && (
                <div className="flex items-start gap-2">
                  <Send className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">Nơi nhận / Đơn vị phối hợp:</div>
                    <div className="font-semibold text-gray-800 text-xs">{doc.recipient}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Cán bộ thụ lý & Bộ phận:</div>
                  <div className="font-bold text-gray-900 text-xs">
                    {doc.assignee} ({doc.role || 'Cán bộ phụ trách'})
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5">{doc.department}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-gray-500 font-medium">Thời gian luân chuyển:</div>
                  <div className="text-gray-800 text-xs">
                    Tiếp nhận: <span className="font-semibold">{formatVNDate(doc.date)}</span> · Hạn: <span className="font-semibold">{formatVNDate(doc.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Director Instruction (Ý kiến chỉ đạo) */}
          {doc.directorInstruction && (
            <div className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <span>Ý KIẾN CHỈ ĐẠO CỦA LÃNH ĐẠO UBND XÃ:</span>
              </div>
              <p className="text-amber-950 font-medium leading-relaxed italic">
                "{doc.directorInstruction}"
              </p>
            </div>
          )}

          {/* Attachments Section */}
          {doc.attachments && doc.attachments.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5 text-xs">
                <Paperclip className="w-3.5 h-3.5 text-gray-600" />
                <span>Tệp Số Hóa Đính Kèm ({doc.attachments.length}):</span>
              </h4>
              <div className="space-y-1.5">
                {doc.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="bg-red-100 text-red-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {file.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-gray-800 truncate font-medium">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-gray-400">({file.size})</span>
                    </div>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Đang mở tệp tin số hóa: ${file.name}`);
                      }}
                      className="text-[#b71c1c] hover:underline font-semibold text-xs shrink-0 ml-2"
                    >
                      Mở tệp
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow & Processing History Log (Luồng luân chuyển xử lý) */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5 text-xs">
              <History className="w-4 h-4 text-gray-600" />
              <span>Nhật Ký Luân Chuyển & Tiến Độ Xử Lý:</span>
            </h4>

            <div className="relative pl-5 border-l-2 border-red-300 space-y-3.5 my-2">
              {doc.history && doc.history.length > 0 ? (
                doc.history.map((entry) => (
                  <div key={entry.id} className="relative">
                    {/* Circle icon */}
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#b71c1c] border-2 border-white ring-2 ring-red-100" />

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-gray-900 text-xs">{entry.actor}</span>
                      <span className="text-[10.5px] font-mono text-gray-500">{entry.time}</span>
                    </div>
                    <div className="text-gray-800 font-medium text-xs mt-0.5">{entry.action}</div>
                    {entry.note && (
                      <div className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded p-1.5 mt-1 italic">
                        {entry.note}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic text-[11px]">
                  Chưa có nhật ký phát sinh ngoài việc tiếp nhận ban đầu.
                </div>
              )}
            </div>

            {/* Quick add progress entry */}
            <form onSubmit={handleAddNote} className="mt-4 pt-3 border-t border-gray-200">
              <span className="block font-bold text-gray-700 mb-1.5">
                Cập nhật tiến độ / Ý kiến xử lý mới:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Thao tác (VD: Hoàn thành dự thảo văn bản trả lời, Trình Lãnh đạo...)"
                  className="p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden text-xs"
                  required
                />
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ghi chú chi tiết thêm (nếu có)..."
                  className="p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#b71c1c] hover:bg-[#d32f2f] text-white rounded font-bold transition-colors cursor-pointer text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ghi Nhật Ký</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">Mã quản lý hệ thống: #{doc.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
