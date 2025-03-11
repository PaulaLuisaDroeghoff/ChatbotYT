import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  History, 
  PlayCircle, 
  ThumbsUp, 
  Clock, 
  ChevronDown, 
  Search, 
  Bell, 
  User, 
  Book, 
  Video, 
  Award, 
  MapPin,
  TrendingUp, 
  Users,      
  Library     
} from 'lucide-react';
import YouTubeLearningChatbot from './YouTubeLearningChatbot';
interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  hasLink?: boolean;
}

// Create a new component that exposes the internals of the chatbot but uses the exact same logic
const EmbeddedChatbot: React.FC = () => {
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
          } else if (userMessage.toLowerCase().includes('guitar') || userMessage.toLowerCase().includes('music')) {
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
          
          botResponse = `Thanks for sharing more details! I've updated your ${previousTopic} learning path [here](/learning-paths/${previousTopic.toLowerCase()}).`;
          
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
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <Book size={20} className="mr-2" />
          <h3 className="font-medium">YouTube Learning Assistant</h3>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: "400px" }}>
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
  );
};

const Learning = () => {
  const [activeTab, setActiveTab] = useState('learning-paths');
  
  // Sample data for learning paths
  const currentLearningPaths = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      progress: 8,
      lastAccessed: "2 days ago",
      totalVideos: 12,
      completedVideos: 1,
      thumbnail: "/api/placeholder/400/225"
    },
    {
      id: 2,
      title: "American History Deep Dive",
      progress: 60,
      lastAccessed: "Yesterday",
      totalVideos: 8,
      completedVideos: 5,
      thumbnail: "/api/placeholder/400/225"
    }
  ];
  
  // Sample suggestions for the chatbot
  const chatbotSuggestions = [
    {
      title: "Finding the Right Path",
      description: "Ask the Learning Assistant to suggest courses based on your skill level and goals.",
      icon: <MapPin size={24} className="text-red-600" />,
      example: "I want to learn JavaScript for web development."
    },
    {
      title: "Track Your Progress",
      description: "The Learning Assistant can tell you where you left off and what to study next.",
      icon: <Award size={24} className="text-red-600" />,
      example: "What's my progress in the Python course?"
    },
    {
      title: "Get Personalized Recommendations",
      description: "Share your learning preferences to get tailored content suggestions.",
      icon: <Book size={24} className="text-red-600" />,
      example: "I have 30 minutes daily to practice guitar."
    }
  ];

  // Sample categories for the Learn Something New section
  const popularCategories = [
    {
      name: "Programming",
      icon: <Code size={24} className="text-red-600" />,
      topics: ["Python", "JavaScript", "Web Development", "Data Science"]
    },
    {
      name: "Music",
      icon: <Music size={24} className="text-red-600" />,
      topics: ["Guitar", "Piano", "Music Theory", "Singing"]
    },
    {
      name: "Business",
      icon: <Briefcase size={24} className="text-red-600" />,
      topics: ["Marketing", "Entrepreneurship", "Finance", "Leadership"]
    }
  ];

  // Function to handle topic button clicks
  const handleTopicClick = (topic: string) => {
    // We would need to implement this to actually send the message to the embedded chatbot
    console.log(`Selected topic: ${topic}`);
    // Ideally, we would have a ref to the embedded chatbot component to call its methods
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="MainPage copy 4.jpg" 
          alt="Main Page" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Invisible links */}
      <a 
        href="/" 
        className="absolute top-[10%] left-0 transform -translate-y-1/2 w-[200px] h-[50px] z-10"
        style={{ opacity: 0, pointerEvents: 'auto' }}
      />
      <a 
        href="/learning" 
        className="absolute top-[45%] left-0 transform -translate-y-1/2 w-[200px] h-[50px] z-10"
        style={{ opacity: 0, pointerEvents: 'auto' }}
      />
      
      {/* Content overlay - positioned like YouTube's interface */}
      <div className="relative z-10 pt-24 ml-60 mr-6">
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Book size={28} className="text-red-600 mr-3" />
              <h1 className="text-2xl font-bold">YouTube Learning Assistant</h1>
            </div>
            <p className="text-gray-700 mb-4">
              Discover personalized learning paths, track your progress, and get recommendations 
              tailored to your interests and skill level.
            </p>
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-full ${activeTab === 'learning-paths' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveTab('learning-paths')}
              >
                My Learning Paths
              </button>
              <button 
                className={`px-4 py-2 rounded-full ${activeTab === 'suggestions' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveTab('suggestions')}
              >
                How to Use
              </button>
              <button 
                className={`px-4 py-2 rounded-full ${activeTab === 'recommendations' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Learn Something New
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Current Learning Paths */}
            {activeTab === 'learning-paths' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Your Learning Paths</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentLearningPaths.map(path => (
                    <div key={path.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{path.title}</h3>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Last accessed: {path.lastAccessed}</span>
                          <span>{path.completedVideos}/{path.totalVideos} videos</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                          <div 
                            className="bg-red-600 h-2.5 rounded-full" 
                            style={{ width: `${path.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{path.progress}% complete</span>
                            <a href={`/learning-paths/machinelearning`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Continue Learning</a>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center h-full">
                    <Book size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Start a New Learning Path</h3>
                    <p className="text-gray-500 mb-4">Ask our Learning Assistant to create a personalized learning path for you.</p>
                    <button 
                      className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                      onClick={() => setActiveTab('recommendations')}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* How to Use the Chatbot */}
            {activeTab === 'suggestions' && (
              <div>
                <h2 className="text-xl font-bold mb-4">How to Use the Learning Assistant</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {chatbotSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex flex-col border border-gray-200">
                      <div className="flex items-center mb-3">
                        {suggestion.icon}
                        <h3 className="font-medium ml-2">{suggestion.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4 flex-grow">{suggestion.description}</p>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700">Try asking:</p>
                        <p className="text-sm italic text-gray-600">"{suggestion.example}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learn Something New - Embedded Chatbot */}
            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Learn Something New</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <EmbeddedChatbot />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-3">Try these topics:</h3>
                    <div className="space-y-4">
                      {popularCategories.map((category, i) => (
                        <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center mb-2">
                            {category.icon}
                            <h4 className="font-medium ml-2">{category.name}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {category.topics.map((topic, j) => (
                              <button 
                                key={j}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                                onClick={() => handleTopicClick(topic)}
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        
      {/* Chatbot - keep this for other tabs */}
      {activeTab !== 'recommendations' && (
        <div className="fixed bottom-4 right-4 z-20">
          <YouTubeLearningChatbot />
        </div>
      )}
    </div>
  );
};

// Add missing imports
import { Briefcase, Code, Music, Send } from 'lucide-react';

export default Learning;