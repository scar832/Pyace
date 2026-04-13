import React from 'react';
import { motion } from 'framer-motion';
import { Flame, BookOpen, FileText, MoreVertical } from 'lucide-react';

// General components (shared across student & instructor)
import CalendarWidget from '../../components/general/CalendarWidget';
import TodoList from '../../components/general/TodoList';
import RecentChats from '../../components/general/RecentChats';

// Student-specific components
import JumpBackIn from '../../components/students/JumpBackIn';
import RecentAchievements from '../../components/students/RecentAchievements';
import DailyChallenge from '../../components/students/DailyChallenge';

const todoItems = [
    { task: 'Complete Dictionaries Lab', type: 'Assignment', important: true, completed: false },
    { task: 'Review OOP concepts', type: 'Task', important: false, completed: true },
    { task: 'Submit Project Proposal', type: 'Assignment', important: true, completed: false },
];

const chatData = [
    { name: 'Alice Johnson', status: 'online', lastMsg: 'Can you help with functions?', time: '2m' },
    { name: 'Bob Smith', status: 'offline', lastMsg: 'Awesome project!', time: '1h' },
];

const reports = [
    { title: 'Module 3 Assessment', score: '92%', date: '2 days ago', status: 'excellent' },
    { title: 'Python Basics Quiz', score: '88%', date: '1 week ago', status: 'good' },
];

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* ── Header ── */}
            <header className="dashboard-header">
                <div className="welcome-section">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="welcome-text"
                    >
                        Welcome back, <span>Sedem</span> 👋
                    </motion.h1>
                    <p className="welcome-subtext">Ready to conquer Python today? Keep the momentum going!</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="stats-container"
                >
                    <div className="stat-card">
                        <div className="stat-icon flame">
                            <Flame size={18} color="#6F5200" fill="#6F5200" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">STREAK</span>
                            <span className="stat-value">12 Days</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon book">
                            <BookOpen size={18} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">COMPLETED</span>
                            <span className="stat-value">8 Modules</span>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* ── Main Grid ── */}
            <div className="dashboard-grid">

                {/* Left: Main content */}
                <div className="dashboard-main-col">

                    {/* Jump Back In — vertical card with image */}
                    <JumpBackIn />

                    <div className="middle">
                        {/* Daily Challenge — my idea: a daily bite-sized problem */}
                        <DailyChallenge />

                        {/* Recent Chats */}
                        <RecentChats chats={chatData} />
                    </div>

                    {/* Recent Achievements */}
                    <RecentAchievements />

                    {/* Recent Reports */}
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Recent Reports</h2>
                        </div>
                        <div className="reports-list">
                            {reports.map((report, idx) => (
                                <div key={idx} className="report-card">
                                    <div className="report-icon">
                                        <FileText size={18} />
                                    </div>
                                    <div className="report-info">
                                        <h4>{report.title}</h4>
                                        <p>{report.date}</p>
                                    </div>
                                    <div className={`report-score ${report.status}`}>
                                        {report.score}
                                    </div>
                                    <button className="icon-btn"><MoreVertical size={15} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Sidebar widgets */}
                <div className="dashboard-sidebar-col">

                    {/* Programming Quote */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="quote-widget"
                    >
                        <div className="quote-mark">"</div>
                        <p className="quote-text">Talk is cheap. Show me the code.</p>
                        <p className="quote-author">— Linus Torvalds</p>
                    </motion.div>

                    {/* Calendar widget — above To-Do */}
                    <CalendarWidget />

                    {/* To-Do List */}
                    <TodoList items={todoItems} />

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
