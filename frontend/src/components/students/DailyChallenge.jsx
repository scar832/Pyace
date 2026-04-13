import React from 'react';
import { Target, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import './DailyChallenge.css';

const DailyChallenge = () => {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="widget daily-challenge-widget"
        >
            <div className="challenge-header">
                <div className="challenge-title">
                    <Target size={20} className="target-icon" />
                    <h3>Daily Challenge</h3>
                </div>
                <div className="points-badge">
                    <Zap size={14} fill="currentColor" />
                    <span>+50 XP</span>
                </div>
            </div>
            
            <div className="challenge-content">
                <h4>Reverse a String</h4>
                <p>Write a Python function that takes a string and returns it reversed without using built-in reverse functions.</p>
            </div>
            
            <div className="challenge-footer">
                <div className="difficulty">
                    <span className="dot easy"></span> Easy
                </div>
                <button className="solve-btn">
                    Solve Now <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default DailyChallenge;
