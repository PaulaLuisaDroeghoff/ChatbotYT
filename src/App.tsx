import { Routes, Route, useLocation } from "react-router-dom";
import YouTubeLearningChatbot from "./pages/YouTubeLearningChatbot";

const App = () => {
  const location = useLocation();
  const showChatbot = location.pathname === '/'; // Only show on main route
  
  return (
    <div className="flex items-center justify-center h-screen relative">
      {/* Image Section */}
      <img src="MainPage copy.jpg" alt="Main Page" className="max-w-full max-h-full" />
      
      {/* Invisible link over the image 1*/}
      <a 
            href="/" 
            className="absolute top-[10%] left-0 transform -translate-y-1/2 w-[200px] h-[50px]" // Specify width and height
            style={{ opacity: 0, pointerEvents: 'auto' }} // Makes the link invisible but clickable
      />
      {/* Invisible link over the image 2*/}
      <a 
            href="/learning" 
            className="absolute top-[45%] left-0 transform -translate-y-1/2 w-[200px] h-[50px]" // Specify width and height
            style={{ opacity: 0, pointerEvents: 'auto' }} // Makes the link invisible but clickable
      />
      
      {/* Conditionally render the chatbot */}
      {showChatbot && <YouTubeLearningChatbot />}
      
      {/* Routes */}
      <Routes>
        {/* Add other routes here */}
      </Routes>
    </div>
  );
};

export default App;
