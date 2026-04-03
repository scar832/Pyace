import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const terminalLines = [
  "Initializing Pyace AI Engine...",
  "Scanning target URL...",
  "Error: Route undefined.",
  "AI Marker Score: 0/100 (Page Not Found)",
];

const floatingSymbols = ["{ }", "< />", "!==", "=>", "404", "[]", "??", "def:", "class", "import", "pip", "install", "pyace-ai", "async def route():", "return"];

const NotFound = () => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [escapes, setEscapes] = useState(0);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        setDisplayedLines((prev) => [...prev, terminalLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 800); // Staggered typing effect per line
    return () => clearInterval(interval);
  }, []);

  const moveButton = () => {
    if (escapes > 4) return; // Let them catch it eventually!
    const x = Math.random() * 700 - 100;
    const y = Math.random() * 150 - 75;
    setBtnPos({ x, y });
    setEscapes((prev) => prev + 1);
  };

  return (
    <div className="container">
      {/* Subtle Dot Pattern Background */}
      <div className="dot-bg" />

      {/* Floating Syntax Symbols */}
      {floatingSymbols.map((symbol, i) => (
        <motion.div
          key={i}
          className="floating-symbol"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: [0.1, 0.4, 0.1], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }}
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        >
          {symbol}
        </motion.div>
      ))}

      <div className="content">
        {/* Animated 404 Header */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="title"
        >
          <span className="text-gradient">404</span>
        </motion.h1>
        <p className="subtitle">Looks like this code didn't compile.</p>

        {/* Sleek AI Terminal */}
        <motion.div
          className="mac-window"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="window-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="window-title">pyace-analyzer.py</span>
          </div>

          <div className="terminal-body">

            {displayedLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`term-line ${index === 3 ? 'error-text' : 'normal-text'}`}
              >
                <span className="prompt">~ %</span> {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="cursor"
            />
          </div>
        </motion.div>

        {/* Evasive Button */}
        <div className="btn-wrapper">
          <motion.button
            onMouseEnter={moveButton}
            animate={{ x: btnPos.x, y: btnPos.y }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`btn ${escapes > 4 ? 'btn-caught' : ''}`}
            onClick={() => window.location.href = '/'}
          >
            {escapes > 4 ? "Okay, you win. Go Home." : "Back to home"}
          </motion.button>
        </div>

        {/* Cheesy Pop-up after trying to click */}
        <AnimatePresence>
          {escapes > 0 && escapes <= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="hint-popup"
            >
              Pyace: Faster reflexes needed! ⚡
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .container {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: var(--color-bg);
          color: var(--color-text-main);
          font-family: 'Inter', -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dot-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.5;
          z-index: 0;
        }

        .floating-symbol {
          position: absolute;
          font-size: 1.5rem;
          font-family: 'Fira Code', monospace;
          color: #94a3b8;
          font-weight: 600;
          z-index: 1;
          user-select: none;
        }

        .content {
          position: relative;
          z-index: 2;
          text-align: center;
          width: 100%;
          max-width: 600px;
          padding: 20px;
        }

        .title {
          font-size: 8rem;
          font-weight: 900;
          margin: 0;
          line-height: 1;
          letter-spacing: -4px;
        }

        .text-gradient {
          background: #0061ff;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #64748b;
          margin-bottom: 2rem;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-weight: 500;
        }

        .mac-window {
          background: #0f172a;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05);
          overflow: hidden;
          text-align: left;
          margin-bottom: 2rem;
        }

        .window-header {
          background: #1e293b;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .window-title {
          margin-left: auto;
          margin-right: auto;
          color: #94a3b8;
          font-size: 0.8rem;
          font-family: 'Fira Code', monospace;
        }

        .terminal-body {
          padding: 24px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.95rem;
          line-height: 1.6;
          position: relative;
          min-height: 180px;
        }

        .term-line { margin-bottom: 8px; }
        .normal-text { color: #e2e8f0; }
        .error-text { color: #ef4444; font-weight: bold; }
        .prompt { color: #3b82f6; font-weight: bold; margin-right: 8px; }

        .cursor {
          display: inline-block;
          width: 10px;
          height: 1.2em;
          background-color: #3b82f6;
          vertical-align: middle;
          margin-left: 4px;
        }

        .btn-wrapper {
          height: 60px; /* Prevents layout jump when button moves */
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .btn {
          padding: 12px 28px;
          border-radius: 18px;
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 400;
          font-size: 1rem;
          font-family: 'Fira Code', 'Courier New', monospace;
          cursor: pointer;
          box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
          transition: background 0.2s;
          position: absolute;
        }

        .btn:hover {
          background: #1d4ed8;
        }

        .btn-caught {
          background: #10b981;
          box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
        }
        .btn-caught:hover {
          background: #059669;
        }

        .hint-popup {
          margin-top: 2rem;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default NotFound;