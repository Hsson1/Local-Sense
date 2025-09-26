import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ExperiencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState(null);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const defaultImage = 'https://via.placeholder.com/800x400/667eea/ffffff?text=تجربة+محلية';

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences/${id}`);
        setExp(response.data);
        setError(null);
      } catch (err) {
        setError('حدث خطأ في تحميل التجربة. يرجى المحاولة مرة أخرى.');
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id]);

  const handleBook = async () => {
    if (!date) {
      alert('يرجى اختيار تاريخ للحجز');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('يرجى تسجيل الدخول أولاً');
      // يمكن إضافة توجيه لصفحة تسجيل الدخول هنا
      return;
    }

    try {
      setBookingLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings/create-checkout-session`,
        { experienceId: id, date, guests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.url) {
        window.location.href = response.data.url; // redirect to stripe checkout
      } else {
        throw new Error('لم يتم الحصول على رابط الدفع');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('حدث خطأ في إنشاء الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">جارِ تحميل التجربة...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => navigate('/')} style={{ marginLeft: '1rem' }}>
          العودة للرئيسية
        </button>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="error">
        التجربة غير موجودة
        <button onClick={() => navigate('/')} style={{ marginLeft: '1rem' }}>
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const totalPrice = (exp.price * guests) / 100;

  return (
    <div className="experience-page fade-in">
      <img 
        src={exp.media?.[0] || defaultImage} 
        alt={exp.title}
        onError={(e) => {
          e.target.src = defaultImage;
        }}
      />
      
      <div className="experience-details">
        <h2>{exp.title}</h2>
        <p>{exp.description}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <strong>السعر للشخص الواحد:</strong> ${(exp.price / 100).toFixed(2)}
          </div>
          <div>
            <strong>القدرة الاستيعابية:</strong> {exp.capacity} أشخاص
          </div>
        </div>

        {exp.host && (
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4>معلومات المضيف</h4>
            <p><strong>الاسم:</strong> {exp.host.name}</p>
            {exp.host.bio && <p><strong>النبذة:</strong> {exp.host.bio}</p>}
            {exp.host.verifiedHost && (
              <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ مضيف موثق</span>
            )}
          </div>
        )}

        <div className="booking-form">
          <h3>احجز هذه التجربة</h3>
          
          <div className="form-group">
            <label htmlFor="date">تاريخ التجربة:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="guests">عدد الأشخاص:</label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Math.min(exp.capacity, parseInt(e.target.value) || 1)))}
              min="1"
              max={exp.capacity}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            المجموع: ${totalPrice.toFixed(2)}
          </div>

          <button 
            className="book-button" 
            onClick={handleBook}
            disabled={bookingLoading || !date}
          >
            {bookingLoading ? 'جارِ المعالجة...' : 'احجز الآن'}
          </button>
        </div>
      </div>
    </div>
  );
}
