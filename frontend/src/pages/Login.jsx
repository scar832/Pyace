import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Styles/Login.css';
import Logo from '../assets/image2.png';

const TechNode = ({ icon, top, left, delay }) => (
    <motion.div 
        className="tech-node" 
        style={{ top, left, x: '-50%', y: '-50%' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
    >
        {icon}
    </motion.div>
);

const ConnectionLine = ({ x1, y1, x2, y2, delay }) => (
    <motion.line 
        x1={x1} y1={y1} x2={x2} y2={y2} 
        stroke="var(--line-color)"
        strokeWidth="2" 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay }}
    />
);

const icons = {
    python: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: '#3776AB'}}><path d="M12.015 2.017c-2.483 0-4.664.081-6.52 1.488-1.527 1.157-1.466 2.502-1.466 4.095v1.89h8.04v-1.1s0-.555-.544-.555h-3.41c-.488 0-.488-.556-.488-.556v-.5c0-.445.334-.445.334-.445h6.612s2.723-.11 2.723 2.666v2.333s.11 2.89-2.723 2.89h-1.61v3.332s0 2.223-2.612 2.223c-2.445 0-3.834-.055-5.39-1.222-1.39-1.056-1.5-2.278-1.5-3.834v-2.055H6.288c-.61 0-1.888.166-3.055-1.055C2.067 10.494 2 9.049 2 9.049V6.05c0-2.833 2.444-4.032 2.444-4.032C6.388.905 12.015.016 12.015.016zm0 19.966c2.483 0 4.665-.082 6.52-1.488 1.528-1.157 1.467-2.503 1.467-4.096v-1.89H11.96v1.1s0 .556.544.556h3.41c.49 0 .49.556.49.556v.5c0 .445-.333.445-.333.445H9.46s-2.722.112-2.722-2.667v-2.333s-.11-2.89 2.722-2.89h1.612v-3.333s0-2.222 2.61-2.222c2.446 0 3.835.056 5.39 1.222 1.39 1.056 1.5 2.278 1.5 3.834v2.056h1.666c.61 0 1.89-.167 3.056 1.055 1.166 1.222 1.233 2.667 1.233 2.667v2.999c0 2.834-2.444 4.033-2.444 4.033-1.945 1.112-7.572 2.001-7.572 2.001z"/></svg>,
    nextjs: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: 'var(--color-text-main)'}}><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm4.187 14.15L9.61 8.847v7.24a.65.65 0 0 1-1.3 0V8c0-.36.29-.65.65-.65h.063l6.764 7.49V8A.65.65 0 0 1 16.44 8v8.35a.65.65 0 0 1-1.3 0v-.2z"/></svg>,
    tailwind: <svg viewBox="0 0 24 24" fill="none" width="32" height="32"><path d="M12 6.5C14.7 6.5 16.5 7.4 17.4 9.2c-1.8-1.5-3.6-1.6-5.4-.4-1.2.8-2.1 2.3-3.9-2.3-2.7 0-4.5-.9-5.4-2.7 1.8 1.5 3.6 1.6 5.4.4 1.2-.8 2.1-2.3 3.9-2.3zm0 7.2c2.7 0 4.5.9 5.4 2.7-1.8-1.5-3.6-1.6-5.4-.4-1.2.8-2.1 2.3-3.9 2.3-2.7 0-4.5-.9-5.4-2.7 1.8 1.5 3.6 1.6 5.4.4 1.2-.8 2.1-2.3 3.9-2.3z" fill="#06B6D4"/></svg>,
    aws: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: '#FF9900'}}><path d="M13.62 10.74c-.38-.28-.59-.72-.59-1.27 0-.74.32-1.31 1.01-1.67a3.02 3.02 0 011.66-.45c.82 0 1.5.21 2.05.62v1.5a2.53 2.53 0 00-1.82-.74c-.45 0-.82.12-1.1.35-.29.23-.43.52-.43.87 0 .58.55.93 1.65 1.48.91.44 1.58.83 2 1.15.52.4.78.96.78 1.67 0 .84-.36 1.5-1.07 1.96a2.91 2.91 0 01-1.74.52 3.82 3.82 0 01-2.17-.61V14.6c.32.22.68.4 1.08.54.41.14.83.2 1.27.2.56 0 1-.13 1.32-.4.33-.27.49-.6.49-1 0-.32-.08-.58-.25-.77a2.86 2.86 0 00-.77-.6L15.3 11.7c-.52-.28-.9-.55-1.17-.81A63.4 63.4 0 0115 15.6c-.32 1.34-1.04 1.77-1.89 1.77-1.02 0-1.53-.5-1.53-1.5a23.1 23.1 0 01.32-3.8c.28-1.53 1.04-1.89 1.83-1.89.43 0 .83.1 1.2.32L14 11l-.38-.26zm-7.6 1.15c-.46-1.56-.84-2.88-1.14-3.95H3l2 6.55h1.74l1.37-4.14L9.4 14.5h1.72L13 7.94h-1.68l-1.04 3.92-1.35-3.92h-1.6l-1.3 3.95zM4 17.6c1.83 1.65 4.6 2.52 7.7 2.52 3.1 0 6-.87 8.3-2.5 0 0-1.25.96-2.6 1.49l-5.7 1c-4.2-.6-7.7-2.5-7.7-2.5zm7.7 3.32c5-1 8.5-3.8 8.5-3.8-2 1.9-4.8 2.6-8.5 3-3 .3-6.2-.2-8.5-2 0 0 3 2.1 8.5 2.8z"/></svg>,
    docker: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: '#2496ED'}}><path d="M22.02 10.97c-.2-.04-.5-.14-.7-.24-.04-.32-.09-.64-.29-.84-1.84-.74-3.34-.14-4.14.74-.84-1.04-2.54-.84-3.54-.24-1.04-.64-2.74-.44-3.64.44-1.04-.74-2.84-.64-3.84.24v-6.79h2.3v-1.7h-2.3V1h-1.9v1.6H1.5v1.7h2.4v6.79C1 14.76 2.7 18 10.6 18c9.59 0 12-5.49 11.42-7.03zM5.5 5.5v2.8H7V5.5H5.5zm3.1 0v2.8h1.5V5.5H8.6zm3.1 0v2.8h1.5V5.5h-1.5zm-6.2 3.4v2.8H7V8.9H5.5zm3.1 0v2.8h1.5V8.9H8.6zm3.1 0v2.8h1.5V8.9h-1.5zm6.1 4.5c-.8.8-1.9 1.1-3 1-1.3.1-2.4-.2-3.2-1V12h6.2v1.4z"/></svg>,
    github: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: 'var(--color-text-main)'}}><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
    nodejs: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: '#339933'}}><path d="M11.83 1.96c-.32-.14-.7-.14-1.03 0L3.38 5.62A1.4 1.4 0 0 0 2.5 6.94v8.32c0 .54.3 1.04.78 1.31l7.32 4.14c.33.19.74.19 1.07 0l7.32-4.14c.48-.27.78-.77.78-1.31V6.94c0-.52-.28-1-.74-1.29L12.5.47a1.43 1.43 0 0 0-.67 1.48v.01zM11.5 5l6.5 3.51V15c0 .35-.19.67-.5.85L11.5 19v-4.47l4.5-2.54v2.4l1.5-.86v-3.79l-6-3.41-6 3.41v3.79l1.5.86v-2.4l4.5 2.54V19L5 15.85A1 1 0 0 1 4.5 15V8.51L11 5h.5z"/></svg>,
    swift: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{color: '#F05138'}}><path d="M16 3H8L2 12l6 9h8l6-9-6-9zm-1.5 14h-5l-3.3-5 3.3-5h5l3.3 5-3.3 5z"/></svg>
};

