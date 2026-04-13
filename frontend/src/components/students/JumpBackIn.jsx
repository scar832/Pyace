import React from 'react';
import { Play, Terminal, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './JumpBackIn.css';
import pythonImage from '../../assets/image copy.png';

const JumpBackIn = () => {
    return (
        <section className="dashboard-section jump-back-section">
            <div className="section-header">
                <h2>Jump Back In</h2>
                <button className="view-all-btn">View All <ChevronRight size={16} /></button>
            </div>
            <motion.div
                whileHover={{ y: -4 }}
                className="jump-back-card-vertical"
            >
                <div className="jump-back-image-wrapper">
                    <img
                        src={pythonImage}
                        alt="Python Programming"
                        className="jump-back-img"
                    />
                    <div className="jump-back-overlay">
                        <Terminal size={32} color="white" />
                    </div>
                </div>

                <div className="jump-back-content-vertical">
                    <div className="jump-back-info-left">
                        <span className="course-tag">Data Structures</span>
                        <h3>Dictionaries in Depth</h3>
                        <p className="course-desc">Master key-value pairs, nested dictionaries, and advanced methods for data manipulation in Python.</p>
                    </div>

                    <div className="jump-back-progress-right">
                        <p className="progress-text">Module 4 • <strong>65%</strong> Completed</p>
                        <div className="progress-bar-modern">
                            <div className="progress-fill-modern" style={{ width: '65%' }}></div>
                        </div>
                        <button className="play-btn-modern">
                            Continue <Play size={16} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default JumpBackIn;
