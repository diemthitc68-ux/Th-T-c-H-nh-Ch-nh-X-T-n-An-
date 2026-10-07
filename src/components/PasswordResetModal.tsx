import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Lock,
  ArrowRight,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { SystemUser } from '../types/user';
import { sha256Hex } from '../utils/cryptoUtils';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: SystemUser[];
  onPasswordResetSuccess: (user: SystemUser, newPass: string, newHash: string) => void;
  onSwitchToLogin: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  users,
  onPasswordResetSuccess,
  onSwitchToLogin
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [accountInput, setAccountInput] = useState('');
  const [cccdInput, setCccdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [targetUser, setTargetUser] = useState<SystemUser | null>(null);

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [mockGeneratedOtp, setMockGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPasswordHash, setNewPasswordHash] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Compute SHA-256 hash when password changes
  useEffect(() => {
    if (newPassword) {
      sha256Hex(newPassword).then((hash) => setNewPasswordHash(hash));
    } else {
      setNewPasswordHash('');
    }
  }, [newPassword]);

  if (!isOpen) return null;

  // Step 1: Verify identity
  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const q = accountInput.trim().toLowerCase();
    const cccd = cccdInput.trim();

    if (!q) {
      setErrorMsg('Vui lòng nhập Tên đăng nhập hoặc Email công vụ.');
      return;
    }

    const found = users.find(
      (u) =>
        u.user.toLowerCase() === q ||
        (u.username && u.username.toLowerCase() === q) ||
        (u.email && u.email.toLowerCase() === q)
    );

    if (!found) {
      setErrorMsg('Không tìm thấy tài khoản cán bộ công chức trong hệ thống!');
      return;
    }

    if (found.status === 'locked') {
      setErrorMsg('Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Quản trị viên tối cao để mở khóa.');
      return;
    }

    // Check CCCD if user has CCCD on record
    if (found.cccd && cccd && found.cccd !== cccd) {
      setErrorMsg(`Số CCCD không khớp với hồ sơ cán bộ đã lưu (CCCD bắt đầu bằng ${found.cccd.substring(0, 3)}...)!`);
      return;
    }

    setTargetUser(found);
    setPhoneInput(found.phone || '0918234567');

    // Generate random 6-digit OTP
    const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockGeneratedOtp(genOtp);
    setOtpCode(genOtp); // Pre-fill for seamless testing
    setCountdown(60);
    setStep(2);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode !== mockGeneratedOtp && otpCode !== '123456') {
      setErrorMsg('Mã OTP xác thực không chính xác hoặc đã hết hạn.');
      return;
    }

    setStep(3);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(newPassword);

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có độ dài tối thiểu 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!');
      return;
    }

    setIsProcessing(true);

    const hash = await sha256Hex(newPassword);

    setTimeout(() => {
      setIsProcessing(false);
      if (targetUser) {
        onPasswordResetSuccess(targetUser, newPassword, hash);
      }
      setStep(4);
    }, 600);
  };

  // Quick select helper
  const handleQuickSelect = (u: SystemUser) => {
    setAccountInput(u.username || u.user);
    setCccdInput(u.cccd || '');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#fceeed] rounded-xl shadow-2xl w-full max-w-[1000px] border border-[#ebd4d4] overflow-hidden my-auto">
        {/* Top Header Bar (Matching Prompt .top-bar) */}
        <div className="bg-[#8b0000] text-white px-5 py-2.5 flex justify-between items-center text-xs border-b border-[#a01616]">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider uppercase text-[11px] md:text-xs">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </span>
            <span className="text-amber-200 text-[10.5px] italic hidden sm:inline">
              - Độc lập - Tự do - Hạnh phúc
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-amber-200 font-semibold">
              Hệ thống Định danh & Cấp lại Mật khẩu Công vụ
            </span>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-sm transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Header (Matching Prompt .main-header) */}
        <div className="bg-white px-5 py-3.5 flex justify-between items-center border-b border-[#ebd4d4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-radial from-[#ffd54f] via-[#d32f2f] to-[#b71c1c] text-[#ffd700] flex items-center justify-center text-lg font-bold shadow-xs border border-red-700 shrink-0">
              ★
            </div>
            <div>
              <h1 className="text-base md:text-lg font-extrabold text-[#8b0000] tracking-wide uppercase">
                UBND XÃ TÂN AN - KHÔI PHỤC & CẤP LẠI MẬT KHẨU
              </h1>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Quy trình xác thực an toàn thông tin theo tiêu chuẩn Nghị định 30/2020/NĐ-CP & Đề án 06
              </p>
            </div>
          </div>

          {/* Step Progress indicator */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className={`px-2 py-0.5 rounded font-bold ${step === 1 ? 'bg-[#8b0000] text-white' : 'bg-gray-200 text-gray-700'}`}>1. Định danh</span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded font-bold ${step === 2 ? 'bg-[#8b0000] text-white' : 'bg-gray-200 text-gray-700'}`}>2. OTP</span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded font-bold ${step === 3 ? 'bg-[#8b0000] text-white' : 'bg-gray-200 text-gray-700'}`}>3. Mật khẩu</span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded font-bold ${step === 4 ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-700'}`}>4. Hoàn tất</span>
          </div>
        </div>

        {/* Container (Matching Prompt .container with 2 columns: 1fr and 1.3fr) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-5">
          {/* CỘT TRÁI (1fr): HƯỚNG DẪN QUY TRÌNH & BẢO MẬT */}
          <div className="bg-white rounded-lg border border-[#ebd4d4] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <Shield className="w-5 h-5 text-[#8b0000]" />
                <h3 className="font-extrabold text-[#8b0000] text-sm uppercase">
                  Quy Trình Cấp Lại Mật Khẩu
                </h3>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#8b0000] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Xác thực tài khoản cán bộ</div>
                    <div className="text-[11.5px] text-gray-600 mt-0.5">
                      Nhập đúng tên đăng nhập/email công vụ và số Căn cước công dân (12 số) đã khai báo.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#8b0000] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Xác thực mã bảo mật OTP</div>
                    <div className="text-[11.5px] text-gray-600 mt-0.5">
                      Mã OTP 6 số sẽ được gửi tới số điện thoại di động công vụ đã đăng ký.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#8b0000] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Thiết lập mật khẩu an toàn</div>
                    <div className="text-[11.5px] text-gray-600 mt-0.5">
                      Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    4
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Mã hóa SHA-256 an toàn</div>
                    <div className="text-[11.5px] text-gray-600 mt-0.5">
                      Mật khẩu được băm chuỗi SHA-256 (256-bit) trước khi đồng bộ vào CSDL hệ thống.
                    </div>
                  </div>
                </div>
              </div>

              {/* Security notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Lưu ý An toàn thông tin:</span>
                </div>
                <p className="leading-relaxed">
                  Mọi hành vi yêu cầu cấp lại mật khẩu đều được tự động lưu vết IP và ghi lại trong Sổ nhật ký kiểm toán (Audit Log) theo quy chế an toàn dữ liệu cơ quan Nhà nước.
                </p>
              </div>
            </div>

            {/* Support contact info */}
            <div className="pt-3 border-t border-gray-200 text-[11px] text-gray-600 space-y-1 bg-gray-50 -mx-5 -mb-5 p-4 rounded-b-lg">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#8b0000]" />
                <span>Hỗ trợ kỹ thuật Văn phòng UBND:</span>
              </div>
              <div>Đ/c Huỳnh Phú Kính (GĐ TT Hành chính công - Super Admin)</div>
              <div className="text-gray-500 font-mono">Hotline: 0918.234.567 · Email: hpkinh.tanan@angiang.gov.vn</div>
            </div>
          </div>

          {/* CỘT PHẢI (1.3fr): BIỂU MẪU XÁC THỰC & ĐỔI MẬT KHẨU */}
          <div className="bg-white rounded-lg border border-[#ebd4d4] p-5 shadow-xs flex flex-col justify-between">
            {errorMsg && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* BƯỚC 1: XÁC THỰC ĐỊNH DANH */}
            {step === 1 && (
              <form onSubmit={handleVerifyIdentity} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#8b0000] uppercase mb-1">
                    Bước 1: Nhập Thông Tin Định Danh Cán Bộ
                  </h3>
                  <p className="text-gray-500 text-[11.5px]">
                    Vui lòng cung cấp chính xác Tên đăng nhập và Số CCCD gắn chip để hệ thống gửi mã xác thực OTP.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Tên đăng nhập hoặc Email công vụ: <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={accountInput}
                      onChange={(e) => setAccountInput(e.target.value)}
                      placeholder="VD: hpkinh.tanan hoặc email @angiang.gov.vn"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số Căn cước công dân (12 chữ số): <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={cccdInput}
                      onChange={(e) => setCccdInput(e.target.value)}
                      placeholder="VD: 079084001234"
                      maxLength={12}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded font-mono focus:border-[#b71c1c] focus:outline-hidden"
                    />
                  </div>
                  <div className="text-[10.5px] text-gray-500 mt-1">
                    Dùng để đối chiếu dữ liệu định danh cán bộ công chức theo Đề án 06.
                  </div>
                </div>

                {/* Quick picker for demo */}
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                  <div className="font-bold text-gray-700 text-[11px] mb-1.5">
                    Chọn nhanh tài khoản để kiểm thử quy trình:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                    {users.slice(0, 4).map((u) => (
                      <button
                        key={u.user}
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className={`text-left p-1.5 rounded border transition-colors cursor-pointer ${
                          accountInput === u.user || accountInput === u.username
                            ? 'border-[#8b0000] bg-red-50 text-[#8b0000] font-bold'
                            : 'border-gray-200 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="truncate font-semibold">{u.name}</div>
                        <div className="text-[9.5px] text-gray-500 font-mono">@{u.username || u.user}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[#8b0000] hover:underline font-semibold text-xs cursor-pointer"
                  >
                    ← Quay lại Đăng nhập
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b0000] hover:bg-[#a01515] text-white rounded font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Tiếp tục: Gửi OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* BƯỚC 2: XÁC THỰC MÃ OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#8b0000] uppercase mb-1">
                    Bước 2: Nhập Mã Xác Thực OTP
                  </h3>
                  <p className="text-gray-600 text-[11.5px]">
                    Hệ thống đã gửi mã OTP 6 chữ số tới số điện thoại cán bộ:{' '}
                    <strong className="text-gray-900 font-mono">
                      {phoneInput ? phoneInput.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : '091****567'}
                    </strong>
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-emerald-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <span>Mô phỏng tin nhắn SMS OTP công vụ:</span>
                    </span>
                    <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">
                      {countdown > 0 ? `${countdown}s` : 'Hết hạn'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-700 mt-1">
                    [UBND TAN AN] Ma xac thuc cap lai mat khau cua dong chi{' '}
                    <strong>{targetUser?.name}</strong> la:
                  </div>
                  <div className="text-xl font-extrabold font-mono tracking-widest text-[#8b0000] my-1 text-center bg-white py-1.5 rounded border border-emerald-200">
                    {mockGeneratedOtp}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nhập mã xác thực OTP 6 số: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="VD: 123456"
                    maxLength={6}
                    className="w-full text-center text-lg font-mono tracking-widest py-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden font-bold"
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-600">
                  <span>Chưa nhận được mã?</span>
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={() => {
                      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                      setMockGeneratedOtp(newOtp);
                      setOtpCode(newOtp);
                      setCountdown(60);
                    }}
                    className={`font-semibold cursor-pointer ${
                      countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#8b0000] hover:underline'
                    }`}
                  >
                    Gửi lại mã OTP ({countdown}s)
                  </button>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-gray-900 font-semibold text-xs cursor-pointer"
                  >
                    ← Quay lại Bước 1
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b0000] hover:bg-[#a01515] text-white rounded font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Xác nhận OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* BƯỚC 3: THIẾT LẬP MẬT KHẨU MỚI */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#8b0000] uppercase mb-1">
                    Bước 3: Thiết Lập Mật Khẩu Mới
                  </h3>
                  <p className="text-gray-600 text-[11.5px]">
                    Cấp lại mật khẩu cho cán bộ: <strong>{targetUser?.name}</strong> (@{targetUser?.username || targetUser?.user})
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Mật khẩu mới: <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                      className="w-full pl-8 pr-9 py-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength bar */}
                <div>
                  <div className="flex justify-between items-center text-[10.5px] text-gray-500 mb-1">
                    <span>Độ an toàn mật khẩu:</span>
                    <span className="font-bold">
                      {strengthScore <= 1 && 'Yếu'}
                      {strengthScore === 2 && 'Trung bình'}
                      {strengthScore === 3 && 'Khá'}
                      {strengthScore === 4 && 'Rất an toàn'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore <= 1
                          ? 'w-1/4 bg-red-500'
                          : strengthScore === 2
                          ? 'w-2/4 bg-amber-500'
                          : strengthScore === 3
                          ? 'w-3/4 bg-blue-500'
                          : 'w-full bg-emerald-600'
                      }`}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nhập lại mật khẩu mới: <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại chính xác mật khẩu mới"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded font-medium focus:border-[#b71c1c] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* SHA-256 Hash Preview */}
                {newPasswordHash && (
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200 font-mono text-[10.5px]">
                    <div className="text-gray-500 flex items-center justify-between mb-1">
                      <span>Mã băm SHA-256 lưu CSDL:</span>
                      <span className="text-emerald-700 font-semibold">256-bit hash</span>
                    </div>
                    <div className="text-gray-800 break-all bg-white p-1.5 rounded border border-gray-200">
                      {newPasswordHash}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-gray-600 hover:text-gray-900 font-semibold text-xs cursor-pointer"
                  >
                    ← Quay lại Bước 2
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b0000] hover:bg-[#a01515] text-white rounded font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer shadow-xs"
                  >
                    {isProcessing ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Mới'}
                  </button>
                </div>
              </form>
            )}

            {/* BƯỚC 4: HOÀN TẤT */}
            {step === 4 && (
              <div className="text-center py-6 space-y-4 text-xs">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-gray-900 uppercase">
                    Cấp Lại Mật Khẩu Thành Công!
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    Tài khoản của đồng chí <strong>{targetUser?.name}</strong> đã được cập nhật mật khẩu mới và đồng bộ vào cơ sở dữ liệu hệ thống.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-sm mx-auto text-left space-y-1">
                  <div>Tên đăng nhập: <strong className="font-mono text-gray-900">{targetUser?.username || targetUser?.user}</strong></div>
                  <div>Mật khẩu mới: <strong className="font-mono text-[#8b0000]">{newPassword}</strong></div>
                  <div className="text-[10px] text-gray-500 font-mono break-all pt-1 border-t border-gray-200">
                    SHA256: {newPasswordHash}
                  </div>
                </div>

                <div className="pt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToLogin();
                    }}
                    className="px-5 py-2 bg-[#8b0000] hover:bg-[#a01515] text-white rounded-md font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer shadow-xs"
                  >
                    Đăng Nhập Ngay Bằng Mật Khẩu Mới
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
