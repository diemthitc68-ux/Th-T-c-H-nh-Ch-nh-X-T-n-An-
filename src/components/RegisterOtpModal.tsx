import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  UserCheck,
  Building,
  Mail,
  CreditCard
} from 'lucide-react';
import { SystemUser } from '../types/user';

interface RegisterOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newUser: SystemUser) => void;
  existingUsers: SystemUser[];
}

export const RegisterOtpModal: React.FC<RegisterOtpModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  existingUsers
}) => {
  const [step, setStep] = useState<'info' | 'otp' | 'success'>('info');

  // Form states
  const [fullName, setFullName] = useState('');
  const [cccd, setCccd] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Công chức Chuyên môn');
  const [dept, setDept] = useState('Văn phòng HĐND & UBND');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // OTP states
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Auto-generate username from name
  const handleGenerateUsername = (nameVal: string) => {
    if (!nameVal.trim()) return;
    const clean = nameVal
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
      setUsername(`${lastName}${initials}_tanan`);
    } else {
      setUsername(`${clean}_tanan`);
    }
  };

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Handle Step 1 submit: validate and generate OTP
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên.');
      return;
    }
    if (cccd.trim().length !== 12) {
      setErrorMsg('Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số.');
      return;
    }
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone.trim())) {
      setErrorMsg('Số điện thoại không hợp lệ (Phải gồm 10 chữ số, đầu số Việt Nam).');
      return;
    }
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hệ thống.');
      return;
    }
    if (existingUsers.some((u) => u.user.toLowerCase() === username.trim().toLowerCase())) {
      setErrorMsg('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    // Generate random 6-digit OTP code
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setInputOtp('');
    setCountdown(60);
    setStep('otp');
  };

  // Handle Step 2 submit: verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (inputOtp.trim() !== generatedOtp) {
      setErrorMsg('Mã OTP không chính xác. Vui lòng kiểm tra lại!');
      return;
    }

    // Success: create user
    const newUser: SystemUser = {
      user: username.trim().toLowerCase(),
      pass: password,
      name: fullName.trim(),
      role: role.trim(),
      dept,
      cccd: cccd.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isVerified: true
    };

    // Send notification email
    const subject = `Phê duyệt tài khoản cán bộ hệ thống: ${newUser.name}`;
    const body = `Kính gửi Ban Quản trị,
    
    Đồng chí ${newUser.name} đã đăng ký tài khoản mới trên hệ thống Điều hành tác nghiệp UBND Xã Tân An.
    
    Thông tin chi tiết:
    - Họ tên: ${newUser.name}
    - Username: ${newUser.user}
    - CCCD: ${newUser.cccd}
    - Bộ phận: ${newUser.dept}
    
    Vui lòng kiểm tra và duyệt tài khoản này trên hệ thống.
    
    Trân trọng!`;

    fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('oauth_token')}`, // Assuming token is stored in sessionStorage
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: btoa(`To: diemthitc68@gmail.com\r\nSubject: ${subject}\r\n\r\n${body}`)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, ''),
      }),
    })
      .then((res) => console.log('Email sent:', res))
      .catch((err) => console.error('Email error:', err));

    onRegisterSuccess(newUser);
    setStep('success');
  };

  const handleResendOtp = () => {
    setIsResending(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setCountdown(60);
    setErrorMsg('');
    setTimeout(() => {
      setIsResending(false);
    }, 600);
  };

  const handleResetModal = () => {
    setStep('info');
    setFullName('');
    setCccd('');
    setPhone('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setInputOtp('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-gray-300 overflow-hidden my-6">
        {/* Top decorative banner */}
        <div className="bg-[#8b0000] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span>CỔNG ĐĂNG KÝ TÀI KHOẢN & XÁC THỰC OTP</span>
          </div>
          <button
            onClick={handleResetModal}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* National Administrative Header (Chuẩn thể thức hành chính) */}
        <div className="p-5 pb-2 text-center border-b border-gray-200">
          <div className="text-xs font-bold uppercase text-gray-800 tracking-wider">
            ỦY BAN NHÂN DÂN XÃ TÂN AN
          </div>
          <div className="text-[13px] font-extrabold uppercase text-gray-900 mt-0.5">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-xs italic text-gray-700 font-medium">
            Độc lập - Tự do - Hạnh phúc
          </div>
          <div className="w-32 h-0.5 bg-[#8b0000] mx-auto my-2 rounded-full"></div>
          <h2 className="text-sm md:text-base font-extrabold text-[#8b0000] uppercase tracking-wide">
            ĐĂNG KÝ TÀI KHOẢN HỆ THỐNG ĐIỀU HÀNH & KÝ SỐ
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
            Xác thực danh tính điện tử theo chuẩn Nghị định 30/2020/NĐ-CP & Đề án 06
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 px-6 py-2.5 bg-gray-50/80 border-b border-gray-200 text-xs">
          <div
            className={`flex items-center gap-1.5 font-bold ${
              step === 'info' ? 'text-[#b71c1c]' : 'text-emerald-700'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'info'
                  ? 'bg-[#b71c1c] text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span>Khai báo thông tin</span>
          </div>

          <div className="w-8 h-px bg-gray-300"></div>

          <div
            className={`flex items-center gap-1.5 font-bold ${
              step === 'otp'
                ? 'text-[#b71c1c]'
                : step === 'success'
                ? 'text-emerald-700'
                : 'text-gray-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'otp'
                  ? 'bg-[#b71c1c] text-white'
                  : step === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              2
            </span>
            <span>Xác thực OTP</span>
          </div>

          <div className="w-8 h-px bg-gray-300"></div>

          <div
            className={`flex items-center gap-1.5 font-bold ${
              step === 'success' ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </span>
            <span>Hoàn tất</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'info' && (
            /* Bước 1: Khai báo thông tin */
            <form onSubmit={handleProceedToOtp} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Họ và tên cán bộ / Công dân: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      handleGenerateUsername(e.target.value);
                    }}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                    <span>Số CCCD (12 số): <span className="text-red-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value.replace(/\D/g, ''))}
                    placeholder="079096001234"
                    className="w-full p-2 border border-gray-300 rounded font-mono font-medium focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Số điện thoại nhận OTP: <span className="text-red-600">*</span></span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="0912345678"
                    className="w-full p-2 border border-gray-300 rounded font-mono font-medium focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Mã xác thực OTP sẽ được gửi về số này.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    <span>Hộp thư điện tử (Email):</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="an.nguyen@tanan.gov.vn"
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Chức vụ / Nhiệm vụ:
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="VD: Công chức Địa chính - Xây dựng"
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-gray-500" />
                    <span>Bộ phận / Ấp quản lý:</span>
                  </label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#b71c1c] focus:outline-hidden"
                  >
                    <option value="Văn phòng HĐND & UBND">Văn phòng HĐND & UBND</option>
                    <option value="Bộ phận Một cửa">Bộ phận Một cửa (TT Hành chính công)</option>
                    <option value="Địa chính - Nông nghiệp">Địa chính - Nông nghiệp</option>
                    <option value="Tư pháp">Tư pháp</option>
                    <option value="Quân sự">Ban Chỉ huy Quân sự</option>
                    <option value="Ấp Tân Hưng">Ấp Tân Hưng</option>
                    <option value="Ấp Tân Hiệp">Ấp Tân Hiệp</option>
                    <option value="Ấp Tân Lập">Ấp Tân Lập</option>
                  </select>
                </div>
              </div>

              {/* Tên đăng nhập & Mật khẩu */}
              <div className="pt-2 border-t border-gray-200">
                <div className="font-bold text-gray-800 mb-2">Thiết lập tài khoản đăng nhập:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Tên đăng nhập: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="annv_tanan"
                      className="w-full p-2 border border-gray-300 rounded font-mono font-medium focus:border-[#b71c1c] focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Mật khẩu: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2 border border-gray-300 rounded font-mono focus:border-[#b71c1c] focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nhập lại mật khẩu: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2 border border-gray-300 rounded font-mono focus:border-[#b71c1c] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#b71c1c] hover:bg-[#a01515] text-white rounded font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Tiếp Tục: Gửi Mã OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            /* Bước 2: Nhập mã xác thực OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">
                  Xác Thực Mã OTP Bảo Mật
                </h3>
                <p className="text-gray-600 mt-1">
                  Mã xác thực gồm 6 chữ số đã được gửi tới số điện thoại{' '}
                  <strong className="text-gray-900 font-mono">
                    {phone.substring(0, 3)}****{phone.substring(7)}
                  </strong>
                </p>
              </div>

              {/* Simulated OTP Display Banner so user is never blocked */}
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-3 rounded-lg text-center">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Mô phỏng tin nhắn SMS từ Tổng đài UBND Xã Tân An:
                </div>
                <div className="my-1.5">
                  <span className="text-2xl font-mono font-extrabold tracking-widest text-[#b71c1c] bg-white px-4 py-1 rounded border border-amber-200 inline-block shadow-2xs">
                    {generatedOtp}
                  </span>
                </div>
                <div className="text-[10.5px] text-amber-800">
                  (Bấm nút "Điền nhanh mã OTP" bên dưới để kiểm tra quy trình)
                </div>
              </div>

              <div className="max-w-xs mx-auto text-center space-y-2">
                <label className="block font-bold text-gray-700">
                  Nhập mã OTP gồm 6 chữ số:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full text-center py-2.5 px-3 border-2 border-gray-300 focus:border-[#b71c1c] focus:outline-hidden rounded-lg font-mono text-xl font-bold tracking-widest"
                  autoFocus
                  required
                />

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setInputOtp(generatedOtp)}
                    className="text-[11px] font-semibold text-[#b71c1c] hover:underline cursor-pointer"
                  >
                    Điền nhanh mã OTP ({generatedOtp})
                  </button>
                </div>
              </div>

              {/* Countdown and Resend */}
              <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                {countdown > 0 ? (
                  <span>Mã có hiệu lực trong: <strong className="font-mono text-gray-800">{countdown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1 text-[#b71c1c] hover:underline font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Gửi lại mã OTP mới</span>
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại sửa thông tin</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#b71c1c] hover:bg-[#a01515] text-white rounded font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận & Hoàn Tất</span>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            /* Bước 3: Hoàn tất đăng ký thành công */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-emerald-800 uppercase tracking-wide">
                  ĐĂNG KÝ VÀ XÁC THỰC OTP THÀNH CÔNG!
                </h3>
                <p className="text-gray-600 mt-1 text-xs">
                  Tài khoản của đồng chí <strong>{fullName}</strong> đã được kích hoạt thành công trên Hệ thống Điều hành tác nghiệp UBND Xã Tân An.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left max-w-sm mx-auto text-xs space-y-1 font-mono">
                <div><span className="text-gray-500">Tên đăng nhập:</span> <strong>@{username}</strong></div>
                <div><span className="text-gray-500">Chức vụ:</span> {role}</div>
                <div><span className="text-gray-500">Đơn vị:</span> {dept}</div>
                <div><span className="text-gray-500">Trạng thái xác thực:</span> <span className="text-emerald-700 font-bold">Đã xác thực OTP</span></div>
              </div>

              <button
                type="button"
                onClick={handleResetModal}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#b71c1c] hover:bg-[#a01515] text-white rounded-md font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Bắt Đầu Làm Việc Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
