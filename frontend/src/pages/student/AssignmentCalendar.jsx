import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import '../../Styles/assignments.css';

// Native Date helpers
const getWeekDays = (baseDate) => {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  const days = [];
  for(let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

const getMonthDays = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  // previous month padding
  for(let i = 0; i < firstDay.getDay(); i++) {
    days.push(new Date(year, month, -firstDay.getDay() + i + 1));
  }
  // current month
  for(let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  // next month padding
  const paddingEnd = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  for(let i = 1; i <= paddingEnd; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
};

const isSameDay = (d1, d2) => {
  return d1 && d2 &&
         d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
};

const AssignmentCalendar = ({ assignments, selectedDate, onSelectDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [baseDate, setBaseDate] = useState(new Date());

  const today = new Date();

  const hasAssignment = (d) => {
    return assignments.some(a => {
      const aDate = new Date(a.dueDate);
      return aDate.getDate() === d.getDate() && 
             aDate.getMonth() === d.getMonth() && 
             aDate.getFullYear() === d.getFullYear();
    });
  };

  const daysToRender = isExpanded ? getMonthDays(baseDate) : getWeekDays(baseDate);

  const prevMonth = () => {
    setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-title">
          <CalendarIcon size={18} />
          {isExpanded ? `${monthNames[baseDate.getMonth()]} ${baseDate.getFullYear()}` : "This Week"}
        </div>
        <div className="calendar-actions">
           {isExpanded && (
             <div className="calendar-nav">
               <button onClick={prevMonth}>&lt;</button>
               <button onClick={nextMonth}>&gt;</button>
             </div>
           )}
           <button 
             className="calendar-toggle" 
             onClick={() => { 
               setIsExpanded(!isExpanded); 
               // Only reset baseDate to today when collapsing, otherwise maintain state
               if(isExpanded) setBaseDate(new Date()); 
             }}
           >
             {isExpanded ? <><ChevronUp size={16}/> Collapse</> : <><ChevronDown size={16}/> Expand</>}
           </button>
        </div>
      </div>

      <div className="week-day-headers">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className={`calendar-grid ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {daysToRender.map((d, i) => {
           const isToday = isSameDay(d, today);
           const isSelected = isSameDay(d, selectedDate);
           const isCurrentMonth = d.getMonth() === baseDate.getMonth();
           const hasAssig = hasAssignment(d);

           return (
             <div 
               key={i} 
               onClick={() => onSelectDate(d)}
               className={`calendar-day 
                           ${!isCurrentMonth && isExpanded ? 'other-month' : ''} 
                           ${isToday ? 'today' : ''} 
                           ${isSelected ? 'selected' : ''}`}
             >
               <span className="day-number">{d.getDate()}</span>
               {hasAssig && <span className="assignment-dot"></span>}
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default AssignmentCalendar;
