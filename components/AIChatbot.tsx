'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Minimize2, Maximize2, RotateCcw, Copy, ExternalLink, Calendar } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  intent?: string
  suggestions?: string[]
}

const quickActions = [
  { label: "💻 Technical Skills", query: "What are Ashfaq's technical skills and expertise?", icon: "💻" },
  { label: "🚀 Featured Projects", query: "Show me Ashfaq's best projects with demos", icon: "🚀" },
  { label: "📧 Contact Info", query: "How can I contact Ashfaq for opportunities?", icon: "📧" },
  { label: "💼 Work Experience", query: "Tell me about Ashfaq's professional experience", icon: "💼" },
  { label: "🤖 AI/ML Expertise", query: "What's Ashfaq's experience with AI and machine learning?", icon: "🤖" },
  { label: "📅 Availability", query: "Is Ashfaq available for new projects?", icon: "📅" }
]

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm Ashfaq's advanced AI assistant. I can provide detailed insights about his technical expertise, showcase his projects, or help you connect with him. What would you like to explore?",
      timestamp: new Date().toISOString(),
      suggestions: ["Tell me about his skills", "Show me his projects", "How can I contact him?"]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15))
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is streaming
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('text/plain')) {
        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let streamedText = ''
        
        setIsTyping(false)
        
        // Add empty message that we'll update
        const messageIndex = messages.length + 1
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          intent: 'general',
          suggestions: []
        }])

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value, { stream: true })
            streamedText += chunk
            
            // Update the message in real-time
            setMessages(prev => prev.map((msg, idx) => 
              idx === messageIndex ? { ...msg, content: streamedText } : msg
            ))
          }
        }
        
        setIsLoading(false)
        setShowSuggestions(true)
        return
      }

      // Handle regular JSON response (fallback)
      const data = await response.json()
      
      // Enhanced response handling
      const aiMessage = data.response || 'Sorry, I could not process your request.'
      
      // Stop typing indicator and start streaming
      setIsTyping(false)
      
      // Add empty message that we'll update
      const newMessage = {
        role: 'assistant' as const,
        content: '',
        timestamp: new Date().toISOString(),
        intent: data.intent,
        suggestions: data.suggestions
      }
      
      setMessages(prev => [...prev, newMessage])
      
      // Stream character by character
      for (let i = 0; i <= aiMessage.length; i++) {
        const currentText = aiMessage.slice(0, i)
        
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, content: currentText } : msg
        ))
        
        // Delay between characters (1ms for very fast effect)
        if (i < aiMessage.length) {
          await new Promise(resolve => setTimeout(resolve, 1))
        }
      }
      
      setIsLoading(false)
      setShowSuggestions(true)

    } catch (error) {
      console.error('Chatbot error:', error)
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m here to help you learn about Ashfaq\'s expertise! Ask me about his skills, projects, experience, or how to get in touch. I have detailed knowledge of his work and can provide specific examples.',
        timestamp: new Date().toISOString(),
        intent: 'general',
        suggestions: ["What are his key technical skills?", "Show me his best projects", "How can I contact him?"]
      }])
      setIsLoading(false)
      setShowSuggestions(true)
    }
  }

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: "👋 Hi! I'm Ashfaq's advanced AI assistant. I can provide detailed insights about his technical expertise, showcase his projects, or help you connect with him. What would you like to explore?",
      timestamp: new Date().toISOString(),
      suggestions: ["Tell me about his skills", "Show me his projects", "How can I contact him?"]
    }])
    setShowSuggestions(true)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getIntentColor = (intent?: string) => {
    const colors = {
      skills: 'bg-blue-100 text-blue-800',
      projects: 'bg-green-100 text-green-800',
      contact: 'bg-purple-100 text-purple-800',
      recruitment: 'bg-orange-100 text-orange-800',
      experience: 'bg-indigo-100 text-indigo-800'
    }
    return colors[intent as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group border border-gray-600"
          aria-label="Open AI Assistant"
        >
          <Bot size={26} className="text-gray-300" />
          
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-500 opacity-75 animate-ping"></div>
          
          {/* AI Badge */}
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
            AI
          </span>
          
          {/* Tooltip */}
          <div className="absolute -top-14 right-0 bg-gray-800 text-gray-200 text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-gray-600">
            Chat with Ashfaq's AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 z-50 transition-all duration-500 backdrop-blur-sm ${
      isMinimized ? 'w-full sm:w-80 h-16' : 'w-full sm:w-[420px] h-[80vh] sm:h-[580px] max-h-[580px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-2xl relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-gray-600/10 animate-pulse"></div>
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-gray-700/60 backdrop-blur-sm flex items-center justify-center ring-1 ring-gray-600">
            <Bot size={20} className="text-gray-300" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100 text-base">Ashfaq's AI Assistant</h3>
            <p className="text-xs text-gray-400 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isTyping ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
              }`}></span>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 relative z-10">
          <button
            onClick={resetChat}
            className="p-2 hover:bg-gray-700/60 rounded-lg transition-all duration-300 group"
            title="New Conversation"
          >
            <RotateCcw size={16} className="text-gray-400 group-hover:text-gray-200 group-hover:rotate-180 transition-all duration-500" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-700/60 rounded-lg transition-all duration-300"
          >
            {isMinimized ? <Maximize2 size={16} className="text-gray-400 hover:text-gray-200" /> : <Minimize2 size={16} className="text-gray-400 hover:text-gray-200" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-700/60 rounded-lg transition-all duration-300 text-gray-400 hover:text-gray-200 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-2 sm:pb-4 space-y-4 bg-gradient-to-b from-gray-800/20 to-gray-900/20">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      message.role === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gray-700'
                    }`}>
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`rounded-xl p-2.5 relative group shadow-sm hover:shadow-md transition-all duration-200 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/20'
                        : 'bg-gray-800 text-gray-100 border border-gray-700/50'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center space-x-2">
                          <p className={`text-xs font-medium ${
                            message.role === 'user' ? 'text-blue-100/70' : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                          {message.intent && message.role === 'assistant' && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getIntentColor(message.intent)}`}>
                              {message.intent}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                          title="Copy message"
                        >
                          <Copy size={12} className={`${message.role === 'user' ? 'text-blue-100/60 hover:text-blue-100' : 'text-gray-400 hover:text-gray-200'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Smart Suggestions */}
                {message.role === 'assistant' && message.suggestions && showSuggestions && index === messages.length - 1 && (
                  <div className="ml-11 space-y-2">
                    <p className="text-xs text-gray-400 font-medium">Suggested follow-ups:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(suggestion)}
                          className="text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-full transition-all duration-200 border border-gray-600/50 hover:border-gray-500 shadow-sm hover:shadow-md"
                          disabled={isLoading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - positioned with proper spacing */}
          <div className="flex-shrink-0 p-3 sm:p-4 mt-2 sm:mt-4 border-t border-gray-700 bg-gray-800/50">
            <div className="flex space-x-2 sm:space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about skills, projects, experience..."
                className="flex-1 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700/80 text-gray-100 placeholder-gray-400 transition-all duration-200"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 sm:p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 sm:mt-3 text-center">
              Powered by AI • Session: {sessionId.slice(0, 8)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
