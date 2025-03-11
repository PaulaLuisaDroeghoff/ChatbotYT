const LearningPath2 = () => {
    return (
      <div className="flex items-center justify-center h-screen relative">
        {/* Image Section */}
        <img src="/MainPageRecommendation Guitar.jpg" alt="MainPageRecommendations copy" className="max-w-full max-h-full" />
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
    </div>
    );
  };
  
  export default LearningPath2;
  