const ConstellationAnimation = () => (
    <motion.div 
        key="constellation"
        className="animation-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
    >
        <div className="dot-grid"></div>

        <svg className="constellation-lines" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <ConnectionLine x1="25%" y1="20%" x2="50%" y2="20%" delay={0.1} />
            <ConnectionLine x1="25%" y1="20%" x2="20%" y2="45%" delay={0.3} />
            <ConnectionLine x1="50%" y1="20%" x2="70%" y2="45%" delay={0.4} />
            <ConnectionLine x1="50%" y1="70%" x2="70%" y2="45%" delay={0.6} />
            <ConnectionLine x1="50%" y1="70%" x2="25%" y2="70%" delay={0.7} />
            <ConnectionLine x1="50%" y1="70%" x2="75%" y2="70%" delay={0.8} />
            <ConnectionLine x1="70%" y1="45%" x2="75%" y2="70%" delay={0.9} />
        </svg>

        <TechNode icon={icons.python} top="20%" left="25%" delay={0.1} />
        <TechNode icon={icons.nextjs} top="20%" left="50%" delay={0.2} />
        <TechNode icon={icons.tailwind} top="20%" left="75%" delay={0.3} />
        <TechNode icon={icons.aws} top="45%" left="20%" delay={0.4} />
        <TechNode icon={icons.docker} top="45%" left="70%" delay={0.5} />
        <TechNode icon={icons.swift} top="70%" left="25%" delay={0.6} />
        <TechNode icon={icons.github} top="70%" left="50%" delay={0.7} />
        <TechNode icon={icons.nodejs} top="70%" left="75%" delay={0.8} />

    </motion.div>
);

