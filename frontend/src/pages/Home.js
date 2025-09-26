import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard';

export default function Home(){
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences`);
        setExps(response.data);
        setError(null);
      } catch (err) {
        setError('حدث خطأ في تحميل التجارب. يرجى المحاولة مرة أخرى.');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = exps.filter(exp =>
    exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">جارِ تحميل التجارب...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="search-section" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="ابحث عن التجارب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '1rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
            margin: '0 auto',
            display: 'block'
          }}
        />
      </div>

      {filteredExperiences.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          {searchQuery ? 'لا توجد تجارب تطابق البحث.' : 'لا توجد تجارب متاحة حالياً.'}
        </div>
      ) : (
        <div className="experiences-grid">
          {filteredExperiences.map(exp => (
            <ExperienceCard key={exp._id} exp={exp} />
          ))}
        </div>
      )}
    </div>
  );
}
