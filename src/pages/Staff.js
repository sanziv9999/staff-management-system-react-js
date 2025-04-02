import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: 'Staff Management',
    dataLoaded: 'Data loaded successfully',
    loadError: 'Error loading data',
    staffAdded: 'Staff added successfully',
    addError: 'Error adding staff',
    staffUpdated: 'Staff updated successfully',
    updateError: 'Error updating staff',
    staffDeleted: 'Staff deleted successfully',
    deleteError: 'Error deleting staff',
    requiredFields: 'Please fill in all required fields',
    validEmail: 'Please enter a valid email address',
    confirmDelete: 'Are you sure you want to delete',
    thisStaff: 'this staff member',
    firstName: 'First Name',
    lastName: 'Last Name',
    searchDept: 'Search Department',
    email: 'Email',
    updateStaff: 'Update Staff',
    addStaff: 'Add Staff',
    searchPlaceholder: 'Search by name, department, or email',
    id: 'ID',
    name: 'Name',
    department: 'Department',
    actions: 'Actions',
    viewDetails: 'View Details',
    delete: 'Delete',
    noDepts: 'No departments found',
    staffDetails: 'Staff Details',
    fullName: 'Full Name',
    username: 'Username',
    dob: 'Date of Birth',
    locationAddress: 'Location Address',
    close: 'Close',
    language: 'Language',
    na: 'N/A',
    edit: 'Edit'
  },
  ja: {
    title: 'スタッフ管理',
    dataLoaded: 'データが正常に読み込まれました',
    loadError: 'データの読み込みエラー',
    staffAdded: 'スタッフが正常に追加されました',
    addError: 'スタッフ追加エラー',
    staffUpdated: 'スタッフ情報が更新されました',
    updateError: 'スタッフ更新エラー',
    staffDeleted: 'スタッフが削除されました',
    deleteError: 'スタッフ削除エラー',
    requiredFields: '必須フィールドを入力してください',
    validEmail: '有効なメールアドレスを入力してください',
    confirmDelete: '本当に削除しますか',
    thisStaff: 'このスタッフメンバー',
    firstName: '名',
    lastName: '姓',
    searchDept: '部門を検索',
    email: 'メールアドレス',
    updateStaff: 'スタッフを更新',
    addStaff: 'スタッフを追加',
    searchPlaceholder: '名前、部門、またはメールで検索',
    id: 'ID',
    name: '名前',
    department: '部門',
    actions: '操作',
    viewDetails: '詳細を見る',
    delete: '削除',
    noDepts: '部門が見つかりません',
    staffDetails: 'スタッフ詳細',
    fullName: '氏名',
    username: 'ユーザー名',
    dob: '生年月日',
    locationAddress: '所在地',
    close: '閉じる',
    language: '言語',
    na: '該当なし',
    edit: '編集'
  },
  ne: {
    title: 'कर्मचारी व्यवस्थापन',
    dataLoaded: 'डाटा सफलतापूर्वक लोड भयो',
    loadError: 'डाटा लोड गर्दा त्रुटि',
    staffAdded: 'कर्मचारी सफलतापूर्वक थपियो',
    addError: 'कर्मचारी थप्ने त्रुटि',
    staffUpdated: 'कर्मचारी सफलतापूर्वक अद्यावधिक भयो',
    updateError: 'कर्मचारी अद्यावधिक गर्दा त्रुटि',
    staffDeleted: 'कर्मचारी सफलतापूर्वक मेटियो',
    deleteError: 'कर्मचारी मेट्ने त्रुटि',
    requiredFields: 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्',
    validEmail: 'कृपया वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्',
    confirmDelete: 'तपाईं निश्चित हुनुहुन्छ हटाउन',
    thisStaff: 'यो कर्मचारी सदस्य',
    firstName: 'पहिलो नाम',
    lastName: 'थर',
    searchDept: 'विभाग खोज्नुहोस्',
    email: 'इमेल',
    updateStaff: 'कर्मचारी अद्यावधिक गर्नुहोस्',
    addStaff: 'कर्मचारी थप्नुहोस्',
    searchPlaceholder: 'नाम, विभाग, वा इमेलले खोज्नुहोस्',
    id: 'आईडी',
    name: 'नाम',
    department: 'विभाग',
    actions: 'कार्यहरू',
    viewDetails: 'विवरण हेर्नुहोस्',
    delete: 'मेट्नुहोस्',
    noDepts: 'कुनै विभाग फेला परेन',
    staffDetails: 'कर्मचारी विवरण',
    fullName: 'पुरा नाम',
    username: 'प्रयोगकर्ता नाम',
    dob: 'जन्म मिति',
    locationAddress: 'स्थान ठेगाना',
    close: 'बन्द गर्नुहोस्',
    language: 'भाषा',
    na: 'उपलब्ध छैन',
    edit: 'सम्पादन गर्नुहोस्'
  },
  hi: {
    title: 'कर्मचारी प्रबंधन',
    dataLoaded: 'डेटा सफलतापूर्वक लोड हो गया',
    loadError: 'डेटा लोड करने में त्रुटि',
    staffAdded: 'कर्मचारी सफलतापूर्वक जोड़ा गया',
    addError: 'कर्मचारी जोड़ने में त्रुटि',
    staffUpdated: 'कर्मचारी सफलतापूर्वक अद्यतन किया गया',
    updateError: 'कर्मचारी अद्यतन करने में त्रुटि',
    staffDeleted: 'कर्मचारी सफलतापूर्वक हटाया गया',
    deleteError: 'कर्मचारी हटाने में त्रुटि',
    requiredFields: 'कृपया सभी आवश्यक फ़ील्ड भरें',
    validEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    confirmDelete: 'क्या आप वाकई हटाना चाहते हैं',
    thisStaff: 'इस कर्मचारी सदस्य को',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    searchDept: 'विभाग खोजें',
    email: 'ईमेल',
    updateStaff: 'कर्मचारी अद्यतन करें',
    addStaff: 'कर्मचारी जोड़ें',
    searchPlaceholder: 'नाम, विभाग, या ईमेल से खोजें',
    id: 'आईडी',
    name: 'नाम',
    department: 'विभाग',
    actions: 'कार्रवाई',
    viewDetails: 'विवरण देखें',
    delete: 'हटाएं',
    noDepts: 'कोई विभाग नहीं मिला',
    staffDetails: 'कर्मचारी विवरण',
    fullName: 'पूरा नाम',
    username: 'उपयोगकर्ता नाम',
    dob: 'जन्म तिथि',
    locationAddress: 'स्थान पता',
    close: 'बंद करें',
    language: 'भाषा',
    na: 'उपलब्ध नहीं',
    edit: 'संपादित करें'
  },
  my: {
    title: 'ဝန်ထမ်းစီမံခန့်ခွဲမှု',
    dataLoaded: 'ဒေတာများအောင်မြင်စွာလုပ်ဆောင်ပြီးပါပြီ',
    loadError: 'ဒေတာများလုပ်ဆောင်ရာတွင်အမှား',
    staffAdded: 'ဝန်ထမ်းအောင်မြင်စွာထည့်သွင်းပြီးပါပြီ',
    addError: 'ဝန်ထမ်းထည့်သွင်းရာတွင်အမှား',
    staffUpdated: 'ဝန်ထမ်းအောင်မြင်စွာအပ်ဒိတ်လုပ်ပြီးပါပြီ',
    updateError: 'ဝန်ထမ်းအပ်ဒိတ်လုပ်ရာတွင်အမှား',
    staffDeleted: 'ဝန်ထမ်းအောင်မြင်စွာဖျက်ပစ်ပြီးပါပြီ',
    deleteError: 'ဝန်ထမ်းဖျက်ပစ်ရာတွင်အမှား',
    requiredFields: 'ကျေးဇူးပြု၍လိုအပ်သောအချက်များကိုဖြည့်စွက်ပါ',
    validEmail: 'ကျေးဇူးပြု၍မှန်ကန်သောအီးမေးလ်လိပ်စာထည့်ပါ',
    confirmDelete: 'ဖျက်ပစ်လိုသည်မှာသေချာပါသလား',
    thisStaff: 'ဤဝန်ထမ်းအဖွဲ့ဝင်',
    firstName: 'အမည်၏ပထမစာလုံး',
    lastName: 'အမည်၏နောက်ဆုံးစာလုံး',
    searchDept: 'ဌာနရှာဖွေပါ',
    email: 'အီးမေးလ်',
    updateStaff: 'ဝန်ထမ်းအပ်ဒိတ်လုပ်ပါ',
    addStaff: 'ဝန်ထမ်းထည့်သွင်းပါ',
    searchPlaceholder: 'အမည်၊ ဌာန သို့မဟုတ် အီးမေးလ်ဖြင့်ရှာဖွေပါ',
    id: 'ID',
    name: 'အမည်',
    department: 'ဌာန',
    actions: 'လုပ်ဆောင်ချက်များ',
    viewDetails: 'အသေးစိတ်ကြည့်ရှုပါ',
    delete: 'ဖျက်ပစ်ပါ',
    noDepts: 'ဌာနမတွေ့ရှိပါ',
    staffDetails: 'ဝန်ထမ်းအသေးစိတ်',
    fullName: 'အပြည့်အစုံအမည်',
    username: 'အသုံးပြုသူအမည်',
    dob: 'မွေးသက္ကရာဇ်',
    locationAddress: 'တည်နေရာလိပ်စာ',
    close: 'ပိတ်ပါ',
    language: 'ဘာသာစကား',
    na: 'မရှိ',
    edit: 'တည်းဖြတ်ပါ'
  },
  pt: {
    title: 'Gestão de Pessoal',
    dataLoaded: 'Dados carregados com sucesso',
    loadError: 'Erro ao carregar dados',
    staffAdded: 'Funcionário adicionado com sucesso',
    addError: 'Erro ao adicionar funcionário',
    staffUpdated: 'Funcionário atualizado com sucesso',
    updateError: 'Erro ao atualizar funcionário',
    staffDeleted: 'Funcionário excluído com sucesso',
    deleteError: 'Erro ao excluir funcionário',
    requiredFields: 'Por favor, preencha todos os campos obrigatórios',
    validEmail: 'Por favor, insira um endereço de e-mail válido',
    confirmDelete: 'Tem certeza que deseja excluir',
    thisStaff: 'este membro da equipe',
    firstName: 'Primeiro Nome',
    lastName: 'Sobrenome',
    searchDept: 'Pesquisar Departamento',
    email: 'E-mail',
    updateStaff: 'Atualizar Funcionário',
    addStaff: 'Adicionar Funcionário',
    searchPlaceholder: 'Pesquisar por nome, departamento ou e-mail',
    id: 'ID',
    name: 'Nome',
    department: 'Departamento',
    actions: 'Ações',
    viewDetails: 'Ver Detalhes',
    delete: 'Excluir',
    noDepts: 'Nenhum departamento encontrado',
    staffDetails: 'Detalhes do Funcionário',
    fullName: 'Nome Completo',
    username: 'Nome de Usuário',
    dob: 'Data de Nascimento',
    locationAddress: 'Endereço de Localização',
    close: 'Fechar',
    language: 'Idioma',
    na: 'N/A',
    edit: 'Editar'
  },
  tl: {
    title: 'Pamamahala ng Staff',
    dataLoaded: 'Matagumpay na na-load ang data',
    loadError: 'Error sa pag-load ng data',
    staffAdded: 'Matagumpay na naidagdag ang staff',
    addError: 'Error sa pagdaragdag ng staff',
    staffUpdated: 'Matagumpay na na-update ang staff',
    updateError: 'Error sa pag-update ng staff',
    staffDeleted: 'Matagumpay na nai-delete ang staff',
    deleteError: 'Error sa pag-delete ng staff',
    requiredFields: 'Mangyaring punan ang lahat ng kinakailangang field',
    validEmail: 'Mangyaring maglagay ng wastong email address',
    confirmDelete: 'Sigurado ka bang gusto mong tanggalin',
    thisStaff: 'ang staff member na ito',
    firstName: 'Pangalan',
    lastName: 'Apelyido',
    searchDept: 'Maghanap ng Departamento',
    email: 'Email',
    updateStaff: 'I-update ang Staff',
    addStaff: 'Magdagdag ng Staff',
    searchPlaceholder: 'Maghanap ayon sa pangalan, departamento, o email',
    id: 'ID',
    name: 'Pangalan',
    department: 'Departamento',
    actions: 'Mga Aksyon',
    viewDetails: 'Tingnan ang Detalye',
    delete: 'Tanggalin',
    noDepts: 'Walang nakitang departamento',
    staffDetails: 'Mga Detalye ng Staff',
    fullName: 'Buong Pangalan',
    username: 'Username',
    dob: 'Petsa ng Kapanganakan',
    locationAddress: 'Lokasyon ng Address',
    close: 'Isara',
    language: 'Wika',
    na: 'N/A',
    edit: 'I-edit'
  },
  bn: {
    title: 'কর্মী ব্যবস্থাপনা',
    dataLoaded: 'ডেটা সফলভাবে লোড হয়েছে',
    loadError: 'ডেটা লোড করতে ত্রুটি',
    staffAdded: 'কর্মী সফলভাবে যোগ করা হয়েছে',
    addError: 'কর্মী যোগ করতে ত্রুটি',
    staffUpdated: 'কর্মী সফলভাবে আপডেট করা হয়েছে',
    updateError: 'কর্মী আপডেট করতে ত্রুটি',
    staffDeleted: 'কর্মী সফলভাবে মুছে ফেলা হয়েছে',
    deleteError: 'কর্মী মুছতে ত্রুটি',
    requiredFields: 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ফিল্ড পূরণ করুন',
    validEmail: 'অনুগ্রহ করে একটি বৈধ ইমেল ঠিকানা লিখুন',
    confirmDelete: 'আপনি কি নিশ্চিতভাবে মুছে ফেলতে চান',
    thisStaff: 'এই কর্মী সদস্য',
    firstName: 'নামের প্রথম অংশ',
    lastName: 'নামের শেষাংশ',
    searchDept: 'বিভাগ অনুসন্ধান করুন',
    email: 'ইমেল',
    updateStaff: 'কর্মী আপডেট করুন',
    addStaff: 'কর্মী যোগ করুন',
    searchPlaceholder: 'নাম, বিভাগ বা ইমেল দ্বারা অনুসন্ধান করুন',
    id: 'আইডি',
    name: 'নাম',
    department: 'বিভাগ',
    actions: 'ক্রিয়াকলাপ',
    viewDetails: 'বিস্তারিত দেখুন',
    delete: 'মুছুন',
    noDepts: 'কোন বিভাগ পাওয়া যায়নি',
    staffDetails: 'কর্মীর বিবরণ',
    fullName: 'পুরো নাম',
    username: 'ব্যবহারকারীর নাম',
    dob: 'জন্ম তারিখ',
    locationAddress: 'অবস্থানের ঠিকানা',
    close: 'বন্ধ করুন',
    language: 'ভাষা',
    na: 'প্রযোজ্য নয়',
    edit: 'সম্পাদনা করুন'
  },
  th: {
    title: 'การจัดการพนักงาน',
    dataLoaded: 'โหลดข้อมูลสำเร็จ',
    loadError: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
    staffAdded: 'เพิ่มพนักงานสำเร็จ',
    addError: 'เกิดข้อผิดพลาดในการเพิ่มพนักงาน',
    staffUpdated: 'อัปเดตพนักงานสำเร็จ',
    updateError: 'เกิดข้อผิดพลาดในการอัปเดตพนักงาน',
    staffDeleted: 'ลบพนักงานสำเร็จ',
    deleteError: 'เกิดข้อผิดพลาดในการลบพนักงาน',
    requiredFields: 'กรุณากรอกข้อมูลในช่องที่จำเป็นทั้งหมด',
    validEmail: 'กรุณากรอกอีเมลที่ถูกต้อง',
    confirmDelete: 'คุณแน่ใจหรือไม่ว่าต้องการลบ',
    thisStaff: 'พนักงานคนนี้',
    firstName: 'ชื่อ',
    lastName: 'นามสกุล',
    searchDept: 'ค้นหาส่วนงาน',
    email: 'อีเมล',
    updateStaff: 'อัปเดตพนักงาน',
    addStaff: 'เพิ่มพนักงาน',
    searchPlaceholder: 'ค้นหาด้วยชื่อ, ส่วนงาน หรืออีเมล',
    id: 'ไอดี',
    name: 'ชื่อ',
    department: 'ส่วนงาน',
    actions: 'การดำเนินการ',
    viewDetails: 'ดูรายละเอียด',
    delete: 'ลบ',
    noDepts: 'ไม่พบส่วนงาน',
    staffDetails: 'รายละเอียดพนักงาน',
    fullName: 'ชื่อเต็ม',
    username: 'ชื่อผู้ใช้',
    dob: 'วันเกิด',
    locationAddress: 'ที่อยู่',
    close: 'ปิด',
    language: 'ภาษา',
    na: 'ไม่มีข้อมูล',
    edit: 'แก้ไข'
  },
  vi: {
    title: 'Quản lý Nhân viên',
    dataLoaded: 'Tải dữ liệu thành công',
    loadError: 'Lỗi khi tải dữ liệu',
    staffAdded: 'Thêm nhân viên thành công',
    addError: 'Lỗi khi thêm nhân viên',
    staffUpdated: 'Cập nhật nhân viên thành công',
    updateError: 'Lỗi khi cập nhật nhân viên',
    staffDeleted: 'Xóa nhân viên thành công',
    deleteError: 'Lỗi khi xóa nhân viên',
    requiredFields: 'Vui lòng điền đầy đủ các trường bắt buộc',
    validEmail: 'Vui lòng nhập địa chỉ email hợp lệ',
    confirmDelete: 'Bạn có chắc chắn muốn xóa',
    thisStaff: 'nhân viên này',
    firstName: 'Tên',
    lastName: 'Họ',
    searchDept: 'Tìm kiếm Phòng ban',
    email: 'Email',
    updateStaff: 'Cập nhật Nhân viên',
    addStaff: 'Thêm Nhân viên',
    searchPlaceholder: 'Tìm kiếm theo tên, phòng ban hoặc email',
    id: 'ID',
    name: 'Tên',
    department: 'Phòng ban',
    actions: 'Hành động',
    viewDetails: 'Xem Chi tiết',
    delete: 'Xóa',
    noDepts: 'Không tìm thấy phòng ban nào',
    staffDetails: 'Chi tiết Nhân viên',
    fullName: 'Họ và Tên',
    username: 'Tên đăng nhập',
    dob: 'Ngày sinh',
    locationAddress: 'Địa chỉ',
    close: 'Đóng',
    language: 'Ngôn ngữ',
    na: 'Không có',
    edit: 'Sửa'
  }
};

