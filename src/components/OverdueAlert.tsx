import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface OverdueAlertProps {
  overdueCount: number;
  upcomingCount: number;
  onFilterOverdue: () => void;
}

export const OverdueAlert: React.FC<OverdueAlertProps> = ({
  overdueCount,
  upcomingCount,
  onFilterOverdue
}) => {
  if (overdueCount === 0 && upcomingCount === 0) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 border-l-4 border-emerald-600 px-3.5 py-2 my-2.5 rounded-r text-xs text-emerald-900 no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-800">TIẾN ĐỘ THÔNG SUỐT:</span>
          <span>100% hồ sơ, công văn tại xã Tân An đang được xử lý đúng hạn quy định.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#fff5f5] border-l-4 border-[#d32f2f] px-3.5 py-2.5 my-2.5 rounded-r text-xs text-[#c62828] shadow-2xs no-print">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-[#d32f2f] shrink-0 animate-pulse" />
        <div>
          <strong className="font-bold uppercase tracking-wide">CẢNH BÁO TIẾN ĐỘ:</strong>{' '}
          {overdueCount > 0 ? (
            <span>
              Hiện có <span className="font-extrabold underline">{overdueCount} hồ sơ quá hạn</span> giải quyết cần đôn đốc khẩn trương.
            </span>
          ) : (
            <span>Hiện có <span className="font-extrabold">{upcomingCount} văn bản sắp đến hạn</span> hôm nay/ngày mai.</span>
          )}
        </div>
      </div>

      {overdueCount > 0 && (
        <button
          onClick={onFilterOverdue}
          className="self-start sm:self-auto inline-flex items-center gap-1 bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
        >
          <Clock className="w-3 h-3" />
          <span>Lọc hồ sơ quá hạn ({overdueCount})</span>
        </button>
      )}
    </div>
  );
};
