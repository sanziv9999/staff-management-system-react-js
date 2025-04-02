import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary (unchanged)
const translations = {
  en: {
    title: "Department Management",
    deptName: "Department Name",
    manager: "Manager",
    staffCount: "Staff Count",
    addDept: "Add Department",
    updateDept: "Update Department",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete",
    loginError: "Please log in to access this page.",
    fetchError: "Failed to load data. Please ensure the backend server is running or check your login credentials.",
    addError: "Failed to add department",
    updateError: "Failed to update department",
    deleteError: "Failed to delete department",
    requiredFields: "All fields are required, and Staff Count must be a valid number",
    searchPlaceholder: "Search by name, manager, or staff count...",
    name: "Name",
    actions: "Actions",
    language: "Language"
  },
  ja: {
    title: "部門管理",
    deptName: "部門名",
    manager: "管理者",
    staffCount: "スタッフ数",
    addDept: "部門を追加",
    updateDept: "部門を更新",
    edit: "編集",
    delete: "削除",
    confirmDelete: "この部門を削除してもよろしいですか",
    loginError: "このページにアクセスするにはログインしてください。",
    fetchError: "データの読み込みに失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    addError: "部門の追加に失敗しました",
    updateError: "部門の更新に失敗しました",
    deleteError: "部門の削除に失敗しました",
    requiredFields: "すべてのフィールドが必要であり、スタッフ数は有効な数字でなければなりません",
    searchPlaceholder: "名前、管理者、またはスタッフ数で検索...",
    name: "名前",
    actions: "操作",
    language: "言語"
  },
  ne: {
    title: "विभाग व्यवस्थापन",
    deptName: "विभागको नाम",
    manager: "प्रबन्धक",
    staffCount: "कर्मचारी संख्या",
    addDept: "विभाग थप्नुहोस्",
    updateDept: "विभाग अपडेट गर्नुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    delete: "हटाउनुहोस्",
    confirmDelete: "के तपाईं यो विभाग हटाउन निश्चित हुनुहुन्छ",
    loginError: "यो पृष्ठमा पहुँच गर्न कृपया लगइन गर्नुहोस्।",
    fetchError: "डाटा लोड गर्न असफल भयो। कृपया ब्याकएन्ड सर्भर चलिरहेको छ कि छैन वा आफ्नो लगइन प्रमाणहरू जाँच गर्नुहोस्।",
    addError: "विभाग थप्न असफल भयो",
    updateError: "विभाग अपडेट गर्न असफल भयो",
    deleteError: "विभाग हटाउन असफल भयो",
    requiredFields: "सबै क्षेत्रहरू आवश्यक छन्, र कर्मचारी संख्या मान्य संख्या हुनुपर्छ",
    searchPlaceholder: "नाम, प्रबन्धक, वा कर्मचारी संख्याबाट खोज्नुहोस्...",
    name: "नाम",
    actions: "कार्यहरू",
    language: "भाषा"
  },
  hi: {
    title: "विभाग प्रबंधन",
    deptName: "विभाग का नाम",
    manager: "प्रबंधक",
    staffCount: "कर्मचारी संख्या",
    addDept: "विभाग जोड़ें",
    updateDept: "विभाग अपडेट करें",
    edit: "संपादन करें",
    delete: "हटाएं",
    confirmDelete: "क्या आप इस विभाग को हटाने के लिए निश्चित हैं",
    loginError: "इस पृष्ठ तक पहुँचने के लिए कृपया लॉगिन करें।",
    fetchError: "डेटा लोड करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है या अपने लॉगिन क्रेडेंशियल्स की जाँच करें।",
    addError: "विभाग जोड़Vपादन करें",
    updateError: "विभाग अपडेट करने में विफल",
    deleteError: "विभाग हटाने में विफल",
    requiredFields: "सभी क्षेत्र आवश्यक हैं, और कर्मचारी संख्या एक मान्य संख्या होनी चाहिए",
    searchPlaceholder: "नाम, प्रबंधक, या कर्मचारी संख्या से खोजें...",
    name: "नाम",
    actions: "कार्रवाइयाँ",
    language: "भाषा"
  },
  my: {
    title: "ဌာနစီမံခန့်ခွဲမှု",
    deptName: "ဌာနအမည်",
    manager: "မန်နေဂျာ",
    staffCount: "ဝန်ထမ်းအရေအတွက်",
    addDept: "ဌာနထည့်ပါ",
    updateDept: "ဌာနအဆင့်မြှင့်ပါ",
    edit: "ပြင်ဆင်ပါ",
    delete: "ဖျက်ပါ",
    confirmDelete: "ဤဌာနကိုဖျက်ရန်သေချာပါသလား",
    loginError: "ဤစာမျက်နှာသို့ဝင်ရောက်ရန် ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ။",
    fetchError: "ဒေတာဖွင့်ရန်မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ နောက်ကွယ်ဆာဗာလည်ပတ်နေသလား သို့မဟုတ် သင်၏လော့ဂ်အင်အထောက်အထားများကိုစစ်ဆေးပါ။",
    addError: "ဌာနထည့်ရန်မအောင်မြင်ပါ",
    updateError: "ဌာနအဆင့်မြှင့်ရန်မအောင်မြင်ပါ",
    deleteError: "ဌာနဖျက်ရန်မအောင်မြင်ပါ",
    requiredFields: "အားလုံးဖြည့်ရန်လိုအပ်ပြီး ဝန်ထမ်းအရေအတွက်သည် မှန်ကန်သောဂဏန်းဖြစ်ရမည်",
    searchPlaceholder: "အမည်၊ မန်နေဂျာ၊ သို့မဟုတ် ဝန်ထမ်းအရေအတွက်ဖြင့် ရှာဖွေပါ...",
    name: "အမည်",
    actions: "လုပ်ဆောင်ချက်များ",
    language: "ဘာသာစကား"
  },
  'pt-BR': {
    title: "Gerenciamento de Departamentos",
    deptName: "Nome do Departamento",
    manager: "Gerente",
    staffCount: "Contagem de Funcionários",
    addDept: "Adicionar Departamento",
    updateDept: "Atualizar Departamento",
    edit: "Editar",
    delete: "Excluir",
    confirmDelete: "Tem certeza de que deseja excluir",
    loginError: "Por favor, faça login para acessar esta página.",
    fetchError: "Falha ao carregar dados. Verifique se o servidor backend está em execução ou confira suas credenciais de login.",
    addError: "Falha ao adicionar departamento",
    updateError: "Falha ao atualizar departamento",
    deleteError: "Falha ao excluir departamento",
    requiredFields: "Todos os campos são obrigatórios, e a contagem de funcionários deve ser um número válido",
    searchPlaceholder: "Pesquisar por nome, gerente ou contagem de funcionários...",
    name: "Nome",
    actions: "Ações",
    language: "Idioma"
  },
  tl: {
    title: "Pamamahala ng Kagawaran",
    deptName: "Pangalan ng Kagawaran",
    manager: "Tagapamahala",
    staffCount: "Bilang ng Kawani",
    addDept: "Magdagdag ng Kagawaran",
    updateDept: "I-update ang Kagawaran",
    edit: "I-edit",
    delete: "Tanggalin",
    confirmDelete: "Sigurado ka bang gusto mong tanggalin",
    loginError: "Mangyaring mag-login upang ma-access ang pahinang ito.",
    fetchError: "Nabigo sa pag-load ng data. Siguraduhing tumatakbo ang backend server o suriin ang iyong mga kredensyal sa pag-login.",
    addError: "Nabigo sa pagdaragdag ng kagawaran",
    updateError: "Nabigo sa pag-update ng kagawaran",
    deleteError: "Nabigo sa pagtanggal ng kagawaran",
    requiredFields: "Lahat ng field ay kinakailangan, at ang bilang ng kawani ay dapat na wastong numero",
    searchPlaceholder: "Maghanap ayon sa pangalan, tagapamahala, o bilang ng kawani...",
    name: "Pangalan",
    actions: "Mga Aksyon",
    language: "Wika"
  },
  bn: {
    title: "বিভাগ ব্যবস্থাপনা",
    deptName: "বিভাগের নাম",
    manager: "পরিচালক",
    staffCount: "কর্মী সংখ্যা",
    addDept: "বিভাগ যোগ করুন",
    updateDept: "বিভাগ আপডেট করুন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    confirmDelete: "আপনি কি নিশ্চিত যে এই বিভাগটি মুছে ফেলতে চান",
    loginError: "এই পৃষ্ঠায় প্রবেশ করতে অনুগ্রহ করে লগইন করুন।",
    fetchError: "ডেটা লোড করতে ব্যর্থ। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে বা আপনার লগইন শংসাপত্র পরীক্ষা করুন।",
    addError: "বিভাগ যোগ করতে ব্যর্থ",
    updateError: "বিভাগ আপডেট করতে ব্যর্থ",
    deleteError: "বিভাগ মুছে ফেলতে ব্যর্থ",
    requiredFields: "সমস্ত ক্ষেত্র প্রয়োজন, এবং কর্মী সংখ্যা একটি বৈধ সংখ্যা হতে হবে",
    searchPlaceholder: "নাম, পরিচালক, বা কর্মী সংখ্যা দ্বারা অনুসন্ধান করুন...",
    name: "নাম",
    actions: "ক্রিয়াকলাপ",
    language: "ভাষা"
  },
  th: {
    title: "การจัดการแผนก",
    deptName: "ชื่อแผนก",
    manager: "ผู้จัดการ",
    staffCount: "จำนวนพนักงาน",
    addDept: "เพิ่มแผนก",
    updateDept: "อัปเดตแผนก",
    edit: "แก้ไข",
    delete: "ลบ",
    confirmDelete: "คุณแน่ใจหรือไม่ว่าต้องการลบ",
    loginError: "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้",
    fetchError: "ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ backend ทำงานอยู่หรือตรวจสอบข้อมูลการเข้าสู่ระบบของคุณ",
    addError: "ไม่สามารถเพิ่มแผนกได้",
    updateError: "ไม่สามารถอัปเดตแผนกได้",
    deleteError: "ไม่สามารถลบแผนกได้",
    requiredFields: "ต้องกรอกทุกช่อง และจำนวนพนักงานต้องเป็นตัวเลขที่ถูกต้อง",
    searchPlaceholder: "ค้นหาด้วยชื่อ ผู้จัดการ หรือจำนวนพนักงาน...",
    name: "ชื่อ",
    actions: "การดำเนินการ",
    language: "ภาษา"
  },
  vi: {
    title: "Quản lý Phòng Ban",
    deptName: "Tên Phòng Ban",
    manager: "Quản lý",
    staffCount: "Số Lượng Nhân Viên",
    addDept: "Thêm Phòng Ban",
    updateDept: "Cập nhật Phòng Ban",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    confirmDelete: "Bạn có chắc chắn muốn xóa",
    loginError: "Vui lòng đăng nhập để truy cập trang này.",
    fetchError: "Không thể tải dữ liệu. Vui lòng đảm bảo máy chủ backend đang chạy hoặc kiểm tra thông tin đăng nhập của bạn.",
    addError: "Không thể thêm phòng ban",
    updateError: "Không thể cập nhật phòng ban",
    deleteError: "Không thể xóa phòng ban",
    requiredFields: "Tất cả các trường đều bắt buộc, và số lượng nhân viên phải là một số hợp lệ",
    searchPlaceholder: "Tìm kiếm theo tên, quản lý hoặc số lượng nhân viên...",
    name: "Tên",
    actions: "Hành động",
    language: "Ngôn ngữ"
  },
  'pt-PT': {
    title: "Gestão de Departamentos",
    deptName: "Nome do Departamento",
    manager: "Gestor",
    staffCount: "Contagem de Funcionários",
    addDept: "Adicionar Departamento",
    updateDept: "Atualizar Departamento",
    edit: "Editar",
    delete: "Eliminar",
    confirmDelete: "Tem a certeza de que deseja eliminar",
    loginError: "Por favor, inicie sessão para aceder a esta página.",
    fetchError: "Falha ao carregar dados. Certifique-se de que o servidor backend está em execução ou verifique as suas credenciais de login.",
    addError: "Falha ao adicionar departamento",
    updateError: "Falha ao atualizar departamento",
    deleteError: "Falha ao eliminar departamento",
    requiredFields: "Todos os campos são obrigatórios, e a contagem de funcionários deve ser um número válido",
    searchPlaceholder: "Pesquisar por nome, gestor ou contagem de funcionários...",
    name: "Nome",
    actions: "Ações",
    language: "Idioma"
  }
};

