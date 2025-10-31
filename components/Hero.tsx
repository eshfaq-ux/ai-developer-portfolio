'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import portfolioData from '@/data/portfolio.json'

const Hero = () => {
  const { personal } = portfolioData
  const [displayedName, setDisplayedName] = useState('')
  const [isNameComplete, setIsNameComplete] = useState(false)
  const [currentRole, setCurrentRole] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number, opacity: number}>>([])
  
  const fullName = personal.name
  const roles = useMemo(() => [
    'Full Stack Developer',
    'AI Integration Specialist', 
    'React & Node.js Expert',
    'Automation Engineer'
  ], [])
  
  // Enhanced name typing effect with sound-like rhythm
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = []
    
    const typeText = (text: string, callback: () => void) => {
      for (let i = 0; i <= text.length; i++) {
        const delay = i === 0 ? 0 : (text[i-1] === ' ' ? 200 : Math.random() * 100 + 50)
        const timeout = setTimeout(() => {
          setDisplayedName(text.slice(0, i))
          if (i === text.length) {
            setTimeout(callback, 800)
          }
        }, i * 80 + delay)
        timeouts.push(timeout)
      }
    }

    // Start typing after initial delay
    const startTimeout = setTimeout(() => {
      typeText(fullName, () => setIsNameComplete(true))
    }, 1000)
    timeouts.push(startTimeout)

    return () => timeouts.forEach(clearTimeout)
  }, [fullName])

  // Enhanced role rotation with smooth transitions
  useEffect(() => {
    if (!isNameComplete) return

    let timeouts: NodeJS.Timeout[] = []
    let intervalId: NodeJS.Timeout

    const typeRole = (role: string) => {
      setIsTyping(true)
      
      for (let i = 0; i <= role.length; i++) {
        const timeout = setTimeout(() => {
          setCurrentRole(role.slice(0, i))
          if (i === role.length) {
            setIsTyping(false)
          }
        }, i * 60)
        timeouts.push(timeout)
      }
    }

    const eraseRole = (callback: () => void) => {
      const roleToErase = roles[roleIndex]
      for (let i = roleToErase.length; i >= 0; i--) {
        const timeout = setTimeout(() => {
          setCurrentRole(roleToErase.slice(0, i))
          if (i === 0) {
            setTimeout(callback, 300)
          }
        }, (roleToErase.length - i) * 40)
        timeouts.push(timeout)
      }
    }

    // Start with first role
    const startTimeout = setTimeout(() => {
      typeRole(roles[0])
      
      // Set up rotation after initial typing
      intervalId = setInterval(() => {
        eraseRole(() => {
          setRoleIndex(prev => {
            const nextIndex = (prev + 1) % roles.length
            setTimeout(() => typeRole(roles[nextIndex]), 100)
            return nextIndex
          })
        })
      }, 4000)
    }, 1000)
    
    timeouts.push(startTimeout)

    return () => {
      clearInterval(intervalId)
      timeouts.forEach(clearTimeout)
    }
  }, [isNameComplete, roles, roleIndex])

  // Optimized particles with better performance
  useEffect(() => {
    const particleCount = 50 // Reduced from 150
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // Smaller particles
      speed: Math.random() * 0.5 + 0.1, // Slower movement
      opacity: Math.random() * 0.6 + 0.2
    }))
    setParticles(newParticles)

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -5 ? 105 : particle.y - particle.speed
      })))
    }

    const interval = setInterval(animateParticles, 100) // Slower animation (was 50ms)
    return () => clearInterval(interval)
  }, []) // Removed mousePosition dependency for better performance

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-950 to-black pt-20 relative overflow-hidden">
      {/* Optimized Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-green-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      {/* Simplified Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl top-20 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl bottom-20 right-10"></div>
      </div>

      {/* Content Layer with enhanced animations */}
      <div className="container-custom text-center relative z-10 px-4 sm:px-6">
        {/* Enhanced Profile Image */}
        <div className="mb-8 mt-14 flex justify-center">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-1 animate-pulse">
              <Image 
                src="/1000003500.jpg" 
                alt={personal.name}
                width={160}
                height={160}
                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-all duration-500 group-hover:rotate-3"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-30 group-hover:opacity-50 transition-all duration-500 animate-ping"></div>
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Typography with stagger animations */}
        <div className="mb-12">
          <p className={`text-xl sm:text-2xl text-gray-300 mb-6 font-medium transition-all duration-1000 ${isNameComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Hello, I'm
          </p>
          <h1 className="leading-none mb-8" role="banner">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                {displayedName.split(' ')[0]}
              </span>
              {displayedName.split(' ')[1] && (
                <span className="text-white font-light ml-3 sm:ml-4">
                  {displayedName.split(' ')[1]}
                </span>
              )}
              <span className={`text-white ${isNameComplete ? 'animate-pulse' : 'animate-blink'}`}>|</span>
            </span>
          </h1>
        </div>
        
        <div className="mb-12">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl mb-6 font-medium transition-all duration-1000 delay-500 ${isNameComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              Full Stack Developer
            </span>
            <span className="text-gray-300 mx-3 animate-pulse">&</span>
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient-x">
              AI Developer
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed min-h-[2rem] transition-all duration-300">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {currentRole}
            </span>
            {isNameComplete && (
              <span className="animate-pulse text-green-400">|</span>
            )}
          </p>
          
          {/* Enhanced Professional Tagline */}
          <p className={`text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mt-4 leading-relaxed transition-all duration-1000 delay-1000 ${isNameComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Building scalable web applications with intelligent automation
          </p>
        </div>

        {/* Enhanced CTA with hover effects */}
        <div className={`mb-8 transition-all duration-1000 delay-1500 ${isNameComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a 
            href="#projects" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  )
}

export default Hero
