import React from 'react';
import {
  PlusCircle,
  Printer,
  Download,
  RotateCcw,
  Users,
  Smartphone,
  FileText,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface UnitHeaderProps {
  onOpenCreateModal: () => void;
  onOpenPrintModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onOpenStaffModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenPasswordReset?: () => void;
  activeMainTab: 'docs' | 'permissions';
  onChangeMainTab: (tab: 'docs' | 'permissions') => void;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({
  onOpenCreateModal,
  onOpenPrintModal,
  onExportCSV,
  onResetData,
  onOpenStaffModal,
  onOpenRegisterModal,
  onOpenPasswordReset,
  activeMainTab,
  onChangeMainTab
}) => {
  return (
    <div className="bg-white px-4 md:px-6 py-3 border-b border-[#ebd4d4] shadow-xs no-print">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
        {/* Brand logo & Unit Information */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* National Emblem SVG */}
          <div className="relative w-11 h-11 shrink-0 rounded-full bg-radial from-[#ffd54f] via-[#d32f2f] to-[#b71c1c] p-0.5 border-2 border-[#b71c1c] shadow-xs flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-9 h-9" fill="none">
              <circle cx="50" cy="50" r="46" fill="#D32F2F" stroke="#FFD700" strokeWidth="2" />
              <circle cx="50" cy="80" r="14" fill="#FFC107" />
              <circle cx="50" cy="80" r="7" fill="#B71C1C" />
              <polygon
                points="50,18 58,35 77,35 62,47 67,65 50,54 33,65 38,47 23,35 42,35"
                fill="#FFEB3B"
                stroke="#F57F17"
                strokeWidth="1"
              />
              <path
                d="M 22 75 C 18 55, 25 35, 36 28"
                stroke="#FFD54F"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 78 75 C 82 55, 75 35, 64 28"
                stroke="#FFD54F"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Brand Text */}
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-extrabold text-[#b71c1c] tracking-wide uppercase">
                UBND XÃ TÂN AN
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#8b0000] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                Ký Số Ban Cơ Yếu VGCA
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">
              {activeMainTab === 'docs'
                ? 'Hệ thống Quản lý Văn bản, Điều hành tác nghiệp & Luân chuyển hồ sơ'
                : 'Hệ thống Phân quyền Quản trị, Vai trò Công vụ & Kiểm soát Bảo mật (RBAC)'}
            </p>
          </div>
        </div>

        {/* Center: Main Nav Tabs */}
        <div className="flex items-center gap-2 bg-gray-100/90 p-1 rounded-lg border border-gray-200 w-full sm:w-auto justify-center">
          <button
            onClick={() => onChangeMainTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'docs'
                ? 'bg-[#8b0000] text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quản Lý Văn Bản & Điều Hành</span>
          </button>

          <button
            onClick={() => onChangeMainTab('permissions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'permissions'
                ? 'bg-[#8b0000] text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Phân Quyền Quản Trị Hệ Thống</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 w-full lg:w-auto">
          {activeMainTab === 'docs' ? (
            <>
              <button
                onClick={onResetData}
                title="Đặt lại dữ liệu mẫu"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-xs font-semibold transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">Khôi phục</span>
              </button>

              <button
                onClick={onExportCSV}
                title="Xuất bảng kê Excel/CSV"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md text-xs font-semibold transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Xuất Excel</span>
              </button>

              <button
                onClick={onOpenPrintModal}
                title="In sổ văn bản đến / văn bản đi"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#8b0000]/30 text-[#8b0000] bg-red-50/60 hover:bg-red-100/60 rounded-md text-xs font-semibold transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#8b0000]" />
                <span>In Sổ</span>
              </button>

              <button
                onClick={onOpenStaffModal}
                title="Quản lý danh sách cán bộ và cấp tài khoản công vụ"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#b71c1c] text-[#b71c1c] bg-white hover:bg-red-50 rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#b71c1c]" />
                <span>Cán Bộ</span>
              </button>

              <button
                onClick={onOpenRegisterModal}
                title="Đăng ký tài khoản cán bộ và xác thực mã OTP điện thoại"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-amber-600 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                <span>Đăng Ký & OTP</span>
              </button>

              {onOpenPasswordReset && (
                <button
                  onClick={onOpenPasswordReset}
                  title="Khôi phục và cấp lại mật khẩu cho cán bộ công chức qua OTP và CCCD"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-red-700/60 text-[#8b0000] bg-red-50/70 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#8b0000]" />
                  <span>Cấp Mật Khẩu</span>
                </button>
              )}

              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-1.5 bg-[#b71c1c] hover:bg-[#a01515] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-xs active:translate-y-0.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>+ Tiếp Nhận</span>
              </button>
            </>
          ) : (
            <>
              {onOpenPasswordReset && (
                <button
                  onClick={onOpenPasswordReset}
                  title="Khôi phục và cấp lại mật khẩu cho cán bộ công chức qua OTP và CCCD"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-700/60 text-[#8b0000] bg-red-50/70 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#8b0000]" />
                  <span>Cấp Lại Mật Khẩu</span>
                </button>
              )}

              <button
                onClick={onOpenStaffModal}
                title="Quản lý danh sách cán bộ và cấp tài khoản công vụ"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#b71c1c] text-[#b71c1c] bg-white hover:bg-red-50 rounded-md text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#b71c1c]" />
                <span>Danh Sách Cán Bộ</span>
              </button>

              <button
                onClick={onOpenRegisterModal}
                title="Đăng ký tài khoản cán bộ và xác thực mã OTP điện thoại"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8b0000] hover:bg-[#a01515] text-white rounded-md text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Đăng Ký Tài Khoản & OTP</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
