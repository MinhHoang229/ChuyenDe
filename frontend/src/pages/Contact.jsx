import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    alert('Đã gửi liên hệ thành công!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white  py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, hãy liên hệ với chúng tôi qua biểu mẫu dưới đây.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Thông tin liên hệ */}
        <div className="space-y-6 text-gray-700">
          <div className="flex items-start gap-4">
            <MapPin className="text-indigo-600" size={24} />
            <div>
              <h4 className="font-semibold">Địa chỉ</h4>
              <p>123 Đường Mẫu, Quận 1, TP.HCM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-indigo-600" size={24} />
            <div>
              <h4 className="font-semibold">Số điện thoại</h4>
              <p>+84 123 456 789</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="text-indigo-600" size={24} />
            <div>
              <h4 className="font-semibold">Email</h4>
              <p>support@example.com</p>
            </div>
          </div>
        </div>

        {/* Form liên hệ */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Lời nhắn"
            value={form.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 justify-center"
          >
            <Send size={18} /> Gửi liên hệ
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
