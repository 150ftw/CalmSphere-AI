import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatMessages, sendMessage as sendMessageApi } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send, AlertCircle, Mic, MicOff, Phone, PhoneOff, Volume2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Voice State
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

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

  const handleSend = async (messageOverride = null) => {
    const messageToSend = messageOverride || inputMessage;
    if (!messageToSend.trim() || loading) return;

    if (!messageOverride) setInputMessage('');
    setLoading(true);

    try {
      const response = await sendMessageApi(sessionId, messageToSend);
      
      // Add user message and bot response
      await loadMessages();
      
      // If in voice mode, speak the response
      if (isCalling && !isMuted) {
        speakResponse(response.data.message.content);
      }
      
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

  // Voice Logic
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          handleSend(transcriptText);
          setTranscript('');
        }
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        // Restart if still calling and not speaking
        if (isCalling && !synthesisRef.current.speaking) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      synthesisRef.current.cancel();
    };
  }, [isCalling, sessionId]);

  const startCall = () => {
    setIsCalling(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    toast.success('Voice session started');
  };

  const endCall = () => {
    setIsCalling(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    synthesisRef.current.cancel();
  };

  const speakResponse = (text) => {
    // Pause recognition while bot is speaking to avoid feedback
    if (recognitionRef.current) recognitionRef.current.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Select a warm, human-like voice if available
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Natural')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsListening(false);
    };

    utterance.onend = () => {
      if (isCalling && !isMuted) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.log("Recognition already started or failed:", e);
          }
        }, 300);
      }
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      if (isCalling) recognitionRef.current?.start();
    };

    synthesisRef.current.speak(utterance);
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

      {/* Voice Overlay */}
      {isCalling && (
        <div className="voice-overlay">
          <div className="aura-container">
            <div className="aura-circle"></div>
            <div className="aura-circle"></div>
            <div className="aura-circle"></div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Volume2 className="w-12 h-12 text-primary animate-pulse" />
              </div>
              {isListening && (
                <div className="listening-indicator">
                  <div className="listening-dot" style={{ animationDelay: '0s' }}></div>
                  <div className="listening-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="listening-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-md px-8 text-center mt-8">
            <div className="mb-6 h-8">
              {isListening && (
                <div className="flex justify-center gap-1 h-full items-end">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-primary rounded-full animate-voice-bar"
                      style={{ 
                        height: '40%', 
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.5 + Math.random()}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="voice-status-text min-h-[3rem]">
              {loading ? "CalmSphere is thinking..." : (transcript || (isListening ? "I'm listening..." : "Speaking..."))}
            </p>
            <p className="voice-subtext mt-4">
              {isMuted ? "Microphone is muted" : "Speak naturally, I can hear you."}
            </p>
          </div>

          <div className="controls-container">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`control-btn btn-mute ${isMuted ? 'active' : ''}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={endCall}
              className="control-btn btn-end"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/40 bg-card/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            onClick={startCall}
            disabled={loading}
            className="bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all"
          >
            <Mic className="w-5 h-5" />
          </Button>
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
            onClick={() => handleSend()}
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