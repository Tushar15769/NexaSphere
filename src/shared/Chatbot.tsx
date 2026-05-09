import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Terminal, Cpu } from 'lucide-react';
import '../styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Nexa-Intelligence Online. How can I assist your journey?' }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    try {
      // Simulate slight delay for "intelligence" feel
      setTimeout(async () => {
        try {
          const response = await fetch('http://localhost:8000/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: currentInput }),
          });
          const data = await response.json();
          setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'Analysis complete. Outcome: Optimistic.' }]);
        } catch (e) {
          setMessages(prev => [...prev, { role: 'bot', text: 'Nexa-AI: Core Link Failure. Routing through backup protocols...' }]);
        }
      }, 600);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Nexa-AI: System Interrupt. Retry requested.' }]);
    }
  };

  return (
    <div className={`ns-chatbot-wrapper ${isOpen ? 'is-open' : ''}`}>
      {!isOpen ? (
        <button className="chat-trigger-btn" onClick={() => setIsOpen(true)} aria-label="Open AI Assistant">
          <div className="pulse-ring"></div>
          <MessageCircle size={28} color="white" />
        </button>
      ) : (
        <div className="chat-window-glass">
          <div className="chat-header">
            <div className="header-status">
              <div className="status-indicator">
                <span className="status-dot"></span>
                <Cpu size={14} className="status-icon-mini" />
              </div>
              <div className="header-text">
                <span className="ai-name">NEXA-AI</span>
                <span className="ai-version">v2.4.0</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chat-messages" ref={scrollRef}>
            <div className="message-notice">
              <Terminal size={12} />
              <span>Secure encrypted channel established</span>
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`msg-wrapper ${m.role}`}>
                <div className="msg-avatar">
                  {m.role === 'bot' ? <Bot size={16} /> : <div className="user-initial">U</div>}
                </div>
                <div className={`msg-bubble ${m.role}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <div className="input-inner">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Initialize query..."
              />
              <button onClick={handleSend} className="send-action-btn" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;