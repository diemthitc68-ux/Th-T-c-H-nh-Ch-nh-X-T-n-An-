import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Users,
  KeyRound,
  Check,
  X,
  Lock,
  Unlock,
  RotateCcw,
  Search,
  Filter,
  AlertTriangle,
  History,
  FileCheck2,
  CheckCircle2,
  Settings2,
  UserCheck,
  FileSpreadsheet,
  Plus,
  Database,
  Copy,
  Download,
  LogOut,
  Trash2
} from 'lucide-react';
import {
  PermissionKey,
  PERMISSION_LIST,
  RoleConfig,
  SystemUser,
  AuditLogEntry
} from '../types/user';

interface RolePermissionManagementProps {
  roles: RoleConfig[];
  onUpdateRolePermissions: (roleId: string, permissions: PermissionKey[]) => void;
  onResetDefaultRoles: () => void;
  users: SystemUser[];
  onUpdateUser: (updatedUser: SystemUser) => void;
  currentUser: SystemUser;
  onSwitchUser: (user: SystemUser) => void;
  auditLogs: AuditLogEntry[];
  onAddAuditLog: (action: string, target?: string, status?: 'Thành công' | 'Từ chối' | 'Cảnh báo') => void;
  onOpenRegisterModal: () => void;
  onLogoutAdmin?: () => void;
  onDeleteUser?: (user: SystemUser) => void;
}

