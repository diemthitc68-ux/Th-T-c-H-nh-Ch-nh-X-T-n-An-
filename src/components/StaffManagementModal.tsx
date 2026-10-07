import React, { useState } from 'react';
import { X, UserPlus, Users, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { SystemUser } from '../types/user';

interface StaffManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: SystemUser[];
  onAddUser: (user: SystemUser) => void;
}

export const StaffManagementModal: React.FC<StaffManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  onAddUser
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('Văn phòng HĐND & UBND');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên cán bộ.');
      return;
    }
    if (!role.trim()) {
      setErrorMsg('Vui lòng nhập chức vụ / bộ phận.');
      return;
    }
    if (!user.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hệ thống.');
      return;
    }
    if (users.some((u) => u.user.toLowerCase() === user.trim().toLowerCase())) {
      setErrorMsg('Tên đăng nhập này đã tồn tại trong hệ thống!');
      return;
    }

    const newUser: SystemUser = {
      name: name.trim(),
      role: role.trim(),
      dept,
      user: user.trim().toLowerCase(),
      pass: pass.trim() || '123456'
    };

    onAddUser(newUser);
    setName('');
    setRole('');
    setUser('');
    setPass('123456');
    setErrorMsg('');
    setActiveTab('list');
  };

  const handleGenerateUsername = () => {
    if (!name.trim()) return;
    // Remove diacritics
    const clean = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      const lastName = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map((p) => p[0]).join('');
      setUser(`${lastName}${initials}_tanan`);
    } else {
      setUser(`${clean}_tanan`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl border border-gray-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-5 py-3 flex items-center justify-between">
          <div className="font-bold text-sm md:text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-300" />
            <span>Quản Lý Danh Sách & Cấp Tài Khoản Cán Bộ</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-5 pt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-3.5 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'border-[#b71c1c] text-[#b71c1c] bg-white rounded-t'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            + Cấp Tài Khoản Mới
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-3.5 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'list'
                ? 'border-[#b71c1c] text-[#b71c1c] bg-white rounded-t'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Danh Sách Cán Bộ ({users.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto text-xs">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Họ và tên cán bộ: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleGenerateUsername}
                    placeholder="VD: Nguyễn Văn Hoàng"
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Chức vụ / Chức danh: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="VD: Công chức Tư pháp - Hộ tịch"
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Bộ phận / Phòng ban công tác:
                </label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                >
                  <option value="Lãnh đạo UBND">Lãnh đạo UBND xã</option>
                  <option value="Thường trực HĐND">Thường trực HĐND xã</option>
                  <option value="Bộ phận Một cửa">Bộ phận Một cửa (TT Hành chính công)</option>
                  <option value="Văn phòng HĐND & UBND">Văn phòng HĐND & UBND</option>
                  <option value="Địa chính - Nông nghiệp">Địa chính - Nông nghiệp</option>
                  <option value="Tư pháp">Tư pháp</option>
                  <option value="Quân sự">Ban Chỉ huy Quân sự</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700">
                      Tên đăng nhập hệ thống: <span className="text-red-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateUsername}
                      className="text-[10.5px] text-[#b71c1c] hover:underline cursor-pointer"
                    >
                      Tạo tự động
                    </button>
                  </div>
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="VD: hoangnv_tanan"
                    className="w-full p-2 border border-gray-300 rounded font-mono focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Mật khẩu khởi tạo: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2 border border-gray-300 rounded font-mono focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Mặc định khuyến nghị: <b className="font-mono">123456</b>
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded text-[11px] flex items-start gap-1.5">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Tài khoản sau khi được cấp sẽ tự động tích hợp quyền thụ lý văn bản, ký số chuyên dùng Ban Cơ Yếu và đăng nhập tác nghiệp tại cổng điều hành xã Tân An.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b71c1c] hover:bg-[#a01515] text-white rounded font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cấp Tài Khoản</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <table className="w-full border border-gray-200 text-left text-xs divide-y divide-gray-200">
                <thead className="bg-gray-50 text-[11px] font-bold text-gray-700 uppercase">
                  <tr>
                    <th className="p-2.5">Cán bộ</th>
                    <th className="p-2.5">Chức vụ / Đơn vị</th>
                    <th className="p-2.5">Tài khoản</th>
                    <th className="p-2.5 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.user} className="hover:bg-gray-50">
                      <td className="p-2.5 font-bold text-gray-900">
                        {u.name}
                      </td>
                      <td className="p-2.5">
                        <div className="text-gray-800 font-medium">{u.role}</div>
                        {u.dept && <div className="text-[10px] text-gray-500">{u.dept}</div>}
                      </td>
                      <td className="p-2.5 font-mono text-gray-700">
                        @{u.user}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Hoạt động</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-500 text-[11px]">Tổng số: {users.length} tài khoản cán bộ</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
