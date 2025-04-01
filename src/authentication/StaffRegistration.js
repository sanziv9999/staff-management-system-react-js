import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Translation dictionary with additional languages
const translations = {
  en: {
    title: "Staff Registration",
    firstName: "First Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    username: "Username",
    email: "Email",
    dob: "Date of Birth",
    password: "Password",
    confirmPassword: "Confirm Password",
    department: "Department",
    selectDepartment: "Select a department",
    location: "Location",
    useCurrentLocation: "Use My Current Location",
    profilePicture: "Profile Picture",
    cv: "CV",
    certificateFile: "Certificate File",
    certificateType: "Certificate Type",
    selectType: "Select Type (Optional)",
    experience: "Experience",
    training: "Training",
    achievement: "Achievement",
    certificateTitle: "Certificate Title",
    certificateDescription: "Certificate Description",
    certificateIssueDate: "Certificate Issue Date",
    register: "Register",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    language: "Language",
    errorPasswordsNotMatch: "Passwords do not match.",
    errorFailedLoadDepartments: "Failed to load departments.",
    errorCouldNotRetrieveAddress: "Could not retrieve address.",
    errorGeolocationNotSupported: "Geolocation not supported.",
    errorUnableRetrieveLocation: "Unable to retrieve location",
    successLocationRetrieved: "Location retrieved successfully!",
    successLocationUpdated: "Location updated from map!",
    successRegistration: "Registration successful! Redirecting..."
  },
  ja: {
    title: "スタッフ登録",
    firstName: "名",
    middleName: "ミドルネーム",
    lastName: "姓",
    username: "ユーザー名",
    email: "メール",
    dob: "生年月日",
    password: "パスワード",
    confirmPassword: "パスワードの確認",
    department: "部門",
    selectDepartment: "部門を選択",
    location: "場所",
    useCurrentLocation: "現在の位置を使用",
    profilePicture: "プロフィール写真",
    cv: "履歴書",
    certificateFile: "証明書ファイル",
    certificateType: "証明書の種類",
    selectType: "種類を選択（任意）",
    experience: "経験",
    training: "トレーニング",
    achievement: "実績",
    certificateTitle: "証明書のタイトル",
    certificateDescription: "証明書の説明",
    certificateIssueDate: "証明書の発行日",
    register: "登録",
    alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    loginHere: "ここでログイン",
    language: "言語",
    errorPasswordsNotMatch: "パスワードが一致しません。",
    errorFailedLoadDepartments: "部門の読み込みに失敗しました。",
    errorCouldNotRetrieveAddress: "住所を取得できませんでした。",
    errorGeolocationNotSupported: "ジオロケーションがサポートされていません。",
    errorUnableRetrieveLocation: "位置情報を取得できません",
    successLocationRetrieved: "位置情報が正常に取得されました！",
    successLocationUpdated: "マップから位置が更新されました！",
    successRegistration: "登録が成功しました！リダイレクト中..."
  },
  ne: {
    title: "कर्मचारी दर्ता",
    firstName: "पहिलो नाम",
    middleName: "बीचको नाम",
    lastName: "थर",
    username: "प्रयोगकर्ता नाम",
    email: "इमेल",
    dob: "जन्म मिति",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड पुष्टि गर्नुहोस्",
    department: "विभाग",
    selectDepartment: "विभाग छान्नुहोस्",
    location: "स्थान",
    useCurrentLocation: "मेरो हालको स्थान प्रयोग गर्नुहोस्",
    profilePicture: "प्रोफाइल तस्वीर",
    cv: "सीभी",
    certificateFile: "प्रमाणपत्र फाइल",
    certificateType: "प्रमाणपत्र प्रकार",
    selectType: "प्रकार छान्नुहोस् (वैकल्पिक)",
    experience: "अनुभव",
    training: "प्रशिक्षण",
    achievement: "उपलब्धि",
    certificateTitle: "प्रमाणपत्र शीर्षक",
    certificateDescription: "प्रमाणपत्र विवरण",
    certificateIssueDate: "प्रमाणपत्र जारी मिति",
    register: "दर्ता गर्नुहोस्",
    alreadyHaveAccount: "पहिल्यै खाता छ?",
    loginHere: "यहाँ लगइन गर्नुहोस्",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्डहरू मेल खाँदैनन्।",
    errorFailedLoadDepartments: "विभागहरू लोड गर्न असफल भयो।",
    errorCouldNotRetrieveAddress: "ठेगाना प्राप्त गर्न सकिएन।",
    errorGeolocationNotSupported: "जियोलेकेसन समर्थित छैन।",
    errorUnableRetrieveLocation: "स्थान प्राप्त गर्न असमर्थ",
    successLocationRetrieved: "स्थान सफलतापूर्वक प्राप्त भयो!",
    successLocationUpdated: "नक्शाबाट स्थान अपडेट भयो!",
    successRegistration: "दर्ता सफल भयो! पुनर्निर्देशन गर्दै..."
  },
  hi: {
    title: "कर्मचारी पंजीकरण",
    firstName: "पहला नाम",
    middleName: "मध्य नाम",
    lastName: "उपनाम",
    username: "उपयोगकर्ता नाम",
    email: "ईमेल",
    dob: "जन्म तिथि",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    department: "विभाग",
    selectDepartment: "एक विभाग चुनें",
    location: "स्थान",
    useCurrentLocation: "मेरा वर्तमान स्थान उपयोग करें",
    profilePicture: "प्रोफाइल चित्र",
    cv: "सीवी",
    certificateFile: "प्रमाणपत्र फ़ाइल",
    certificateType: "प्रमाणपत्र प्रकार",
    selectType: "प्रकार चुनें (वैकल्पिक)",
    experience: "अनुभव",
    training: "प्रशिक्षण",
    achievement: "उपलब्धि",
    certificateTitle: "प्रमाणपत्र शीर्षक",
    certificateDescription: "प्रमाणपत्र विवरण",
    certificateIssueDate: "प्रमाणपत्र जारी तिथि",
    register: "पंजीकरण करें",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
    loginHere: "यहाँ लॉगिन करें",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्ड मेल नहीं खाते।",
    errorFailedLoadDepartments: "विभाग लोड करने में विफल।",
    errorCouldNotRetrieveAddress: "पता प्राप्त नहीं कर सका।",
    errorGeolocationNotSupported: "जियोलोकेशन समर्थित नहीं है।",
    errorUnableRetrieveLocation: "स्थान प्राप्त करने में असमर्थ",
    successLocationRetrieved: "स्थान सफलतापूर्वक प्राप्त हुआ!",
    successLocationUpdated: "मानचित्र से स्थान अपडेट हुआ!",
    successRegistration: "पंजीकरण सफल हुआ! पुनर्निर्देशन कर रहा है..."
  },
  my: { // Myanmar (Burmese)
    title: "ဝန်ထမ်းမှတ်ပုံတင်ခြင်း",
    firstName: "အမည်",
    middleName: "အလယ်အမည်",
    lastName: "မျိုးရိုးအမည်",
    username: "အသုံးပြုသူအမည်",
    email: "အီးမေးလ်",
    dob: "မွေးသက္ကရာဇ်",
    password: "စကားဝှက်",
    confirmPassword: "စကားဝှက်အတည်ပြုပါ",
    department: "ဌာန",
    selectDepartment: "ဌာနတစ်ခုရွေးပါ",
    location: "တည်နေရာ",
    useCurrentLocation: "ကျွန်ုပ်၏လက်ရှိတည်နေရာကိုသုံးပါ",
    profilePicture: "ပရိုဖိုင်ဓာတ်ပုံ",
    cv: "အလုပ်ရာဇဝင်",
    certificateFile: "လက်မှတ်ဖိုင်",
    certificateType: "လက်မှတ်အမျိုးအစား",
    selectType: "အမျိုးအစားရွေးပါ (ရွေးချယ်ခွင့်)",
    experience: "အတွေ့အကြုံ",
    training: "လေ့ကျင့်ရေး",
    achievement: "အောင်မြင်မှု",
    certificateTitle: "လက်မှတ်ခေါင်းစဉ်",
    certificateDescription: "လက်မှတ်ဖော်ပြချက်",
    certificateIssueDate: "လက်မှတ်ထုတ်ပေးသည့်ရက်စွဲ",
    register: "မှတ်ပုံတင်ပါ",
    alreadyHaveAccount: "အကောင့်ရှိပြီးသားလား?",
    loginHere: "ဒီမှာဝင်ရောက်ပါ",
    language: "ဘာသာစကား",
    errorPasswordsNotMatch: "စကားဝှက်များမကိုက်ညီပါ။",
    errorFailedLoadDepartments: "ဌာနများကိုဖွင့်ရန်မအောင်မြင်ပါ။",
    errorCouldNotRetrieveAddress: "လိပ်စာကိုမရယူနိုင်ပါ။",
    errorGeolocationNotSupported: "တည်နေရာရှာဖွေမှုကိုမထောက်ပံ့ပါ။",
    errorUnableRetrieveLocation: "တည်နေရာကိုမရယူနိုင်ပါ",
    successLocationRetrieved: "တည်နေရာကိုအောင်မြင်စွာရယူပြီးပါပြီ!",
    successLocationUpdated: "မြေပုံမှတည်နေရာကိုအဆင့်မြှင့်တင်ပြီးပါပြီ!",
    successRegistration: "မှတ်ပုံတင်ခြင်းအောင်မြင်ပါပြီ! ပြန်ညွှန်းနေပါပြီ..."
  },
  'pt-BR': { // Brazil (Portuguese)
    title: "Registro de Funcionário",
    firstName: "Primeiro Nome",
    middleName: "Nome do Meio",
    lastName: "Sobrenome",
    username: "Nome de Usuário",
    email: "E-mail",
    dob: "Data de Nascimento",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    department: "Departamento",
    selectDepartment: "Selecione um departamento",
    location: "Localização",
    useCurrentLocation: "Usar Minha Localização Atual",
    profilePicture: "Foto de Perfil",
    cv: "Currículo",
    certificateFile: "Arquivo de Certificado",
    certificateType: "Tipo de Certificado",
    selectType: "Selecionar Tipo (Opcional)",
    experience: "Experiência",
    training: "Treinamento",
    achievement: "Conquista",
    certificateTitle: "Título do Certificado",
    certificateDescription: "Descrição do Certificado",
    certificateIssueDate: "Data de Emissão do Certificado",
    register: "Registrar",
    alreadyHaveAccount: "Já possui uma conta?",
    loginHere: "Faça login aqui",
    language: "Idioma",
    errorPasswordsNotMatch: "As senhas não coincidem.",
    errorFailedLoadDepartments: "Falha ao carregar departamentos.",
    errorCouldNotRetrieveAddress: "Não foi possível recuperar o endereço.",
    errorGeolocationNotSupported: "Geolocalização não suportada.",
    errorUnableRetrieveLocation: "Não foi possível recuperar a localização",
    successLocationRetrieved: "Localização recuperada com sucesso!",
    successLocationUpdated: "Localização atualizada pelo mapa!",
    successRegistration: "Registro bem-sucedido! Redirecionando..."
  },
  tl: { // Philippines (Filipino/Tagalog)
    title: "Pagpaparehistro ng Staff",
    firstName: "Pangalan",
    middleName: "Gitnang Pangalan",
    lastName: "Apelyido",
    username: "Username",
    email: "Email",
    dob: "Petsa ng Kapanganakan",
    password: "Password",
    confirmPassword: "Kumpirmahin ang Password",
    department: "Kagawaran",
    selectDepartment: "Pumili ng kagawaran",
    location: "Lokasyon",
    useCurrentLocation: "Gamitin ang Aking Kasalukuyang Lokasyon",
    profilePicture: "Larawan ng Profile",
    cv: "CV",
    certificateFile: "File ng Sertipiko",
    certificateType: "Uri ng Sertipiko",
    selectType: "Pumili ng Uri (Opsyonal)",
    experience: "Karanasan",
    training: "Pagsasanay",
    achievement: "Tagumpay",
    certificateTitle: "Pamagat ng Sertipiko",
    certificateDescription: "Paglalarawan ng Sertipiko",
    certificateIssueDate: "Petsa ng Pag-isyu ng Sertipiko",
    register: "Magrehistro",
    alreadyHaveAccount: "May account na ba?",
    loginHere: "Mag-login dito",
    language: "Wika",
    errorPasswordsNotMatch: "Hindi tugma ang mga password.",
    errorFailedLoadDepartments: "Hindi na-load ang mga kagawaran.",
    errorCouldNotRetrieveAddress: "Hindi makuha ang address.",
    errorGeolocationNotSupported: "Hindi suportado ang geolocation.",
    errorUnableRetrieveLocation: "Hindi makuha ang lokasyon",
    successLocationRetrieved: "Matagumpay na nakuha ang lokasyon!",
    successLocationUpdated: "Na-update ang lokasyon mula sa mapa!",
    successRegistration: "Matagumpay ang pagpaparehistro! Ina-redirect..."
  },
  bn: { // Bangladesh (Bengali)
    title: "কর্মচারী নিবন্ধন",
    firstName: "প্রথম নাম",
    middleName: "মধ্য নাম",
    lastName: "পদবি",
    username: "ব্যবহারকারীর নাম",
    email: "ইমেইল",
    dob: "জন্ম তারিখ",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    department: "বিভাগ",
    selectDepartment: "একটি বিভাগ নির্বাচন করুন",
    location: "অবস্থান",
    useCurrentLocation: "আমার বর্তমান অবস্থান ব্যবহার করুন",
    profilePicture: "প্রোফাইল ছবি",
    cv: "সিভি",
    certificateFile: "সার্টিফিকেট ফাইল",
    certificateType: "সার্টিফিকেট প্রকার",
    selectType: "প্রকার নির্বাচন করুন (ঐচ্ছিক)",
    experience: "অভিজ্ঞতা",
    training: "প্রশিক্ষণ",
    achievement: "সাফল্য",
    certificateTitle: "সার্টিফিকেট শিরোনাম",
    certificateDescription: "সার্টিফিকেট বিবরণ",
    certificateIssueDate: "সার্টিফিকেট জারি তারিখ",
    register: "নিবন্ধন করুন",
    alreadyHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    loginHere: "এখানে লগইন করুন",
    language: "ভাষা",
    errorPasswordsNotMatch: "পাসওয়ার্ড মিলছে না।",
    errorFailedLoadDepartments: "বিভাগ লোড করতে ব্যর্থ।",
    errorCouldNotRetrieveAddress: "ঠিকানা পুনরুদ্ধার করা যায়নি।",
    errorGeolocationNotSupported: "জিওলোকেশন সমর্থিত নয়।",
    errorUnableRetrieveLocation: "অবস্থান পুনরুদ্ধার করতে অক্ষম",
    successLocationRetrieved: "অবস্থান সফলভাবে পুনরুদ্ধার করা হয়েছে!",
    successLocationUpdated: "মানচিত্র থেকে অবস্থান আপডেট করা হয়েছে!",
    successRegistration: "নিবন্ধন সফল! পুনর্নির্দেশ করা হচ্ছে..."
  },
  th: { // Thailand (Thai)
    title: "การลงทะเบียนพนักงาน",
    firstName: "ชื่อ",
    middleName: "ชื่อกลาง",
    lastName: "นามสกุล",
    username: "ชื่อผู้ใช้",
    email: "อีเมล",
    dob: "วันเกิด",
    password: "รหัสผ่าน",
    confirmPassword: "ยืนยันรหัสผ่าน",
    department: "แผนก",
    selectDepartment: "เลือกแผนก",
    location: "สถานที่",
    useCurrentLocation: "ใช้ตำแหน่งปัจจุบันของฉัน",
    profilePicture: "รูปโปรไฟล์",
    cv: "ประวัติย่อ",
    certificateFile: "ไฟล์ใบรับรอง",
    certificateType: "ประเภทใบรับรอง",
    selectType: "เลือกประเภท (ไม่บังคับ)",
    experience: "ประสบการณ์",
    training: "การฝึกอบรม",
    achievement: "ความสำเร็จ",
    certificateTitle: "ชื่อใบรับรอง",
    certificateDescription: "คำอธิบายใบรับรอง",
    certificateIssueDate: "วันที่ออกใบรับรอง",
    register: "ลงทะเบียน",
    alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
    loginHere: "เข้าสู่ระบบที่นี่",
    language: "ภาษา",
    errorPasswordsNotMatch: "รหัสผ่านไม่ตรงกัน",
    errorFailedLoadDepartments: "ไม่สามารถโหลดแผนกได้",
    errorCouldNotRetrieveAddress: "ไม่สามารถดึงที่อยู่ได้",
    errorGeolocationNotSupported: "ไม่รองรับการระบุตำแหน่ง",
    errorUnableRetrieveLocation: "ไม่สามารถดึงตำแหน่งได้",
    successLocationRetrieved: "ดึงตำแหน่งสำเร็จแล้ว!",
    successLocationUpdated: "อัปเดตตำแหน่งจากแผนที่แล้ว!",
    successRegistration: "การลงทะเบียนสำเร็จ! กำลังเปลี่ยนเส้นทาง..."
  },
  vi: { // Vietnam (Vietnamese)
    title: "Đăng ký Nhân viên",
    firstName: "Tên",
    middleName: "Tên đệm",
    lastName: "Họ",
    username: "Tên người dùng",
    email: "Email",
    dob: "Ngày sinh",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    department: "Phòng ban",
    selectDepartment: "Chọn một phòng ban",
    location: "Vị trí",
    useCurrentLocation: "Sử dụng vị trí hiện tại của tôi",
    profilePicture: "Ảnh hồ sơ",
    cv: "Sơ yếu lý lịch",
    certificateFile: "Tệp chứng chỉ",
    certificateType: "Loại chứng chỉ",
    selectType: "Chọn loại (Tùy chọn)",
    experience: "Kinh nghiệm",
    training: "Đào tạo",
    achievement: "Thành tựu",
    certificateTitle: "Tiêu đề chứng chỉ",
    certificateDescription: "Mô tả chứng chỉ",
    certificateIssueDate: "Ngày cấp chứng chỉ",
    register: "Đăng ký",
    alreadyHaveAccount: "Đã có tài khoản?",
    loginHere: "Đăng nhập tại đây",
    language: "Ngôn ngữ",
    errorPasswordsNotMatch: "Mật khẩu không khớp.",
    errorFailedLoadDepartments: "Không thể tải danh sách phòng ban.",
    errorCouldNotRetrieveAddress: "Không thể lấy địa chỉ.",
    errorGeolocationNotSupported: "Định vị địa lý không được hỗ trợ.",
    errorUnableRetrieveLocation: "Không thể lấy vị trí",
    successLocationRetrieved: "Lấy vị trí thành công!",
    successLocationUpdated: "Vị trí đã được cập nhật từ bản đồ!",
    successRegistration: "Đăng ký thành công! Đang chuyển hướng..."
  },
  'pt-PT': { // Portugal (Portuguese)
    title: "Registo de Funcionário",
    firstName: "Primeiro Nome",
    middleName: "Nome do Meio",
    lastName: "Apelido",
    username: "Nome de Utilizador",
    email: "E-mail",
    dob: "Data de Nascimento",
    password: "Palavra-passe",
    confirmPassword: "Confirmar Palavra-passe",
    department: "Departamento",
    selectDepartment: "Selecione um departamento",
    location: "Localização",
    useCurrentLocation: "Usar a Minha Localização Atual",
    profilePicture: "Foto de Perfil",
    cv: "Currículo",
    certificateFile: "Ficheiro de Certificado",
    certificateType: "Tipo de Certificado",
    selectType: "Selecionar Tipo (Opcional)",
    experience: "Experiência",
    training: "Formação",
    achievement: "Conquista",
    certificateTitle: "Título do Certificado",
    certificateDescription: "Descrição do Certificado",
    certificateIssueDate: "Data de Emissão do Certificado",
    register: "Registar",
    alreadyHaveAccount: "Já tem uma conta?",
    loginHere: "Faça login aqui",
    language: "Idioma",
    errorPasswordsNotMatch: "As palavras-passe não coincidem.",
    errorFailedLoadDepartments: "Falha ao carregar departamentos.",
    errorCouldNotRetrieveAddress: "Não foi possível recuperar o endereço.",
    errorGeolocationNotSupported: "Geolocalização não suportada.",
    errorUnableRetrieveLocation: "Não foi possível recuperar a localização",
    successLocationRetrieved: "Localização recuperada com sucesso!",
    successLocationUpdated: "Localização atualizada a partir do mapa!",
    successRegistration: "Registo bem-sucedido! A redirecionar..."
  }
};

