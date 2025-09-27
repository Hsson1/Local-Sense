import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
// import { useTranslation } from 'next-i18next'; // افتراض استخدام مكتبة next-i18next

// وظيفة وهمية للترجمة، في التطبيق الحقيقي ستأتي من مكتبة الترجمة
const useTranslation = () => {
  const t = (key) => {
    const translations = {
      'dashboard.title': 'مساحتي في وعي',
      'dashboard.slogan': '"النمو ليس وجهة، بل رحلة."',
      'wellbeing.physical': 'جسدي',
      'wellbeing.mental': 'عقلي',
      'wellbeing.emotional': 'عاطفي',
      'wellbeing.intellectual': 'فكري',
      'wellbeing.social': 'اجتماعي',
      'ai_companion.recommendations_title': 'توصيات الرفيق الذكي',
      'ai_companion.recommendation_text': 'مرحباً بك! يبدو أنك قضيت يومًا مليئًا بالنشاط. تذكر أن تخصيص وقت للاسترخاء الذهني مهم بقدر النشاط البدني. لماذا لا تجرب تمرين تأمل قصير لمدة 5 دقائق اليوم؟ يمكن أن يساعدك على إعادة شحن طاقتك.',
      'ai_companion.start_meditation_button': 'ابدأ التأمل الآن',
      'footer.copyright': '© 2025 وعي. جميع الحقوق محفوظة.',
      'alert.card_clicked': 'تم النقر على بطاقة: {{title}}',
    };
    return translations[key] || key;
  };
  return { t };
};

// مكون بطاقة الرفاهية (مثال)
const WellbeingCard = ({ title, value, icon, onClick, color }) => (
  <motion.div
    className={`p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center cursor-pointer ${color} text-white`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm">{value}</p>
  </motion.div>
);

// صفحة لوحة التحكم الرئيسية (Home Dashboard)
const HomeDashboard = () => {
  const { t } = useTranslation();

  // بيانات وهمية للرفاهية
  const wellbeingData = [
    { id: 1, title: t('wellbeing.physical'), value: 'نشيط', icon: '💪', color: 'bg-green-500' },
    { id: 2, title: t('wellbeing.mental'), value: 'متوازن', icon: '🧠', color: 'bg-blue-500' },
    { id: 3, title: t('wellbeing.emotional'), value: 'سعيد', icon: '😊', color: 'bg-yellow-500' },
    { id: 4, title: t('wellbeing.intellectual'), value: 'متحفز', icon: '💡', color: 'bg-purple-500' },
    { id: 5, title: t('wellbeing.social'), value: 'متواصل', icon: '🤝', color: 'bg-red-500' },
  ];

  const handleCardClick = (card) => {
    alert(t('alert.card_clicked', { title: card.title }));
    // هنا يمكن إضافة منطق للانتقال إلى صفحة تفاصيل البعد المحدد
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Head>
        <title>{t('dashboard.title')}</title>
        <meta name="description" content="رفيقك الشامل للنمو الشخصي المستدام" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{t('dashboard.title').split(' ')[0]} في <span className="text-indigo-600">{t('dashboard.title').split(' ')[2]}</span></h1>
          <p className="text-xl text-gray-600">{t('dashboard.slogan')}</p>
        </motion.header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {wellbeingData.map((card) => (
            <WellbeingCard key={card.id} {...card} onClick={() => handleCardClick(card)} />
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('ai_companion.recommendations_title')}</h2>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-5xl">✨</div>
            <div>
              <p className="text-gray-700 text-lg mb-4">
                {t('ai_companion.recommendation_text')}
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out">
                {t('ai_companion.start_meditation_button')}
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default HomeDashboard;

