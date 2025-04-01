import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Salary Details",
    searchStaff: "Search Staff...",
    noStaffFound: "No staff found",
    baseSalary: "Base Salary",
    bonus: "Bonus",
    deductions: "Deductions",
    paymentDate: "Payment Date",
    status: "Status",
    pending: "Pending",
    paid: "Paid",
    netSalary: "Net Salary",
    addSalary: "Add Salary",
    updateSalary: "Update Salary",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete salary for",
    unknown: "Unknown",
    loginError: "Please log in to access this page.",
    fetchError: "Failed to fetch salaries. Please ensure the backend server is running.",
    addError: "Failed to add salary",
    updateError: "Failed to update salary",
    deleteError: "Failed to delete salary",
    loading: "Loading salaries...",
    noSalaries: "No salaries available. Add a new salary to get started.",
    searchPlaceholder: "Search by name or ID...",
    requiredFields: "All fields are required, and salary values must be valid numbers",
    staff: "Staff",
    date: "Date",
    actions: "Actions",
    language: "Language"
  },
  ja: {
    title: "給与明細",
    searchStaff: "スタッフを検索...",
    noStaffFound: "スタッフが見つかりません",
    baseSalary: "基本給",
    bonus: "ボーナス",
    deductions: "控除額",
    paymentDate: "支払日",
    status: "状態",
    pending: "保留中",
    paid: "支払済み",
    netSalary: "手取り額",
    addSalary: "給与を追加",
    updateSalary: "給与を更新",
    edit: "編集",
    delete: "削除",
    confirmDelete: "この給与を削除してもよろしいですか",
    unknown: "不明",
    loginError: "このページにアクセスするにはログインしてください。",
    fetchError: "給与データの取得に失敗しました。バックエンドサーバーが実行されていることを確認してください。",
    addError: "給与の追加に失敗しました",
    updateError: "給与の更新に失敗しました",
    deleteError: "給与の削除に失敗しました",
    loading: "給与データを読み込み中...",
    noSalaries: "給与データがありません。新しい給与を追加してください。",
    searchPlaceholder: "名前またはIDで検索...",
    requiredFields: "すべてのフィールドが必要であり、給与の値は有効な数字でなければなりません",
    staff: "スタッフ",
    date: "日付",
    actions: "操作",
    language: "言語"
  },
  ne: {
    title: "तलब विवरण",
    searchStaff: "कर्मचारी खोज्नुहोस्...",
    noStaffFound: "कुनै कर्मचारी फेला परेन",
    baseSalary: "आधार तलब",
    bonus: "बोनस",
    deductions: "कटौती",
    paymentDate: "भुक्तानी मिति",
    status: "स्थिति",
    pending: "प्रतिक्षामा",
    paid: "भुक्तान भयो",
    netSalary: "नयाँ तलब",
    addSalary: "तलब थप्नुहोस्",
    updateSalary: "तलब अपडेट गर्नुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    delete: "मेटाउनुहोस्",
    confirmDelete: "तपाईं निश्चित हुनुहुन्छ कि यस कर्मचारीको तलब मेटाउन चाहनुहुन्छ",
    unknown: "अज्ञात",
    loginError: "यो पृष्ठ पहुँच गर्न कृपया लगइन गर्नुहोस्।",
    fetchError: "तलब डाटा लोड गर्न असफल भयो। कृपया ब्याकेन्ड सर्भर चलिरहेको छ भनी निश्चित गर्नुहोस्।",
    addError: "तलब थप्न असफल भयो",
    updateError: "तलब अपडेट गर्न असफल भयो",
    deleteError: "तलब मेटाउन असफल भयो",
    loading: "तलब डाटा लोड गर्दै...",
    noSalaries: "कुनै तलब उपलब्ध छैन। नयाँ तलब थप्नुहोस्।",
    searchPlaceholder: "नाम वा आईडीले खोज्नुहोस्...",
    requiredFields: "सबै फिल्डहरू आवश्यक छन्, र तलब मानहरू वैध संख्या हुनुपर्छ",
    staff: "कर्मचारी",
    date: "मिति",
    actions: "कार्यहरू",
    language: "भाषा"
  },
  hi: {
    title: "वेतन विवरण",
    searchStaff: "स्टाफ खोजें...",
    noStaffFound: "कोई स्टाफ नहीं मिला",
    baseSalary: "मूल वेतन",
    bonus: "बोनस",
    deductions: "कटौती",
    paymentDate: "भुगतान तिथि",
    status: "स्थिति",
    pending: "लंबित",
    paid: "भुगतान किया गया",
    netSalary: "शुद्ध वेतन",
    addSalary: "वेतन जोड़ें",
    updateSalary: "वेतन अपडेट करें",
    edit: "संपादन",
    delete: "हटाएं",
    confirmDelete: "क्या आप वाकई इस स्टाफ के लिए वेतन हटाना चाहते हैं",
    unknown: "अज्ञात",
    loginError: "इस पेज तक पहुंचने के लिए कृपया लॉगिन करें।",
    fetchError: "वेतन डेटा लोड करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है।",
    addError: "वेतन जोड़ने में विफल",
    updateError: "वेतन अपडेट करने में विफल",
    deleteError: "वेतन हटाने में विफल",
    loading: "वेतन डेटा लोड हो रहा है...",
    noSalaries: "कोई वेतन उपलब्ध नहीं है। शुरू करने के लिए नया वेतन जोड़ें।",
    searchPlaceholder: "नाम या आईडी से खोजें...",
    requiredFields: "सभी फ़ील्ड आवश्यक हैं, और वेतन मान वैध संख्याएँ होनी चाहिए",
    staff: "स्टाफ",
    date: "तारीख",
    actions: "कार्रवाई",
    language: "भाषा"
  },
  my: {
    title: "လစား အေသးစိတ်",
    searchStaff: "ဝန်ထမ်းရှာဖွေပါ...",
    noStaffFound: "ဝန်ထမ်းမတွေ့ပါ",
    baseSalary: "အခြေခံလစာ",
    bonus: "အပိုဆု",
    deductions: "နှုတ်ငွေ",
    paymentDate: "ငွေပေးချေသည့်နေ့",
    status: "အခြေအနေ",
    pending: "ဆိုင်းငံ့ထား",
    paid: "ပေးချေပြီး",
    netSalary: "အသားတင်လစာ",
    addSalary: "လစာထည့်ပါ",
    updateSalary: "လစာပြင်ပါ",
    edit: "ပြင်ဆင်ရန်",
    delete: "ဖျက်ရန်",
    confirmDelete: "ဤဝန်ထမ်း၏လစာကိုဖျက်ရန်သေချာပါသလား",
    unknown: "မသိ",
    loginError: "ဤစာမျက်နှာကိုဝင်ရောက်ရန်ကျေးဇူးပြု၍လော့ဂ်အင်ဝင်ပါ။",
    fetchError: "လစာဒေတာများကိုရယူရန်မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ backend server လည်ပတ်နေကြောင်းသေချာပါစေ။",
    addError: "လစာထည့်ရန်မအောင်မြင်ပါ",
    updateError: "လစာပြင်ရန်မအောင်မြင်ပါ",
    deleteError: "လစာဖျက်ရန်မအောင်မြင်ပါ",
    loading: "လစာဒေတာများကိုရယူနေသည်...",
    noSalaries: "လစာမရှိပါ။ စတင်ရန်လစာအသစ်ထည့်ပါ။",
    searchPlaceholder: "အမည် သို့မဟုတ် ID ဖြင့်ရှာဖွေပါ...",
    requiredFields: "အားလုံးသောအကွက်များလိုအပ်ပြီး၊ လစာတန်ဖိုးများသည်မှန်ကန်သောနံပါတ်များဖြစ်ရမည်",
    staff: "ဝန်ထမ်း",
    date: "ရက်စွဲ",
    actions: "လုပ်ဆောင်ချက်များ",
    language: "ဘာသာစကား"
  },
  pt: {
    title: "Detalhes do Salário",
    searchStaff: "Pesquisar Funcionário...",
    noStaffFound: "Nenhum funcionário encontrado",
    baseSalary: "Salário Base",
    bonus: "Bônus",
    deductions: "Deduções",
    paymentDate: "Data de Pagamento",
    status: "Status",
    pending: "Pendente",
    paid: "Pago",
    netSalary: "Salário Líquido",
    addSalary: "Adicionar Salário",
    updateSalary: "Atualizar Salário",
    edit: "Editar",
    delete: "Excluir",
    confirmDelete: "Tem certeza que deseja excluir o salário de",
    unknown: "Desconhecido",
    loginError: "Por favor, faça login para acessar esta página.",
    fetchError: "Falha ao buscar salários. Por favor, verifique se o servidor backend está em execução.",
    addError: "Falha ao adicionar salário",
    updateError: "Falha ao atualizar salário",
    deleteError: "Falha ao excluir salário",
    loading: "Carregando salários...",
    noSalaries: "Nenhum salário disponível. Adicione um novo salário para começar.",
    searchPlaceholder: "Pesquisar por nome ou ID...",
    requiredFields: "Todos os campos são obrigatórios e os valores do salário devem ser números válidos",
    staff: "Funcionário",
    date: "Data",
    actions: "Ações",
    language: "Idioma"
  },
  th: {
    title: "รายละเอียดเงินเดือน",
    searchStaff: "ค้นหาพนักงาน...",
    noStaffFound: "ไม่พบพนักงาน",
    baseSalary: "เงินเดือนพื้นฐาน",
    bonus: "โบนัส",
    deductions: "หักเงิน",
    paymentDate: "วันที่จ่าย",
    status: "สถานะ",
    pending: "รอดำเนินการ",
    paid: "จ่ายแล้ว",
    netSalary: "เงินเดือนสุทธิ",
    addSalary: "เพิ่มเงินเดือน",
    updateSalary: "อัปเดตเงินเดือน",
    edit: "แก้ไข",
    delete: "ลบ",
    confirmDelete: "คุณแน่ใจหรือไม่ว่าต้องการลบเงินเดือนสำหรับ",
    unknown: "ไม่ทราบ",
    loginError: "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้",
    fetchError: "ไม่สามารถดึงข้อมูลเงินเดือนได้ โปรดตรวจสอบว่าเซิร์ฟเวอร์แบ็กเอนด์ทำงานอยู่",
    addError: "ไม่สามารถเพิ่มเงินเดือนได้",
    updateError: "ไม่สามารถอัปเดตเงินเดือนได้",
    deleteError: "ไม่สามารถลบเงินเดือนได้",
    loading: "กำลังโหลดข้อมูลเงินเดือน...",
    noSalaries: "ไม่มีข้อมูลเงินเดือน เพิ่มเงินเดือนใหม่เพื่อเริ่มต้น",
    searchPlaceholder: "ค้นหาด้วยชื่อหรือ ID...",
    requiredFields: "ต้องกรอกข้อมูลในช่องทั้งหมด และค่าของเงินเดือนต้องเป็นตัวเลขที่ถูกต้อง",
    staff: "พนักงาน",
    date: "วันที่",
    actions: "การดำเนินการ",
    language: "ภาษา"
  },
  vi: {
    title: "Chi tiết Lương",
    searchStaff: "Tìm kiếm Nhân viên...",
    noStaffFound: "Không tìm thấy nhân viên",
    baseSalary: "Lương cơ bản",
    bonus: "Thưởng",
    deductions: "Khấu trừ",
    paymentDate: "Ngày thanh toán",
    status: "Trạng thái",
    pending: "Đang chờ",
    paid: "Đã thanh toán",
    netSalary: "Lương thực nhận",
    addSalary: "Thêm Lương",
    updateSalary: "Cập nhật Lương",
    edit: "Sửa",
    delete: "Xóa",
    confirmDelete: "Bạn có chắc chắn muốn xóa lương của",
    unknown: "Không xác định",
    loginError: "Vui lòng đăng nhập để truy cập trang này.",
    fetchError: "Không thể tải dữ liệu lương. Vui lòng đảm bảo máy chủ backend đang chạy.",
    addError: "Thêm lương thất bại",
    updateError: "Cập nhật lương thất bại",
    deleteError: "Xóa lương thất bại",
    loading: "Đang tải dữ liệu lương...",
    noSalaries: "Không có dữ liệu lương. Thêm lương mới để bắt đầu.",
    searchPlaceholder: "Tìm kiếm theo tên hoặc ID...",
    requiredFields: "Tất cả các trường đều bắt buộc và giá trị lương phải là số hợp lệ",
    staff: "Nhân viên",
    date: "Ngày",
    actions: "Hành động",
    language: "Ngôn ngữ"
  },
  bn: {
    title: "বেতনের বিবরণ",
    searchStaff: "স্টাফ খুঁজুন...",
    noStaffFound: "কোন স্টাফ পাওয়া যায়নি",
    baseSalary: "মূল বেতন",
    bonus: "বোনাস",
    deductions: "কাটা",
    paymentDate: "পেমেন্টের তারিখ",
    status: "স্ট্যাটাস",
    pending: "বিচারাধীন",
    paid: "পেমেন্ট করা হয়েছে",
    netSalary: "নিট বেতন",
    addSalary: "বেতন যোগ করুন",
    updateSalary: "বেতন আপডেট করুন",
    edit: "সম্পাদনা",
    delete: "মুছে ফেলা",
    confirmDelete: "আপনি কি নিশ্চিত যে আপনি এই স্টাফের বেতন মুছে ফেলতে চান",
    unknown: "অজানা",
    loginError: "এই পৃষ্ঠা অ্যাক্সেস করতে লগইন করুন।",
    fetchError: "বেতন ডেটা আনতে ব্যর্থ হয়েছে। ব্যাকএন্ড সার্ভার চলছে তা নিশ্চিত করুন।",
    addError: "বেতন যোগ করতে ব্যর্থ হয়েছে",
    updateError: "বেতন আপডেট করতে ব্যর্থ হয়েছে",
    deleteError: "বেতন মুছে ফেলতে ব্যর্থ হয়েছে",
    loading: "বেতন ডেটা লোড হচ্ছে...",
    noSalaries: "কোন বেতন উপলব্ধ নেই। শুরু করতে নতুন বেতন যোগ করুন।",
    searchPlaceholder: "নাম বা আইডি দিয়ে অনুসন্ধান করুন...",
    requiredFields: "সমস্ত ফিল্ড প্রয়োজন এবং বেতনের মান অবশ্যই বৈধ সংখ্যা হতে হবে",
    staff: "স্টাফ",
    date: "তারিখ",
    actions: "ক্রিয়াকলাপ",
    language: "ভাষা"
  },
  tl: {
    title: "Mga Detalye ng Sahod",
    searchStaff: "Maghanap ng Staff...",
    noStaffFound: "Walang staff na natagpuan",
    baseSalary: "Batayang Sahod",
    bonus: "Bonus",
    deductions: "Mga Bawas",
    paymentDate: "Petsa ng Pagbabayad",
    status: "Katayuan",
    pending: "Nakabinbin",
    paid: "Bayad na",
    netSalary: "Netong Sahod",
    addSalary: "Magdagdag ng Sahod",
    updateSalary: "I-update ang Sahod",
    edit: "I-edit",
    delete: "Burahin",
    confirmDelete: "Sigurado ka bang gusto mong burahin ang sahod para sa",
    unknown: "Hindi kilala",
    loginError: "Mangyaring mag-log in upang ma-access ang pahinang ito.",
    fetchError: "Nabigong i-fetch ang mga sahod. Mangyaring siguraduhin na tumatakbo ang backend server.",
    addError: "Nabigong magdagdag ng sahod",
    updateError: "Nabigong i-update ang sahod",
    deleteError: "Nabigong burahin ang sahod",
    loading: "Naglo-load ng mga sahod...",
    noSalaries: "Walang available na sahod. Magdagdag ng bagong sahod para makapagsimula.",
    searchPlaceholder: "Maghanap ayon sa pangalan o ID...",
    requiredFields: "Lahat ng field ay kinakailangan, at ang mga halaga ng sahod ay dapat na wastong mga numero",
    staff: "Staff",
    date: "Petsa",
    actions: "Mga Aksyon",
    language: "Wika"
  }
};

