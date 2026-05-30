import React from 'react';
import { X, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import '../../Styles/utils.css';

const notifications = [
    { id: 1, type: 'success', title: 'Assignment Graded', message: 'You scored 92% on Python Basics Quiz.', time: '10m ago' },
    { id: 2, type: 'info', title: 'New Class Announcement', message: 'CS202 lecture times have slightly changed.', time: '1h ago' },
    { id: 3, type: 'warning', title: 'Deadline Approaching', message: 'Graph Algorithms assignment is due tomorrow.', time: '5h ago' },
];

const NotificationDrawer = ({ isOpen, onClose }) => {
    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`notification-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="drawer-title">
                        <Bell size={18} />
                        <h3>Notifications</h3>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="drawer-content">
                    {notifications.map(notif => (
                        <div key={notif.id} className="notification-item">
                            <div className={`notification-icon ${notif.type}`}>
                                {notif.type === 'success' && <CheckCircle size={16} />}
                                {notif.type === 'info' && <Info size={16} />}
                                {notif.type === 'warning' && <AlertTriangle size={16} />}
                            </div>
                            <div className="notification-details">
                                <h4>{notif.title}</h4>
                                <p>{notif.message}</p>
                                <span>{notif.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NotificationDrawer;
