/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { NationalHeader } from './components/NationalHeader';
import { UnitHeader } from './components/UnitHeader';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { OverdueAlert } from './components/OverdueAlert';
import { DocumentTable } from './components/DocumentTable';
import { DocumentModal } from './components/DocumentModal';
import { DetailModal } from './components/DetailModal';
import { PrintLedgerModal } from './components/PrintLedgerModal';
import { DigitalSignModal } from './components/DigitalSignModal';
import { LoginModal } from './components/LoginModal';
import { StaffManagementModal } from './components/StaffManagementModal';
import { RegisterOtpModal } from './components/RegisterOtpModal';
import { RolePermissionManagement } from './components/RolePermissionManagement';
import { PasswordResetModal } from './components/PasswordResetModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { DocumentItem, DocStatus, DocType, StatFilterType, DigitalSignatureInfo } from './types/document';
import { INITIAL_DOCUMENTS, DEPARTMENTS } from './data/initialDocs';
import {
  SystemUser,
  INITIAL_USERS,
  RoleConfig,
  DEFAULT_ROLES,
  AuditLogEntry,
  INITIAL_AUDIT_LOGS,
  PermissionKey
} from './types/user';
import { exportToCSV, isOverdue, TODAY_ISO } from './utils/dateUtils';

const STORAGE_KEY = 'ubnd_tan_an_docs_v2';

