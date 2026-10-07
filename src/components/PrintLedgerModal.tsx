import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import { DocumentItem, DocType } from '../types/document';
import { formatVNDate } from '../utils/dateUtils';

interface PrintLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  singleDocToPrint?: DocumentItem | null;
}

export const PrintLedgerModal: React.FC<PrintLedgerModalProps> = ({
  isOpen,
  onClose,
  documents,
  singleDocToPrint
}) => {
  const [ledgerType, setLedgerType] = useState<DocType | 'all'>('all');

  if (!isOpen) return null;

  const filteredDocs = singleDocToPrint
    ? [singleDocToPrint]
    : documents.filter((d) => (ledgerType === 'all' ? true : d.type === ledgerType));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border border-gray-300 overflow-hidden my-6">
        {/* Modal Controls (Not printed) */}
        <div className="bg-[#8b0000] text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="font-bold text-sm md:text-base flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <span>
              {singleDocToPrint
                ? `Phiếu Giải Quyết & Luân Chuyển Văn Bản: ${singleDocToPrint.code}`
                : 'Sổ Đăng Ký Quản Lý Văn Bản (Mẫu Chuẩn Nghị Định 30/2020/NĐ-CP)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!singleDocToPrint && (
              <select
                value={ledgerType}
                onChange={(e) => setLedgerType(e.target.value as any)}
                className="bg-red-950 text-white border border-red-800 rounded px-2.5 py-1 text-xs"
              >
                <option value="all">Tất cả sổ (Đến & Đi)</option>
                <option value="Đến">Chỉ Sổ Văn Bản Đến</option>
                <option value="Đi">Chỉ Sổ Văn Bản Đi</option>
                <option value="Nội bộ">Chỉ Sổ Văn Bản Nội Bộ</option>
              </select>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay / Xuất PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 bg-white max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {/* Header Quốc hiệu / Cơ quan */}
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div className="text-center leading-tight">
              <div className="text-xs font-bold uppercase text-gray-800">
                ỦY BAN NHÂN DÂN XÃ TÂN AN
              </div>
              <div className="text-xs font-semibold text-gray-700 mt-0.5">
                VĂN PHÒNG HỘI ĐỒNG NHÂN DÂN & ỦY BAN NHÂN DÂN
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Số: ...... /S-UBND
              </div>
            </div>

            <div className="text-center leading-tight">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-900">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-xs font-semibold italic text-gray-800 underline decoration-1 underline-offset-4 mt-0.5">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="text-[11px] text-gray-600 italic mt-2">
                Tân An, ngày 04 tháng 10 năm 2026
              </div>
            </div>
          </div>

          {singleDocToPrint ? (
            /* Single Document Routing Slip (Phiếu giải quyết văn bản) */
            <div className="space-y-4">
              <div className="text-center my-4">
                <h2 className="text-base font-bold uppercase tracking-wider text-gray-900">
                  PHIẾU GIẢI QUYẾT VĂN BẢN ĐẾN / ĐI
                </h2>
                <div className="text-xs italic text-gray-600">
                  (Kèm theo hồ sơ số: {singleDocToPrint.code})
                </div>
              </div>

              <table className="w-full border border-gray-400 text-xs border-collapse">
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50 w-1/4">
                      Số / Ký hiệu:
                    </td>
                    <td className="p-2 border border-gray-400 font-mono font-bold">
                      {singleDocToPrint.code}
                    </td>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50 w-1/4">
                      Ngày văn bản:
                    </td>
                    <td className="p-2 border border-gray-400 font-mono">
                      {formatVNDate(singleDocToPrint.date)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50">
                      Cơ quan ban hành:
                    </td>
                    <td className="p-2 border border-gray-400" colSpan={3}>
                      {singleDocToPrint.agency}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50">
                      Trích yếu nội dung:
                    </td>
                    <td className="p-2 border border-gray-400 font-medium" colSpan={3}>
                      {singleDocToPrint.summary}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50">
                      Độ khẩn / Hình thức:
                    </td>
                    <td className="p-2 border border-gray-400">
                      {singleDocToPrint.category} ({singleDocToPrint.urgent})
                    </td>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50">
                      Hạn giải quyết:
                    </td>
                    <td className="p-2 border border-gray-400 font-bold text-red-700">
                      {formatVNDate(singleDocToPrint.dueDate)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50">
                      Cán bộ & Bộ phận thụ lý:
                    </td>
                    <td className="p-2 border border-gray-400 font-bold" colSpan={3}>
                      {singleDocToPrint.assignee} ({singleDocToPrint.role || 'Cán bộ thụ lý'}) -{' '}
                      {singleDocToPrint.department}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-400 font-bold bg-gray-50">
                      Ý kiến chỉ đạo của Lãnh đạo UBND:
                    </td>
                    <td
                      className="p-3 border border-gray-400 italic text-gray-800 min-h-[60px]"
                      colSpan={3}
                    >
                      {singleDocToPrint.directorInstruction || 'Chưa có bút phê chỉ đạo cụ thể.'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Signing Blocks */}
              <div className="grid grid-cols-2 text-center pt-8 text-xs font-semibold">
                <div>
                  <div className="font-bold uppercase text-gray-800">CÁN BỘ THỤ LÝ</div>
                  <div className="text-[11px] italic font-normal text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16"></div>
                  <div className="font-bold">{singleDocToPrint.assignee}</div>
                </div>

                <div>
                  <div className="font-bold uppercase text-gray-800">THỦ TRƯỞNG CƠ QUAN PHÊ DUYỆT</div>
                  <div className="text-[11px] italic font-normal text-gray-500">(Ký, đóng dấu)</div>
                  <div className="h-16"></div>
                  <div className="font-bold">Chủ tịch UBND Xã Tân An</div>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-document Ledger Table */
            <div>
              <div className="text-center my-4">
                <h2 className="text-base font-bold uppercase tracking-wider text-gray-900">
                  {ledgerType === 'Đến'
                    ? 'SỔ ĐĂNG KÝ VĂN BẢN ĐẾN'
                    : ledgerType === 'Đi'
                    ? 'SỔ THEO DÕI VĂN BẢN ĐI'
                    : 'BẢNG KÊ QUẢN LÝ VĂN BẢN & ĐIỀU HÀNH CÔNG VIỆC'}
                </h2>
                <div className="text-xs italic text-gray-600 mt-1">
                  Năm công tác: 2026 · Đơn vị: Ủy ban nhân dân Xã Tân An
                </div>
              </div>

              <table className="w-full border border-gray-400 text-[11px] border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100 text-gray-900 text-center font-bold">
                    <th className="p-1.5 border border-gray-400 w-8">STT</th>
                    <th className="p-1.5 border border-gray-400 w-24">Số / Ký hiệu</th>
                    <th className="p-1.5 border border-gray-400 w-20">Ngày VB</th>
                    <th className="p-1.5 border border-gray-400 w-20">Loại sổ</th>
                    <th className="p-1.5 border border-gray-400">Trích yếu nội dung</th>
                    <th className="p-1.5 border border-gray-400 w-32">Cơ quan ban hành / Gửi</th>
                    <th className="p-1.5 border border-gray-400 w-28">Người thụ lý</th>
                    <th className="p-1.5 border border-gray-400 w-20">Hạn giải quyết</th>
                    <th className="p-1.5 border border-gray-400 w-20">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="p-1.5 border border-gray-400 text-center font-mono">{idx + 1}</td>
                      <td className="p-1.5 border border-gray-400 font-mono font-bold">{doc.code}</td>
                      <td className="p-1.5 border border-gray-400 text-center">{formatVNDate(doc.date)}</td>
                      <td className="p-1.5 border border-gray-400 text-center font-medium">VB {doc.type}</td>
                      <td className="p-1.5 border border-gray-400">
                        <span className="font-semibold text-gray-900">{doc.summary}</span>
                        {doc.directorInstruction && (
                          <div className="text-[10px] italic text-gray-600 mt-0.5">
                            Chỉ đạo: {doc.directorInstruction}
                          </div>
                        )}
                      </td>
                      <td className="p-1.5 border border-gray-400 text-gray-700">{doc.agency}</td>
                      <td className="p-1.5 border border-gray-400 font-medium">{doc.assignee}</td>
                      <td className="p-1.5 border border-gray-400 text-center font-mono">
                        {formatVNDate(doc.dueDate)}
                      </td>
                      <td className="p-1.5 border border-gray-400 text-center font-bold">
                        {doc.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 text-center pt-8 text-xs font-semibold">
                <div>
                  <div className="font-bold uppercase text-gray-800">NGƯỜI LẬP SỔ (VĂN THƯ)</div>
                  <div className="text-[11px] italic font-normal text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-14"></div>
                  <div className="font-bold">Lê Thu Hương</div>
                </div>

                <div>
                  <div className="font-bold uppercase text-gray-800">XÁC NHẬN CỦA LÃNH ĐẠO UBND XÃ</div>
                  <div className="text-[11px] italic font-normal text-gray-500">(Ký, ghi rõ họ tên, đóng dấu)</div>
                  <div className="h-14"></div>
                  <div className="font-bold">Chủ tịch UBND Xã Tân An</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
