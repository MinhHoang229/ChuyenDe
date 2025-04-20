import React from 'react';
import { Users2, Briefcase, BookOpenText } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b  to-white py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">Về chúng tôi</h1>
        <p className="text-gray-600 text-lg md:text-xl mb-12">
          Chúng tôi là một đội ngũ đam mê công nghệ, luôn hướng tới việc tạo ra những trải nghiệm mua sắm tuyệt vời nhất cho người dùng.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {/* Đội ngũ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div className="flex justify-center mb-4 text-indigo-600">
            <Users2 size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Đội ngũ tận tâm</h3>
          <p className="text-gray-600 text-sm">
            Với những con người đầy sáng tạo và trách nhiệm, chúng tôi luôn đặt khách hàng là trọng tâm.
          </p>
        </div>

        {/* Sứ mệnh */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div className="flex justify-center mb-4 text-indigo-600">
            <Briefcase size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Sứ mệnh rõ ràng</h3>
          <p className="text-gray-600 text-sm">
            Mang đến sự tiện lợi, nhanh chóng và tin cậy trong từng đơn hàng của bạn.
          </p>
        </div>

        {/* Câu chuyện */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div className="flex justify-center mb-4 text-indigo-600">
            <BookOpenText size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Câu chuyện phát triển</h3>
          <p className="text-gray-600 text-sm">
            Từ một ý tưởng nhỏ đến một nền tảng mua sắm đáng tin cậy – chúng tôi luôn không ngừng nỗ lực và đổi mới.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
