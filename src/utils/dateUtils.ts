import { DocumentItem } from '../types/document';

export const TODAY_ISO = '2026-10-04';

export function isOverdue(dueDateStr: string, status: string): boolean {
  if (status === 'Hoàn thành') return false;
  return dueDateStr < TODAY_ISO;
}

export function getDueStatus(dueDateStr: string, status: string): {
  isOverdue: boolean;
  isToday: boolean;
  daysDiff: number;
  label: string;
} {
  if (status === 'Hoàn thành') {
    return { isOverdue: false, isToday: false, daysDiff: 0, label: 'Đã hoàn tất' };
  }

  const d1 = new Date(TODAY_ISO).getTime();
  const d2 = new Date(dueDateStr).getTime();
  const diffDays = Math.round((d2 - d1) / (1000 * 3600 * 24));

  if (diffDays < 0) {
    return {
      isOverdue: true,
      isToday: false,
      daysDiff: Math.abs(diffDays),
      label: `Quá hạn ${Math.abs(diffDays)} ngày`
    };
  } else if (diffDays === 0) {
    return {
      isOverdue: false,
      isToday: true,
      daysDiff: 0,
      label: 'Hạn hôm nay'
    };
  } else {
    return {
      isOverdue: false,
      isToday: false,
      daysDiff: diffDays,
      label: `Còn ${diffDays} ngày`
    };
  }
}

export function formatVNDate(dateStr?: string): string {
  if (!dateStr) return '---';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function exportToCSV(documents: DocumentItem[], filename = 'So_quan_ly_van_ban_Tan_An.csv') {
  const headers = [
    'STT',
    'Số / Ký hiệu',
    'Ngày ban hành/tiếp nhận',
    'Loại văn bản',
    'Hình thức',
    'Độ khẩn',
    'Trích yếu nội dung',
    'Cơ quan ban hành / Gửi',
    'Bộ phận thụ lý',
    'Cán bộ thụ lý',
    'Hạn xử lý',
    'Trạng thái'
  ];

  const rows = documents.map((doc, idx) => [
    idx + 1,
    `"${doc.code.replace(/"/g, '""')}"`,
    `"${formatVNDate(doc.date)}"`,
    `"${doc.type}"`,
    `"${doc.category}"`,
    `"${doc.urgent}"`,
    `"${doc.summary.replace(/"/g, '""')}"`,
    `"${doc.agency.replace(/"/g, '""')}"`,
    `"${doc.department || ''}"`,
    `"${doc.assignee.replace(/"/g, '""')}"`,
    `"${formatVNDate(doc.dueDate)}"`,
    `"${doc.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
