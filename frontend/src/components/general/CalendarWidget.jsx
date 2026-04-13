import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarWidget.css';

const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const days = daysInMonth(month, year);
        const firstDay = firstDayOfMonth(month, year);
        
        const daysArray = [];
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];

        for (let i = 0; i < firstDay; i++) {
            daysArray.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        const today = new Date();
        for (let i = 1; i <= days; i++) {
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            daysArray.push(
                <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    {i}
                </div>
            );
        }

        return (
            <div className="calendar">
                <div className="calendar-header-nav">
                    <button className="icon-btn" onClick={() => setCurrentDate(new Date(year, month - 1))}><ChevronLeft size={18} /></button>
                    <h4>{monthNames[month]} {year}</h4>
                    <button className="icon-btn" onClick={() => setCurrentDate(new Date(year, month + 1))}><ChevronRight size={18} /></button>
                </div>
                <div className="calendar-grid-header">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="calendar-day-name">{day}</div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {daysArray}
                </div>
            </div>
        );
    };

    return (
        <div className="widget calendar-widget">
            {renderCalendar()}
        </div>
    );
};

export default CalendarWidget;
