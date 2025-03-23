import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Book } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  hasLink?: boolean;
}

const YouTubeLearningChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! I'm your YouTube Learning Assistant. What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate processing time
    setTimeout(() => {
      let botResponse = '';
      let hasLink = false;
      let followUpMessage = null;
      
      // Check if this is a follow-up message with more details
      const isFollowUp = messages.length > 2;
      const lastBotMessageIndex = messages.findIndex(m => m.sender === 'bot' && m.hasLink);
      const hasProvidedTopicBefore = lastBotMessageIndex !== -1;
      const topicLinks = {
        machinelearning: '/learning-paths/machinelearning',
        javascript: '/learning-paths/javascript',
        guitar: '/learning-paths/guitar',
      };
      
      // Simple keyword matching for initial topic requests
      if (!isFollowUp || !hasProvidedTopicBefore) {
        if (userMessage.toLowerCase().includes('machine learning')) {
            botResponse = "Great! I have created the following learning path for you [here](/learning-paths/machinelearning). To tailor your learning path better to your specific needs, feel free to share more details such as your learning goal, your current knowledge level, or how long you want to learn for.";
            hasLink = true;
        } else if (userMessage.toLowerCase().includes('javascript') || userMessage.toLowerCase().includes('js')) {
            botResponse = "Great! I have created the following learning path for you [here](/learning-paths/javascript). To tailor your learning path better to your specific needs, feel free to share more details such as your learning goal, your current knowledge level, or how long you want to learn for.";
            hasLink = true;
        } else if (userMessage.toLowerCase().includes('guitar') || userMessage.toLowerCase().includes('guitar')) {
            botResponse = "Great! I have created the following learning path for you [here](/learning-paths/guitar). To tailor your learning path better to your specific needs, feel free to share more details such as your learning goal, your current knowledge level, or how long you want to learn for.";
            hasLink = true;
        } else {
            botResponse = "I'd be happy to help you learn that! To create a personalized learning path for you, could you provide more details about what specific topic you're interested in? It would also help to know your current skill level and learning goals.";
        }
      } else {
        // This is a follow-up message with more details
        const previousTopic = messages[lastBotMessageIndex].text.includes('machine learning') ? 'Machine learning' : 
                              messages[lastBotMessageIndex].text.includes('javascript') ? 'JavaScript' :
                              messages[lastBotMessageIndex].text.includes('guitar') ? 'Guitar' : 'your topic';
        
        // Check for skill level indicators
        const isBeginnerMessage = userMessage.toLowerCase().includes('beginner') || 
                                  userMessage.toLowerCase().includes('new to') ||
                                  userMessage.toLowerCase().includes('starting') ||
                                  userMessage.toLowerCase().includes('basic');
                                  
        const isAdvancedMessage = userMessage.toLowerCase().includes('advanced') ||
                                  userMessage.toLowerCase().includes('experienced') ||
                                  userMessage.toLowerCase().includes('expert');
                                  
        const hasTimeframe = userMessage.toLowerCase().includes('hour') ||
                            userMessage.toLowerCase().includes('day') ||
                            userMessage.toLowerCase().includes('week') ||
                            userMessage.toLowerCase().includes('month');
        
        botResponse = `Thanks for sharing more details! I've updated your ${previousTopic} learning path [here](/learning-paths/machinelearning).`;
        
        if (isBeginnerMessage) {
          botResponse += " I've focused on beginner-friendly content that will help you build a solid foundation.";
        } else if (isAdvancedMessage) {
          botResponse += " I've included more advanced topics that will challenge your existing knowledge.";
        }
        
        if (hasTimeframe) {
          botResponse += " The schedule has been adjusted to fit your available time.";
        }
        
        hasLink = true;
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date(),
          hasLink
        }
      ]);
      
      // Add follow-up message if needed
      if (followUpMessage) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: prev.length + 1,
              sender: 'bot',
              text: followUpMessage ?? "",
              timestamp: new Date()
            }
          ]);
        }, 1000);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: inputValue,
        timestamp: new Date(),
      };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    simulateBotResponse(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatMessageText = (text: string) => {
    // Simple Markdown-like link parser
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link
      parts.push(
        <a key={match.index} href={match[2]} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {/* Chatbot toggle button */}
      <button
        className="bg-red-600 text-white rounded-full p-3 shadow-lg mb-2 flex items-center justify-center"
        onClick={toggleChatbot}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>
      
      {/* Chatbot window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-96 border border-gray-200">
          {/* Header */}
          <div className="bg-red-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <Book size={18} className="mr-2" />
              <h3 className="font-medium">YouTube Learning Assistant</h3>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-red-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {message.hasLink ? (
                    <p className="text-sm">{formatMessageText(message.text)}</p>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="What would you like to learn?"
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
                className={`bg-red-600 text-white px-3 py-2 rounded-r-lg ${
                  inputValue.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeLearningChatbot;