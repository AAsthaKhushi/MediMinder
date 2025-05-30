import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image, Paperclip, Bot } from 'lucide-react';
import PageContainer from '../components/PageContainer';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your MediMinder AI assistant. How can I help you with your medications or health questions today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, newUserMessage]);
    setInputText('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        'medication': 'It\'s important to take your medications as prescribed. Is there a specific medication you have questions about?',
        'side effect': 'Side effects can vary by medication. What symptoms are you experiencing?',
        'forgot': 'If you missed a dose, check your medication instructions. Some medications should be taken as soon as you remember, while others might need to wait until your next scheduled dose.',
        'exercise': 'Exercise can be beneficial while on medications, but some medications may require precautions. Always consult your doctor before starting a new exercise routine.',
        'food': 'Some medications interact with certain foods. What medication are you asking about?'
      };

      // Simple keyword matching for demo purposes
      let aiResponseText = 'I\'m not sure I understand. Could you provide more details about your question?';
      
      for (const [keyword, response] of Object.entries(aiResponses)) {
        if (inputText.toLowerCase().includes(keyword)) {
          aiResponseText = response;
          break;
        }
      }

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with the Web Speech API
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setInputText('What medications should I avoid taking with grapefruit?');
        setIsRecording(false);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageContainer title="AI Assistant">
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="space-y-4 px-1">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center mb-1">
                      <Bot size={16} className="mr-1 text-primary" />
                      <span className="font-medium text-sm text-primary">MediMinder AI</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-1 text-right ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <button className="text-gray-500 mr-2">
              <Paperclip size={20} />
            </button>
            <button className="text-gray-500 mr-2">
              <Image size={20} />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your medications..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-24 py-2"
              rows={1}
            />
            <button 
              onClick={toggleRecording} 
              className={`p-2 rounded-full ${isRecording ? 'text-red-500 bg-red-100' : 'text-gray-500'} mr-2`}
            >
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSendMessage} 
              disabled={!inputText.trim()}
              className={`p-2 rounded-full ${inputText.trim() ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Your conversations are private and secure
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AIAssistant;