// Language options with flags
const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'my', name: 'မြန်မာ (Myanmar)', flag: '🇲🇲' },
  { code: 'pt-BR', name: 'Português (Brazil)', flag: '🇧🇷' },
  { code: 'tl', name: 'Filipino (Philippines)', flag: '🇵🇭' },
  { code: 'bn', name: 'বাংলা (Bangladesh)', flag: '🇧🇩' },
  { code: 'th', name: 'ไทย (Thailand)', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt (Vietnam)', flag: '🇻🇳' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' }
];

function StaffRegistration({ setToken, setIsStaff }) {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    department: '',
    dob: '',
    location_lat: 51.505,
    location_lng: -0.09,
    location_address: '',
    profile_picture: null,
    cv: null,
    certificate_type: '',
    certificate_title: '',
    certificate_description: '',
    certificate_issue_date: '',
    certificate_file: null,
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const navigate = useNavigate();

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`);
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(t('errorFailedLoadDepartments'));
        toast.error(t('errorFailedLoadDepartments'), { autoClose: 3000 });
      } finally {
        setIsMapReady(true);
      }
    };
    fetchDepartments();
  }, [language]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location_lat: latitude,
            location_lng: longitude,
          }));
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            setFormData((prev) => ({
              ...prev,
              location_address: response.data.display_name,
            }));
            toast.success(t('successLocationRetrieved'), { autoClose: 2000 });
          } catch (err) {
            setError(t('errorCouldNotRetrieveAddress'));
            toast.error(t('errorCouldNotRetrieveAddress'), { autoClose: 3000 });
          }
        },
        (err) => {
          setError(`${t('errorUnableRetrieveLocation')}: ${err.message}`);
          toast.error(`${t('errorUnableRetrieveLocation')}: ${err.message}`, { autoClose: 3000 });
        }
      );
    } else {
      setError(t('errorGeolocationNotSupported'));
      toast.error(t('errorGeolocationNotSupported'), { autoClose: 3000 });
    }
  };

  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 13);
      }
    }, [lat, lng, map]);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          location_lat: e.latlng.lat,
          location_lng: e.latlng.lng,
        }));
        axios
          .get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then((response) => {
            setFormData((prev) => ({
              ...prev,
              location_address: response.data.display_name,
            }));
            toast.success(t('successLocationUpdated'), { autoClose: 2000 });
          })
          .catch((err) => {
            setError(t('errorCouldNotRetrieveAddress'));
            toast.error(t('errorCouldNotRetrieveAddress'), { autoClose: 3000 });
          });
      },
    });
    return formData.location_lat && formData.location_lng ? (
      <Marker position={[formData.location_lat, formData.location_lng]} />
    ) : null;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError(t('errorPasswordsNotMatch'));
      toast.error(t('errorPasswordsNotMatch'), { autoClose: 3000 });
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '' && key !== 'name') {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/staff/register/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { access, is_staff, department, staff_id, user_name } = response.data;
      setToken(access);
      setIsStaff(is_staff);
      localStorage.setItem('token', access);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('department', department);
      localStorage.setItem('staff_id', staff_id);
      localStorage.setItem('user_name', user_name);
      setSuccess(t('successRegistration'));
      toast.success(t('successRegistration'), { autoClose: 1500 });
      setTimeout(() => navigate('/staff-login'), 1500);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.email?.[0] || 
                       error.response?.data?.username?.[0] || 
                       'Registration failed.';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
      setSuccess('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col p-6">
      {/* Navbar for Language Selection */}
      <nav className="bg-gray-800 p-4 mb-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">{t('title')}</h1>
          <div className="flex space-x-4 items-center">
            <span className="text-white">{t('language')}:</span>
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleLanguageChange(option.code)}
                className={`text-white ${language === option.code ? 'font-bold' : ''} hover:underline flex items-center`}
              >
                <span className="mr-1">{option.flag}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-8 mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">{t('title')}</h2>
        <form onSubmit={handleRegistration} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1">{t('firstName')}</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="middle_name" className="block text-sm font-semibold text-gray-700 mb-1">{t('middleName')}</label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1">{t('lastName')}</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">{t('username')}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">{t('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1">{t('dob')}</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">{t('password')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1">{t('confirmPassword')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Department and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">{t('department')}</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              >
                <option value="">{t('selectDepartment')}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('location')}</label>
              <button
                type="button"
                onClick={handleLocationClick}
                className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {t('useCurrentLocation')}
              </button>
              <input
                type="text"
                id="location_address"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                readOnly
              />
            </div>
          </div>

          {/* Map */}
          {isMapReady && (
            <div className="w-full">
              <MapContainer
                center={[formData.location_lat, formData.location_lng]}
                zoom={13}
                style={{ height: '250px', width: '100%', borderRadius: '8px' }}
                className="shadow-md"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
                <RecenterMap lat={formData.location_lat} lng={formData.location_lng} />
              </MapContainer>
            </div>
          )}

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="profile_picture" className="block text-sm font-semibold text-gray-700 mb-1">{t('profilePicture')}</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                accept="image/*"
              />
            </div>
            <div>
              <label htmlFor="cv" className="block text-sm font-semibold text-gray-700 mb-1">{t('cv')}</label>
              <input
                type="file"
                id="cv"
                name="cv"
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                accept=".pdf,.doc,.docx"
              />
            </div>
            <div>
              <label htmlFor="certificate_file" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateFile')}</label>
              <input
                type="file"
                id="certificate_file"
                name="certificate_file"
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="certificate_type" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateType')}</label>
              <select
                id="certificate_type"
                name="certificate_type"
                value={formData.certificate_type}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                <option value="">{t('selectType')}</option>
                <option value="Experience">{t('experience')}</option>
                <option value="Training">{t('training')}</option>
                <option value="Achievement">{t('achievement')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="certificate_title" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateTitle')}</label>
              <input
                type="text"
                id="certificate_title"
                name="certificate_title"
                value={formData.certificate_title}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="certificate_description" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateDescription')}</label>
              <textarea
                id="certificate_description"
                name="certificate_description"
                value={formData.certificate_description}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="certificate_issue_date" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateIssueDate')}</label>
              <input
                type="date"
                id="certificate_issue_date"
                name="certificate_issue_date"
                value={formData.certificate_issue_date}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Messages and Submit */}
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          {success && <p className="text-green-500 text-center font-medium">{success}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            {t('register')}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {t('alreadyHaveAccount')}{' '}
          <a href="/staff-login" className="text-blue-600 hover:underline font-medium">{t('loginHere')}</a>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default StaffRegistration;