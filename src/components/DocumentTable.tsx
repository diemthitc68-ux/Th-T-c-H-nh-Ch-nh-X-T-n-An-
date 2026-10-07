import React from 'react';
import { Eye, Edit3, Trash2, AlertCircle, Clock, CheckCircle, Paperclip, ShieldCheck, Stamp } from 'lucide-react';
import { DocumentItem, DocStatus } from '../types/document';
import { formatVNDate, getDueStatus } from '../utils/dateUtils';

interface DocumentTableProps {
  documents: DocumentItem[];
  onStatusChange: (id: number, newStatus: DocStatus) => void;
  onDeleteDocument: (id: number) => void;
  onViewDocument: (doc: DocumentItem) => void;
  onEditDocument: (doc: DocumentItem) => void;
  onOpenDigitalSign: (doc: DocumentItem) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onStatusChange,
  onDeleteDocument,
  onViewDocument,
  onEditDocument,
  onOpenDigitalSign
}) => {
  if (documents.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 my-4">
        <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" />
        <h4 className="text-sm font-bold text-gray-700">Không tìm thấy văn bản phù hợp</h4>
        <p className="text-xs text-gray-500 mt-1">
          Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại các tiêu chí bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 mt-3">
      <table className="w-full border-collapse text-[12px] text-left">
        <thead>
          <tr className="bg-[#fcf5f5] text-gray-700 border-b border-gray-200">
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[130px]">
              SỐ / KÝ HIỆU
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[320px]">
              TRÍCH YẾU & GỢI Ý XỬ LÝ
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[160px]">
              TỆP ĐÍNH KÈM
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[150px]">
              CÁN BỘ & CHỨC VỤ
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[190px]">
              CHỨNG THƯ SỐ BAN CƠ YẾU
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[115px]">
              HẠN XỬ LÝ
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 min-w-[160px]">
              TRẠNG THÁI & KÝ DUYỆT
            </th>
            <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider text-gray-700 text-center min-w-[100px]">
              THAO TÁC
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {documents.map((doc) => {
            const dueInfo = getDueStatus(doc.dueDate, doc.status);
            const isCompleted = doc.status === 'Hoàn thành';

            // Primary attached file or first attachment
            const primaryFileName = doc.fileName || doc.attachments?.[0]?.name;
            const primaryFileSize = doc.fileSize || doc.attachments?.[0]?.size || '1.2 MB';

            return (
              <tr
                key={doc.id}
                className={`transition-colors hover:bg-gray-50/90 ${
                  dueInfo.isOverdue
                    ? 'bg-[#fff3f3] hover:bg-red-50/80 border-l-3 border-l-red-600'
                    : isCompleted
                    ? 'bg-emerald-50/20'
                    : ''
                }`}
              >
                {/* 1. SỐ / KÝ HIỆU */}
                <td className="py-3 px-3 align-top">
                  <div className="font-bold text-gray-900 text-xs font-mono">
                    {doc.code}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Ngày: {formatVNDate(doc.date)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <span
                      className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        doc.type === 'Đến'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : doc.type === 'Đi'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      Văn bản {doc.type}
                    </span>

                    {doc.digitalSignature?.isSigned && (
                      <span
                        onClick={() => onViewDocument(doc)}
                        className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1 py-0.5 rounded cursor-pointer hover:bg-emerald-200"
                        title={`Đã ký số VGCA bởi ${doc.digitalSignature.signerName}`}
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>KÝ SỐ VGCA</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* 2. TRÍCH YẾU & GỢI Ý XỬ LÝ */}
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="bg-[#ffebee] text-[#c62828] text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {doc.category}
                    </span>

                    {doc.urgent !== 'Bình thường' && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 ${
                          doc.urgent === 'HỎA TỐC'
                            ? 'bg-red-600 text-white animate-pulse'
                            : doc.urgent === 'THƯỢNG KHẨN'
                            ? 'bg-purple-700 text-white'
                            : 'bg-[#ffeb3b] text-[#856404]'
                        }`}
                      >
                        {doc.urgent}
                      </span>
                    )}

                    <span className="text-[10.5px] text-gray-500 ml-auto font-medium">
                      Nguồn: {doc.agency}
                    </span>
                  </div>

                  {/* Summary title */}
                  <div
                    onClick={() => onViewDocument(doc)}
                    className="font-semibold text-[#1a237e] hover:text-[#b71c1c] cursor-pointer leading-snug my-1 transition-colors"
                    title="Bấm để xem hồ sơ và tiến độ chi tiết"
                  >
                    {doc.summary}
                  </div>

                  {/* Hộp gợi ý xử lý tự động */}
                  <div className="bg-[#f0fdf4] border-l-3 border-[#16a34a] p-2 my-1.5 rounded-sm text-[11.5px] text-[#166534] leading-relaxed">
                    <div className="font-bold mb-0.5 flex items-center gap-1">
                      <span>💡 Gợi ý xử lý:</span>
                    </div>
                    <div>{doc.suggestion || 'Đang chờ phân luồng tác nghiệp và xin ý kiến Lãnh đạo'}</div>
                  </div>
                </td>

                {/* 3. TỆP ĐÍNH KÈM */}
                <td className="py-3 px-3 align-top">
                  {primaryFileName ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Mở tệp đính kèm: ${primaryFileName}`);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1967d2] px-2 py-1 rounded text-[11px] border border-[#c2d7fa] transition-colors leading-tight font-medium max-w-[155px] truncate"
                      title={`Tải về / Xem tệp: ${primaryFileName}`}
                    >
                      <Paperclip className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{primaryFileName}</span>
                      <small className="text-gray-500 shrink-0">({primaryFileSize})</small>
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-[11px]">Không có tệp</span>
                  )}
                </td>

                {/* 4. CÁN BỘ & CHỨC VỤ */}
                <td className="py-3 px-3 align-top">
                  <div className="font-bold text-gray-900 leading-snug">
                    {doc.assignee}
                  </div>
                  <div className="text-[11px] text-gray-600 leading-tight mt-0.5">
                    {doc.role || 'Cán bộ chuyên môn'}
                  </div>
                  {doc.department && (
                    <div className="text-[10.5px] text-gray-500 mt-1 flex items-center gap-1">
                      <span className="font-medium text-gray-400">Phòng:</span>
                      <span className="truncate max-w-[130px]">{doc.department}</span>
                    </div>
                  )}
                </td>

                {/* 5. CHỨNG THƯ SỐ BAN CƠ YẾU */}
                <td className="py-3 px-3 align-top">
                  {doc.digitalSignature?.isSigned ? (
                    <div>
                      <div className="inline-flex items-center gap-1 bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                        <CheckCircle className="w-3 h-3 text-[#2e7d32] shrink-0" />
                        <span>✔ Đã ký số VGCA</span>
                      </div>
                      <div className="text-[10.5px] text-gray-600 mt-1 font-medium leading-tight">
                        <div className="font-bold text-gray-800">{doc.digitalSignature.signerName}</div>
                        <div className="text-gray-500 text-[10px]">{doc.digitalSignature.signedTime}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-[11px]">Chưa ký số</span>
                  )}
                </td>

                {/* 6. HẠN XỬ LÝ */}
                <td className="py-3 px-3 align-top">
                  <div className="font-mono text-xs font-semibold text-gray-900">
                    {formatVNDate(doc.dueDate)}
                  </div>
                  <div className="mt-1">
                    {dueInfo.isOverdue ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/90 border border-red-200 px-1.5 py-0.5 rounded">
                        <span>⚠️ {dueInfo.label}</span>
                      </span>
                    ) : dueInfo.isToday ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                        <span>Hạn hôm nay</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Đã hoàn tất</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                        {dueInfo.label}
                      </span>
                    )}
                  </div>
                </td>

                {/* 7. TRẠNG THÁI & KÝ DUYỆT */}
                <td className="py-3 px-3 align-top">
                  <div className="space-y-1.5">
                    <select
                      value={doc.status}
                      onChange={(e) => onStatusChange(doc.id, e.target.value as DocStatus)}
                      className={`w-full text-xs font-semibold py-1 px-1.5 rounded border cursor-pointer focus:outline-hidden ${
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

                    {!doc.digitalSignature?.isSigned ? (
                      <button
                        onClick={() => onOpenDigitalSign(doc)}
                        className="w-full bg-[#1565c0] hover:bg-[#0d47a1] text-white py-1 px-2 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Stamp className="w-3 h-3" />
                        <span>Ký số VGCA</span>
                      </button>
                    ) : (
                      <div className="text-[10.5px] text-[#2e7d32] font-bold text-center bg-emerald-50/70 border border-emerald-200 py-0.5 rounded">
                        Hoàn thành ban hành
                      </div>
                    )}
                  </div>
                </td>

                {/* 7. THAO TÁC */}
                <td className="py-3 px-3 align-top text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onOpenDigitalSign(doc)}
                      title={
                        doc.digitalSignature?.isSigned
                          ? 'Đã ký số Ban Cơ Yếu - Bấm để ký lại / ký bổ sung'
                          : 'Ký số chuyên dùng Ban Cơ Yếu (VGCA)'
                      }
                      className={`p-1 rounded transition-colors ${
                        doc.digitalSignature?.isSigned
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-[#8b0000] hover:bg-red-100/60'
                      }`}
                    >
                      <Stamp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onViewDocument(doc)}
                      title="Xem chi tiết & Nhật ký"
                      className="p-1 text-blue-700 hover:bg-blue-100/60 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEditDocument(doc)}
                      title="Chỉnh sửa văn bản"
                      className="p-1 text-amber-700 hover:bg-amber-100/60 rounded transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      title="Xóa văn bản"
                      className="p-1 text-red-600 hover:bg-red-100/60 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
