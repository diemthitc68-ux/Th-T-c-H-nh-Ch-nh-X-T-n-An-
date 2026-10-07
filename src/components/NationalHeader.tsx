import React, { useState, useEffect } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { SystemUser } from '../types/user';

interface NationalHeaderProps {
  currentUserRole: string;
  onRoleChange: (role: string) => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  onConfirmLogout?: () => void;
  currentUser?: SystemUser;
}

export const NationalHeader: React.FC<NationalHeaderProps> = ({
  currentUserRole,
  onRoleChange,
  onLogout,
  onSwitchAccount,
  onConfirmLogout,
  currentUser
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      // Format in Vietnamese locale
      setTimeStr(now.toLocaleDateString('vi-VN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const badgeInitial = currentUser?.name
    ? currentUser.name.substring(0, 2).toUpperCase()
    : 'GĐ';

  return (
    <header className="bg-[#8b0000] text-white px-4 md:px-6 py-2 flex flex-col md:flex-row justify-between items-center text-xs border-b border-[#a01616] no-print">
      {/* Quốc hiệu & Tiêu ngữ */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left mb-1.5 md:mb-0">
        <span className="font-bold tracking-wider text-[11px] md:text-xs uppercase">
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        </span>
        <div className="text-[10.5px] italic text-amber-200 font-medium">
          Độc lập - Tự do - Hạnh phúc
        </div>
      </div>

      {/* Thông tin người dùng, Token Ban Cơ Yếu & thời gian */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5 text-[11.5px]">
        {/* Token VGCA Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/60 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            Token VGCA: Đã kết nối {currentUser?.vgcaCertInfo?.status ? `(${currentUser.vgcaCertInfo.status})` : ''}
          </span>
        </div>

        {/* Real-time system clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-amber-100 font-mono text-[11px] bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>{timeStr || 'Thứ Bảy, 04/10/2026 08:00:00'}</span>
        </div>

        {/* User profile area */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-red-900/60 pl-2 pr-2 py-0.5 rounded border border-red-800/80">
            <span
              id="userBadge"
              className="bg-[#ff9800] text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-xs"
            >
              {badgeInitial}
            </span>
            <div className="flex items-center gap-1">
              <span id="currentUserName" className="font-semibold text-white">
                {currentUser?.name || 'Quản trị viên (Admin)'}
              </span>
              <span className="text-amber-200 text-[10.5px] hidden sm:inline">
                ({currentUser?.role || currentUserRole})
              </span>
            </div>
          </div>

          {/* Switch Account Button */}
          <button
            onClick={onSwitchAccount || onLogout}
            className="border border-white/40 hover:border-white text-white hover:bg-white/10 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer whitespace-nowrap"
            title="Đổi tài khoản đăng nhập"
          >
            Đổi tài khoản
          </button>

          {/* Dedicated Logout Button */}
          <button
            onClick={onConfirmLogout || onLogout}
            className="bg-red-950/70 hover:bg-red-900 text-amber-200 hover:text-white border border-amber-300/50 hover:border-amber-300 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-2xs active:scale-95"
            title="Đăng xuất khỏi tài khoản Quản trị viên"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-300" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