function Staff() {
  const [language, setLanguage] = useState('en');
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newStaff, setNewStaff] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    department: '',
    dob: '',
    location_lat: '',
    location_lng: '',
    location_address: '',
    certificate_type: '',
    certificate_title: '',
    certificate_description: '',
    certificate_issue_date: ''
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deptSearch, setDeptSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, deptResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/staff/`),
          axios.get(`${API_BASE_URL}/departments/`),
        ]);
        setStaffList(staffResponse.data);
        setDepartments(deptResponse.data);
        toast.success(t('dataLoaded'), { autoClose: 2000 });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('loadError'));
        toast.error(t('loadError'), { autoClose: 3000 });
      }
    };
    fetchData();
  }, [language]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.department) {
      setError(t('requiredFields'));
      toast.error(t('requiredFields'), { autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError(t('validEmail'));
      toast.error(t('validEmail'), { autoClose: 3000 });
      return;
    }
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        department: '',
        dob: '',
        location_lat: '',
        location_lng: '',
        location_address: '',
        certificate_type: '',
        certificate_title: '',
        certificate_description: '',
        certificate_issue_date: ''
      });
      setDeptSearch('');
      setShowDeptDropdown(false);
      toast.success(t('staffAdded'), { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding staff:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.message;
      setError(t('addError') + ': ' + errorMsg);
      toast.error(t('addError') + ': ' + errorMsg, { autoClose: 3000 });
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      first_name: staff.first_name || '',
      middle_name: staff.middle_name || '',
      last_name: staff.last_name || '',
      username: staff.username || '',
      email: staff.email || '',
      department: staff.department || '',
      dob: staff.dob || '',
      location_lat: staff.location_lat || '',
      location_lng: staff.location_lng || '',
      location_address: staff.location_address || '',
      certificate_type: staff.certificate_type || '',
      certificate_title: staff.certificate_title || '',
      certificate_description: staff.certificate_description || '',
      certificate_issue_date: staff.certificate_issue_date || ''
    });
    const dept = departments.find((d) => d.id === staff.department);
    setDeptSearch(dept ? dept.name : '');
    setShowDeptDropdown(false);
    setError('');
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.department) {
      setError(t('requiredFields'));
      toast.error(t('requiredFields'), { autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError(t('validEmail'));
      toast.error(t('validEmail'), { autoClose: 3000 });
      return;
    }
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/${editingStaff.id}/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList(staffList.map((staff) => (staff.id === editingStaff.id ? response.data : staff)));
      setEditingStaff(null);
      setNewStaff({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        department: '',
        dob: '',
        location_lat: '',
        location_lng: '',
        location_address: '',
        certificate_type: '',
        certificate_title: '',
        certificate_description: '',
        certificate_issue_date: ''
      });
      setDeptSearch('');
      setShowDeptDropdown(false);
      toast.success(t('staffUpdated'), { autoClose: 2000 });
    } catch (error) {
      console.error('Error updating staff:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.message;
      setError(t('updateError') + ': ' + errorMsg);
      toast.error(t('updateError') + ': ' + errorMsg, { autoClose: 3000 });
    }
  };

  const handleDeleteStaff = async (id, name) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${name || t('thisStaff')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/${id}/`);
        setStaffList(staffList.filter((staff) => staff.id !== id));
        toast.success(t('staffDeleted'), { autoClose: 2000 });
      } catch (error) {
        console.error('Error deleting staff:', error);
        const errorMsg = error.response?.data?.detail || error.message;
        setError(t('deleteError') + ': ' + errorMsg);
        toast.error(t('deleteError') + ': ' + errorMsg, { autoClose: 3000 });
      }
    }
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
  };

  const closeModal = () => {
    setSelectedStaff(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      handleUpdateStaff(e);
    } else {
      handleAddStaff(e);
    }
  };

  const filteredDepartments = deptSearch
    ? departments.filter((dept) =>
        dept.name?.toLowerCase().includes(deptSearch.toLowerCase())
      )
    : departments.sort((a, b) => b.id - a.id).slice(0, 3);

  const handleDeptSelect = (dept) => {
    setNewStaff({ ...newStaff, department: dept.id });
    setDeptSearch(dept.name);
    setShowDeptDropdown(false);
  };

  const filteredStaff = staffList.filter((staff) => {
    const departmentName =
      staff.department_name ||
      (departments.find((d) => d.id === staff.department)?.name) ||
      '';
    const name = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
    const email = staff.email || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">{t('title')}</h2>
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto`}>
          <div className="relative">
            <span className="mr-2 hidden sm:inline">{t('language')}:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="p-2 border rounded bg-white w-full sm:w-auto"
            >
              <option value="en">🇬🇧 English</option>
              <option value="ja">🇯🇵 日本語 (Japanese)</option>
              <option value="ne">🇳🇵 नेपाली (Nepali)</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="my">🇲🇲 မြန်မာ (Myanmar)</option>
              <option value="pt">🇧🇷🇵🇹 Português (Portuguese)</option>
              <option value="tl">🇵🇭 Tagalog (Filipino)</option>
              <option value="bn">🇧🇩 বাংলা (Bengali)</option>
              <option value="th">🇹🇭 ไทย (Thai)</option>
              <option value="vi">🇻🇳 Tiếng Việt (Vietnamese)</option>
            </select>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="sm:col-span-1">
            <input
              type="text"
              placeholder={t('firstName')}
              value={newStaff.first_name}
              onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
              className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 w-full"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <input
              type="text"
              placeholder={t('lastName')}
              value={newStaff.last_name}
              onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
              className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 w-full"
              required
            />
          </div>
          <div className="sm:col-span-1 relative">
            <input
              type="text"
              placeholder={t('searchDept')}
              value={deptSearch}
              onChange={(e) => {
                setDeptSearch(e.target.value);
                setShowDeptDropdown(true);
              }}
              onFocus={() => setShowDeptDropdown(true)}
              onBlur={() => setTimeout(() => setShowDeptDropdown(false), 200)}
              className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 w-full"
              required
            />
            {showDeptDropdown && (
              <ul className="absolute z-10 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto w-full mt-1">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li
                      key={dept.id}
                      onClick={() => handleDeptSelect(dept)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      {dept.name}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500">{t('noDepts')}</li>
                )}
              </ul>
            )}
          </div>
          <div className="sm:col-span-1">
            <input
              type="email"
              placeholder={t('email')}
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 w-full"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-center font-medium mt-4">{error}</p>
        )}

        <button
          type="submit"
          className="mt-4 sm:mt-6 w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
        >
          {editingStaff ? t('updateStaff') : t('addStaff')}
        </button>
      </form>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 md:w-1/3 p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">
                  {t('id')}
                </th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">
                  {t('name')}
                </th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap hidden sm:table-cell">
                  {t('department')}
                </th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap hidden md:table-cell">
                  {t('email')}
                </th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">{staff.id}</td>
                    <td className="p-3 whitespace-nowrap">
                      {`${staff.first_name || ''} ${staff.last_name || ''}`.trim() || t('na')}
                    </td>
                    <td className="p-3 whitespace-nowrap hidden sm:table-cell">
                      {staff.department_name ||
                        departments.find((d) => d.id === staff.department)?.name ||
                        t('na')}
                    </td>
                    <td className="p-3 whitespace-nowrap hidden md:table-cell">
                      {staff.email || t('na')}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewDetails(staff)}
                          className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
                        >
                          {t('viewDetails')}
                        </button>
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="text-green-600 hover:underline font-medium text-sm sm:text-base"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteStaff(
                              staff.id,
                              `${staff.first_name} ${staff.last_name}`
                            )
                          }
                          className="text-red-600 hover:underline font-medium text-sm sm:text-base"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">
                  {t('staffDetails')}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                    {t('fullName')}
                  </h4>
                  <p className="text-gray-600 break-words">
                    {`${selectedStaff.first_name || ''} ${
                      selectedStaff.middle_name || ''
                    } ${selectedStaff.last_name || ''}`.trim() || t('na')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                    {t('username')}
                  </h4>
                  <p className="text-gray-600 break-words">
                    {selectedStaff.username || t('na')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                    {t('email')}
                  </h4>
                  <p className="text-gray-600 break-words">
                    {selectedStaff.email || t('na')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                    {t('department')}
                  </h4>
                  <p className="text-gray-600 break-words">
                    {selectedStaff.department_name ||
                      departments.find((d) => d.id === selectedStaff.department)
                        ?.name ||
                      t('na')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                    {t('dob')}
                  </h4>
                  <p className="text-gray-600 break-words">
                    {selectedStaff.dob || t('na')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                    {t('locationAddress')}
                  </h4>
                  <p className="text-gray-600 break-words">
                    {selectedStaff.location_address || t('na')}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-semibold"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Staff;