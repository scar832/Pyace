import React from 'react';
import { Award, CheckCircle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import './RecentAchievements.css';

const RecentAchievements = () => {
    const achievements = [
        { title: "First Blood", desc: "Completed first module", icon: <Award size={28} />, color: "var(--color-primary)", bg: "linear-gradient(135deg, #e0e7ff, #c7d2fe)" },
        { title: "Night Owl", desc: "Coded past midnight", icon: <CheckCircle size={28} />, color: "#8b5cf6", bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)" },
        { title: "7-Day Streak", desc: "Consistently coded", icon: <Flame size={28} />, color: "#f59e0b", bg: "linear-gradient(135deg, #fef3c7, #fde68a)" }
    ];

    return (
        <section className="dashboard-section">
            <div className="section-header">
                <h2>Recent Achievements</h2>
            </div>
            <div className="achievements-grid-modern">
                {achievements.map((badge, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="achievement-card-modern"
                    >
                        <div className="achievement-icon-wrapper" style={{ background: badge.bg, color: badge.color }}>
                            {badge.icon}
                        </div>
                        <div className="achievement-info">
                            <h4>{badge.title}</h4>
                            <p>{badge.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default RecentAchievements;
