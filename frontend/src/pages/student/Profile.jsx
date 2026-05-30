import { User, Mail, GraduationCap, MapPin, Activity } from 'lucide-react';
import '../../Styles/utils.css';

const Profile = () => {
    return (
        <div className="utils-page-container">
            <div className="utils-header">
                <h1>My Profile</h1>
                <p>Manage your public details and view recent activity.</p>
            </div>

            <div className="profile-grid">
                <div className="profile-card profile-main">
                    <div className="profile-avatar-large">
                        JS
                    </div>
                    <h2 className="profile-name">John Smith</h2>
                    <p className="profile-tag">Computer Science Major</p>

                    <div className="profile-details-list">
                        <div className="profile-detail-item">
                            <Mail size={16} />
                            <span>john.smith@university.edu</span>
                        </div>
                        <div className="profile-detail-item">
                            <GraduationCap size={16} />
                            <span>Class of 2028</span>
                        </div>
                        <div className="profile-detail-item">
                            <MapPin size={16} />
                            <span>New York, NY</span>
                        </div>
                    </div>
                </div>

                <div className="profile-card profile-activity">
                    <h3 className="card-title">
                        <Activity size={18} />
                        Recent Activity
                    </h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                                <h4>Submitted "Binary Search Trees"</h4>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                                <h4>Achieved 12-Day Streak!</h4>
                                <span>Yesterday</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                                <h4>Joined "CS202: Data Structures"</h4>
                                <span>3 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;