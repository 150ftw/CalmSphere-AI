import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatMessages, sendMessage as sendMessageApi } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send, AlertCircle, LifeBuoy } from 'lucide-react';
import { toast } from 'sonner';

export default function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await getChatMessages(sessionId);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      const response = await sendMessageApi(sessionId, userMsg);
      
      // Add user message and bot response
      await loadMessages();
      
      // Show crisis resources if needed
      if (response.data.show_crisis_resources) {
        setShowCrisisResources(true);
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-background bg-noise flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            data-testid="back-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-fraunces text-xl font-medium">CalmSphere AI</h1>
            <p className="text-xs text-muted-foreground">Your supportive companion</p>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <div className="bg-muted/30 border-b border-border/40 px-6 py-2">
        <p className="text-xs text-center text-muted-foreground max-w-4xl mx-auto">
          CalmSphere AI is a support tool, not a substitute for professional mental health care. In crisis, call KIRAN: 1800-599-0019 or emergency: 112.
        </p>
      </div>

      {/* Crisis Resources Banner */}
      {showCrisisResources && (
        <div className="bg-secondary/10 border-b border-secondary/20 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">Crisis Resources Available</h3>
              <p className="text-xs text-muted-foreground mb-2">
                If you're in crisis, please reach out for professional support immediately.
              </p>
              <Button
                data-testid="view-crisis-resources-btn"
                onClick={() => navigate('/crisis')}
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full text-xs"
              >
                View Crisis Resources
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div data-testid="chat-messages-container" className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircleHeart className="w-16 h-16 text-primary/30 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-fraunces text-2xl font-medium mb-2">Start Your Conversation</h3>
              <p className="text-muted-foreground">
                Share what's on your mind. I'm here to listen and support you.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              data-testid={`message-${msg.role}`}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border/40 shadow-soft'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.risk_level && msg.risk_level !== 'low' && msg.role === 'user' && (
                  <div className="mt-2 pt-2 border-t border-primary-foreground/20">
                    <p className="text-xs opacity-80">Risk level detected: {msg.risk_level}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border/40 shadow-soft rounded-2xl px-6 py-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/40 bg-card/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            data-testid="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            disabled={loading}
            className="flex-1 bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-full h-12 px-6"
          />
          <Button
            data-testid="send-message-btn"
            onClick={handleSend}
            disabled={loading || !inputMessage.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-soft hover:shadow-float transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const MessageCircleHeart = ({ className, strokeWidth }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M12 9c-1.333 1-2 2.333-2 4 0 1.667.667 3 2 4 1.333-1 2-2.333 2-4 0-1.667-.667-3-2-4z" />
  </svg>
);