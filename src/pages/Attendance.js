import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Attendance Management",
    selectDate: "Select Date:",
    searchStaff: "Search Staff...",
    noStaffFound: "No staff found",
    status: "Status",
    present: "Present",
    absent: "Absent",
    leave: "Leave",
    timeIn: "Time In",
    timeOut: "Time Out",
    updateAttendance: "Update Attendance",
    recordAttendance: "Record Attendance",
    requiredFields: "Staff and status are required.",
    loading: "Loading attendance records...",
    noRecords: "No attendance records available for this date.",
    fetchError: "Failed to fetch data. Please ensure the backend server is running or check your login credentials.",
    addError: "Failed to add attendance",
    updateError: "Failed to update attendance",
    deleteError: "Failed to delete attendance",
    confirmDelete: "Are you sure you want to delete attendance for",
    unknown: "Unknown",
    staff: "Staff",
    date: "Date",
    actions: "Actions",
    na: "N/A",
    edit: "Edit",
    delete: "Delete",
    language: "Language"
  },
  ja: {
    title: "出勤管理",
    selectDate: "日付を選択:",
    searchStaff: "スタッフを検索...",
    noStaffFound: "スタッフが見つかりません",
    status: "状態",
    present: "出勤",
    absent: "欠勤",
    leave: "休暇",
    timeIn: "出勤時間",
    timeOut: "退勤時間",
    updateAttendance: "出勤記録を更新",
    recordAttendance: "出勤を記録",
    requiredFields: "スタッフと状態が必要です。",
    loading: "出勤記録を読み込み中...",
    noRecords: "この日付の出勤記録はありません。",
    fetchError: "データの取得に失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    addError: "出勤記録の追加に失敗しました",
    updateError: "出勤記録の更新に失敗しました",
    deleteError: "出勤記録の削除に失敗しました",
    confirmDelete: "この出勤記録を削除してもよろしいですか",
    unknown: "不明",
    staff: "スタッフ",
    date: "日付",
    actions: "操作",
    na: "なし",
    edit: "編集",
    delete: "削除",
    language: "言語"
  },
  ne: {
    title: "उपस्थिति व्यवस्थापन",
    selectDate: "मिति छान्नुहोस्:",
    searchStaff: "कर्मचारी खोज्नुहोस्...",
    noStaffFound: "कुनै कर्मचारी भेटिएन",
    status: "स्थिति",
    present: "उपस्थित",
    absent: "अनुपस्थित",
    leave: "बिदा",
    timeIn: "प्रवेश समय",
    timeOut: "निकास समय",
    updateAttendance: "उपस्थिति अपडेट गर्नुहोस्",
    recordAttendance: "उपस्थिति रेकर्ड गर्नुहोस्",
    requiredFields: "कर्मचारी र स्थिति आवश्यक छ।",
    loading: "उपस्थिति रेकर्डहरू लोड हुँदै...",
    noRecords: "यो मितिको लागि कुनै उपस्थिति रेकर्ड उपलब्ध छैन।",
    fetchError: "डाटा प्राप्त गर्न असफल भयो। कृपया ब्याकएन्ड सर्भर चलिरहेको छ कि छैन वा आफ्नो लगइन प्रमाणहरू जाँच गर्नुहोस्।",
    addError: "उपस्थिति थप्न असफल भयो",
    updateError: "उपस्थिति अपडेट गर्न असफल भयो",
    deleteError: "उपस्थिति हटाउन असफल भयो",
    confirmDelete: "के तपाईं यो कर्मचारीको उपस्थिति हटाउन निश्चित हुनुहुन्छ",
    unknown: "अज्ञात",
    staff: "कर्मचारी",
    date: "मिति",
    actions: "कार्यहरू",
    na: "उपलब्ध छैन",
    edit: "सम्पादन गर्नुहोस्",
    delete: "हटाउनुहोस्",
    language: "भाषा"
  },
  hi: {
    title: "उपस्थिति प्रबंधन",
    selectDate: "तारीख चुनें:",
    searchStaff: "कर्मचारी खोजें...",
    noStaffFound: "कोई कर्मचारी नहीं मिला",
    status: "स्थिति",
    present: "उपस्थित",
    absent: "अनुपस्थित",
    leave: "अवकाश",
    timeIn: "प्रवेश समय",
    timeOut: "निकास समय",
    updateAttendance: "उपस्थिति अपडेट करें",
    recordAttendance: "उपस्थिति रिकॉर्ड करें",
    requiredFields: "कर्मचारी और स्थिति आवश्यक हैं।",
    loading: "उपस्थिति रिकॉर्ड लोड हो रहे हैं...",
    noRecords: "इस तारीख के लिए कोई उपस्थिति रिकॉर्ड उपलब्ध नहीं है।",
    fetchError: "डेटा प्राप्त करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है या अपने लॉगिन क्रेडेंशियल्स की जाँच करें।",
    addError: "उपस्थिति जोड़ने में विफल",
    updateError: "उपस्थिति अपडेट करने में विफल",
    deleteError: "उपस्थिति हटाने में विफल",
    confirmDelete: "क्या आप इस कर्मचारी की उपस्थिति हटाने के लिए निश्चित हैं",
    unknown: "अज्ञात",
    staff: "कर्मचारी",
    date: "तारीख",
    actions: "कार्रवाइयाँ",
    na: "उपलब्ध नहीं",
    edit: "संपादन करें",
    delete: "हटाएं",
    language: "भाषा"
  },
  my: { // Myanmar (Burmese)
    title: "တက်ရောက်မှုစီမံခန့်ခွဲမှု",
    selectDate: "ရက်စွဲရွေးပါ:",
    searchStaff: "ဝန်ထမ်းရှာဖွေပါ...",
    noStaffFound: "ဝန်ထမ်းမတွေ့ပါ",
    status: "အခြေအနေ",
    present: "တက်ရောက်",
    absent: "မတက်ရောက်",
    leave: "ခွင့်ယူ",
    timeIn: "ဝင်ချိန်",
    timeOut: "ထွက်ချိန်",
    updateAttendance: "တက်ရောက်မှုကိုအဆင့်မြှင့်ပါ",
    recordAttendance: "တက်ရောက်မှုမှတ်တမ်းတင်ပါ",
    requiredFields: "ဝန်ထမ်းနှင့်အခြေအနေလိုအပ်ပါသည်။",
    loading: "တက်ရောက်မှုမှတ်တမ်းများကိုဖွင့်နေသည်...",
    noRecords: "ဤရက်စွဲအတွက်တက်ရောက်မှုမှတ်တမ်းမရှိပါ။",
    fetchError: "ဒေတာရယူရန်မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ နောက်ကွယ်ဆာဗာလည်ပတ်နေသလား သို့မဟုတ် သင်၏လော့ဂ်အင်အထောက်အထားများကိုစစ်ဆေးပါ။",
    addError: "တက်ရောက်မှုထည့်ရန်မအောင်မြင်ပါ",
    updateError: "တက်ရောက်မှုအဆင့်မြှင့်ရန်မအောင်မြင်ပါ",
    deleteError: "တက်ရောက်မှုဖျက်ရန်မအောင်မြင်ပါ",
    confirmDelete: "ဤဝန်ထမ်း၏တက်ရောက်မှုကိုဖျက်ရန်သေချာပါသလား",
    unknown: "မသိ",
    staff: "ဝန်ထမ်း",
    date: "ရက်စွဲ",
    actions: "လုပ်ဆောင်ချက်များ",
    na: "မရှိ",
    edit: "ပြင်ဆင်ပါ",
    delete: "ဖျက်ပါ",
    language: "ဘာသာစကား"
  },
  'pt-BR': { // Brazil (Portuguese)
    title: "Gerenciamento de Presença",
    selectDate: "Selecionar Data:",
    searchStaff: "Pesquisar Funcionário...",
    noStaffFound: "Nenhum funcionário encontrado",
    status: "Status",
    present: "Presente",
    absent: "Ausente",
    leave: "Licença",
    timeIn: "Hora de Entrada",
    timeOut: "Hora de Saída",
    updateAttendance: "Atualizar Presença",
    recordAttendance: "Registrar Presença",
    requiredFields: "Funcionário e status são obrigatórios.",
    loading: "Carregando registros de presença...",
    noRecords: "Nenhum registro de presença disponível para esta data.",
    fetchError: "Falha ao buscar dados. Verifique se o servidor backend está em execução ou confira suas credenciais de login.",
    addError: "Falha ao adicionar presença",
    updateError: "Falha ao atualizar presença",
    deleteError: "Falha ao excluir presença",
    confirmDelete: "Tem certeza de que deseja excluir a presença de",
    unknown: "Desconhecido",
    staff: "Funcionário",
    date: "Data",
    actions: "Ações",
    na: "N/D",
    edit: "Editar",
    delete: "Excluir",
    language: "Idioma"
  },
  tl: { // Philippines (Filipino/Tagalog)
    title: "Pamamahala ng Pagdalo",
    selectDate: "Pumili ng Petsa:",
    searchStaff: "Maghanap ng Kawani...",
    noStaffFound: "Walang natagpuang kawani",
    status: "Katayuan",
    present: "Dumalo",
    absent: "Wala",
    leave: "Bakasyon",
    timeIn: "Oras ng Pagpasok",
    timeOut: "Oras ng Pag-alis",
    updateAttendance: "I-update ang Pagdalo",
    recordAttendance: "Magrehistro ng Pagdalo",
    requiredFields: "Kailangan ang kawani at katayuan.",
    loading: "Nilo-load ang mga tala ng pagdalo...",
    noRecords: "Walang magagamit na tala ng pagdalo para sa petsang ito.",
    fetchError: "Nabigo sa pagkuha ng data. Siguraduhing tumatakbo ang backend server o suriin ang iyong mga kredensyal sa pag-login.",
    addError: "Nabigo sa pagdaragdag ng pagdalo",
    updateError: "Nabigo sa pag-update ng pagdalo",
    deleteError: "Nabigo sa pagtanggal ng pagdalo",
    confirmDelete: "Sigurado ka bang gusto mong tanggalin ang pagdalo para kay",
    unknown: "Hindi Kilala",
    staff: "Kawani",
    date: "Petsa",
    actions: "Mga Aksyon",
    na: "Wala",
    edit: "I-edit",
    delete: "Tanggalin",
    language: "Wika"
  },
  bn: { // Bangladesh (Bengali)
    title: "উপস্থিতি ব্যবস্থাপনা",
    selectDate: "তারিখ নির্বাচন করুন:",
    searchStaff: "কর্মী অনুসন্ধান করুন...",
    noStaffFound: "কোনো কর্মী পাওয়া যায়নি",
    status: "অবস্থা",
    present: "উপস্থিত",
    absent: "অনুপস্থিত",
    leave: "ছুটি",
    timeIn: "প্রবেশের সময়",
    timeOut: "বের হওয়ার সময়",
    updateAttendance: "উপস্থিতি আপডেট করুন",
    recordAttendance: "উপস্থিতি রেকর্ড করুন",
    requiredFields: "কর্মী এবং অবস্থা প্রয়োজন।",
    loading: "উপস্থিতি রেকর্ড লোড হচ্ছে...",
    noRecords: "এই তারিখের জন্য কোনো উপস্থিতি রেকর্ড উপলব্ধ নেই।",
    fetchError: "ডেটা আনতে ব্যর্থ। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে বা আপনার লগইন শংসাপত্র পরীক্ষা করুন।",
    addError: "উপস্থিতি যোগ করতে ব্যর্থ",
    updateError: "উপস্থিতি আপডেট করতে ব্যর্থ",
    deleteError: "উপস্থিতি মুছে ফেলতে ব্যর্থ",
    confirmDelete: "আপনি কি নিশ্চিত যে এই কর্মীর উপস্থিতি মুছে ফেলতে চান",
    unknown: "অজানা",
    staff: "কর্মী",
    date: "তারিখ",
    actions: "ক্রিয়াকলাপ",
    na: "প্রযোজ্য নয়",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    language: "ভাষা"
  },
  th: { // Thailand (Thai)
    title: "การจัดการการเข้างาน",
    selectDate: "เลือกวันที่:",
    searchStaff: "ค้นหาพนักงาน...",
    noStaffFound: "ไม่พบพนักงาน",
    status: "สถานะ",
    present: "มาทำงาน",
    absent: "ขาดงาน",
    leave: "ลางาน",
    timeIn: "เวลามาทำงาน",
    timeOut: "เวลาออกงาน",
    updateAttendance: "อัปเดตการเข้างาน",
    recordAttendance: "บันทึกการเข้างาน",
    requiredFields: "ต้องระบุพนักงานและสถานะ",
    loading: "กำลังโหลดบันทึกการเข้างาน...",
    noRecords: "ไม่มีบันทึกการเข้างานสำหรับวันที่นี้",
    fetchError: "ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ backend ทำงานอยู่หรือตรวจสอบข้อมูลการเข้าสู่ระบบของคุณ",
    addError: "ไม่สามารถเพิ่มการเข้างานได้",
    updateError: "ไม่สามารถอัปเดตการเข้างานได้",
    deleteError: "ไม่สามารถลบการเข้างานได้",
    confirmDelete: "คุณแน่ใจหรือไม่ว่าต้องการลบการเข้างานของ",
    unknown: "ไม่ทราบ",
    staff: "พนักงาน",
    date: "วันที่",
    actions: "การดำเนินการ",
    na: "ไม่มี",
    edit: "แก้ไข",
    delete: "ลบ",
    language: "ภาษา"
  },
  vi: { // Vietnam (Vietnamese)
    title: "Quản lý Điểm danh",
    selectDate: "Chọn Ngày:",
    searchStaff: "Tìm kiếm Nhân viên...",
    noStaffFound: "Không tìm thấy nhân viên",
    status: "Trạng thái",
    present: "Có mặt",
    absent: "Vắng mặt",
    leave: "Nghỉ phép",
    timeIn: "Giờ vào",
    timeOut: "Giờ ra",
    updateAttendance: "Cập nhật Điểm danh",
    recordAttendance: "Ghi lại Điểm danh",
    requiredFields: "Nhân viên và trạng thái là bắt buộc.",
    loading: "Đang tải bản ghi điểm danh...",
    noRecords: "Không có bản ghi điểm danh nào cho ngày này.",
    fetchError: "Không thể lấy dữ liệu. Vui lòng đảm bảo máy chủ backend đang chạy hoặc kiểm tra thông tin đăng nhập của bạn.",
    addError: "Không thể thêm điểm danh",
    updateError: "Không thể cập nhật điểm danh",
    deleteError: "Không thể xóa điểm danh",
    confirmDelete: "Bạn có chắc chắn muốn xóa điểm danh của",
    unknown: "Không rõ",
    staff: "Nhân viên",
    date: "Ngày",
    actions: "Hành động",
    na: "Không có",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    language: "Ngôn ngữ"
  },
  'pt-PT': { // Portugal (Portuguese)
    title: "Gestão de Presenças",
    selectDate: "Selecionar Data:",
    searchStaff: "Pesquisar Funcionário...",
    noStaffFound: "Nenhum funcionário encontrado",
    status: "Estado",
    present: "Presente",
    absent: "Ausente",
    leave: "Licença",
    timeIn: "Hora de Entrada",
    timeOut: "Hora de Saída",
    updateAttendance: "Atualizar Presença",
    recordAttendance: "Registar Presença",
    requiredFields: "Funcionário e estado são obrigatórios.",
    loading: "A carregar registos de presença...",
    noRecords: "Nenhum registo de presença disponível para esta data.",
    fetchError: "Falha ao obter dados. Certifique-se de que o servidor backend está em execução ou verifique as suas credenciais de login.",
    addError: "Falha ao adicionar presença",
    updateError: "Falha ao atualizar presença",
    deleteError: "Falha ao eliminar presença",
    confirmDelete: "Tem a certeza de que deseja eliminar a presença de",
    unknown: "Desconhecido",
    staff: "Funcionário",
    date: "Data",
    actions: "Ações",
    na: "N/D",
    edit: "Editar",
    delete: "Eliminar",
    language: "Idioma"
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

function Attendance({ token }) {
  const [language, setLanguage] = useState('en');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newAttendance, setNewAttendance] = useState({
    staff: '',
    status: 'Present',
    time_in: '',
    time_out: '',
  });
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load language preference
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
    if (!token) {
      navigate('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [attendanceResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/attendance/`, {
            params: { date: selectedDate.toISOString().split('T')[0] },
          }),
          axios.get(`${API_BASE_URL}/staff/`),
        ]);
        setAttendanceRecords(attendanceResponse.data || []);
        setStaffList(staffResponse.data || []);
        if (!attendanceResponse.data || attendanceResponse.data.length === 0) {
          setFetchError(t('noRecords'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, selectedDate, navigate, language]);

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.staff || !newAttendance.status) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    const payload = {
      ...newAttendance,
      staff_id: parseInt(newAttendance.staff),
      date: selectedDate.toISOString().split('T')[0],
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };
    delete payload.staff;
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ staff: '', status: 'Present', time_in: '', time_out: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
      setFetchError('');
    } catch (error) {
      console.error('Error adding attendance:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
    setNewAttendance({
      staff: attendance.staff.id.toString(),
      status: attendance.status,
      time_in: attendance.time_in ? attendance.time_in.slice(0, 5) : '',
      time_out: attendance.time_out ? attendance.time_out.slice(0, 5) : '',
    });
    const staff = staffList.find(s => s.id === attendance.staff.id);
    setStaffSearch(staff ? staff.name : '');
    setShowStaffDropdown(false);
  };

  const handleUpdateAttendance = async (e) => {
    e.preventDefault();
    if (!editingAttendance) return;
    if (!newAttendance.staff || !newAttendance.status) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    const payload = {
      ...newAttendance,
      staff_id: parseInt(newAttendance.staff),
      date: selectedDate.toISOString().split('T')[0],
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };
    delete payload.staff;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/attendance/${editingAttendance.id}/`,
        payload
      );
      setAttendanceRecords(attendanceRecords.map(a => a.id === editingAttendance.id ? response.data : a));
      setEditingAttendance(null);
      setNewAttendance({ staff: '', status: 'Present', time_in: '', time_out: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error updating attendance:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteAttendance = async (id, staffName) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${staffName || t('unknown')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/attendance/${id}/`);
        setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
      } catch (error) {
        console.error('Error deleting attendance:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAttendance) {
      handleUpdateAttendance(e);
    } else {
      handleAddAttendance(e);
    }
  };

  const handleStaffSelect = (staff) => {
    setNewAttendance({ ...newAttendance, staff: staff.id.toString() });
    setStaffSearch(staff.name);
    setShowStaffDropdown(false);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setNewAttendance({
      ...newAttendance,
      status,
      time_in: status === 'Present' ? newAttendance.time_in : '',
      time_out: status === 'Present' ? newAttendance.time_out : '',
    });
  };

  const isTimeInputVisible = newAttendance.status === 'Present';

  return (
    <div className="container mx-auto p-4">
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

      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <label className="block mb-2 font-semibold">{t('selectDate')}</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="p-2 border rounded w-full"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchStaff')}
                value={staffSearch}
                onChange={(e) => {
                  setStaffSearch(e.target.value);
                  setShowStaffDropdown(true);
                }}
                onFocus={() => setShowStaffDropdown(true)}
                onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                className="p-2 border rounded w-full"
                required
              />
              {showStaffDropdown && (
                <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
                  {staffList
                    .filter(staff => staff.name.toLowerCase().includes(staffSearch.toLowerCase()))
                    .map((staff) => (
                      <li
                        key={staff.id}
                        onClick={() => handleStaffSelect(staff)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {staff.name} (ID: {staff.id})
                      </li>
                    ))}
                  {staffList.filter(staff => staff.name.toLowerCase().includes(staffSearch.toLowerCase())).length === 0 && (
                    <li className="p-2 text-gray-500">{t('noStaffFound')}</li>
                  )}
                </ul>
              )}
            </div>
            <select
              value={newAttendance.status}
              onChange={handleStatusChange}
              className="p-2 border rounded"
            >
              <option value="Present">{t('present')}</option>
              <option value="Absent">{t('absent')}</option>
              <option value="Leave">{t('leave')}</option>
            </select>
            {isTimeInputVisible && (
              <>
                <input
                  type="time"
                  value={newAttendance.time_in}
                  onChange={(e) => setNewAttendance({ ...newAttendance, time_in: e.target.value })}
                  className="p-2 border rounded"
                  placeholder={t('timeIn')}
                />
                <input
                  type="time"
                  value={newAttendance.time_out}
                  onChange={(e) => setNewAttendance({ ...newAttendance, time_out: e.target.value })}
                  className="p-2 border rounded"
                  placeholder={t('timeOut')}
                />
              </>
            )}
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingAttendance ? t('updateAttendance') : t('recordAttendance')}
          </button>
        </form>
      </div>
      {loading && <p className="text-gray-600 mb-4">{t('loading')}</p>}
      {fetchError && !loading && <p className="text-red-600 mb-4">{fetchError}</p>}
      {!loading && !fetchError && attendanceRecords.length === 0 && (
        <p className="text-gray-600 mb-4">{t('noRecords')}</p>
      )}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('staff')}</th>
              <th className="p-2 text-left">{t('status')}</th>
              <th className="p-2 text-left">{t('timeIn')}</th>
              <th className="p-2 text-left">{t('timeOut')}</th>
              <th className="p-2 text-left">{t('date')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="p-2">{record.staff?.name || t('unknown')}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      record.status === 'Present'
                        ? 'bg-green-200'
                        : record.status === 'Absent'
                        ? 'bg-red-200'
                        : 'bg-yellow-200'
                    }`}
                  >
                    {t(record.status.toLowerCase())}
                  </span>
                </td>
                <td className="p-2">{record.time_in || t('na')}</td>
                <td className="p-2">{record.time_out || t('na')}</td>
                <td className="p-2">{record.date}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditAttendance(record)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteAttendance(record.id, record.staff?.name || t('unknown'))}
                    className="text-red-600 hover:underline"
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;