import React from 'react';
import { LogOut, X, ShieldAlert, User, KeyRound, CheckCircle2 } from 'lucide-react';
import { SystemUser } from '../types/user';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  currentUser: SystemUser;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
  currentUser
}) => {
  if (!isOpen) return null;

  const isAdmin =
    currentUser.roleId === 'SUPER_ADMIN' ||
    currentUser.roleId === 'admin' ||
    currentUser.role?.includes('SUPER_ADMIN') ||
    currentUser.user === 'hpkinh.tanan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-red-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-5 py-3 flex justify-between items-center border-b border-red-900">
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-sm uppercase tracking-wide">
              {isAdmin ? 'Đăng Xuất Tài Khoản Quản Trị Viên' : 'Đăng Xuất Tài Khoản Cán Bộ'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-sm cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3 text-red-900">
            <ShieldAlert className="w-5 h-5 text-[#8b0000] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-[#8b0000] mb-0.5">
                Xác nhận kết thúc phiên làm việc an toàn?
              </div>
              <p className="text-[11.5px] leading-relaxed text-gray-700">
                Đồng chí đang chuẩn bị đăng xuất khỏi tài khoản{' '}
                <strong>{currentUser.name}</strong>. Phiên ký số chuyên dùng VGCA và các thẩm quyền tác nghiệp sẽ được khóa lại.
              </p>
            </div>
          </div>

          {/* Current User Snapshot Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider text-gray-500">
              Thông tin phiên làm việc hiện tại:
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8b0000] to-[#d32f2f] text-white font-extrabold flex items-center justify-center text-sm shadow-xs border border-red-700">
                {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  {isAdmin && (
                    <span className="bg-amber-100 text-[#8b0000] text-[9.5px] font-extrabold px-1.5 py-0.2 rounded border border-amber-300">
                      SUPER_ADMIN
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-[11px]">
                  {currentUser.position || 'Giám đốc Trung tâm Hành chính công'}
                </div>
                <div className="font-mono text-[10.5px] text-gray-500">
                  Username: <strong className="text-gray-800">@{currentUser.username || currentUser.user}</strong> · Cơ quan: {currentUser.agency || 'UBND XÃ TÂN AN'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 text-[10.5px] text-emerald-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trạng thái: Đang hoạt động bình thường</span>
              </span>
              <span className="font-mono text-gray-500">IP: 192.168.1.100</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 italic">
            * Thao tác đăng xuất sẽ được lưu vết vào Sổ Nhật ký Kiểm toán (Audit Log) theo Nghị định 30/2020/NĐ-CP.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md font-semibold text-xs transition-colors cursor-pointer"
          >
            Hủy bỏ / Ở lại
          </button>
          <button
            type="button"
            onClick={onConfirmLogout}
            className="px-4 py-2 bg-[#8b0000] hover:bg-[#a01515] text-white rounded-md font-bold text-xs uppercase tracking-wide transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-300" />
            <span>Đăng Xuất An Toàn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
