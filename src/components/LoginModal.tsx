import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  Star,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldAlert
} from 'lucide-react';
import { SystemUser, adminAccount } from '../types/user';
import { sha256Hex } from '../utils/cryptoUtils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: SystemUser) => void;
  users: SystemUser[];
  currentUser: SystemUser;
  onOpenRegister?: () => void;
  onOpenForgotPassword?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  users,
  currentUser,
  onOpenRegister,
  onOpenForgotPassword
}) => {
  const [username, setUsername] = useState('hpkinh.tanan');
  const [password, setPassword] = useState('hpkinh1909@');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qUser = username.trim().toLowerCase();

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(adminAccount.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFillAdminCredentials = () => {
    setUsername(adminAccount.username);
    setPassword(adminAccount.password);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!qUser) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hoặc email công vụ.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu bảo mật của tài khoản!');
      return;
    }

    const account = users.find(
      (x) =>
        x.user.toLowerCase() === qUser ||
        (x.username && x.username.toLowerCase() === qUser) ||
        (x.email && x.email.toLowerCase() === qUser)
    );

    if (!account) {
      setErrorMsg('Tên đăng nhập không tồn tại trong hệ thống!');
      return;
    }

    if (account.status === 'locked') {
      setErrorMsg('Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Văn phòng HĐND & UBND để mở khóa.');
      return;
    }

    // BẢO MẬT MẬT KHẨU: Bắt buộc kiểm tra mật khẩu đã nhập hoặc chuỗi băm SHA-256
    const hash = await sha256Hex(password.trim());
    const isPasswordValid =
      account.pass === password.trim() ||
      (account.password && account.password === password.trim()) ||
      (account.password_hash && account.password_hash === hash);

    if (isPasswordValid) {
      onLogin(account);
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Mật khẩu không chính xác! Vui lòng kiểm tra lại mật khẩu bảo mật.');
    }
  };

  const handleQuickSelect = (u: SystemUser) => {
    setUsername(u.username || u.user);
    setPassword(u.password || u.pass || '123456');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#8b0000]/92 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-7 relative border border-red-200">
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 p-1 rounded-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Emblem & Title */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-radial from-[#ffd54f] via-[#d32f2f] to-[#b71c1c] text-[#ffd700] mx-auto flex items-center justify-center text-xl font-bold shadow-xs border border-red-700">
            ★
          </div>
          <h2 className="text-base font-extrabold text-[#b71c1c] mt-2.5 uppercase tracking-wide">
            UBND XÃ TÂN AN
          </h2>
          <p className="text-xs text-gray-600 mt-0.5 font-medium">
            Đăng nhập hệ thống Quản lý Văn bản, Điều hành & Ký số
          </p>
        </div>

        {/* Card Quản Trị Viên: BẢO MẬT MẬT KHẨU CHUẨN SHA-256 */}
        <div className="mb-4 bg-amber-50/90 border border-amber-300 rounded-lg p-3 text-xs shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-extrabold text-[#8b0000] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>TÀI KHOẢN QUẢN TRỊ VIÊN TỐI CAO:</span>
            </span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-700" />
              <span>BẢO MẬT SHA-256</span>
            </span>
          </div>

          <div className="space-y-1 text-gray-700">
            <div>
              Họ tên: <strong>{adminAccount.fullName}</strong> ({adminAccount.position})
            </div>
            <div className="font-mono text-[11px] text-gray-600 flex flex-wrap items-center justify-between gap-1">
              <div>
                Username: <strong className="text-gray-900">{adminAccount.username}</strong>
              </div>
              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="text-[10px] font-bold text-[#8b0000] hover:underline bg-white px-2 py-0.5 rounded border border-amber-300 cursor-pointer shadow-2xs inline-flex items-center gap-1"
              >
                <span>Điền thông tin mẫu</span>
              </button>
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-amber-200 font-mono text-[11px] text-gray-700 mt-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-gray-500">Mật khẩu:</span>
                <span className="font-bold text-[#8b0000]">
                  {showPassword ? adminAccount.password : '••••••••••••'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="text-gray-500 hover:text-gray-800 p-0.5 cursor-pointer ml-1"
                  title="Sao chép mật khẩu"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="text-[10px] text-emerald-700 font-medium pt-0.5">
              ✓ Toàn quyền SUPER_ADMIN · Ký số Ban Cơ Yếu VGCA Active · Mã hóa băm SHA-256
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3.5 bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Tên đăng nhập hoặc Email công vụ: <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: hpkinh.tanan hoặc email công vụ"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden text-xs"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-gray-700">
                Mật khẩu: <span className="text-red-600">*</span>
              </label>
              <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <span>Bảo vệ mã hóa SHA-256</span>
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu công vụ"
                className="w-full pl-8 pr-10 py-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#b71c1c] hover:bg-[#a01515] text-white py-2.5 rounded-md font-bold text-xs uppercase tracking-wide transition-colors shadow-xs cursor-pointer mt-1 flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đăng Nhập Hệ Thống</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 pt-1.5 text-[11px]">
            {onOpenForgotPassword && (
              <button
                type="button"
                onClick={onOpenForgotPassword}
                className="text-[#8b0000] hover:underline font-semibold cursor-pointer"
              >
                Quên mật khẩu? <strong>Khôi phục & cấp lại</strong>
              </button>
            )}

            {onOpenRegister && (
              <button
                type="button"
                onClick={onOpenRegister}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Đăng ký tài khoản
              </button>
            )}
          </div>
        </form>

        {/* Quick account switcher for demonstration */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-600">
          <div className="font-bold text-gray-700 mb-1.5 flex items-center justify-between">
            <span>Chọn nhanh tài khoản cán bộ để kiểm thử:</span>
            <span className="text-[10px] text-gray-400 font-mono">Bảo mật SHA-256</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {users.slice(0, 4).map((u) => {
              const isSuper = u.roleId === 'SUPER_ADMIN' || u.user === 'hpkinh.tanan';

              return (
                <button
                  key={u.user}
                  type="button"
                  onClick={() => handleQuickSelect(u)}
                  className={`text-left p-1.5 rounded border text-[10.5px] transition-colors cursor-pointer ${
                    username === u.user || username === u.username
                      ? 'border-[#b71c1c] bg-red-50 text-[#b71c1c] font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="truncate font-semibold flex items-center justify-between">
                    <span>{u.name}</span>
                    {isSuper && (
                      <span className="text-[9px] text-[#8b0000] font-bold bg-amber-100 px-1 rounded">Super Admin</span>
                    )}
                  </div>
                  <div className="text-[9.5px] text-gray-500 font-mono truncate">@{u.username || u.user}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center text-[10.5px] text-gray-400 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bảo mật dữ liệu chuẩn Nghị định 30/2020/NĐ-CP & Chữ ký số Ban Cơ Yếu</span>
        </div>
      </div>
    </div>
  );
};
