import React from 'react'
import { Search, Bell, Zap } from 'lucide-react';
import '../Styles/TopNav.css';

const TopNav = () => {
    return (
        <div className="top-nav">
            <div className="nav-left">
                <ul>
                    <li><a href="#">Resources</a></li>
                    <li><a href="#">Support</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </div>
            <div className="nav-right">
                <div className="search-bar">
                    <Search size={16} color='var(--color-text-muted)' />
                    <input type="text" placeholder="search courses..." />
                </div>
                <button className="icon-btn"><Bell size={20} fill='var(--color-text-muted)' /></button>
                <button className="icon-btn"><Zap size={20} fill='var(--color-text-muted)' /></button>
                <div className="user-info">
                    <button className='upgrade-btn'>Upgrade to Pro</button>
                </div>
            </div>
        </div>
    )
}

export default TopNav