const CodeMockup = () => (
    <motion.div 
        key="code"
        className="animation-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
    >
        {/* Decorative background blur elements */}
        <div className="glow-bubble bubble-1"></div>
        <div className="glow-bubble bubble-2"></div>
        
        <div className="code-window">
            <div className="code-header">
                <div className="mac-buttons">
                    <span className="close"></span>
                    <span className="minimize"></span>
                    <span className="maximize"></span>
                </div>
                <div className="file-name">market.py</div>
            </div>
            <div className="code-content">
                <pre>
                    <code>
<span className="keyword">import</span> <span className="variable">pyace</span><br/><br/>
<span className="keyword">class</span> <span className="class-name">AIModelMarket</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">def</span> <span className="function">__init__</span>(<span className="variable">self</span>):<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="variable">self</span>.<span className="property">market</span> = pyace.<span className="class-name">Marketplace</span>()<br/><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">async def</span> <span className="function">fetch_model</span>(<span className="variable">self</span>, <span className="variable">name</span>: <span className="type">str</span>) -&gt; <span className="class-name">Model</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Connect to Pyace AI models</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="variable">model</span> = <span className="keyword">await</span> <span className="variable">self</span>.<span className="property">market</span>.<span className="function">get_model</span>(name)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="variable">model</span><br/><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">async def</span> <span className="function">deploy</span>(<span className="variable">self</span>):<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">await</span> <span className="variable">self</span>.<span className="cursor-blink"></span>
                    </code>
                </pre>
                
                <div className="autocomplete-dropdown">
                    <div className="dropdown-item">
                        <div className="item-icon">⚡</div>
                        <div className="item-text">
                            <span className="item-title">train</span>
                            <span className="item-desc">(): Promise&lt;void&gt; - Initiates AI training</span>
                        </div>
                        <div className="item-type">method</div>
                    </div>
                    <div className="dropdown-item active">
                        <div className="item-icon">🔄</div>
                        <div className="item-text">
                            <span className="item-title">transform</span>
                            <span className="item-desc">(): Promise&lt;Data&gt; - Transforms user data</span>
                        </div>
                        <div className="item-type">method</div>
                    </div>
                    <div className="dropdown-item">
                        <div className="item-icon">✨</div>
                        <div className="item-text">
                            <span className="item-title">initialize</span>
                            <span className="item-desc">(): Model - Sets up the neural network</span>
                        </div>
                        <div className="item-type">method</div>
                    </div>
                    <div className="dropdown-item">
                        <div className="item-icon">🚀</div>
                        <div className="item-text">
                            <span className="item-title">deploy</span>
                            <span className="item-desc">(): Promise&lt;Deploy&gt; - Deploys to market</span>
                        </div>
                        <div className="item-type">method</div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const Login = () => {
    const [role, setRole] = useState('student');
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className={`login-container ${isLogin ? 'reverse' : ''}`}>
            
            {/* Animated Panel (Left on Signup, Right on Signin) */}
            <motion.div layout className="login-panel-animated">
                <AnimatePresence mode="wait">
                    {isLogin ? <ConstellationAnimation key="constellation" /> : <CodeMockup key="code" />}
                </AnimatePresence>
            </motion.div>

            {/* Right Side (Form) */}
            <motion.div layout className="login-panel-form">
                <div className="login-card">
                    <header className="login-header">
                        <img src={Logo} alt="Pyace Logo" />
                        <h2>Pyace</h2>
                    </header>
                    
                    <div className="login-content">
                        <h1 className="title">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
                        <p className="subtitle">{isLogin ? 'Login to continue to Pyace.' : 'Join the future of personalized education.'}</p>

                        {!isLogin && (
                            <div className="role-toggle">
                                <button 
                                    type="button"
                                    className={`toggle-btn ${role === 'student' ? 'active' : ''}`}
                                    onClick={() => setRole('student')}
                                >
                                    I am a Student
                                </button>
                                <button 
                                    type="button"
                                    className={`toggle-btn ${role === 'instructor' ? 'active' : ''}`}
                                    onClick={() => setRole('instructor')}
                                >
                                    I am an Instructor
                                </button>
                            </div>
                        )}

                        <div className="oauth-buttons">
                            <button type="button" className="oauth-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button type="button" className="oauth-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                                GitHub
                            </button>
                        </div>

                        <div className="divider">
                            <span>OR CONTINUE WITH EMAIL</span>
                        </div>

                        <form className="login-form">
                            {!isLogin && (
                                <div className="input-group">
                                    <label>FULL NAME</label>
                                    <input type="text" placeholder="John Doe" />
                                </div>
                            )}
                            <div className="input-group">
                                <label>EMAIL ADDRESS</label>
                                <input type="email" placeholder="john@example.com" />
                            </div>
                            <div className="input-group">
                                <label>PASSWORD</label>
                                <input type="password" placeholder="••••••••" />
                            </div>

                            <button type="button" className="submit-btn">{isLogin ? 'Sign In' : 'Create Account'}</button>
                        </form>

                        <p className="signin-link">
                            {isLogin ? (
                                <>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></>
                            ) : (
                                <>Already have an account? <span onClick={() => setIsLogin(true)}>Sign In</span></>
                            )}
                        </p>
                    </div>

                    <footer className="login-footer">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </footer>
                </div>
            </motion.div>
        </div>
    )
}

export default Login;