export const RolePermissionManagement: React.FC<RolePermissionManagementProps> = ({
  roles,
  onUpdateRolePermissions,
  onResetDefaultRoles,
  users,
  onUpdateUser,
  currentUser,
  onSwitchUser,
  auditLogs,
  onAddAuditLog,
  onOpenRegisterModal,
  onLogoutAdmin,
  onDeleteUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'users' | 'audit' | 'sql'>('matrix');

  // Matrix edit state (local modifications before or auto save)
  const [editingPermissions, setEditingPermissions] = useState<Record<string, PermissionKey[]>>(() => {
    const map: Record<string, PermissionKey[]> = {};
    roles.forEach((r) => {
      map[r.id] = [...r.permissions];
    });
    return map;
  });

  // User search & filter
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // User edit modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<SystemUser | null>(null);

  // Toggle permission in matrix
  const handleTogglePermission = (roleId: string, permKey: PermissionKey) => {
    const role = roles.find((r) => r.id === roleId);
    if (role?.isSystem && permKey === 'admin_roles') {
      // Admin role must keep admin permission
      alert('Không thể thu hồi quyền Quản trị hệ thống từ tài khoản Quản trị viên!');
      return;
    }

    setEditingPermissions((prev) => {
      const current = prev[roleId] || [];
      const updated = current.includes(permKey)
        ? current.filter((k) => k !== permKey)
        : [...current, permKey];

      onUpdateRolePermissions(roleId, updated);
      onAddAuditLog(
        `Thay đổi phân quyền vai trò "${role?.name}"`,
        `Quyền: ${permKey} (${current.includes(permKey) ? 'Thu hồi' : 'Cấp mới'})`,
        'Thành công'
      );
      return {
        ...prev,
        [roleId]: updated
      };
    });
  };

  // Toggle all permissions for a role
  const handleToggleAllForRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    const current = editingPermissions[roleId] || [];
    const allKeys = PERMISSION_LIST.map((p) => p.key);

    const willSelectAll = current.length < allKeys.length;
    const updated = willSelectAll
      ? allKeys
      : role?.isSystem
      ? ['admin_roles', 'admin_users'] as PermissionKey[]
      : [];

    setEditingPermissions((prev) => ({
      ...prev,
      [roleId]: updated
    }));
    onUpdateRolePermissions(roleId, updated);
    onAddAuditLog(
      `${willSelectAll ? 'Cấp toàn bộ quyền' : 'Thu hồi toàn bộ quyền'} cho vai trò "${role?.name}"`,
      undefined,
      'Thành công'
    );
  };

  // Lock / Unlock user account
  const handleToggleLockUser = (targetUser: SystemUser) => {
    if (
      targetUser.user === 'admin' ||
      targetUser.user === 'hpkinh.tanan' ||
      targetUser.username === 'hpkinh.tanan' ||
      targetUser.roleId === 'SUPER_ADMIN'
    ) {
      alert('Không thể khóa tài khoản Quản trị viên tối cao (SUPER_ADMIN)!');
      return;
    }
    const newStatus = targetUser.status === 'locked' ? 'active' : 'locked';
    const updated: SystemUser = { ...targetUser, status: newStatus };
    onUpdateUser(updated);
    onAddAuditLog(
      `${newStatus === 'locked' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'} cán bộ`,
      `Tài khoản: ${targetUser.user} (${targetUser.name})`,
      newStatus === 'locked' ? 'Cảnh báo' : 'Thành công'
    );
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.roleId !== roleFilter && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && (u.status || 'active') !== statusFilter) return false;
      if (q) {
        const matchName = u.name.toLowerCase().includes(q);
        const matchUser = u.user.toLowerCase().includes(q);
        const matchRole = u.role.toLowerCase().includes(q);
        const matchDept = (u.dept || '').toLowerCase().includes(q);
        const matchCccd = (u.cccd || '').includes(q);
        if (!matchName && !matchUser && !matchRole && !matchDept && !matchCccd) return false;
      }
      return true;
    });
  }, [users, userSearch, roleFilter, statusFilter]);

  // Count stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => (u.status || 'active') === 'active').length;
  const vgcaSignersCount = users.filter((u) => {
    const role = roles.find((r) => r.id === u.roleId || r.name === u.role);
    return role?.permissions.includes('doc_sign') || u.customPermissions?.includes('doc_sign');
  }).length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-[#ebd4d4] p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#8b0000] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">Tài khoản cán bộ</div>
            <div className="text-xl font-extrabold text-[#8b0000]">{totalUsers} <span className="text-xs font-normal text-emerald-700">({activeUsers} hoạt động)</span></div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#ebd4d4] p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">Nhóm vai trò công vụ</div>
            <div className="text-xl font-extrabold text-amber-800">{roles.length} vai trò</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#ebd4d4] p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">Ủy quyền ký số VGCA</div>
            <div className="text-xl font-extrabold text-emerald-700">{vgcaSignersCount} cán bộ</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#ebd4d4] p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">Tiêu chuẩn kiểm soát</div>
            <div className="text-xs font-extrabold text-blue-900 leading-tight">NĐ 30/2020 & Đề án 06</div>
            <div className="text-[10px] text-emerald-600 font-semibold">● Xác thực 2 lớp OTP/PIN</div>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-lg border border-[#ebd4d4] p-4 sm:p-5 shadow-xs">
        {/* Navigation Sub-Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#ebd4d4] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8b0000] text-white flex items-center justify-center font-bold text-sm">
              ★
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#8b0000] uppercase tracking-wide">
                PHÂN QUYỀN QUẢN TRỊ HỆ THỐNG & VAI TRÒ CÔNG VỤ
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Quản lý ma trận phân quyền, ủy quyền ký số VGCA và giám sát nhật ký hành chính
              </p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('matrix')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'matrix'
                  ? 'bg-[#8b0000] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Ma Trận Phân Quyền (RBAC)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('users')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'users'
                  ? 'bg-[#8b0000] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Danh Sách & Quyền Cán Bộ ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'audit'
                  ? 'bg-[#8b0000] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Nhật Ký Thao Tác (Audit Log)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('sql')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'sql'
                  ? 'bg-[#8b0000] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cơ Sở Dữ Liệu SQL & Seed</span>
            </button>

            {onLogoutAdmin && (
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 font-bold ml-auto shadow-2xs hover:shadow-xs active:scale-95"
                title="Đăng xuất khỏi phiên làm việc Quản trị viên"
              >
                <LogOut className="w-3.5 h-3.5 text-[#8b0000]" />
                <span>Đăng Xuất Quản Trị Viên</span>
              </button>
            )}
          </div>
        </div>

        {/* SUBTAB 1: ROLE PERMISSION MATRIX */}
        {activeSubTab === 'matrix' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Quy tắc phân quyền:</strong> Thay đổi quyền trên bảng dưới đây sẽ có hiệu lực tức thời đối với mọi tài khoản thuộc vai trò tương ứng.
                </span>
              </div>
              <button
                onClick={onResetDefaultRoles}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded font-semibold transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Khôi phục chuẩn mặc định</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#8b0000] text-white border-b border-[#a01616]">
                    <th className="py-2.5 px-3 font-bold sticky left-0 bg-[#8b0000] z-10 w-56 min-w-[200px]">
                      Chức Năng & Quyền Hạn
                    </th>
                    {roles.map((role) => (
                      <th key={role.id} className="py-2.5 px-3 font-bold text-center border-l border-red-900/60 min-w-[130px]">
                        <div className="leading-tight">
                          <div>{role.name}</div>
                          <button
                            type="button"
                            onClick={() => handleToggleAllForRole(role.id)}
                            className="mt-1 text-[10px] text-amber-200 hover:text-white underline cursor-pointer font-normal block mx-auto"
                            title="Bật/Tắt tất cả quyền"
                          >
                            (Tất cả)
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Category: Văn bản */}
                  <tr className="bg-gray-100/90 font-bold text-gray-700 text-[11px]">
                    <td colSpan={roles.length + 1} className="py-1.5 px-3 uppercase tracking-wider text-[#8b0000]">
                      📁 Nghiệp vụ Quản lý Văn bản & Hồ sơ
                    </td>
                  </tr>
                  {PERMISSION_LIST.filter((p) => p.category === 'Văn bản').map((perm) => (
                    <tr key={perm.key} className="hover:bg-red-50/40 transition-colors">
                      <td className="py-2 px-3 sticky left-0 bg-white z-10 border-r border-gray-200">
                        <div className="font-semibold text-gray-900">{perm.name}</div>
                        <div className="text-[10px] text-gray-500 font-normal leading-tight">{perm.description}</div>
                      </td>
                      {roles.map((role) => {
                        const isChecked = (editingPermissions[role.id] || []).includes(perm.key);
                        return (
                          <td key={role.id} className="py-2 px-3 text-center border-l border-gray-100">
                            <label className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(role.id, perm.key)}
                                className="w-4 h-4 text-[#8b0000] border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Category: Ký số & Chỉ đạo */}
                  <tr className="bg-gray-100/90 font-bold text-gray-700 text-[11px]">
                    <td colSpan={roles.length + 1} className="py-1.5 px-3 uppercase tracking-wider text-[#8b0000]">
                      🔐 Ký Số Ban Cơ Yếu & Lãnh Đạo Chỉ Đạo
                    </td>
                  </tr>
                  {PERMISSION_LIST.filter((p) => p.category === 'Ký số & Chỉ đạo').map((perm) => (
                    <tr key={perm.key} className="hover:bg-red-50/40 transition-colors">
                      <td className="py-2 px-3 sticky left-0 bg-white z-10 border-r border-gray-200">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          {perm.key === 'doc_sign' && <KeyRound className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{perm.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-normal leading-tight">{perm.description}</div>
                      </td>
                      {roles.map((role) => {
                        const isChecked = (editingPermissions[role.id] || []).includes(perm.key);
                        return (
                          <td key={role.id} className="py-2 px-3 text-center border-l border-gray-100">
                            <label className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(role.id, perm.key)}
                                className="w-4 h-4 text-[#8b0000] border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Category: Báo cáo & Lưu trữ */}
                  <tr className="bg-gray-100/90 font-bold text-gray-700 text-[11px]">
                    <td colSpan={roles.length + 1} className="py-1.5 px-3 uppercase tracking-wider text-[#8b0000]">
                      📊 In Sổ Văn Bản & Trích Xuất Dữ Liệu
                    </td>
                  </tr>
                  {PERMISSION_LIST.filter((p) => p.category === 'Báo cáo').map((perm) => (
                    <tr key={perm.key} className="hover:bg-red-50/40 transition-colors">
                      <td className="py-2 px-3 sticky left-0 bg-white z-10 border-r border-gray-200">
                        <div className="font-semibold text-gray-900">{perm.name}</div>
                        <div className="text-[10px] text-gray-500 font-normal leading-tight">{perm.description}</div>
                      </td>
                      {roles.map((role) => {
                        const isChecked = (editingPermissions[role.id] || []).includes(perm.key);
                        return (
                          <td key={role.id} className="py-2 px-3 text-center border-l border-gray-100">
                            <label className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(role.id, perm.key)}
                                className="w-4 h-4 text-[#8b0000] border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Category: Quản trị */}
                  <tr className="bg-gray-100/90 font-bold text-gray-700 text-[11px]">
                    <td colSpan={roles.length + 1} className="py-1.5 px-3 uppercase tracking-wider text-[#8b0000]">
                      ⚙️ Quản Trị Hệ Thống & Bảo Mật
                    </td>
                  </tr>
                  {PERMISSION_LIST.filter((p) => p.category === 'Quản trị').map((perm) => (
                    <tr key={perm.key} className="hover:bg-red-50/40 transition-colors">
                      <td className="py-2 px-3 sticky left-0 bg-white z-10 border-r border-gray-200">
                        <div className="font-semibold text-gray-900">{perm.name}</div>
                        <div className="text-[10px] text-gray-500 font-normal leading-tight">{perm.description}</div>
                      </td>
                      {roles.map((role) => {
                        const isChecked = (editingPermissions[role.id] || []).includes(perm.key);
                        return (
                          <td key={role.id} className="py-2 px-3 text-center border-l border-gray-100">
                            <label className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(role.id, perm.key)}
                                className="w-4 h-4 text-[#8b0000] border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
              <div className="text-gray-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Toàn bộ thay đổi phân quyền được lưu trữ liên tục và ghi lại trong Sổ nhật ký Audit Log.</span>
              </div>
              <button
                onClick={() => {
                  roles.forEach((r) => {
                    onUpdateRolePermissions(r.id, editingPermissions[r.id] || r.permissions);
                  });
                  alert('Đã áp dụng và đồng bộ toàn bộ ma trận phân quyền vào hệ thống!');
                }}
                className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a01515] text-white rounded font-bold transition-colors cursor-pointer shadow-xs"
              >
                Lưu & Áp Dụng Ma Trận
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 2: USER AUTHORIZATION LIST */}
        {activeSubTab === 'users' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Tìm theo tên cán bộ, CCCD, username, chức vụ..."
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:border-[#b71c1c] focus:outline-hidden"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:border-[#b71c1c] focus:outline-hidden"
                >
                  <option value="all">-- Tất cả vai trò --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:border-[#b71c1c] focus:outline-hidden"
                >
                  <option value="all">-- Trạng thái --</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="locked">Đã khóa</option>
                </select>
              </div>

              <button
                onClick={onOpenRegisterModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8b0000] hover:bg-[#a01515] text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Đăng Ký Tài Khoản & OTP</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#8b0000] text-white">
                    <th className="py-2.5 px-3 font-bold">Họ Và Tên Cán Bộ</th>
                    <th className="py-2.5 px-3 font-bold">Tài Khoản & CCCD</th>
                    <th className="py-2.5 px-3 font-bold">Vai Trò & Bộ Phận</th>
                    <th className="py-2.5 px-3 font-bold">Quyền Ký Số VGCA</th>
                    <th className="py-2.5 px-3 font-bold">Trạng Thái</th>
                    <th className="py-2.5 px-3 font-bold text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        Không tìm thấy tài khoản cán bộ phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const userRole = roles.find((r) => r.id === u.roleId || r.name === u.role);
                      const hasSignPermission =
                        userRole?.permissions.includes('doc_sign') ||
                        u.customPermissions?.includes('doc_sign');
                      const isCurrentUser = currentUser.user === u.user;
                      const isLocked = u.status === 'locked';

                      return (
                        <tr key={u.user} className={`hover:bg-red-50/30 transition-colors ${isLocked ? 'bg-gray-100/70 opacity-75' : ''}`}>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#ff9800] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                {u.name.substring(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <div className="font-bold">{u.name}</div>
                                {u.email && <div className="text-[10px] text-gray-500 font-normal">{u.email}</div>}
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-mono font-bold text-gray-800">@{u.user}</div>
                            <div className="text-[10.5px] font-mono text-gray-500">CCCD: {u.cccd || '---'}</div>
                          </td>

                          <td className="py-2.5 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-[#8b0000] border border-red-200">
                              {u.role}
                            </span>
                            <div className="text-[10.5px] text-gray-600 mt-0.5">{u.dept || 'UBND Xã Tân An'}</div>
                          </td>

                          <td className="py-2.5 px-3">
                            {hasSignPermission ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                                <KeyRound className="w-3 h-3 text-emerald-600" />
                                <span>Được phép ký VGCA</span>
                              </span>
                            ) : (
                              <span className="text-[10.5px] text-gray-400">Không có quyền ký</span>
                            )}
                          </td>

                              <td className="py-2.5 px-3">
                                {isLocked ? (
                                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded">
                                    <Lock className="w-3 h-3" />
                                    <span>Đã Khóa</span>
                                  </span>
                                ) : u.status === 'pending' ? (
                                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Chờ Duyệt</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Hoạt động</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Approval/Rejection buttons for pending users */}
                                  {u.status === 'pending' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => onUpdateUser({ ...u, status: 'active' })}
                                        title="Duyệt thành viên"
                                        className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => onDeleteUser && onDeleteUser(u)}
                                        title="Từ chối/Xóa thành viên"
                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  
                                  {/* Switch session button */}
                                  {u.status !== 'pending' && (
                                    <button
                                      type="button"
                                      onClick={() => onSwitchUser(u)}
                                      disabled={isCurrentUser || isLocked}
                                      title={isCurrentUser ? 'Đang đăng nhập' : 'Chuyển phiên làm việc sang đồng chí này'}
                                      className={`px-2 py-1 rounded text-[10.5px] font-semibold transition-colors cursor-pointer ${
                                        isCurrentUser
                                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                                      }`}
                                    >
                                      {isCurrentUser ? 'Phiên hiện tại' : 'Chuyển phiên'}
                                    </button>
                                  )}

                                  {/* Delete button for active/locked users */}
                                  {u.status !== 'pending' && onDeleteUser && (
                                    <button
                                      type="button"
                                      onClick={() => onDeleteUser(u)}
                                      disabled={u.roleId === 'SUPER_ADMIN' || u.roleId === 'admin' || isCurrentUser}
                                      title={u.roleId === 'SUPER_ADMIN' || u.roleId === 'admin' ? 'Không thể xóa Quản trị viên' : 'Xóa tài khoản cán bộ'}
                                      className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                
                                  {/* Edit details */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUserForEdit(u)}
                                    className="px-2 py-1 rounded text-[10.5px] font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                                    title="Đổi vai trò & phân quyền riêng"
                                  >
                                    Phân quyền
                                  </button>

                                  {/* Lock / Unlock */}
                                  {u.user !== 'admin' && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleLockUser(u)}
                                      className={`p-1 rounded text-xs transition-colors cursor-pointer border ${
                                        isLocked
                                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-300'
                                          : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-300'
                                      }`}
                                      title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                    >
                                      {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: AUDIT LOG */}
        {activeSubTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-xs text-gray-600">
                Hiển thị <strong>{auditLogs.length}</strong> sự kiện kiểm toán bảo mật gần nhất trên hệ thống.
              </div>
              <button
                onClick={() => {
                  const csvContent =
                    '\uFEFFThời gian,Tài khoản,Họ tên,Vai trò,Hành động,Đối tượng,Trạng thái\n' +
                    auditLogs
                      .map(
                        (l) =>
                          `"${l.timestamp}","${l.user}","${l.userName}","${l.role}","${l.action}","${l.target || ''}","${l.status}"`
                      )
                      .join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `Nhat_ky_AuditLog_TanAn_${Date.now()}.csv`;
                  link.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Xuất Nhật Ký (CSV)</span>
              </button>
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-2xs">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-[#8b0000] text-white">
                    <th className="py-2.5 px-3 font-bold">Thời Gian</th>
                    <th className="py-2.5 px-3 font-bold">Cán Bộ Thực Hiện</th>
                    <th className="py-2.5 px-3 font-bold">Vai Trò</th>
                    <th className="py-2.5 px-3 font-bold">Nội Dung Thao Tác</th>
                    <th className="py-2.5 px-3 font-bold">Đối Tượng Tác Động</th>
                    <th className="py-2.5 px-3 font-bold">Địa Chỉ IP</th>
                    <th className="py-2.5 px-3 font-bold text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 font-mono text-gray-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-gray-900">{log.userName}</div>
                        <div className="text-[10px] font-mono text-gray-500">@{log.user}</div>
                      </td>
                      <td className="py-2 px-3 text-gray-700">
                        {log.role}
                      </td>
                      <td className="py-2 px-3 font-medium text-gray-900">
                        {log.action}
                      </td>
                      <td className="py-2 px-3 text-gray-600 max-w-xs truncate" title={log.target}>
                        {log.target || 'Hệ thống'}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-gray-500">
                        {log.ipAddress || '192.168.1.10'}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            log.status === 'Thành công'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : log.status === 'Cảnh báo'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: SQL DATABASE & SEED */}
        {activeSubTab === 'sql' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  <strong>Đặc tả cơ sở dữ liệu quan hệ (SQL Schema):</strong> Cấu trúc bảng <code>users</code> và câu lệnh khởi tạo tài khoản Quản trị viên tối cao (Super Admin) chuẩn bảo mật SHA-256.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const sqlInsert = `INSERT INTO users (
  full_name, 
  username, 
  email, 
  password_hash, 
  position, 
  department, 
  role, 
  can_sign_vgca, 
  created_at
) VALUES (
  'Huỳnh Phú Kính',
  'hpkinh.tanan',
  'hpkinh.tanan@angiang.gov.vn',
  SHA2('hpkinh1909@', 256), -- Băm mật khẩu bảo mật chuẩn SHA-256
  'Giám đốc Trung tâm Hành chính công',
  'Bộ phận Tiếp nhận và Trả kết quả',
  'SUPER_ADMIN',
  1,
  NOW()
);`;
                    navigator.clipboard.writeText(sqlInsert);
                    alert('Đã sao chép câu lệnh INSERT SQL vào khay nhớ tạm (Clipboard)!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5 text-blue-700" />
                  <span>Sao chép SQL</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const ddl = `-- ====================================================================
-- HỆ THỐNG QUẢN LÝ VĂN BẢN & ĐIỀU HÀNH TÁC NGHIỆP - UBND XÃ TÂN AN
-- CƠ SỞ DỮ LIỆU CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP & ĐỀ ÁN 06
-- ====================================================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(256) NOT NULL,
  position VARCHAR(150) NOT NULL,
  department VARCHAR(150) NOT NULL,
  role VARCHAR(64) NOT NULL DEFAULT 'OFFICER',
  can_sign_vgca TINYINT(1) NOT NULL DEFAULT 0,
  is_verified TINYINT(1) NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (
  full_name, 
  username, 
  email, 
  password_hash, 
  position, 
  department, 
  role, 
  can_sign_vgca, 
  created_at
) VALUES (
  'Huỳnh Phú Kính',
  'hpkinh.tanan',
  'hpkinh.tanan@angiang.gov.vn',
  SHA2('hpkinh1909@', 256),
  'Giám đốc Trung tâm Hành chính công',
  'Bộ phận Tiếp nhận và Trả kết quả',
  'SUPER_ADMIN',
  1,
  NOW()
);`;
                    const blob = new Blob([ddl], { type: 'text/sql;charset=utf-8;' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'schema_ubnd_tanan.sql';
                    a.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8b0000] hover:bg-[#a01515] text-white rounded font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải schema.sql</span>
                </button>
              </div>
            </div>

            {/* Code Block */}
            <div className="bg-[#1e1e1e] text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-gray-700 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-700 pb-2 mb-3">
                <span className="text-amber-400 font-bold">SQL / MySQL / PostgreSQL DML Script</span>
                <span>Chuẩn băm SHA-256 (256-bit hash)</span>
              </div>
              <pre className="text-emerald-400 whitespace-pre">
{`INSERT INTO users (
  full_name, 
  username, 
  email, 
  password_hash, 
  position, 
  department, 
  role, 
  can_sign_vgca, 
  created_at
) VALUES (
  'Huỳnh Phú Kính',
  'hpkinh.tanan',
  'hpkinh.tanan@angiang.gov.vn',
  SHA2('hpkinh1909@', 256), -- Băm mật khẩu bảo mật chuẩn SHA-256
  'Giám đốc Trung tâm Hành chính công',
  'Bộ phận Tiếp nhận và Trả kết quả',
  'SUPER_ADMIN',
  1,
  NOW()
);`}
              </pre>
            </div>

            {/* Field Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                <div className="font-bold text-gray-800 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bảo mật SHA-256 Hash:</span>
                </div>
                <div className="text-[11px] text-gray-600">
                  Mật khẩu gốc: <code className="bg-white px-1 py-0.5 rounded border border-gray-300 font-mono text-[#8b0000]">hpkinh1909@</code>
                </div>
                <div className="text-[10px] font-mono text-gray-500 break-all bg-white p-1 rounded border border-gray-200">
                  f35ba770bfab6ded64241c764bc7aee31a9b61e6de7082ba2cea1a88230704f9
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                <div className="font-bold text-gray-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thẩm quyền & Vai trò:</span>
                </div>
                <div className="text-[11px] text-gray-700">
                  Vai trò: <strong className="text-red-900">SUPER_ADMIN</strong>
                </div>
                <div className="text-[11px] text-gray-700">
                  Ký số VGCA: <strong className="text-emerald-700">can_sign_vgca = 1 (Active)</strong>
                </div>
                <div className="text-[11px] text-gray-600">
                  Bộ phận: Bộ phận Tiếp nhận và Trả kết quả
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                <div className="font-bold text-gray-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Định danh công vụ:</span>
                </div>
                <div className="text-[11px] text-gray-700">
                  Họ tên: <strong>Huỳnh Phú Kính</strong>
                </div>
                <div className="text-[11px] text-gray-700">
                  Username: <code className="font-mono text-blue-900 font-bold">hpkinh.tanan</code>
                </div>
                <div className="text-[11px] text-gray-600 truncate" title="hpkinh.tanan@angiang.gov.vn">
                  Email: hpkinh.tanan@angiang.gov.vn
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: EDIT USER ROLE & OVERRIDES */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-300 overflow-hidden">
            <div className="bg-[#8b0000] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Settings2 className="w-4 h-4 text-amber-300" />
                <span>Điều Chỉnh Vai Trò Cán Bộ</span>
              </div>
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="text-white/80 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-3.5">
              <div>
                <div className="text-gray-500">Cán bộ được chọn:</div>
                <div className="text-sm font-bold text-gray-900">{selectedUserForEdit.name} (@{selectedUserForEdit.user})</div>
                <div className="text-[11px] text-gray-600">Đơn vị: {selectedUserForEdit.dept || 'UBND Xã Tân An'}</div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Chọn vai trò công vụ chính:
                </label>
                <select
                  value={selectedUserForEdit.roleId || 'officer'}
                  onChange={(e) => {
                    const newRoleId = e.target.value;
                    const r = roles.find((x) => x.id === newRoleId);
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      roleId: newRoleId,
                      role: r ? r.name : selectedUserForEdit.role
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Cập nhật chức vụ hiển thị:
                </label>
                <input
                  type="text"
                  value={selectedUserForEdit.role}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      role: e.target.value
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateUser(selectedUserForEdit);
                    onAddAuditLog(
                      `Cập nhật vai trò cán bộ "${selectedUserForEdit.name}"`,
                      `Vai trò mới: ${selectedUserForEdit.role}`,
                      'Thành công'
                    );
                    setSelectedUserForEdit(null);
                  }}
                  className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a01515] text-white rounded font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
