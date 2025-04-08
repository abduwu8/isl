import React, { useState, useEffect, useRef } from 'react'
import { startAssistant, stopAssistant, sendChatMessage } from '../ai'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { FiMessageSquare, FiSend, FiX, FiHelpCircle } from 'react-icons/fi'
import Threads from '../components/Threads'

// Component for mobile title display
const MobileTitle = ({ onTooltipClick }) => (
  <div className="block md:hidden w-full relative">
    {/* Decorative circles */}
    <div className="absolute -top-16 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#D94E27]/30 to-transparent blur-xl"></div>
    <div className="absolute -top-12 right-0 w-20 h-20 rounded-full bg-gradient-to-bl from-[#D94E27]/20 to-transparent blur-xl"></div>
    
    <h1 
      className="text-white font-light cursor-pointer flex flex-col items-center justify-center"
      style={{ 
        letterSpacing: '-0.05em',
        textShadow: '0 0 25px rgba(217, 78, 39, 0.35), 0 0 50px rgba(217, 78, 39, 0.15)'
      }}
    >
      <div className="text-8xl relative" style={{ lineHeight: '1.1' }}>
        alham
        <button 
          onClick={onTooltipClick}
          className="absolute -right-6 top-3 text-[#D94E27] text-lg opacity-70 hover:opacity-100 animate-pulse"
          aria-label="Show meaning"
        >
          ⓘ
        </button>
      </div>
      <div className="text-6xl mt-3 mb-5 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">AI</div>
    </h1>
    
    {/* Subtle divider line */}
    <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#D94E27]/40 to-transparent rounded-full mb-4"></div>
  </div>
);

// Component for desktop title display
const DesktopTitle = ({ onTooltipClick }) => (
  <div className="hidden md:block w-full">
    <h1 
      className="text-white font-light cursor-pointer flex items-center justify-center"
      style={{ 
        letterSpacing: '-0.05em',
        textShadow: '0 0 20px rgba(217, 78, 39, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)'
      }}
    >
      <span className="text-8xl relative" style={{ lineHeight: '1.1' }}>
        alham
        <button 
          onClick={onTooltipClick}
          className="absolute -right-7 top-2 text-[#D94E27] text-lg opacity-70 hover:opacity-100"
          aria-label="Show meaning"
        >
          ⓘ
        </button>
      </span>
      <span className="text-6xl ml-5 mt-2">AI</span>
    </h1>
  </div>
);

