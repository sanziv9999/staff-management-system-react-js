import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

// Extended Translation dictionary with all requested languages
const translations = {
  en: { /* ... English translations remain same ... */ },
  ja: { /* ... Japanese translations remain same ... */ },
  ne: { /* ... Nepali translations remain same ... */ },
  hi: { /* ... Hindi translations remain same ... */ },
  my: { // Myanmar (Burmese)
    dashboardTitle: "ကျွန်ုပ်၏ ဒက်ရှ်ဘုတ်",
    markAttendance: "တက်ရောက်မှု မှတ်တမ်းတင်ပါ",
    date: "ရက်စွဲ",
    status: "အခြေအနေ",
    timeIn: "ဝင်ချိန်",
    timeOut: "ထွက်ချိန်",
    present: "ရှိနေသည်",
    absent: "မရှိပါ",
    leave: "ခွင့်ယူသည်",
    submit: "တင်ပြပါ",
    attendanceHistory: "ကျွန်ုပ်၏ တက်ရောက်မှု မှတ်တမ်း",
    noRecords: "တက်ရောက်မှု မှတ်တမ်းများ မတွေ့ပါ။",
    noScheduleRecords: "အချိန်ဇယား မှတ်တမ်းများ မတွေ့ပါ။",
    noSalaryRecords: "လစာ မှတ်တမ်းများ မတွေ့ပါ။",
    schedule: "ကျွန်ုပ်၏ အချိန်ဇယား",
    shift: "အလှည့်",
    location: "တည်နေရာ",
    salaryDetails: "ကျွန်ုပ်၏ လစာ အသေးစိတ်",
    paymentDate: "ပေးချေသည့်ရက်စွဲ",
    baseSalary: "အခြေခံလစာ",
    bonus: "ဘောနပ်စ်",
    deductions: "နုတ်ယူမှုများ",
    total: "စုစုပေါင်း",
    paid: "ပေးချေပြီး",
    pending: "ဆိုင်းငံ့ထားသည်",
    language: "ဘာသာစကား",
    staffIdNotFound: "ဝန်ထမ်း ID ကို ဒေသဆိုင်ရာ သိုလှောင်မှုတွင် မတွေ့ပါ။",
    fetchError: "ဒေတာရယူရန် မအောင်မြင်ပါ: ",
    markAttendanceError: "တက်ရောက်မှု မှတ်တမ်းတင်ရန် မအောင်မြင်ပါ: ",
    statusRequired: "အခြေအနေ လိုအပ်ပါသည်။"
  },
  pt: { // Portuguese (Brazil/Portugal)
    dashboardTitle: "Meu Painel",
    markAttendance: "Marcar Presença",
    date: "Data",
    status: "Estado",
    timeIn: "Hora de Entrada",
    timeOut: "Hora de Saída",
    present: "Presente",
    absent: "Ausente",
    leave: "Licença",
    submit: "Enviar",
    attendanceHistory: "Histórico de Presença",
    noRecords: "Nenhum registro de presença encontrado.",
    noScheduleRecords: "Nenhum registro de horário encontrado.",
    noSalaryRecords: "Nenhum registro de salário encontrado.",
    schedule: "Meu Horário",
    shift: "Turno",
    location: "Localização",
    salaryDetails: "Detalhes do Salário",
    paymentDate: "Data de Pagamento",
    baseSalary: "Salário Base",
    bonus: "Bônus",
    deductions: "Deduções",
    total: "Total",
    paid: "Pago",
    pending: "Pendente",
    language: "Idioma",
    staffIdNotFound: "ID do funcionário não encontrado no armazenamento local.",
    fetchError: "Falha ao buscar dados: ",
    markAttendanceError: "Falha ao marcar presença: ",
    statusRequired: "O estado é obrigatório."
  },
  tl: { // Tagalog (Filipino)
    dashboardTitle: "Aking Dashboard",
    markAttendance: "Markahan ang Pagdalo",
    date: "Petsa",
    status: "Katayuan",
    timeIn: "Oras ng Pagpasok",
    timeOut: "Oras ng Paglabas",
    present: "Narito",
    absent: "Wala",
    leave: "Bakasyon",
    submit: "Isumite",
    attendanceHistory: "Kasaysayan ng Aking Pagdalo",
    noRecords: "Walang natagpuang rekord ng pagdalo.",
    noScheduleRecords: "Walang natagpuang rekord ng iskedyul.",
    noSalaryRecords: "Walang natagpuang rekord ng sahod.",
    schedule: "Aking Iskedyul",
    shift: "Shift",
    location: "Lokasyon",
    salaryDetails: "Detalye ng Aking Sahod",
    paymentDate: "Petsa ng Bayad",
    baseSalary: "Batayang Sahod",
    bonus: "Bonus",
    deductions: "Mga Bawas",
    total: "Kabuuan",
    paid: "Bayad",
    pending: "Nakabinbin",
    language: "Wika",
    staffIdNotFound: "Hindi natagpuan ang Staff ID sa local storage.",
    fetchError: "Nabigo sa pagkuha ng data: ",
    markAttendanceError: "Nabigo sa pagmamarka ng pagdalo: ",
    statusRequired: "Kailangan ang katayuan."
  },
  bn: { // Bengali
    dashboardTitle: "আমার ড্যাশবোর্ড",
    markAttendance: "উপস্থিতি চিহ্নিত করুন",
    date: "তারিখ",
    status: "অবস্থা",
    timeIn: "প্রবেশের সময়",
    timeOut: "বের হওয়ার সময়",
    present: "উপস্থিত",
    absent: "অনুপস্থিত",
    leave: "ছুটি",
    submit: "জমা দিন",
    attendanceHistory: "আমার উপস্থিতি ইতিহাস",
    noRecords: "কোনো উপস্থিতি রেকর্ড পাওয়া যায়নি।",
    noScheduleRecords: "কোনো সময়সূচী রেকর্ড পাওয়া যায়নি।",
    noSalaryRecords: "কোনো বেতন রেকর্ড পাওয়া যায়নি।",
    schedule: "আমার সময়সূচী",
    shift: "শিফট",
    location: "অবস্থান",
    salaryDetails: "আমার বেতনের বিবরণ",
    paymentDate: "প্রদানের তারিখ",
    baseSalary: "মূল বেতন",
    bonus: "বোনাস",
    deductions: "কর্তন",
    total: "মোট",
    paid: "প্রদত্ত",
    pending: "মুলতুবি",
    language: "ভাষা",
    staffIdNotFound: "স্থানীয় স্টোরেজে কর্মচারী আইডি পাওয়া যায়নি।",
    fetchError: "ডেটা আনতে ব্যর্থ: ",
    markAttendanceError: "উপস্থিতি চিহ্নিত করতে ব্যর্থ: ",
    statusRequired: "অবস্থা প্রয়োজন।"
  },
  th: { // Thai
    dashboardTitle: "แดชบอร์ดของฉัน",
    markAttendance: "บันทึกการเข้างาน",
    date: "วันที่",
    status: "สถานะ",
    timeIn: "เวลาเข้า",
    timeOut: "เวลาออก",
    present: "มาทำงาน",
    absent: "ขาดงาน",
    leave: "ลางาน",
    submit: "ส่ง",
    attendanceHistory: "ประวัติการเข้างานของฉัน",
    noRecords: "ไม่พบประวัติการเข้างาน",
    noScheduleRecords: "ไม่พบประวัติตารางงาน",
    noSalaryRecords: "ไม่พบประวัติเงินเดือน",
    schedule: "ตารางงานของฉัน",
    shift: "กะ",
    location: "สถานที่",
    salaryDetails: "รายละเอียดเงินเดือนของฉัน",
    paymentDate: "วันที่จ่าย",
    baseSalary: "เงินเดือนพื้นฐาน",
    bonus: "โบนัส",
    deductions: "การหัก",
    total: "รวม",
    paid: "จ่ายแล้ว",
    pending: "รอดำเนินการ",
    language: "ภาษา",
    staffIdNotFound: "ไม่พบรหัสพนักงานในที่เก็บข้อมูลท้องถิ่น",
    fetchError: "ไม่สามารถดึงข้อมูลได้: ",
    markAttendanceError: "ไม่สามารถบันทึกการเข้างานได้: ",
    statusRequired: "ต้องระบุสถานะ"
  },
  vi: { // Vietnamese
    dashboardTitle: "Bảng Điều Khiển Của Tôi",
    markAttendance: "Đánh Dấu Điểm Danh",
    date: "Ngày",
    status: "Trạng Thái",
    timeIn: "Giờ Vào",
    timeOut: "Giờ Ra",
    present: "Có Mặt",
    absent: "Vắng Mặt",
    leave: "Nghỉ Phép",
    submit: "Gửi",
    attendanceHistory: "Lịch Sử Điểm Danh Của Tôi",
    noRecords: "Không tìm thấy bản ghi điểm danh.",
    noScheduleRecords: "Không tìm thấy bản ghi lịch làm việc.",
    noSalaryRecords: "Không tìm thấy bản ghi lương.",
    schedule: "Lịch Làm Việc Của Tôi",
    shift: "Ca Làm",
    location: "Vị Trí",
    salaryDetails: "Chi Tiết Lương Của Tôi",
    paymentDate: "Ngày Thanh Toán",
    baseSalary: "Lương Cơ Bản",
    bonus: "Thưởng",
    deductions: "Khấu Trừ",
    total: "Tổng",
    paid: "Đã Thanh Toán",
    pending: "Đang Chờ",
    language: "Ngôn Ngữ",
    staffIdNotFound: "Không tìm thấy ID nhân viên trong bộ nhớ cục bộ.",
    fetchError: "Không thể lấy dữ liệu: ",
    markAttendanceError: "Không thể đánh dấu điểm danh: ",
    statusRequired: "Trạng thái là bắt buộc."
  }
};

