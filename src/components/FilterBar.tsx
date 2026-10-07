import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { DocCategory, DocType, UrgencyLevel } from '../types/document';

interface FilterBarProps {
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  typeFilter: 'all' | DocType;
  onTypeFilterChange: (type: 'all' | DocType) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  urgencyFilter: string;
  onUrgencyFilterChange: (urgency: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (dep: string) => void;
  departments: string[];
  totalShown: number;
  totalAll: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchKeyword,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  urgencyFilter,
  onUrgencyFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  departments,
  totalShown,
  totalAll,
  onResetFilters,
  hasActiveFilters
}) => {
  const typeTabs: { id: 'all' | DocType; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Đến', label: 'Văn bản đến' },
    { id: 'Đi', label: 'Văn bản đi' },
    { id: 'Nội bộ', label: 'Nội bộ' }
  ];

  const categories: DocCategory[] = [
    'Công văn',
    'Quyết định',
    'Tờ trình',
    'Kế hoạch',
    'Thông báo',
    'Báo cáo',
    'Chỉ thị',
    'Giấy mời',
    'Biên bản'
  ];

  const urgencies: UrgencyLevel[] = [
    'Bình thường',
    'KHẨN',
    'HỎA TỐC',
    'THƯỢNG KHẨN'
  ];

  return (
    <div className="space-y-3 no-print">
      {/* Top Filter Row: Search & Book Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo số ký hiệu, trích yếu, cán bộ hoặc nội dung gợi ý..."
            className="w-full pl-9 pr-9 py-2 bg-gray-50/70 border border-gray-300 focus:border-[#b71c1c] focus:bg-white focus:outline-hidden rounded-md text-xs sm:text-sm text-gray-900 transition-colors shadow-2xs"
          />
          {searchKeyword && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Pills / Segmented Controls */}
        <div className="flex items-center bg-gray-100 p-1 rounded-md border border-gray-200 shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
          {typeTabs.map((tab) => {
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTypeFilterChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#b71c1c] shadow-xs font-bold border border-gray-200/80'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Filter Row: Dropdowns & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 pb-1 border-b border-gray-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Bộ lọc:</span>
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 focus:outline-hidden focus:border-[#b71c1c] font-medium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Mới tiếp nhận">Mới tiếp nhận</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="overdue">Hồ sơ quá hạn</option>
          </select>

          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 focus:outline-hidden focus:border-[#b71c1c]"
          >
            <option value="all">Tất cả hình thức</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Urgency selector */}
          <select
            value={urgencyFilter}
            onChange={(e) => onUrgencyFilterChange(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 focus:outline-hidden focus:border-[#b71c1c]"
          >
            <option value="all">Tất cả độ khẩn</option>
            {urgencies.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* Department selector */}
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
            className="hidden sm:inline-block bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 focus:outline-hidden focus:border-[#b71c1c] max-w-[190px] truncate"
          >
            <option value="all">Tất cả bộ phận chuyên môn</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[#b71c1c] hover:underline font-semibold text-xs ml-1 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* Counter Display */}
        <div className="text-gray-500 font-medium tabular-nums ml-auto text-xs">
          Hiển thị <span className="font-bold text-gray-900">{totalShown}</span> /{' '}
          <span>{totalAll}</span> văn bản
        </div>
      </div>
    </div>
  );
};
