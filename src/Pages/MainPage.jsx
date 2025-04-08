import React, { useState, useEffect, useRef } from 'react'
import { startAssistant, stopAssistant, sendChatMessage } from '../ai'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { FiMessageSquare, FiSend, FiX } from 'react-icons/fi'
import Threads from '../components/Threads'

// Component for mobile title display
const MobileTitle = ({ onMouseEnter, onMouseLeave }) => (
  <div className="block md:hidden">
    <h1 
      className="text-white font-light cursor-pointer"
      style={{ 
        letterSpacing: '-0.05em',
        textShadow: '0 0 20px rgba(217, 78, 39, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-5xl" style={{ lineHeight: '1.1' }}>alham</div>
      <div className="text-3xl" style={{ marginTop: '30px', marginBottom: '25px' }}>AI</div>
    </h1>
  </div>
);

// Component for desktop title display
const DesktopTitle = ({ onMouseEnter, onMouseLeave }) => (
  <div className="hidden md:block">
    <h1 
      className="text-white font-light cursor-pointer"
      style={{ 
        letterSpacing: '-0.05em',
        textShadow: '0 0 20px rgba(217, 78, 39, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-8xl" style={{ lineHeight: '1.1' }}>alham</div>
      <div className="text-5xl mt-2 mb-4">AI</div>
    </h1>
  </div>
);

const MainPage = () => {
  const [isListening, setIsListening] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showChat, setShowChat] = useState(false)
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
        className={`absolute z-10 text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`} 
        style={{ top: '18%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '90%' }}
      >
        <div className="relative inline-block">
          <MobileTitle 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          <DesktopTitle 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          
          {/* Informative Tooltip */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md border border-[#D94E27]/30 rounded-lg p-4 shadow-lg text-left w-72 sm:w-80 z-20 transition-all duration-300 ${
              showTooltip ? 'opacity-100 -top-28' : 'opacity-0 -top-20 pointer-events-none'
            }`}
          >
            <div className="text-[#D94E27] text-sm font-medium mb-1">alham (الهام)</div>
            <div className="text-white/80 text-sm mb-2">An Arabic term meaning "inspiration" or "divine guidance".</div>
            <div className="text-white/60 text-xs">alham AI aims to provide guidance through technology with Islamic principles at its core.</div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-black/90 border-r border-b border-[#D94E27]/30"></div>
          </div>
        </div>
        
        <p className="text-white/60 text-sm xs:text-base sm:text-lg md:text-xl font-light tracking-wide mb-8 px-4">
          first ever <span className="relative inline-block mx-1">
            <span className="absolute inset-0 bg-[#D94E27] rounded-md opacity-40" style={{ transform: 'skew(-5deg)', padding: '0 4px' }}></span>
            <span className="relative text-white font-normal px-1">islamic</span>
          </span> voice assistant.
        </p>
      </div>
      
      {/* Microphone button in center */}
      <div 
        className={`absolute z-10 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}
        style={{ top: '70%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <button 
          onClick={toggleAssistant}
          className={`flex items-center justify-center rounded-full w-14 h-14 sm:w-16 sm:h-16 transition-all duration-500 shadow-lg ${
            isListening 
              ? 'bg-[#D94E27] ring-2 ring-[#D94E27]/60 shadow-[#D94E27]/20' 
              : 'bg-[#D94E27] hover:bg-[#D94E27]/90 hover:shadow-[0_0_25px_rgba(217,78,39,0.4)] shadow-[#D94E27]/10'
          }`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <FaMicrophoneSlash className="text-white text-xl sm:text-2xl" />
          ) : (
            <FaMicrophone className="text-white text-xl sm:text-2xl" />
          )}
        </button>
        <div className="text-xs font-light text-white/40 text-center mt-5">tap to speak</div>
      </div>
      
      {/* Chat Button */}
      <div 
        className={`fixed bottom-16 sm:bottom-20 right-4 sm:right-8 z-20 transition-all duration-500 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}
      >
        <button 
          onClick={() => setShowChat(true)}
          className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white/80 hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#D94E27]/30 hover:border-[#D94E27]/60 transition-all duration-300 text-xs sm:text-sm shadow-lg"
        >
          <FiMessageSquare className="text-[#D94E27]" />
          <span className="hidden xs:inline">Chat with our AI</span>
          <span className="xs:hidden">Chat</span>
        </button>
      </div>
      
      {/* Chat Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${showChat ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowChat(false)}></div>
        
        <div 
          className={`relative bg-black/90 border border-[#D94E27]/20 rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-md h-[500px] sm:h-[600px] max-h-[90vh] flex flex-col shadow-2xl transition-all duration-500 ${
            showChat ? 'opacity-100 transform-none' : 'opacity-0 scale-95'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#D94E27]/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#D94E27]"></div>
              <h3 className="text-white text-sm sm:text-base font-medium">alham AI Chat</h3>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <FiX />
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
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 text-sm sm:text-base ${
                    message.role === 'user' 
                      ? 'bg-[#D94E27]/20 text-white' 
                      : 'bg-white/5 text-white/90'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 bg-white/5">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#D94E27]/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#D94E27]/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#D94E27]/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef}></div>
          </div>
          
          {/* Chat Input */}
          <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-[#D94E27]/10">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-[#D94E27]/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm text-white focus:outline-none focus:border-[#D94E27]/40 transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`flex items-center justify-center bg-[#D94E27] rounded-full w-8 h-8 sm:w-10 sm:h-10 text-white ${
                  !inputValue.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#D94E27]/90'
                }`}
              >
                <FiSend className="text-sm sm:text-base" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-1000 delay-600 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 py-6 sm:py-8 text-white/30 text-[10px] sm:text-xs">
          <span>© Abdullah Khan</span>
          <span className="text-[#D94E27]/30 hidden xs:inline">•</span>
          <span>alham AI</span>
          <span className="text-[#D94E27]/30 hidden xs:inline">•</span>
          <span><a href="https://www.linkedin.com/in/abdullahkhannn" className="hover:text-white/60 transition-colors duration-300">LinkedIn</a></span>
        </div>
      </div>
    </div>
  )
}

export default MainPage