function Department({ token }) {
  const [language, setLanguage] = useState('en');
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: '', manager: '', staff_count: '' });
  const [editingDept, setEditingDept] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load language preference from localStorage
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

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError(t('fetchError'));
      }
    };
    fetchDepartments();
  }, [token, language]);

  const handleAddDept = async (e) => {
    e.preventDefault();
    const staffCount = parseInt(newDept.staff_count);
    if (!newDept.name || !newDept.manager || isNaN(staffCount)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/departments/`, {
        ...newDept,
        staff_count: staffCount,
      });
      setDepartments([...departments, response.data]);
      setNewDept({ name: '', manager: '', staff_count: '' });
    } catch (error) {
      console.error('Error adding department:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setNewDept({
      name: dept.name,
      manager: dept.manager,
      staff_count: dept.staff_count.toString(),
    });
    setError('');
  };

  const handleUpdateDept = async (e) => {
    e.preventDefault();
    if (!editingDept) return;
    const staffCount = parseInt(newDept.staff_count);
    if (!newDept.name || !newDept.manager || isNaN(staffCount)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/departments/${editingDept.id}/`, {
        ...newDept,
        staff_count: staffCount,
      });
      setDepartments(departments.map(dept => dept.id === editingDept.id ? response.data : dept));
      setEditingDept(null);
      setNewDept({ name: '', manager: '', staff_count: '' });
    } catch (error) {
      console.error('Error updating department:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteDept = async (id, name) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${name || 'this department'}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/departments/${id}/`);
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (error) {
        console.error('Error deleting department:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      handleUpdateDept(e);
    } else {
      handleAddDept(e);
    }
  };

  const handleStaffCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setNewDept({ ...newDept, staff_count: value });
      setError('');
    } else {
      setError(t('requiredFields'));
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.staff_count.toString().includes(searchTerm)
  );

  if (!token) {
    return <p className="text-red-600">{t('loginError')}</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={t('deptName')}
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder={t('manager')}
            value={newDept.manager}
            onChange={(e) => setNewDept({ ...newDept, manager: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder={t('staffCount')}
            value={newDept.staff_count}
            onChange={handleStaffCountChange}
            className="p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingDept ? t('updateDept') : t('addDept')}
        </button>
      </form>
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
              <th className="p-2 text-left">{t('name')}</th>
              <th className="p-2 text-left">{t('manager')}</th>
              <th className="p-2 text-left">{t('staffCount')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="border-t">
                <td className="p-2">{dept.name}</td>
                <td className="p-2">{dept.manager}</td>
                <td className="p-2">{dept.staff_count}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditDept(dept)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteDept(dept.id, dept.name)}
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

export default Department;