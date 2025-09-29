import React, { useState, useRef, useEffect } from 'react';
import '../../assets/styles/ScrollSnapDatePicker.css';
import { updateBirthDate } from '../../services/auth';

const ScrollSnapDatePicker = ({ onDone, onBack }) => {
    const [selectedMonth, setSelectedMonth] = useState('Jun');
    const [selectedDay, setSelectedDay] = useState(17);
    const [selectedYear, setSelectedYear] = useState(1982);
    const [loading, setLoading] = useState(false);
  
    const monthRef = useRef(null);
    const dayRef = useRef(null);
    const yearRef = useRef(null);
  
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  
    useEffect(() => {
      // Set initial scroll positions
      const monthIndex = months.indexOf(selectedMonth);
      const dayIndex = days.indexOf(selectedDay);
      const yearIndex = years.indexOf(selectedYear);
  
      if (monthRef.current) {
        monthRef.current.scrollTop = monthIndex * 60;
      }
      if (dayRef.current) {
        dayRef.current.scrollTop = dayIndex * 60;
      }
      if (yearRef.current) {
        yearRef.current.scrollTop = yearIndex * 60;
      }
    }, []);
  
    const handleScroll = (ref, items, setter) => {
      const scrollTop = ref.current.scrollTop;
      const itemHeight = 60;
      const index = Math.round(scrollTop / itemHeight);
      const selectedIndex = Math.max(0, Math.min(index, items.length - 1));
      setter(items[selectedIndex]);
    };
  
    const handleSave = async () => {
      if (loading) return;
      
      const dateString = `${selectedMonth} ${selectedDay}, ${selectedYear}`;
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        if (!userId) {
          throw new Error('No user ID found');
        }
        
        console.log('Sending birth date update request:', { 
          birthDate: dateString, 
          userId: userId,
          url: `/admin/users/birth-date/${userId}`,
          token: token.substring(0, 20) + '...' 
        });
        
        await updateBirthDate(token, dateString);
        console.log("Birth date saved successfully:", dateString);
        
        if (onDone) onDone();
      } catch (err) {
        console.error('Failed to update birth date:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          response: err.response
        });
        alert('Failed to update birth date: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
     <div className="brith">
       <div className="date-picker-container">
        <div className="date-picker-header">
          <button className="back-button" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="step-indicator">2/2</span>
        </div>
  
        <h1 className="date-picker-title">What's your date of birth?</h1>
  
        <div className="date-picker-wrapper">
          <div className="date-picker-scrollers">
            {/* Month Picker */}
            <div className="date-picker-column">
              <div 
                className="date-picker-scroller"
                ref={monthRef}
                onScroll={() => handleScroll(monthRef, months, setSelectedMonth)}
              >
                <div className="spacer"></div>
                {months.map((month, index) => (
                  <div
                    key={index}
                    className={`date-picker-item ${month === selectedMonth ? 'selected' : ''}`}
                  >
                    {month}
                  </div>
                ))}
                <div className="spacer"></div>
              </div>
            </div>
  
            {/* Day Picker */}
            <div className="date-picker-column">
              <div 
                className="date-picker-scroller"
                ref={dayRef}
                onScroll={() => handleScroll(dayRef, days, setSelectedDay)}
              >
                <div className="spacer"></div>
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`date-picker-item ${day === selectedDay ? 'selected' : ''}`}
                  >
                    {day}
                  </div>
                ))}
                <div className="spacer"></div>
              </div>
            </div>
  
            {/* Year Picker */}
            <div className="date-picker-column">
              <div 
                className="date-picker-scroller"
                ref={yearRef}
                onScroll={() => handleScroll(yearRef, years, setSelectedYear)}
              >
                <div className="spacer"></div>
                {years.map((year, index) => (
                  <div
                    key={index}
                    className={`date-picker-item ${year === selectedYear ? 'selected' : ''}`}
                  >
                    {year}
                  </div>
                ))}
                <div className="spacer"></div>
              </div>
            </div>
          </div>
  
          {/* Selection Indicator */}
          <div className="selection-indicator"></div>
        </div>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <button className="save-button" onClick={handleSave} disabled={loading}>
      {loading ? 'Saving...' : 'Save'}
    </button>
  </div>
  
      </div>
     </div>
    );
  };
  
  export default ScrollSnapDatePicker;