import React from 'react';
import { Files, Inbox, RefreshCw, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';
import { StatFilterType } from '../types/document';

interface StatCardsProps {
  counts: {
    total: number;
    newDocs: number;
    processing: number;
    pending: number;
    done: number;
    overdue: number;
  };
  activeFilter: StatFilterType;
  onSelectFilter: (filter: StatFilterType) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  counts,
  activeFilter,
  onSelectFilter
}) => {
  const cards = [
    {
      id: 'all' as StatFilterType,
      title: 'Tổng văn bản',
      count: counts.total,
      desc: 'Toàn bộ hồ sơ',
      colorClass: 'text-gray-800',
      activeBorder: 'border-[#b71c1c] ring-2 ring-[#b71c1c]/20 bg-white',
      hoverBorder: 'hover:border-gray-400',
      icon: Files,
      iconColor: 'text-gray-500'
    },
    {
      id: 'new' as StatFilterType,
      title: 'Mới tiếp nhận',
      count: counts.newDocs,
      desc: 'Chờ phân công thụ lý',
      colorClass: 'text-blue-700',
      activeBorder: 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/30',
      hoverBorder: 'hover:border-blue-400',
      icon: Inbox,
      iconColor: 'text-blue-600'
    },
    {
      id: 'processing' as StatFilterType,
      title: 'Đang xử lý',
      count: counts.processing,
      desc: 'Chuyên viên đang giải quyết',
      colorClass: 'text-amber-700',
      activeBorder: 'border-amber-600 ring-2 ring-amber-600/20 bg-amber-50/30',
      hoverBorder: 'hover:border-amber-400',
      icon: RefreshCw,
      iconColor: 'text-amber-600'
    },
    {
      id: 'pending' as StatFilterType,
      title: 'Chờ duyệt',
      count: counts.pending,
      desc: 'Trình Lãnh đạo UBND',
      colorClass: 'text-purple-700',
      activeBorder: 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30',
      hoverBorder: 'hover:border-purple-400',
      icon: Clock,
      iconColor: 'text-purple-600'
    },
    {
      id: 'done' as StatFilterType,
      title: 'Hoàn thành',
      count: counts.done,
      desc: 'Đã lưu sổ & ban hành',
      colorClass: 'text-emerald-700',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/30',
      hoverBorder: 'hover:border-emerald-400',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600'
    },
    {
      id: 'overdue' as StatFilterType,
      title: 'Quá hạn',
      count: counts.overdue,
      desc: 'Cần đôn đốc khẩn',
      colorClass: 'text-red-700',
      activeBorder: 'border-red-600 ring-2 ring-red-600/25 bg-red-50/60',
      hoverBorder: 'hover:border-red-400',
      icon: AlertOctagon,
      iconColor: 'text-red-600',
      isDanger: true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4 no-print">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-3 rounded-lg border transition-all cursor-pointer shadow-2xs ${
              isActive
                ? card.activeBorder
                : card.isDanger
                ? 'border-red-200 bg-red-50/30 hover:bg-red-50/60'
                : 'border-gray-200 bg-white hover:bg-gray-50/70'
            } ${card.hoverBorder}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[12px] font-bold ${card.colorClass}`}>
                {card.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
            </div>

            <div className="text-2xl font-black tabular-nums my-1 text-gray-900 tracking-tight">
              {card.count}
            </div>

            <div
              className={`text-[11px] truncate font-medium ${
                card.isDanger && card.count > 0
                  ? 'text-red-600 font-bold'
                  : 'text-gray-500'
              }`}
            >
              {card.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
};
