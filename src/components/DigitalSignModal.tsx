import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  FileCheck2,
  Lock,
  Building2,
  Eye,
  Stamp
} from 'lucide-react';
import { DocumentItem, DigitalSignatureInfo } from '../types/document';
import { VGCA_CERTIFICATES, VGCACertificate } from '../data/initialDocs';
import { TODAY_ISO, formatVNDate } from '../utils/dateUtils';

interface DigitalSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onSignSuccess: (docId: number, signatureInfo: DigitalSignatureInfo) => void;
}

export const DigitalSignModal: React.FC<DigitalSignModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onSignSuccess
}) => {
  const [selectedCertId, setSelectedCertId] = useState<string>(VGCA_CERTIFICATES[0].id);
  const [pinCode, setPinCode] = useState('123456');
  const [signaturePosition, setSignaturePosition] = useState<'bottom-right' | 'approval-box'>('bottom-right');
  const [isSigning, setIsSigning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !doc) return null;

  const currentCert = VGCA_CERTIFICATES.find((c) => c.id === selectedCertId) || VGCA_CERTIFICATES[0];

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pinCode || pinCode.length < 4) {
      setErrorMsg('Vui lòng nhập mã PIN bảo mật Token Ban Cơ yếu (tối thiểu 4 số).');
      return;
    }

    setIsSigning(true);
    setErrorMsg('');

    // Simulate cryptographic HSM / Token signing delay
    setTimeout(() => {
      const now = new Date();
      const signedTime = `${TODAY_ISO} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

      const sigInfo: DigitalSignatureInfo = {
        isSigned: true,
        signerName: currentCert.name,
        signerRole: currentCert.role,
        signedTime,
        certIssuer: 'Ban Cơ yếu Chính phủ - Cục Chứng thực số và Bảo mật thông tin (VGCA)',
        serialNumber: currentCert.serial,
        validFrom: '2024-01-01',
        validTo: '2029-01-01',
        signatureType: currentCert.type,
        tamperStatus: 'valid'
      };

      setIsSigning(false);
      onSignSuccess(doc.id, sigInfo);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl border border-gray-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-red-950 flex items-center justify-center font-black text-xs shadow-xs">
              VGCA
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                Ký Số Chuyên Dùng Công Vụ - Ban Cơ Yếu Chính Phủ
              </h3>
              <div className="text-[11px] text-amber-200">
                Xác thực danh tính điện tử & toàn vẹn văn bản theo Nghị định 30/2020/NĐ-CP
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSign} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Document Summary Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-700">Văn bản ký duyệt:</span>
              <span className="font-mono font-bold text-[#b71c1c] text-xs">
                {doc.code}
              </span>
            </div>
            <div className="text-gray-900 font-semibold line-clamp-2 leading-relaxed">
              {doc.summary}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Hình thức: <span className="font-medium text-gray-800">{doc.category}</span> · Ngày lập: {formatVNDate(doc.date)}
            </div>
          </div>

          {/* VGCA Connection Info Box */}
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-[11px] space-y-1 text-slate-700">
            <div><b>Hệ thống kết nối:</b> Cổng Dịch vụ Chứng thực Chữ ký số Chuyên dùng Chính phủ</div>
            <div><b>Dịch vụ TSA (Thời gian):</b> <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">http://ca.gov.vn/tsa</code> <span className="text-emerald-700 font-bold ml-1">(Hoạt động)</span></div>
            <div><b>Chuẩn định dạng:</b> CAdES / PAdES (Nghị định 30/2020/NĐ-CP)</div>
          </div>

          {/* Certificate Selection */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chọn Chứng Thư Số Ban Cơ Yếu (USB Token / SIM PKI):</span>
            </label>
            <div className="space-y-2">
              {VGCA_CERTIFICATES.map((cert) => {
                const isSelected = selectedCertId === cert.id;
                return (
                  <label
                    key={cert.id}
                    onClick={() => setSelectedCertId(cert.id)}
                    className={`flex items-start justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="vgca_cert"
                        checked={isSelected}
                        onChange={() => setSelectedCertId(cert.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                          <span>{cert.name}</span>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.2 rounded font-semibold ${
                              cert.type === 'organization'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {cert.type === 'organization' ? 'Con dấu cơ quan' : 'Cá nhân lãnh đạo'}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5">
                          {cert.role} · {cert.unit}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          Cơ quan cấp: {cert.issuer} · Serial: {cert.serial}
                        </div>
                      </div>
                    </div>

                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 ${
                        isSelected ? 'text-emerald-600' : 'text-gray-300'
                      }`}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* PIN Input & Signature Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Mã PIN Token công vụ: <span className="text-red-600">*</span></span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Nhập mã PIN Token"
                  className="w-full p-2 border border-gray-300 rounded font-mono font-bold tracking-widest focus:border-[#b71c1c] focus:outline-hidden"
                  required
                />
              </div>
              <span className="text-[10.5px] text-gray-400 mt-0.5 block">
                Mã PIN thử nghiệm: <span className="font-mono font-bold text-gray-700">123456</span>
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Stamp className="w-3.5 h-3.5 text-blue-600" />
                <span>Vị trí hiển thị dấu ký số:</span>
              </label>
              <select
                value={signaturePosition}
                onChange={(e) => setSignaturePosition(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
              >
                <option value="bottom-right">Góc dưới cùng bên phải (Chữ ký & Dấu)</option>
                <option value="approval-box">Khung phê duyệt của Lãnh đạo</option>
              </select>
            </div>
          </div>

          {/* Live Preview of Visual Signature Stamp */}
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-700 text-xs flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span>Mẫu dấu ký số hiển thị trên văn bản (Nghị định 30/2020/NĐ-CP):</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                Chuẩn VGCA
              </span>
            </div>

            {currentCert.type === 'organization' ? (
              /* Dấu điện tử cơ quan tròn màu đỏ */
              <div className="p-3 border-2 border-red-600 rounded bg-red-50/30 flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-red-600 flex flex-col items-center justify-center text-center p-1 text-red-700 shrink-0 font-bold">
                  <span className="text-[8px] leading-tight">UBND XÃ</span>
                  <span className="text-[9px] uppercase font-black">TÂN AN</span>
                  <span className="text-[7.5px] mt-0.5">★ ★ ★</span>
                </div>
                <div>
                  <div className="font-extrabold text-red-800 text-xs uppercase">
                    Cơ quan ký: ỦY BAN NHÂN DÂN XÃ TÂN AN
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium">
                    Chứng thư số: Ban Cơ yếu Chính phủ (VGCA)
                  </div>
                  <div className="text-[10.5px] text-gray-500 font-mono">
                    Ngày ký: {formatVNDate(TODAY_ISO)} (Thời gian máy chủ bảo mật)
                  </div>
                </div>
              </div>
            ) : (
              /* Dấu chữ ký số cá nhân màu xanh */
              <div className="p-3 border-2 border-blue-500 rounded bg-blue-50/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-900 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>KÝ BỞI: {currentCert.name.toUpperCase()}</span>
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium mt-0.5">
                    Chức vụ: {currentCert.role} - UBND Xã Tân An
                  </div>
                  <div className="text-[10.5px] text-gray-500 font-mono mt-0.5">
                    Tổ chức cấp: Ban Cơ yếu Chính phủ · Mã số: {currentCert.serial}
                  </div>
                </div>

                <div className="text-right text-blue-800 italic font-serif text-sm font-bold border-l pl-3 border-blue-200">
                  Phan Văn Hùng
                </div>
              </div>
            )}
          </div>

          {/* Cryptographic Proof Notice */}
          <div className="text-[10.5px] text-gray-500 leading-normal flex items-start gap-1.5 bg-gray-50 p-2.5 rounded border border-gray-200">
            <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <span>
              Hệ thống áp dụng thuật toán chữ ký số RSA-2048/SHA-256 theo tiêu chuẩn kỹ thuật về chữ ký số chuyên dùng công vụ do Ban Cơ yếu Chính phủ quy định. Văn bản sau khi ký sẽ được khóa toàn vẹn dữ liệu.
            </span>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSigning}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSigning}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#b71c1c] hover:bg-[#a01515] text-white rounded font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isSigning ? 'Đang Ký Số VGCA...' : 'Ký Phê Duyệt Văn Bản'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