function UserDashboard({ token, isStaff }) {
  const [language, setLanguage] = useState('en');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [scheduleRecords, setScheduleRecords] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    date: new Date(),
    status: 'Present',
    time_in: '',
    time_out: '',
  });
  const [currency, setCurrency] = useState('$');
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    const fetchData = async () => {
      if (!token) {
        setFetchError('No authentication token provided');
        return;
      }

      const staffId = localStorage.getItem('staff_id');
      if (!staffId) {
        setFetchError(t('staffIdNotFound'));
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const [settingsResponse, attendanceResponse, salaryResponse, scheduleResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/settings/1/`),
          axios.get(`${API_BASE_URL}/attendance/`, { params: { staff_id: staffId } }),
          axios.get(`${API_BASE_URL}/salaries/`, { params: { staff_id: staffId } }),
          axios.get(`${API_BASE_URL}/schedules/`, { params: { staff_id: staffId } }),
        ]);
        
        const currencySymbol = settingsResponse.data.currency?.split('-')[1] || '$';
        setCurrency(currencySymbol);

        setAttendanceRecords(attendanceResponse.data || []);
        setSalaryRecords(salaryResponse.data || []);
        const sortedSchedules = (scheduleResponse.data || []).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        setScheduleRecords(sortedSchedules);
        setFetchError('');
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setFetchError(
          t('fetchError') + (error.response?.data?.detail || error.response?.data?.message || error.message)
        );
      }
    };
    fetchData();
  }, [language, token]);

  const t = (key) => translations[language][key] || key;

  const getTodayClass = (recordDate) => {
    const today = new Date();
    const recordDateObj = new Date(recordDate);
    return recordDateObj.toDateString() === today.toDateString()
      ? 'bg-blue-100 text-blue-800 font-semibold'
      : 'opacity-60';
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.status) {
      setError(t('statusRequired'));
      return;
    }
    setError('');
    const staffId = localStorage.getItem('staff_id');
    if (!staffId) {
      setError(t('staffIdNotFound'));
      return;
    }
    if (!token) {
      setError('No authentication token provided');
      return;
    }

    const payload = {
      staff_id: parseInt(staffId),
      date: newAttendance.date.toISOString().split('T')[0],
      status: newAttendance.status,
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ date: new Date(), status: 'Present', time_in: '', time_out: '' });
      setFetchError('');
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      setError(t('markAttendanceError') + errorMsg);
    }
  };

  const isTimeInputVisible = newAttendance.status === 'Present';

  const getAttendanceStatusClass = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSalaryStatusClass = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <div className="relative">
          <span className="mr-2">{t('language')}:</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 border rounded bg-white"
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

      <h2 className="text-2xl font-bold mb-4">{t('dashboardTitle')}</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{t('markAttendance')}</h3>
        <form onSubmit={handleMarkAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DatePicker
            selected={newAttendance.date}
            onChange={(date) => setNewAttendance({ ...newAttendance, date: date || new Date() })}
            className="p-2 border rounded w-full"
            dateFormat="yyyy-MM-dd"
          />
          <select
            value={newAttendance.status}
            onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
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
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {t('submit')}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Rest of the component remains the same */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{t('attendanceHistory')}</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {attendanceRecords.length === 0 ? (
          <p className="text-gray-600">{t('noRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">{t('date')}</th>
                  <th className="p-2 text-left">{t('status')}</th>
                  <th className="p-2 text-left">{t('timeIn')}</th>
                  <th className="p-2 text-left">{t('timeOut')}</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr 
                    key={record.id} 
                    className={`border-t ${getTodayClass(record.date)}`}
                  >
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getAttendanceStatusClass(record.status)}`}
                      >
                        {t(record.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="p-2">{record.time_in || 'N/A'}</td>
                    <td className="p-2">{record.time_out || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{t('schedule')}</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {scheduleRecords.length === 0 ? (
          <p className="text-gray-600">{t('noScheduleRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">{t('date')}</th>
                  <th className="p-2 text-left">{t('shift')}</th>
                  <th className="p-2 text-left">{t('location')}</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRecords.map((record) => (
                  <tr 
                    key={record.id} 
                    className={`border-t ${getTodayClass(record.date)}`}
                  >
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">{record.shift}</td>
                    <td className="p-2">{record.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">{t('salaryDetails')}</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {salaryRecords.length === 0 ? (
          <p className="text-gray-600">{t('noSalaryRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">{t('paymentDate')}</th>
                  <th className="p-2 text-left">{t('baseSalary')}</th>
                  <th className="p-2 text-left">{t('bonus')}</th>
                  <th className="p-2 text-left">{t('deductions')}</th>
                  <th className="p-2 text-left">{t('total')}</th>
                  <th className="p-2 text-left">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="p-2">{record.payment_date}</td>
                    <td className="p-2">{currency}{parseFloat(record.base_salary || 0).toFixed(2)}</td>
                    <td className="p-2">{currency}{parseFloat(record.bonus || 0).toFixed(2)}</td>
                    <td className="p-2">{currency}{parseFloat(record.deductions || 0).toFixed(2)}</td>
                    <td className="p-2">
                      {currency}{(parseFloat(record.base_salary || 0) + parseFloat(record.bonus || 0) - parseFloat(record.deductions || 0)).toFixed(2)}
                    </td>
                    <td className="p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getSalaryStatusClass(record.status)}`}
                      >
                        {t(record.status.toLowerCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;