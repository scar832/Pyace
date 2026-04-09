import React from 'react';
import { motion } from 'framer-motion';
import {
    Flame, Clock, BookOpen, CheckCircle,
    Award, MessageSquare, ChevronRight,
    FileText, Play, Terminal, MoreVertical
} from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Header: Welcome & Stats */}
            <header className="dashboard-header">
                <div className="welcome-section">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="welcome-text"
                    >
                        Welcome back, <span>Sedem</span> 👋
                    </motion.h1>
                    <p className="welcome-subtext">Ready to conquer Python today?</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="stats-container"
                >
                    <div className="stat-card">
                        <div className="stat-icon flame">
                            <Flame size={20} color='#6F5200' fill='#6F5200' />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">STREAK</span>
                            <span className="stat-value">12 Days</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon book">
                            <BookOpen size={20} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">COMPLETED</span>
                            <span className="stat-value">8 Modules</span>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Left Column: Main Progress & Content */}
                <div className="dashboard-main-col">

                    {/* Jump Back In */}
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Jump Back In</h2>
                            <button className="view-all-btn">View All <ChevronRight size={16} /></button>
                        </div>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="jump-back-card"
                        >
                            <div className="jump-back-icon">
                                <Terminal size={32} />
                            </div>
                            <div className="jump-back-info">
                                <h3>Data Structures: Dictionaries</h3>
                                <p>Module 4 • 65% Completed</p>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <button className="play-btn">
                                <Play size={20} fill="currentColor" />
                            </button>
                        </motion.div>
                    </section>

                    {/* Achievements */}
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Recent Achievements</h2>
                        </div>
                        <div className="achievements-grid">
                            {[
                                { title: "First Blood", desc: "Completed first module", icon: <Award size={24} />, color: "var(--color-primary)" },
                                { title: "Night Owl", desc: "Coded past midnight", icon: <CheckCircle size={24} />, color: "#8b5cf6" },
                                { title: "7-Day Streak", desc: "Consistently coded", icon: <Flame size={24} />, color: "#f59e0b" }
                            ].map((badge, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    className="achievement-card"
                                >
                                    <div className="achievement-icon" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>
                                        {badge.icon}
                                    </div>
                                    <h4>{badge.title}</h4>
                                    <p>{badge.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Reports */}
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Recent Reports</h2>
                        </div>
                        <div className="reports-list">
                            {[
                                { title: "Module 3 Assessment", score: "92%", date: "2 days ago", status: "excellent" },
                                { title: "Python Basics Quiz", score: "88%", date: "1 week ago", status: "good" }
                            ].map((report, idx) => (
                                <div key={idx} className="report-card">
                                    <div className="report-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="report-info">
                                        <h4>{report.title}</h4>
                                        <p>{report.date}</p>
                                    </div>
                                    <div className={`report-score ${report.status}`}>
                                        {report.score}
                                    </div>
                                    <button className="icon-btn"><MoreVertical size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Column: Sidebar Widgets */}
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

                    {/* To-Do List */}
                    <div className="widget todo-widget">
                        <div className="widget-header">
                            <h3>To-Do List</h3>
                            <button className="icon-btn"><MoreVertical size={16} /></button>
                        </div>
                        <div className="todo-list">
                            {[
                                { task: "Complete Dictionaries Lab", type: "Assignment", important: true },
                                { task: "Review OOP concepts", type: "Task", important: false },
                                { task: "Submit Project Proposal", type: "Assignment", important: true }
                            ].map((item, idx) => (
                                <div key={idx} className="todo-item">
                                    <div className="todo-checkbox"></div>
                                    <div className="todo-info">
                                        <h4>{item.task}</h4>
                                        <span className={`todo-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                                    </div>
                                    {item.important && <div className="important-dot"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Friends / Recent Chats */}
                    <div className="widget friends-widget">
                        <div className="widget-header">
                            <h3>Recent Chats</h3>
                            <button className="view-all-text">View All</button>
                        </div>
                        <div className="friends-list">
                            {[
                                { name: "Alice Johnson", status: "online", lastMsg: "Can you help with functions?" },
                                { name: "Bob Smith", status: "offline", lastMsg: "Awesome project!" },
                                { name: "Study Group A", status: "online", lastMsg: "Meeting at 5 PM" }
                            ].map((friend, idx) => (
                                <div key={idx} className="friend-item">
                                    <div className="friend-avatar">
                                        {friend.name.charAt(0)}
                                        <div className={`status-dot ${friend.status}`}></div>
                                    </div>
                                    <div className="friend-info">
                                        <h4>{friend.name}</h4>
                                        <p>{friend.lastMsg}</p>
                                    </div>
                                    <button className="chat-btn"><MessageSquare size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