export default function App() {
  // Load documents from localStorage or initial dataset
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_DOCUMENTS;
  });

  // Save to localStorage when documents change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch {
      // Ignore storage errors
    }
  }, [documents]);

  // Users directory & Authentication
  const [users, setUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('ubnd_tan_an_users_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some((u) => u.username === 'hpkinh.tanan' || u.user === 'hpkinh.tanan')
        ) {
          return parsed.map((u) => {
            if (
              u.user === 'hpkinh.tanan' ||
              u.username === 'hpkinh.tanan' ||
              u.roleId === 'SUPER_ADMIN' ||
              u.roleId === 'admin'
            ) {
              return {
                ...u,
                skipPassword: false,
                pass: 'hpkinh1909@',
                password: 'hpkinh1909@',
                password_hash: 'f35ba770bfab6ded64241c764bc7aee31a9b61e6de7082ba2cea1a88230704f9'
              };
            }
            return u;
          });
        }
      }
    } catch {}
    return INITIAL_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ubnd_tan_an_users_v2', JSON.stringify(users));
    } catch {}
  }, [users]);

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    return (
      users.find((u) => u.username === 'hpkinh.tanan' || u.user === 'hpkinh.tanan') ||
      users[0]
    );
  });
  const [currentUserRole, setCurrentUserRole] = useState<string>(() => {
    const u =
      users.find((x) => x.username === 'hpkinh.tanan' || x.user === 'hpkinh.tanan') ||
      users[0];
    return u.role;
  });

  // Top level navigation tab: 'docs' | 'permissions'
  const [mainTab, setMainTab] = useState<'docs' | 'permissions'>('docs');

  // Roles & RBAC Configuration
  const [roles, setRoles] = useState<RoleConfig[]>(() => {
    try {
      const saved = localStorage.getItem('ubnd_tan_an_roles_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ROLES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ubnd_tan_an_roles_v2', JSON.stringify(roles));
    } catch {}
  }, [roles]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ubnd_tan_an_audit_logs_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ubnd_tan_an_audit_logs_v2', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  // Audit Logger Helper
  const logAuditEvent = (
    action: string,
    target?: string,
    status: 'Thành công' | 'Từ chối' | 'Cảnh báo' = 'Thành công'
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: `${TODAY_ISO} ${new Date().toLocaleTimeString('vi-VN')}`,
      user: currentUser.username || currentUser.user,
      userName: currentUser.fullName || currentUser.name,
      role: currentUser.role,
      action,
      target,
      status,
      ipAddress: '192.168.1.1'
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  // Permission Verification Helper
  const hasPermission = (permission: PermissionKey): boolean => {
    // Super admin has all permissions
    if (
      currentUser.roleId === 'SUPER_ADMIN' ||
      currentUser.role?.includes('SUPER_ADMIN') ||
      currentUser.username === 'hpkinh.tanan' ||
      currentUser.user === 'hpkinh.tanan'
    ) {
      return true;
    }
    const userRole = roles.find(
      (r) => r.id === currentUser.roleId || r.name === currentUser.role
    );
    if (!userRole) return true;
    if (userRole.isSystem) return true;
    if (currentUser.customPermissions?.includes(permission)) return true;
    return userRole.permissions.includes(permission);
  };

  // Filter & Search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DocType>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeStatFilter, setActiveStatFilter] = useState<StatFilterType>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [singleDocToPrint, setSingleDocToPrint] = useState<DocumentItem | null>(null);
  const [signingDoc, setSigningDoc] = useState<DocumentItem | null>(null);
  const [isDigitalSignOpen, setIsDigitalSignOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Quick Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // KPI Calculations
  const counts = useMemo(() => {
    const total = documents.length;
    const newDocs = documents.filter((d) => d.status === 'Mới tiếp nhận').length;
    const processing = documents.filter((d) => d.status === 'Đang xử lý').length;
    const pending = documents.filter((d) => d.status === 'Chờ duyệt').length;
    const done = documents.filter((d) => d.status === 'Hoàn thành').length;
    const overdue = documents.filter((d) => isOverdue(d.dueDate, d.status)).length;

    // Upcoming in <= 1 day
    const upcoming = documents.filter((d) => {
      if (d.status === 'Hoàn thành') return false;
      const diff = Math.round(
        (new Date(d.dueDate).getTime() - new Date(TODAY_ISO).getTime()) / (1000 * 3600 * 24)
      );
      return diff >= 0 && diff <= 1;
    }).length;

    return { total, newDocs, processing, pending, done, overdue, upcoming };
  }, [documents]);

  // Synchronize StatCard clicks with filters
  const handleSelectStatFilter = (filterId: StatFilterType) => {
    setActiveStatFilter(filterId);
    if (filterId === 'all') {
      setStatusFilter('all');
    } else if (filterId === 'new') {
      setStatusFilter('Mới tiếp nhận');
    } else if (filterId === 'processing') {
      setStatusFilter('Đang xử lý');
    } else if (filterId === 'pending') {
      setStatusFilter('Chờ duyệt');
    } else if (filterId === 'done') {
      setStatusFilter('Hoàn thành');
    } else if (filterId === 'overdue') {
      setStatusFilter('overdue');
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status === 'all') setActiveStatFilter('all');
    else if (status === 'Mới tiếp nhận') setActiveStatFilter('new');
    else if (status === 'Đang xử lý') setActiveStatFilter('processing');
    else if (status === 'Chờ duyệt') setActiveStatFilter('pending');
    else if (status === 'Hoàn thành') setActiveStatFilter('done');
    else if (status === 'overdue') setActiveStatFilter('overdue');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchKeyword('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setUrgencyFilter('all');
    setDepartmentFilter('all');
    setActiveStatFilter('all');
  };

  const hasActiveFilters =
    searchKeyword.trim() !== '' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    urgencyFilter !== 'all' ||
    departmentFilter !== 'all';

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    const q = searchKeyword.toLowerCase().trim();

    return documents.filter((doc) => {
      // 1. Type
      if (typeFilter !== 'all' && doc.type !== typeFilter) return false;

      // 2. Status
      if (statusFilter === 'overdue') {
        if (!isOverdue(doc.dueDate, doc.status)) return false;
      } else if (statusFilter !== 'all') {
        if (doc.status !== statusFilter) return false;
      }

      // 3. Category
      if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;

      // 4. Urgency
      if (urgencyFilter !== 'all' && doc.urgent !== urgencyFilter) return false;

      // 5. Department
      if (departmentFilter !== 'all' && doc.department !== departmentFilter) return false;

      // 6. Search keyword
      if (q) {
        const matchCode = doc.code.toLowerCase().includes(q);
        const matchSummary = doc.summary.toLowerCase().includes(q);
        const matchAssignee = doc.assignee.toLowerCase().includes(q);
        const matchAgency = doc.agency.toLowerCase().includes(q);
        const matchDept = (doc.department || '').toLowerCase().includes(q);
        const matchCategory = doc.category.toLowerCase().includes(q);
        const matchSuggestion = (doc.suggestion || '').toLowerCase().includes(q);
        if (
          !matchCode &&
          !matchSummary &&
          !matchAssignee &&
          !matchAgency &&
          !matchDept &&
          !matchCategory &&
          !matchSuggestion
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    documents,
    searchKeyword,
    typeFilter,
    statusFilter,
    categoryFilter,
    urgencyFilter,
    departmentFilter
  ]);

  // Operations
  const handleStatusChange = (id: number, newStatus: DocStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          const newEntry = {
            id: `h-${Date.now()}`,
            time: `${TODAY_ISO} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
            actor: currentUserRole,
            action: `Chuyển trạng thái sang "${newStatus}"`,
            statusAfter: newStatus
          };
          return {
            ...doc,
            status: newStatus,
            history: [newEntry, ...(doc.history || [])]
          };
        }
        return doc;
      })
    );
    showToast(`Đã cập nhật trạng thái sang "${newStatus}" thành công!`);
  };

  const handleDeleteDocument = (id: number) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    if (!hasPermission('doc_delete')) {
      showToast('Đồng chí không có thẩm quyền xóa/hủy văn bản trong hệ thống!');
      logAuditEvent('Cố gắng xóa văn bản không có thẩm quyền', `Văn bản ${doc.code}`, 'Từ chối');
      return;
    }
    if (window.confirm(`Đồng chí có chắc chắn muốn xóa văn bản số "${doc.code}" khỏi hệ thống?`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      logAuditEvent('Xóa văn bản khỏi sổ quản lý', `Văn bản ${doc.code} (${doc.summary})`, 'Cảnh báo');
      showToast(`Đã xóa văn bản ${doc.code} khỏi sổ theo dõi.`);
    }
  };

  const handleSaveDocument = (data: Partial<DocumentItem>) => {
    if (editingDoc) {
      // Edit
      if (!hasPermission('doc_edit')) {
        showToast('Đồng chí không có quyền chỉnh sửa văn bản này!');
        logAuditEvent('Cố gắng sửa văn bản không có quyền', `Văn bản ${editingDoc.code}`, 'Từ chối');
        return;
      }
      setDocuments((prev) =>
        prev.map((d) => {
          if (d.id === editingDoc.id) {
            const updated = { ...d, ...data };
            if (viewingDoc && viewingDoc.id === editingDoc.id) {
              setViewingDoc(updated as DocumentItem);
            }
            return updated as DocumentItem;
          }
          return d;
        })
      );
      logAuditEvent('Cập nhật thông tin văn bản', `Văn bản ${data.code || editingDoc.code}`, 'Thành công');
      showToast(`Đã cập nhật thông tin văn bản ${data.code} thành công!`);
      setEditingDoc(null);
    } else {
      // Create new
      if (!hasPermission('doc_receive')) {
        showToast('Đồng chí không có thẩm quyền tiếp nhận / tạo mới văn bản!');
        logAuditEvent('Cố gắng tạo mới văn bản không có quyền', `Văn bản ${data.code}`, 'Từ chối');
        return;
      }
      const newDoc: DocumentItem = {
        id: Date.now(),
        code: data.code || '.../UBND',
        date: data.date || TODAY_ISO,
        receivedDate: TODAY_ISO,
        type: data.type || 'Đến',
        category: data.category || 'Công văn',
        urgent: data.urgent || 'Bình thường',
        summary: data.summary || '',
        note: data.note || '',
        agency: data.agency || '',
        recipient: data.recipient || 'UBND Xã Tân An',
        department: data.department || DEPARTMENTS[0],
        assignee: data.assignee || 'Cán bộ thụ lý',
        role: data.role || 'Cán bộ chuyên môn',
        dueDate: data.dueDate || TODAY_ISO,
        status: data.status || 'Mới tiếp nhận',
        directorInstruction: data.directorInstruction || '',
        attachments: data.attachments || [
          { name: `${data.code?.replace(/[^a-zA-Z0-9]/g, '_') || 'VB'}.pdf`, size: '1.5 MB', type: 'pdf' }
        ],
        history: [
          {
            id: `h-${Date.now()}`,
            time: `${TODAY_ISO} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
            actor: currentUserRole,
            action: `Tiếp nhận và vào sổ văn bản ${data.type}`,
            statusAfter: data.status || 'Mới tiếp nhận'
          }
        ]
      };

      setDocuments((prev) => [newDoc, ...prev]);
      logAuditEvent('Tiếp nhận văn bản mới vào sổ', `Văn bản số ${newDoc.code} (${newDoc.category})`, 'Thành công');
      showToast(`Đã lưu thành công văn bản ${newDoc.code} vào hệ thống!`);
      setIsCreateModalOpen(false);
    }
  };

  const handleAddHistoryEntry = (docId: number, action: string, note?: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const entry = {
            id: `h-${Date.now()}`,
            time: `${TODAY_ISO} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
            actor: currentUserRole,
            action,
            note,
            statusAfter: d.status
          };
          const updated = {
            ...d,
            history: [entry, ...(d.history || [])]
          };
          if (viewingDoc && viewingDoc.id === docId) {
            setViewingDoc(updated);
          }
          return updated;
        }
        return d;
      })
    );
    showToast('Đã ghi nhận nhật ký xử lý thành công!');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Đồng chí có muốn khôi phục lại dữ liệu mẫu gốc ban đầu của UBND Xã Tân An?'
      )
    ) {
      setDocuments(INITIAL_DOCUMENTS);
      handleResetFilters();
      showToast('Đã khôi phục lại toàn bộ dữ liệu mẫu ban đầu.');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredDocuments, `So_quan_ly_van_ban_Tan_An_${TODAY_ISO}.csv`);
    showToast(`Đã xuất ${filteredDocuments.length} văn bản ra tệp Excel (CSV)!`);
  };

  const handleOpenPrintLedger = () => {
    setSingleDocToPrint(null);
    setIsPrintModalOpen(true);
  };

  const handlePrintRoutingSheet = (doc: DocumentItem) => {
    setSingleDocToPrint(doc);
    setIsPrintModalOpen(true);
  };

  const handleOpenDigitalSign = (doc: DocumentItem) => {
    if (!hasPermission('doc_sign')) {
      showToast('Đồng chí không có quyền ký số chuyên dùng Ban Cơ Yếu (VGCA)!');
      logAuditEvent('Cố gắng ký số văn bản không có thẩm quyền', `Văn bản ${doc.code}`, 'Từ chối');
      return;
    }
    setSigningDoc(doc);
    setIsDigitalSignOpen(true);
  };

  const handleSignSuccess = (docId: number, signatureInfo: DigitalSignatureInfo) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const historyEntry = {
            id: `h-${Date.now()}`,
            time: signatureInfo.signedTime || `${TODAY_ISO} ${new Date().toLocaleTimeString('vi-VN')}`,
            actor: `${signatureInfo.signerName} (${signatureInfo.signerRole})`,
            action: 'Ký số chuyên dùng Ban Cơ Yếu Chính Phủ (VGCA)',
            note: `Chứng thư số Serial: ${signatureInfo.serialNumber} · Toàn vẹn văn bản: Hợp lệ`,
            statusAfter: 'Hoàn thành' as DocStatus
          };
          const updatedDoc: DocumentItem = {
            ...d,
            status: 'Hoàn thành' as DocStatus,
            digitalSignature: signatureInfo,
            history: [historyEntry, ...(d.history || [])]
          };
          if (viewingDoc && viewingDoc.id === docId) {
            setViewingDoc(updatedDoc);
          }
          logAuditEvent(
            'Ký số chuyên dùng Ban Cơ Yếu Chính Phủ (VGCA)',
            `Văn bản ${d.code} - Serial: ${signatureInfo.serialNumber}`,
            'Thành công'
          );
          return updatedDoc;
        }
        return d;
      })
    );
    showToast(`Ký số Ban Cơ Yếu thành công cho văn bản! Đã khóa dữ liệu và ban hành.`);
  };

  return (
    <div className="min-h-screen bg-[#fceeed] flex flex-col font-sans">
      {/* 1. National Banner & User Area */}
      <NationalHeader
        currentUserRole={currentUserRole}
        onRoleChange={(r) => {
          setCurrentUserRole(r);
          showToast(`Đã chuyển phiên làm việc: ${r}`);
        }}
        currentUser={currentUser}
        onLogout={() => setIsLogoutModalOpen(true)}
        onSwitchAccount={() => setIsLoginModalOpen(true)}
        onConfirmLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* 2. Unit Brand Header & Primary Actions */}
      <UnitHeader
        onOpenCreateModal={() => {
          setEditingDoc(null);
          setIsCreateModalOpen(true);
        }}
        onOpenPrintModal={handleOpenPrintLedger}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        onOpenStaffModal={() => setIsStaffModalOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenPasswordReset={() => setIsPasswordResetOpen(true)}
        activeMainTab={mainTab}
        onChangeMainTab={(tab) => {
          setMainTab(tab);
          logAuditEvent('Chuyển phân hệ làm việc', tab === 'docs' ? 'Quản lý Văn bản & Điều hành' : 'Phân quyền Quản trị Hệ thống', 'Thành công');
        }}
      />

      {/* Main Workspace Container */}
      <main className="max-w-[1380px] w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 flex-1">
        {mainTab === 'docs' ? (
          <>
            {/* 3. Stat KPI Cards */}
            <StatCards
              counts={counts}
              activeFilter={activeStatFilter}
              onSelectFilter={handleSelectStatFilter}
            />

            {/* 4. Document Panel */}
            <div className="bg-white rounded-lg border border-[#ebd4d4] p-4 shadow-xs">
              {/* Filter Section */}
              <FilterBar
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                typeFilter={typeFilter}
                onTypeFilterChange={(t) => setTypeFilter(t)}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                urgencyFilter={urgencyFilter}
                onUrgencyFilterChange={setUrgencyFilter}
                departmentFilter={departmentFilter}
                onDepartmentFilterChange={setDepartmentFilter}
                departments={DEPARTMENTS}
                totalShown={filteredDocuments.length}
                totalAll={documents.length}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Overdue Warning Alert Bar */}
              <OverdueAlert
                overdueCount={counts.overdue}
                upcomingCount={counts.upcoming}
                onFilterOverdue={() => handleStatusFilterChange('overdue')}
              />

              {/* 5. Document Table */}
              <DocumentTable
                documents={filteredDocuments}
                onStatusChange={handleStatusChange}
                onDeleteDocument={handleDeleteDocument}
                onViewDocument={(doc) => setViewingDoc(doc)}
                onEditDocument={(doc) => {
                  setEditingDoc(doc);
                  setIsCreateModalOpen(true);
                }}
                onOpenDigitalSign={handleOpenDigitalSign}
              />
            </div>
          </>
        ) : (
          <RolePermissionManagement
            roles={roles}
            onUpdateRolePermissions={(roleId, permissions) => {
              setRoles((prev) =>
                prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
              );
              showToast('Đã lưu thiết lập ma trận phân quyền vào hệ thống!');
            }}
            onResetDefaultRoles={() => {
              if (window.confirm('Đồng chí có chắc chắn muốn khôi phục ma trận phân quyền về chuẩn mặc định?')) {
                setRoles(DEFAULT_ROLES);
                logAuditEvent('Khôi phục ma trận phân quyền chuẩn mặc định', undefined, 'Cảnh báo');
                showToast('Đã khôi phục ma trận phân quyền về chuẩn mặc định!');
              }
            }}
            users={users}
            onUpdateUser={(updatedUser) => {
              setUsers((prev) =>
                prev.map((u) => (u.user === updatedUser.user ? updatedUser : u))
              );
              if (currentUser.user === updatedUser.user) {
                setCurrentUser(updatedUser);
                setCurrentUserRole(updatedUser.role);
              }
              showToast(`Đã cập nhật thông tin và vai trò cho cán bộ: ${updatedUser.name}!`);
            }}
            currentUser={currentUser}
            onSwitchUser={(targetUser) => {
              setCurrentUser(targetUser);
              setCurrentUserRole(targetUser.role);
              logAuditEvent('Chuyển phiên làm việc cán bộ', `Tài khoản @${targetUser.user} (${targetUser.name})`, 'Thành công');
              showToast(`Đã chuyển phiên làm việc sang: ${targetUser.name} (${targetUser.role})`);
            }}
            auditLogs={auditLogs}
            onAddAuditLog={logAuditEvent}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onLogoutAdmin={() => setIsLogoutModalOpen(true)}
            onDeleteUser={(userToDelete) => {
              if (userToDelete.roleId === 'SUPER_ADMIN' || userToDelete.roleId === 'admin') {
                alert('Không thể xóa tài khoản Quản trị viên hệ thống!');
                return;
              }
              if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản cán bộ: ${userToDelete.name}?`)) {
                setUsers((prev) => prev.filter((u) => u.user !== userToDelete.user));
                logAuditEvent(
                  'Xóa tài khoản cán bộ',
                  `Tài khoản @${userToDelete.user} (${userToDelete.name}) đã bị xóa khỏi hệ thống`,
                  'Cảnh báo'
                );
                showToast(`Đã xóa cán bộ: ${userToDelete.name} thành công!`);
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-xs text-gray-500 border-t border-[#ebd4d4] bg-white/60 no-print">
        <div className="max-w-[1380px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            ỦY BAN NHÂN DÂN XÃ TÂN AN · HỆ THỐNG QUẢN LÝ VĂN BẢN VÀ ĐIỀU HÀNH
          </div>
          <div className="text-[11px] text-gray-400">
            Ứng dụng công nghệ số phục vụ cải cách thủ tục hành chính
          </div>
        </div>
      </footer>

      {/* Toast Alert Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#8b0000] text-white px-4 py-2.5 rounded-lg shadow-xl border border-red-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Create / Edit Document Modal */}
      <DocumentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingDoc(null);
        }}
        onSave={handleSaveDocument}
        editDocument={editingDoc}
        currentUserRole={currentUserRole}
      />

      {/* Detailed View Modal */}
      <DetailModal
        document={viewingDoc}
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        onAddHistoryEntry={handleAddHistoryEntry}
        onStatusChange={(id, st) => {
          handleStatusChange(id, st);
          if (viewingDoc) {
            setViewingDoc((prev) => (prev ? { ...prev, status: st } : null));
          }
        }}
        onPrintRoutingSheet={handlePrintRoutingSheet}
        onOpenDigitalSign={handleOpenDigitalSign}
      />

      {/* VGCA Digital Signing Modal */}
      <DigitalSignModal
        isOpen={isDigitalSignOpen}
        onClose={() => {
          setIsDigitalSignOpen(false);
          setSigningDoc(null);
        }}
        document={signingDoc}
        onSignSuccess={handleSignSuccess}
      />

      {/* Official Print Ledger & Routing Sheet Modal */}
      <PrintLedgerModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSingleDocToPrint(null);
        }}
        documents={filteredDocuments}
        singleDocToPrint={singleDocToPrint}
      />

      {/* Login & Switch Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(u) => {
          setCurrentUser(u);
          setCurrentUserRole(u.role);
          showToast(`Đã chuyển sang tài khoản: ${u.name} (${u.role})`);
        }}
        users={users}
        currentUser={currentUser}
        onOpenRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onOpenForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsPasswordResetOpen(true);
        }}
      />

      {/* Staff Directory & Account Management Modal */}
      <StaffManagementModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        users={users}
        onAddUser={(newUser) => {
          setUsers((prev) => [newUser, ...prev]);
          showToast(`Đã cấp tài khoản thành công cho đồng chí: ${newUser.name}!`);
        }}
      />

      {/* Register Account & OTP Verification Modal */}
      <RegisterOtpModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={(newUser) => {
          setUsers((prev) => [newUser, ...prev]);
          setCurrentUser(newUser);
          setCurrentUserRole(newUser.role);
          showToast(`Đã xác thực OTP và cấp tài khoản thành công cho đồng chí: ${newUser.name}!`);
        }}
        existingUsers={users}
      />

      {/* Password Reset & Recovery Modal */}
      <PasswordResetModal
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
        users={users}
        onPasswordResetSuccess={(targetUser, newPass, newHash) => {
          setUsers((prev) =>
            prev.map((u) => {
              if (
                u.user === targetUser.user ||
                (u.username && u.username === targetUser.username)
              ) {
                const updated = {
                  ...u,
                  pass: newPass,
                  password: newPass,
                  password_hash: newHash
                };
                if (
                  currentUser.user === u.user ||
                  (currentUser.username && currentUser.username === u.username)
                ) {
                  setCurrentUser(updated);
                }
                return updated;
              }
              return u;
            })
          );
          logAuditEvent(
            'Khôi phục & Cấp lại mật khẩu qua OTP/CCCD',
            `Tài khoản @${targetUser.username || targetUser.user} (${targetUser.name})`,
            'Thành công'
          );
          showToast(`Đã cấp lại mật khẩu thành công cho cán bộ: ${targetUser.name}!`);
        }}
        onSwitchToLogin={() => {
          setIsPasswordResetOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        currentUser={currentUser}
        onConfirmLogout={() => {
          const adminName = currentUser.name;
          const adminUser = currentUser.username || currentUser.user;
          logAuditEvent(
            'Đăng xuất tài khoản an toàn',
            `Quản trị viên ${adminName} (@${adminUser}) đã đăng xuất an toàn khỏi hệ thống`,
            'Thành công'
          );
          setIsLogoutModalOpen(false);
          setIsLoginModalOpen(true);
          showToast(`Đã đăng xuất khỏi tài khoản Quản trị viên: ${adminName} an toàn!`);
        }}
      />
    </div>
  );
}