const MainPage = () => {
  const [isListening, setIsListening] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalamu alaikum! How can I assist you today?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Animation on component mount
  useEffect(() => {
    setIsVisible(true)
    
    // Show hint after 3 seconds only on mobile devices
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        setShowHint(true)
        // Auto-hide after 5 seconds
        setTimeout(() => setShowHint(false), 5000)
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (showChat && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 300)
    }
  }, [showChat])

  const toggleAssistant = async () => {
    if (isListening) {
      stopAssistant()
      setIsListening(false)
    } else {
      await startAssistant('User', '', '', '')
      setIsListening(true)
    }
  }

  const sendMessage = async (e) => {
    e?.preventDefault()
    
    if (!inputValue.trim()) return
    
    // Add user message
    const userMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    
    try {
      // Use the chat service from ai.js
      const messageHistory = [...messages, userMessage];
      const response = await sendChatMessage(messageHistory);
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error connecting to my knowledge source. Please try again in a moment.' 
      }])
      setIsLoading(false)
    }
  }

  // Converting hex #FF6A3D to RGB with increased intensity (1.0 is max)
  const orangeColor = [0.85, 0.3, 0.18]; // Darker orange

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-black">
      {/* Threads Background with increased opacity */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.85, height: '100vh' }}>
        <Threads 
          color={orangeColor}
          amplitude={1.8}
          distance={1.4}
          enableMouseInteraction={true}
        />
      </div>
      
      {/* Title and Description with fade-in animation */}
      <div 
        className={`absolute z-10 text-center w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`} 
        style={{ top: '28%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}
      >
        {/* Floating shapes - visible only on mobile */}
        <div className="block md:hidden">
          <div className="absolute top-48 left-8 w-5 h-5 rounded-full border border-[#D94E27]/30 animate-float opacity-60"></div>
          <div className="absolute top-28 right-12 w-8 h-8 rounded-full border border-[#D94E27]/20 animate-float opacity-40" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-64 right-16 w-3 h-3 rounded-sm bg-[#D94E27]/10 animate-float opacity-70" style={{ animationDelay: '2.5s' }}></div>
        </div>
        
        <div className="mx-auto max-w-md px-4">
          <MobileTitle 
            onTooltipClick={() => setShowTooltip(true)}
          />
          <DesktopTitle 
            onTooltipClick={() => setShowTooltip(true)}
          />
          
          {/* Informative Tooltip */}
          {showTooltip && (
            <div 
              className="fixed left-1/2 -translate-x-1/2 top-1/4 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-md border border-[#D94E27]/30 rounded-xl p-5 pr-8 shadow-lg text-left w-[90%] max-w-[320px] z-50 transition-all duration-300"
            >
              <button 
                className="absolute top-3 right-3 text-white/60 hover:text-white" 
                onClick={() => setShowTooltip(false)}
                aria-label="Close tooltip"
              >
                <FiX size={16} />
              </button>
              <div className="text-[#D94E27] text-sm font-medium mb-2">alham (الهام)</div>
              <div className="text-white/80 text-sm mb-3">An Arabic term meaning "inspiration" or "divine guidance".</div>
              <div className="text-white/60 text-xs">alham AI aims to provide guidance through technology with Islamic principles at its core.</div>
            </div>
          )}
        </div>
        
        <p className="text-white/70 text-lg sm:text-xl md:text-2xl font-light tracking-wide mt-6 mb-8 mx-auto max-w-xs sm:max-w-md px-6">
          <span className="flex items-center justify-center flex-wrap">
            <span>first ever</span>
            <span className="relative inline-block mx-2 my-1">
              <span className="absolute inset-0 bg-gradient-to-r from-[#D94E27]/60 to-[#D94E27]/40 rounded-md" style={{ transform: 'skew(-5deg)', padding: '0 4px' }}></span>
              <span className="relative text-white font-normal px-2">islamic</span>
            </span>
            <span>voice assistant.</span>
          </span>
        </p>
      </div>
      
      {/* Microphone button in center */}
      <div 
        className={`absolute left-0 right-0 mx-auto w-max z-10 transition-all duration-1000 delay-300 ease-out flex flex-col items-center ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}
        style={{ 
          top: '62%',
          transform: 'translateY(-50%)'
        }}
      >
        {/* Mobile-only decorative curved line */}
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 w-24 h-24 md:hidden">
          <svg viewBox="0 0 100 50" className="w-full h-full opacity-30">
            <path d="M0,50 C30,20 70,20 100,50" stroke="#D94E27" strokeWidth="0.5" fill="none" strokeDasharray="2,2" />
          </svg>
        </div>
        
        {/* Feature hint for mobile - only shows briefly */}
        {showHint && (
          <div className="absolute -left-36 top-10 md:hidden bg-gradient-to-r from-[#D94E27]/20 to-black/60 backdrop-blur-md p-3 rounded-lg max-w-[140px] text-xs text-white/80 shadow-lg border border-[#D94E27]/30 transform -rotate-6">
            <FiHelpCircle className="inline-block mr-1 text-[#D94E27]" />
            <span>Ask me questions about Islam!</span>
            <div className="absolute h-0.5 w-12 bg-[#D94E27]/30 -right-8 top-1/2"></div>
          </div>
        )}
        
        <div className={`absolute rounded-full w-24 h-24 sm:w-26 sm:h-26 ${isListening ? 'animate-ping bg-[#D94E27]/20' : 'bg-transparent'}`}></div>
        <button 
          onClick={toggleAssistant}
          className={`flex items-center justify-center rounded-full w-20 h-20 sm:w-22 sm:h-22 transition-all duration-500 shadow-lg backdrop-blur-sm border-2 border-white/20 animate-glow ${
            isListening 
              ? 'bg-gradient-to-br from-[#D94E27] to-[#F05E3A] ring-4 ring-[#D94E27]/40 shadow-[0_0_30px_rgba(217,78,39,0.5)]' 
              : 'bg-gradient-to-br from-[#D94E27] to-[#F05E3A] hover:from-[#F05E3A] hover:to-[#D94E27] hover:shadow-[0_0_25px_rgba(217,78,39,0.4)] shadow-[0_0_15px_rgba(217,78,39,0.3)]'
          }`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <FaMicrophoneSlash className="text-white text-3xl sm:text-4xl" />
          ) : (
            <FaMicrophone className="text-white text-3xl sm:text-4xl" />
          )}
        </button>
        <div className="text-lg font-semibold text-white text-center mt-5">
          <span className="px-5 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
            tap to speak
          </span>
        </div>
      </div>
      
      {/* Chat Button */}
      <div 
        className={`fixed bottom-16 sm:bottom-20 right-4 sm:right-8 z-20 transition-all duration-500 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}
      >
        <button 
          onClick={() => setShowChat(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-black/80 to-black/70 backdrop-blur-md text-white hover:text-white px-4 py-2.5 rounded-full border border-[#D94E27]/40 hover:border-[#D94E27]/70 transition-all duration-300 text-sm shadow-lg"
        >
          <FiMessageSquare className="text-[#D94E27]" size={18} />
          <span className="hidden xs:inline">Chat with AI</span>
          <span className="xs:hidden">Chat</span>
        </button>
      </div>
      
      {/* Chat Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${showChat ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowChat(false)}></div>
        
        <div 
          className={`relative bg-gradient-to-b from-black/95 to-black/90 border border-[#D94E27]/30 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md h-[500px] sm:h-[600px] max-h-[90vh] flex flex-col shadow-2xl transition-all duration-500 ${
            showChat ? 'opacity-100 transform-none' : 'opacity-0 scale-95'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#D94E27]/20">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D94E27] animate-pulse"></div>
              <h3 className="text-white text-base sm:text-lg font-medium">alham AI Chat</h3>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 text-sm sm:text-base ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-[#D94E27]/30 to-[#D94E27]/20 text-white' 
                      : 'bg-white/8 text-white/95 backdrop-blur-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 bg-white/5">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-[#D94E27]/60 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-[#D94E27]/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-[#D94E27]/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef}></div>
          </div>
          
          {/* Chat Input */}
          <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-[#D94E27]/20">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/60 border border-[#D94E27]/30 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D94E27]/60 transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`flex items-center justify-center bg-gradient-to-r from-[#D94E27] to-[#F05E3A] rounded-full w-10 h-10 sm:w-12 sm:h-12 text-white ${
                  !inputValue.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#F05E3A] hover:to-[#D94E27]'
                }`}
              >
                <FiSend className="text-base sm:text-lg" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-1000 delay-600 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 py-6 sm:py-8 text-white/40 text-xs sm:text-sm">
          <span>© Abdullah Khan</span>
          <span className="text-[#D94E27]/40 hidden xs:inline">•</span>
          <span className="text-[#D94E27]/90">alham AI</span>
          <span className="text-[#D94E27]/40 hidden xs:inline">•</span>
          <span><a href="https://www.linkedin.com/in/abdullahkhannn" className="hover:text-white/70 transition-colors duration-300">LinkedIn</a></span>
        </div>
      </div>
    </div>
  )
}

export default MainPage
