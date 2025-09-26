import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HostDashboard() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newExperience, setNewExperience] = useState({
    title: '',
    description: '',
    price: '',
    capacity: 1,
    media: '',
    location: { coordinates: [0, 0] }
  });

  useEffect(() => {
    const fetchHostExperiences = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('يرجى تسجيل الدخول أولاً');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Since we don't have a specific host endpoint, we'll fetch all experiences
        // In a real app, you'd have an endpoint like /api/experiences/host
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences`);
        setExperiences(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('حدث خطأ في تحميل التجارب');
      } finally {
        setLoading(false);
      }
    };

    fetchHostExperiences();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateExperience = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (!newExperience.title || !newExperience.description || !newExperience.price) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const mediaArray = newExperience.media ? newExperience.media.split(',').map(url => url.trim()).filter(url => url) : [];
      
      const experienceData = {
        ...newExperience,
        price: parseFloat(newExperience.price) * 100, // Convert to cents
        media: mediaArray,
        capacity: parseInt(newExperience.capacity) || 1
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences`,
        experienceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExperiences(prev => [...prev, response.data]);
      setNewExperience({
        title: '',
        description: '',
        price: '',
        capacity: 1,
        media: '',
        location: { coordinates: [0, 0] }
      });
      setSuccess('تم إنشاء التجربة بنجاح!');
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error creating experience:', error);
      setError('حدث خطأ في إنشاء التجربة. يرجى المحاولة مرة أخرى.');
      setSuccess(null);
    }
  };

  return (
    <div className="host-dashboard fade-in">
      <div className="dashboard-section">
        <h2>إنشاء تجربة جديدة</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleCreateExperience}>
          <div className="form-row">
            <input
              type="text"
              name="title"
              placeholder="عنوان التجربة *"
              value={newExperience.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="السعر (بالدولار) *"
              value={newExperience.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-row">
            <textarea
              name="description"
              placeholder="وصف التجربة *"
              value={newExperience.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="capacity"
              placeholder="القدرة الاستيعابية"
              value={newExperience.capacity}
              onChange={handleInputChange}
              min="1"
              required
            />
            <input
              type="text"
              name="media"
              placeholder="روابط الصور (مفصولة بفاصلة)"
              value={newExperience.media}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="create-button">
            إنشاء تجربة
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>التجارب الحالية</h2>
        
        {loading ? (
          <div className="loading">جارِ تحميل التجارب...</div>
        ) : experiences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            لا توجد تجارب حالية. ابدأ بإنشاء تجربتك الأولى!
          </div>
        ) : (
          <ul className="experience-list">
            {experiences.map(exp => (
              <li key={exp._id}>
                <h3>{exp.title}</h3>
                <p>{exp.description}</p>
                <p><strong>السعر:</strong> ${(exp.price / 100).toFixed(2)} للشخص الواحد</p>
                <p><strong>القدرة الاستيعابية:</strong> {exp.capacity} أشخاص</p>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(exp.createdAt).toLocaleDateString('ar-SA')}</p>
                {exp.media && exp.media.length > 0 && (
                  <p><strong>عدد الصور:</strong> {exp.media.length}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