function SalaryDetails({ token }) {
  const [language, setLanguage] = useState('en');
  const [salaries, setSalaries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [newSalary, setNewSalary] = useState({
    staff: '',
    base_salary: '',
    bonus: '',
    deductions: '',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
  });
  const [currency, setCurrency] = useState('$');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSalary, setEditingSalary] = useState(null);
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    if (!token) {
      setError(t('loginError'));
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const settingsRes = await axios.get(`${API_BASE_URL}/settings/1/`);
        const currencySymbol = settingsRes.data.currency.split('-')[1] || '$';
        setCurrency(currencySymbol);
        const [salariesResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/salaries/`),
          axios.get(`${API_BASE_URL}/staff/`),
        ]);
        setSalaries(salariesResponse.data || []);
        setStaffList(staffResponse.data || []);
        if (!salariesResponse.data || salariesResponse.data.length === 0) {
          setFetchError(t('noSalaries'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, language]);

  const calculateNetSalary = (salary) => {
    const base = parseFloat(salary.base_salary) || 0;
    const bonus = parseFloat(salary.bonus) || 0;
    const deductions = parseFloat(salary.deductions) || 0;
    return (base + bonus - deductions).toFixed(2);
  };

  const handleAddSalary = async (e) => {
    e.preventDefault();
    const baseSalary = parseFloat(newSalary.base_salary);
    const bonus = parseFloat(newSalary.bonus);
    const deductions = parseFloat(newSalary.deductions);
    if (!newSalary.staff || isNaN(baseSalary) || isNaN(bonus) || isNaN(deductions)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const payload = {
        staff_id: parseInt(newSalary.staff),
        base_salary: baseSalary,
        bonus,
        deductions,
        payment_date: newSalary.payment_date,
        status: newSalary.status,
      };
      const response = await axios.post(`${API_BASE_URL}/salaries/`, payload);
      setSalaries([...salaries, response.data]);
      setNewSalary({
        staff: '',
        base_salary: '',
        bonus: '',
        deductions: '',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      });
      setStaffSearch('');
      setShowStaffDropdown(false);
      setFetchError('');
    } catch (error) {
      console.error('Error adding salary:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditSalary = (salary) => {
    setEditingSalary(salary);
    const staffId = salary.staff && salary.staff.id ? salary.staff.id.toString() : '';
    setNewSalary({
      staff: staffId,
      base_salary: salary.base_salary ? salary.base_salary.toString() : '',
      bonus: salary.bonus ? salary.bonus.toString() : '',
      deductions: salary.deductions ? salary.deductions.toString() : '',
      payment_date: salary.payment_date || new Date().toISOString().split('T')[0],
      status: salary.status || 'Pending',
    });
    const staff = staffList.find(s => s.id === (salary.staff?.id || 0));
    setStaffSearch(staff ? staff.name : '');
    setShowStaffDropdown(false);
  };

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!editingSalary) return;
    const baseSalary = parseFloat(newSalary.base_salary);
    const bonus = parseFloat(newSalary.bonus);
    const deductions = parseFloat(newSalary.deductions);
    if (!newSalary.staff || isNaN(baseSalary) || isNaN(bonus) || isNaN(deductions)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const payload = {
        staff_id: parseInt(newSalary.staff),
        base_salary: baseSalary,
        bonus,
        deductions,
        payment_date: newSalary.payment_date,
        status: newSalary.status,
      };
      const response = await axios.put(`${API_BASE_URL}/salaries/${editingSalary.id}/`, payload);
      setSalaries(salaries.map(s => s.id === editingSalary.id ? response.data : s));
      setEditingSalary(null);
      setNewSalary({
        staff: '',
        base_salary: '',
        bonus: '',
        deductions: '',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error updating salary:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteSalary = async (id, staffName) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${staffName || t('unknown')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/salaries/${id}/`);
        setSalaries(salaries.filter(salary => salary.id !== id));
      } catch (error) {
        console.error('Error deleting salary:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSalary) {
      handleUpdateSalary(e);
    } else {
      handleAddSalary(e);
    }
  };

  const filteredSalaries = salaries.filter(salary => {
    if (!salary.staff) return false;
    const staffName = salary.staff.name || '';
    const staffId = salary.staff.id ? salary.staff.id.toString() : '';
    return (
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffId.includes(searchTerm)
    );
  });

  const handleStaffSelect = (staff) => {
    setNewSalary({ ...newSalary, staff: staff.id.toString() });
    setStaffSearch(staff.name);
    setShowStaffDropdown(false);
  };

  const handleNumberChange = (field) => (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNewSalary({ ...newSalary, [field]: value });
      setError('');
    } else {
      setError(`${field.replace('_', ' ')} must be a valid number`);
    }
  };

  const handleStatusChange = (e) => {
    setNewSalary({ ...newSalary, status: e.target.value });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (!token) {
    return <p className="text-red-600">{t('loginError')}</p>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <div className="relative">
          <span className="mr-2">{t('language')}:</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="en">🇺🇸 English</option>
            <option value="ja">🇯🇵 日本語 (Japanese)</option>
            <option value="ne">🇳🇵 नेपाली (Nepali)</option>
            <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
            <option value="my">🇲🇲 မြန်မာ (Myanmar)</option>
            <option value="pt">🇵🇹 Português (Portuguese)</option>
            <option value="th">🇹🇭 ไทย (Thai)</option>
            <option value="vi">🇻🇳 Tiếng Việt (Vietnamese)</option>
            <option value="bn">🇧🇩 বাংলা (Bangladesh)</option>
            <option value="tl">🇵🇭 Tagalog (Philippines)</option>
          </select>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="relative">
            <input
              type="text"
              placeholder={t('baseSalary')}
              value={newSalary.base_salary}
              onChange={handleNumberChange('base_salary')}
              className="p-2 border rounded w-full pl-8"
              required
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={t('bonus')}
              value={newSalary.bonus}
              onChange={handleNumberChange('bonus')}
              className="p-2 border rounded w-full pl-8"
              required
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={t('deductions')}
              value={newSalary.deductions}
              onChange={handleNumberChange('deductions')}
              className="p-2 border rounded w-full pl-8"
              required
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          </div>
          <select
            value={newSalary.status}
            onChange={handleStatusChange}
            className="p-2 border rounded"
            required
          >
            <option value="Pending">{t('pending')}</option>
            <option value="Paid">{t('paid')}</option>
          </select>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingSalary ? t('updateSalary') : t('addSalary')}
        </button>
      </form>
      {loading && <p className="text-gray-600 mb-4">{t('loading')}</p>}
      {fetchError && !loading && <p className="text-red-600 mb-4">{fetchError}</p>}
      {!loading && !fetchError && filteredSalaries.length === 0 && (
        <p className="text-gray-600 mb-4">{t('noSalaries')}</p>
      )}
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('staff')}</th>
              <th className="p-2 text-left">{t('baseSalary')}</th>
              <th className="p-2 text-left">{t('bonus')}</th>
              <th className="p-2 text-left">{t('deductions')}</th>
              <th className="p-2 text-left">{t('netSalary')}</th>
              <th className="p-2 text-left">{t('date')}</th>
              <th className="p-2 text-left">{t('status')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary.id} className="border-t">
                <td className="p-2">{salary.staff?.name || t('unknown')}</td>
                <td className="p-2">{currency}{salary.base_salary}</td>
                <td className="p-2">{currency}{salary.bonus}</td>
                <td className="p-2">{currency}{salary.deductions}</td>
                <td className="p-2">{currency}{calculateNetSalary(salary)}</td>
                <td className="p-2">{salary.payment_date}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${salary.status === 'Paid' ? 'bg-green-200' : 'bg-yellow-200'}`}>
                    {salary.status === 'Paid' ? t('paid') : t('pending')}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditSalary(salary)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteSalary(salary.id, salary.staff?.name || t('unknown'))}
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

export default SalaryDetails;