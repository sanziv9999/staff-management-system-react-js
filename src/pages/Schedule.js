import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Schedule Management",
    searchStaff: "Search Staff...",
    noStaffFound: "No staff found",
    location: "Location",
    addSchedule: "Add Schedule",
    updateSchedule: "Update Schedule",
    selectStaffError: "Please select a staff member",
    locationError: "Please provide a location",
    searchPlaceholder: "Search by staff name, date, shift, or location...",
    staff: "Staff",
    date: "Date",
    shift: "Shift",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete schedule for",
    thisStaff: "this staff",
    loginError: "Please log in to access this page.",
    fetchError: "Failed to fetch data. Please ensure the backend server is running or check your login credentials.",
    addError: "Failed to add schedule",
    updateError: "Failed to update schedule",
    deleteError: "Failed to delete schedule",
    na: "N/A",
    shifts: {
      Morning: "Morning",
      Afternoon: "Afternoon",
      Night: "Night"
    },
    language: "Language"
  },
  ja: {
    title: "スケジュール管理",
    searchStaff: "スタッフを検索...",
    noStaffFound: "スタッフが見つかりません",
    location: "場所",
    addSchedule: "スケジュールを追加",
    updateSchedule: "スケジュールを更新",
    selectStaffError: "スタッフを選択してください",
    locationError: "場所を入力してください",
    searchPlaceholder: "スタッフ名、日付、シフト、または場所で検索...",
    staff: "スタッフ",
    date: "日付",
    shift: "シフト",
    actions: "操作",
    edit: "編集",
    delete: "削除",
    confirmDelete: "このスケジュールを削除してもよろしいですか",
    thisStaff: "このスタッフ",
    loginError: "このページにアクセスするにはログインしてください。",
    fetchError: "データの取得に失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    addError: "スケジュールの追加に失敗しました",
    updateError: "スケジュールの更新に失敗しました",
    deleteError: "スケジュールの削除に失敗しました",
    na: "なし",
    shifts: {
      Morning: "朝",
      Afternoon: "昼",
      Night: "夜"
    },
    language: "言語"
  },
  ne: {
    title: "तालिका व्यवस्थापन",
    searchStaff: "कर्मचारी खोज्नुहोस्...",
    noStaffFound: "कुनै कर्मचारी फेला परेन",
    location: "स्थान",
    addSchedule: "तालिका थप्नुहोस्",
    updateSchedule: "तालिका अपडेट गर्नुहोस्",
    selectStaffError: "कृपया कर्मचारी चयन गर्नुहोस्",
    locationError: "कृपया स्थान प्रदान गर्नुहोस्",
    searchPlaceholder: "कर्मचारी नाम, मिति, पाली, वा स्थानले खोज्नुहोस्...",
    staff: "कर्मचारी",
    date: "मिति",
    shift: "पाली",
    actions: "कार्यहरू",
    edit: "सम्पादन गर्नुहोस्",
    delete: "मेटाउनुहोस्",
    confirmDelete: "तपाईं निश्चित हुनुहुन्छ कि यस कर्मचारीको तालिका मेटाउन चाहनुहुन्छ",
    thisStaff: "यो कर्मचारी",
    loginError: "यो पृष्ठ पहुँच गर्न कृपया लगइन गर्नुहोस्।",
    fetchError: "डाटा लोड गर्न असफल भयो। कृपया ब्याकेन्ड सर्भर चलिरहेको छ भनी निश्चित गर्नुहोस् वा तपाईंको लगइन प्रमाणिकरण जाँच गर्नुहोस्।",
    addError: "तालिका थप्न असफल भयो",
    updateError: "तालिका अपडेट गर्न असफल भयो",
    deleteError: "तालिका मेटाउन असफल भयो",
    na: "उपलब्ध छैन",
    shifts: {
      Morning: "बिहान",
      Afternoon: "दिउँसो",
      Night: "रात"
    },
    language: "भाषा"
  },
  hi: {
    title: "अनुसूची प्रबंधन",
    searchStaff: "स्टाफ खोजें...",
    noStaffFound: "कोई स्टाफ नहीं मिला",
    location: "स्थान",
    addSchedule: "अनुसूची जोड़ें",
    updateSchedule: "अनुसूची अपडेट करें",
    selectStaffError: "कृपया एक स्टाफ सदस्य चुनें",
    locationError: "कृपया स्थान प्रदान करें",
    searchPlaceholder: "स्टाफ नाम, तारीख, शिफ्ट या स्थान से खोजें...",
    staff: "स्टाफ",
    date: "तारीख",
    shift: "शिफ्ट",
    actions: "कार्रवाई",
    edit: "संपादन",
    delete: "हटाएं",
    confirmDelete: "क्या आप वाकई इस स्टाफ के लिए अनुसूची हटाना चाहते हैं",
    thisStaff: "इस स्टाफ",
    loginError: "इस पेज तक पहुंचने के लिए कृपया लॉगिन करें।",
    fetchError: "डेटा लोड करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है या अपने लॉगिन क्रेडेंशियल्स जांचें।",
    addError: "अनुसूची जोड़ने में विफल",
    updateError: "अनुसूची अपडेट करने में विफल",
    deleteError: "अनुसूची हटाने में विफल",
    na: "उपलब्ध नहीं",
    shifts: {
      Morning: "सुबह",
      Afternoon: "दोपहर",
      Night: "रात"
    },
    language: "भाषा"
  },
  my: { // Myanmar (Burmese)
    title: "အချိန်ဇယားစီမံခန့်ခွဲမှု",
    searchStaff: "ဝန်ထမ်းရှာဖွေပါ...",
    noStaffFound: "ဝန်ထမ်းမတွေ့ပါ",
    location: "တည်နေရာ",
    addSchedule: "အချိန်ဇယားထည့်ပါ",
    updateSchedule: "အချိန်ဇယားအဆင့်မြှင့်ပါ",
    selectStaffError: "ကျေးဇူးပြု၍ ဝန်ထမ်းတစ်ဦးကိုရွေးချယ်ပါ",
    locationError: "ကျေးဇူးပြု၍ တည်နေရာပေးပါ",
    searchPlaceholder: "ဝန်ထမ်းအမည်၊ ရက်စွဲ၊ အလုပ်ချိန်၊ သို့မဟုတ် တည်နေရာဖြင့် ရှာဖွေပါ...",
    staff: "ဝန်ထမ်း",
    date: "ရက်စွဲ",
    shift: "အလုပ်ချိန်",
    actions: "လုပ်ဆောင်ချက်များ",
    edit: "ပြင်ဆင်ပါ",
    delete: "ဖျက်ပါ",
    confirmDelete: "ဤဝန်ထမ်း၏အချိန်ဇယားကိုဖျက်ရန်သေချာပါသလား",
    thisStaff: "ဤဝန်ထမ်း",
    loginError: "ဤစာမျက်နှာသို့ဝင်ရောက်ရန် ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ။",
    fetchError: "ဒေတာရယူရန်မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ နောက်ကွယ်ဆာဗာလည်ပတ်နေသလား သို့မဟုတ် သင်၏လော့ဂ်အင်အထောက်အထားများကိုစစ်ဆေးပါ။",
    addError: "အချိန်ဇယားထည့်ရန်မအောင်မြင်ပါ",
    updateError: "အချိန်ဇယားအဆင့်မြှင့်ရန်မအောင်မြင်ပါ",
    deleteError: "အချိန်ဇယားဖျက်ရန်မအောင်မြင်ပါ",
    na: "မရှိ",
    shifts: {
      Morning: "မနက်",
      Afternoon: "နေ့လည်",
      Night: "ည"
    },
    language: "ဘာသာစကား"
  },
  'pt-BR': { // Brazil (Portuguese)
    title: "Gerenciamento de Horários",
    searchStaff: "Pesquisar Funcionário...",
    noStaffFound: "Nenhum funcionário encontrado",
    location: "Localização",
    addSchedule: "Adicionar Horário",
    updateSchedule: "Atualizar Horário",
    selectStaffError: "Por favor, selecione um funcionário",
    locationError: "Por favor, forneça uma localização",
    searchPlaceholder: "Pesquisar por nome do funcionário, data, turno ou localização...",
    staff: "Funcionário",
    date: "Data",
    shift: "Turno",
    actions: "Ações",
    edit: "Editar",
    delete: "Excluir",
    confirmDelete: "Tem certeza de que deseja excluir o horário de",
    thisStaff: "este funcionário",
    loginError: "Por favor, faça login para acessar esta página.",
    fetchError: "Falha ao buscar dados. Verifique se o servidor backend está em execução ou confira suas credenciais de login.",
    addError: "Falha ao adicionar horário",
    updateError: "Falha ao atualizar horário",
    deleteError: "Falha ao excluir horário",
    na: "N/D",
    shifts: {
      Morning: "Manhã",
      Afternoon: "Tarde",
      Night: "Noite"
    },
    language: "Idioma"
  },
  tl: { // Philippines (Filipino/Tagalog)
    title: "Pamamahala ng Iskedyul",
    searchStaff: "Maghanap ng Kawani...",
    noStaffFound: "Walang natagpuang kawani",
    location: "Lokasyon",
    addSchedule: "Magdagdag ng Iskedyul",
    updateSchedule: "I-update ang Iskedyul",
    selectStaffError: "Mangyaring pumili ng kawani",
    locationError: "Mangyaring magbigay ng lokasyon",
    searchPlaceholder: "Maghanap ayon sa pangalan ng kawani, petsa, shift, o lokasyon...",
    staff: "Kawani",
    date: "Petsa",
    shift: "Shift",
    actions: "Mga Aksyon",
    edit: "I-edit",
    delete: "Tanggalin",
    confirmDelete: "Sigurado ka bang gusto mong tanggalin ang iskedyul para sa",
    thisStaff: "itong kawani",
    loginError: "Mangyaring mag-login upang ma-access ang pahinang ito.",
    fetchError: "Nabigo sa pagkuha ng data. Siguraduhing tumatakbo ang backend server o suriin ang iyong mga kredensyal sa pag-login.",
    addError: "Nabigo sa pagdaragdag ng iskedyul",
    updateError: "Nabigo sa pag-update ng iskedyul",
    deleteError: "Nabigo sa pagtanggal ng iskedyul",
    na: "Wala",
    shifts: {
      Morning: "Umaga",
      Afternoon: "Hapon",
      Night: "Gabi"
    },
    language: "Wika"
  },
  bn: { // Bangladesh (Bengali)
    title: "সূচি ব্যবস্থাপনা",
    searchStaff: "কর্মী খুঁজুন...",
    noStaffFound: "কোনো কর্মী পাওয়া যায়নি",
    location: "অবস্থান",
    addSchedule: "সূচি যোগ করুন",
    updateSchedule: "সূচি আপডেট করুন",
    selectStaffError: "অনুগ্রহ করে একজন কর্মী নির্বাচন করুন",
    locationError: "অনুগ্রহ করে একটি অবস্থান প্রদান করুন",
    searchPlaceholder: "কর্মীর নাম, তারিখ, শিফট বা অবস্থান দ্বারা খুঁজুন...",
    staff: "কর্মী",
    date: "তারিখ",
    shift: "শিফট",
    actions: "ক্রিয়াকলাপ",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    confirmDelete: "আপনি কি নিশ্চিত যে এই কর্মীর জন্য সূচি মুছে ফেলতে চান",
    thisStaff: "এই কর্মী",
    loginError: "এই পৃষ্ঠায় প্রবেশ করতে অনুগ্রহ করে লগইন করুন।",
    fetchError: "ডেটা আনতে ব্যর্থ। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে বা আপনার লগইন শংসাপত্র পরীক্ষা করুন।",
    addError: "সূচি যোগ করতে ব্যর্থ",
    updateError: "সূচি আপডেট করতে ব্যর্থ",
    deleteError: "সূচি মুছে ফেলতে ব্যর্থ",
    na: "প্রযোজ্য নয়",
    shifts: {
      Morning: "সকাল",
      Afternoon: "দুপুর",
      Night: "রাত"
    },
    language: "ভাষা"
  },
  th: { // Thailand (Thai)
    title: "การจัดการตารางงาน",
    searchStaff: "ค้นหาพนักงาน...",
    noStaffFound: "ไม่พบพนักงาน",
    location: "สถานที่",
    addSchedule: "เพิ่มตารางงาน",
    updateSchedule: "อัปเดตตารางงาน",
    selectStaffError: "กรุณาเลือกพนักงาน",
    locationError: "กรุณาระบุสถานที่",
    searchPlaceholder: "ค้นหาด้วยชื่อพนักงาน วันที่ กะ หรือสถานที่...",
    staff: "พนักงาน",
    date: "วันที่",
    shift: "กะ",
    actions: "การดำเนินการ",
    edit: "แก้ไข",
    delete: "ลบ",
    confirmDelete: "คุณแน่ใจหรือไม่ว่าต้องการลบตารางงานของ",
    thisStaff: "พนักงานนี้",
    loginError: "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้",
    fetchError: "ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ backend ทำงานอยู่หรือตรวจสอบข้อมูลการเข้าสู่ระบบของคุณ",
    addError: "ไม่สามารถเพิ่มตารางงานได้",
    updateError: "ไม่สามารถอัปเดตตารางงานได้",
    deleteError: "ไม่สามารถลบตารางงานได้",
    na: "ไม่มี",
    shifts: {
      Morning: "เช้า",
      Afternoon: "บ่าย",
      Night: "กลางคืน"
    },
    language: "ภาษา"
  },
  vi: { // Vietnam (Vietnamese)
    title: "Quản lý Lịch trình",
    searchStaff: "Tìm kiếm Nhân viên...",
    noStaffFound: "Không tìm thấy nhân viên",
    location: "Địa điểm",
    addSchedule: "Thêm Lịch trình",
    updateSchedule: "Cập nhật Lịch trình",
    selectStaffError: "Vui lòng chọn một nhân viên",
    locationError: "Vui lòng cung cấp địa điểm",
    searchPlaceholder: "Tìm kiếm theo tên nhân viên, ngày, ca hoặc địa điểm...",
    staff: "Nhân viên",
    date: "Ngày",
    shift: "Ca",
    actions: "Hành động",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    confirmDelete: "Bạn có chắc chắn muốn xóa lịch trình của",
    thisStaff: "nhân viên này",
    loginError: "Vui lòng đăng nhập để truy cập trang này.",
    fetchError: "Không thể lấy dữ liệu. Vui lòng đảm bảo máy chủ backend đang chạy hoặc kiểm tra thông tin đăng nhập của bạn.",
    addError: "Không thể thêm lịch trình",
    updateError: "Không thể cập nhật lịch trình",
    deleteError: "Không thể xóa lịch trình",
    na: "Không có",
    shifts: {
      Morning: "Sáng",
      Afternoon: "Chiều",
      Night: "Tối"
    },
    language: "Ngôn ngữ"
  },
  'pt-PT': { // Portugal (Portuguese)
    title: "Gestão de Horários",
    searchStaff: "Pesquisar Funcionário...",
    noStaffFound: "Nenhum funcionário encontrado",
    location: "Localização",
    addSchedule: "Adicionar Horário",
    updateSchedule: "Atualizar Horário",
    selectStaffError: "Por favor, selecione um funcionário",
    locationError: "Por favor, forneça uma localização",
    searchPlaceholder: "Pesquisar por nome do funcionário, data, turno ou localização...",
    staff: "Funcionário",
    date: "Data",
    shift: "Turno",
    actions: "Ações",
    edit: "Editar",
    delete: "Eliminar",
    confirmDelete: "Tem a certeza de que deseja eliminar o horário de",
    thisStaff: "este funcionário",
    loginError: "Por favor, inicie sessão para aceder a esta página.",
    fetchError: "Falha ao obter dados. Certifique-se de que o servidor backend está em execução ou verifique as suas credenciais de login.",
    addError: "Falha ao adicionar horário",
    updateError: "Falha ao atualizar horário",
    deleteError: "Falha ao eliminar horário",
    na: "N/D",
    shifts: {
      Morning: "Manhã",
      Afternoon: "Tarde",
      Night: "Noite"
    },
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

function Schedule({ token }) {
  const [language, setLanguage] = useState('en');
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ staff: '', date: new Date(), shift: 'Morning', location: '' });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Fetch schedules and staff on component mount
  useEffect(() => {
    if (!token) {
      setError(t('loginError'));
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [scheduleResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/schedules/`),
          axios.get(`${API_BASE_URL}/staff/`)
        ]);
        setSchedules(scheduleResponse.data);
        setStaffList(staffResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.status, error.response?.data);
        setError(t('fetchError'));
      }
    };
    fetchData();
  }, [token, language]);

  // Helper function to get staff name from staff ID
  const getStaffName = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? (staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim()) : t('na');
  };

  // Handle adding a new schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.staff) {
      setError(t('selectStaffError'));
      return;
    }
    if (!newSchedule.location) {
      setError(t('locationError'));
      return;
    }
    setError('');
    const payload = {
      staff_id: parseInt(newSchedule.staff),
      date: newSchedule.date.toISOString().split('T')[0],
      shift: newSchedule.shift,
      location: newSchedule.location
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/schedules/`, payload);
      setSchedules([...schedules, response.data]);
      setNewSchedule({ staff: '', date: new Date(), shift: 'Morning', location: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error adding schedule:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  // Handle editing a schedule
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    const staffId = typeof schedule.staff === 'object' ? schedule.staff?.id : schedule.staff;
    setNewSchedule({
      staff: staffId?.toString() || '',
      date: new Date(schedule.date),
      shift: schedule.shift || 'Morning',
      location: schedule.location || ''
    });
    setStaffSearch(typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff) || '');
    setShowStaffDropdown(false);
  };

  // Handle updating a schedule
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!editingSchedule || !newSchedule.staff) {
      setError(t('selectStaffError'));
      return;
    }
    if (!newSchedule.location) {
      setError(t('locationError'));
      return;
    }
    setError('');
    const payload = {
      staff_id: parseInt(newSchedule.staff),
      date: newSchedule.date.toISOString().split('T')[0],
      shift: newSchedule.shift,
      location: newSchedule.location
    };
    try {
      const response = await axios.put(`${API_BASE_URL}/schedules/${editingSchedule.id}/`, payload);
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? response.data : s));
      setEditingSchedule(null);
      setNewSchedule({ staff: '', date: new Date(), shift: 'Morning', location: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error updating schedule:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  // Handle deleting a schedule
  const handleDeleteSchedule = async (id, staffName) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${staffName || t('thisStaff')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/schedules/${id}/`);
        setSchedules(schedules.filter(schedule => schedule.id !== id));
      } catch (error) {
        console.error('Error deleting schedule:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSchedule) {
      handleUpdateSchedule(e);
    } else {
      handleAddSchedule(e);
    }
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => {
    const staffName = typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff) || '';
    const date = schedule.date || '';
    const shift = schedule.shift || '';
    const location = schedule.location || '';
    const search = searchTerm.toLowerCase();

    return (
      staffName.toLowerCase().includes(search) ||
      date.includes(search) ||
      shift.toLowerCase().includes(search) ||
      location.toLowerCase().includes(search)
    );
  });

  // Filter staff based on search input
  const filteredStaff = staffList.filter(staff => {
    const name = staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim();
    return name.toLowerCase().includes(staffSearch.toLowerCase());
  });

  // Handle staff selection from dropdown
  const handleStaffSelect = (staff) => {
    setNewSchedule({ ...newSchedule, staff: staff.id.toString() });
    setStaffSearch(staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim());
    setShowStaffDropdown(false);
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (!token) {
    return <p className="text-red-600">{t('loginError')}</p>;
  }

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
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
            />
            {showStaffDropdown && (
              <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <li
                      key={staff.id}
                      onClick={() => handleStaffSelect(staff)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim()}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">{t('noStaffFound')}</li>
                )}
              </ul>
            )}
          </div>
          <DatePicker
            selected={newSchedule.date}
            onChange={(date) => setNewSchedule({ ...newSchedule, date })}
            className="p-2 border rounded"
            dateFormat="yyyy-MM-dd"
          />
          <select
            value={newSchedule.shift}
            onChange={(e) => setNewSchedule({ ...newSchedule, shift: e.target.value })}
            className="p-2 border rounded"
          >
            {Object.entries(t('shifts')).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t('location')}
            value={newSchedule.location}
            onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingSchedule ? t('updateSchedule') : t('addSchedule')}
        </button>
      </form>

      {/* Search Bar for Schedules */}
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />

      {/* Schedule Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('staff')}</th>
              <th className="p-2 text-left">{t('date')}</th>
              <th className="p-2 text-left">{t('shift')}</th>
              <th className="p-2 text-left">{t('location')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id} className="border-t">
                <td className="p-2">{typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff) || t('na')}</td>
                <td className="p-2">{schedule.date || t('na')}</td>
                <td className="p-2">{t('shifts')[schedule.shift] || schedule.shift || t('na')}</td>
                <td className="p-2">{schedule.location || t('na')}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditSchedule(schedule)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id, typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff))}
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

export default Schedule;