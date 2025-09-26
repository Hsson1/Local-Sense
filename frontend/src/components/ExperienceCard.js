import React from 'react';
import { Link } from 'react-router-dom';

export default function ExperienceCard({ exp }) {
  const defaultImage = 'https://via.placeholder.com/400x200/667eea/ffffff?text=تجربة+محلية';
  
  return (
    <div className="experience-card">
      <img 
        src={exp.media?.[0] || defaultImage} 
        alt={exp.title}
        onError={(e) => {
          e.target.src = defaultImage;
        }}
      />
      <div className="experience-card-content">
        <h3>{exp.title || 'تجربة محلية'}</h3>
        <p>{exp.description ? `${exp.description.slice(0, 120)}...` : 'وصف التجربة غير متوفر.'}</p>
        <div className="experience-price">
          السعر: ${exp.price ? (exp.price / 100).toFixed(2) : '0.00'}
        </div>
        <Link to={`/experience/${exp._id}`} className="experience-link">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
