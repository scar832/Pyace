import { useState } from 'react';
import { Bell, Moon, Sun, Lock, Save } from 'lucide-react';
import '../../Styles/utils.css';

const Settings = () => {
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(false);
    const [darkTheme, setDarkTheme] = useState(true);

    return (
        <div className="utils-page-container">
            <div className="utils-header">
                <h1>Account Settings</h1>
                <p>Configure your preferences and security details.</p>
            </div>

            <div className="settings-grid">
                {/* PREFERENCES */}
                <div className="settings-card">
                    <h3 className="card-title">Preferences</h3>

                    <div className="settings-row">
                        <div className="settings-info">
                            <Bell size={18} />
                            <div>
                                <h4>Email Notifications</h4>
                                <p>Receive updates about assignments and grades</p>
                            </div>
                        </div>
                        <div
                            className={`toggle-switch ${emailNotifs ? 'on' : 'off'}`}
                            onClick={() => setEmailNotifs(!emailNotifs)}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-info">
                            <Bell size={18} />
                            <div>
                                <h4>Push Notifications</h4>
                                <p>Get instant browser alerts</p>
                            </div>
                        </div>
                        <div
                            className={`toggle-switch ${pushNotifs ? 'on' : 'off'}`}
                            onClick={() => setPushNotifs(!pushNotifs)}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-info">
                            {darkTheme ? <Moon size={18} /> : <Sun size={18} />}
                            <div>
                                <h4>Dark Theme</h4>
                                <p>Switch between light and dark aesthetics (mock)</p>
                            </div>
                        </div>
                        <div
                            className={`toggle-switch ${darkTheme ? 'on' : 'off'}`}
                            onClick={() => setDarkTheme(!darkTheme)}
                        >
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                </div>

                {/* SECURITY */}
                <div className="settings-card">
                    <h3 className="card-title">Security</h3>

                    <div className="settings-form">
                        <div className="input-group">
                            <label>Current Password</label>
                            <div className="input-with-icon">
                                <Lock size={16} />
                                <input type="password" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="input-with-icon">
                                <Lock size={16} />
                                <input type="password" placeholder="••••••••" />
                            </div>
                        </div>
                        <button className="btn-primary">
                            <Save size={16} /> Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;