import { NextRequest, NextResponse } from 'next/server'
import portfolioData from '@/data/portfolio.json'
import { chatAnalytics } from '@/utils/chatAnalytics'
import { knowledgeBase } from '@/utils/knowledgeBase'

interface ConversationContext {
  sessionId: string
  messages: Array<{ role: string; content: string; timestamp: string }>
  userIntent?: string
  topics: string[]
}

// In-memory conversation store (use Redis in production)
const conversations = new Map<string, ConversationContext>()

const SYSTEM_PROMPT = `You are Ashfaq Nabi's advanced AI assistant. You are a fully conversational AI like ChatGPT or Gemini - you can discuss any topic, answer any question, and engage in natural conversations. However, you have specialized expertise about Ashfaq's professional background.

PERSONALITY: Friendly, intelligent, conversational, and helpful with ANY topic. Think and respond naturally like a human would.

PORTFOLIO DATA: ${JSON.stringify(portfolioData, null, 2)}

CAPABILITIES:
- Answer ANY question on ANY topic (science, history, cooking, philosophy, etc.)
- Engage in natural conversations about anything
- Provide detailed information about Ashfaq's skills, projects, and experience
- Help with technical discussions, general knowledge, creative tasks
- Assist with contact and collaboration inquiries
- Think critically and provide thoughtful responses

RESPONSE GUIDELINES:
- Answer all questions naturally and helpfully (like ChatGPT would)
- For Ashfaq-related questions, use the portfolio data for specific details
- Be conversational, intelligent, and engaging
- Think through problems and provide reasoned responses
- When relevant, you can mention Ashfaq's expertise, but don't force it
- Keep responses natural and conversational (max 300 words)
- Use a friendly, intelligent tone like other AI assistants

INTENT DETECTION: Classify user queries into: skills, projects, contact, experience, collaboration, technical, general`

function detectIntent(message: string): string {
  const msg = message.toLowerCase()
  if (msg.includes('skill') || msg.includes('tech') || msg.includes('programming') || msg.includes('language')) return 'skills'
  if (msg.includes('project') || msg.includes('work') || msg.includes('portfolio') || msg.includes('demo')) return 'projects'
  if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('reach')) return 'contact'
  if (msg.includes('experience') || msg.includes('education') || msg.includes('background') || msg.includes('career')) return 'experience'
  if (msg.includes('hire') || msg.includes('collaborate') || msg.includes('opportunity') || msg.includes('available')) return 'collaboration'
  if (msg.includes('how') || msg.includes('implement') || msg.includes('build') || msg.includes('develop')) return 'technical'
  return 'general'
}

function generateSuggestions(intent: string): string[] {
  const suggestions: Record<string, string[]> = {
    skills: ["What AI/ML technologies does he use?", "Show me his full tech stack", "What's his strongest programming language?"],
    projects: ["Tell me about LinkVault features", "What was the biggest impact project?", "Show me live demos"],
    contact: ["What's the best way to reach him?", "Is he available for freelance work?", "How quickly does he respond?"],
    experience: ["What companies has he worked with?", "What's his educational background?", "How many years of experience?"],
    collaboration: ["What type of projects is he looking for?", "What's his hourly rate?", "Can he work remotely?"],
    technical: ["How does he approach AI integration?", "What's his development process?", "Can he explain his architecture choices?"],
    general: ["What makes him unique as a developer?", "What are his recent achievements?", "What's he currently working on?"]
  }
  return suggestions[intent] || suggestions.general
}

async function callGeminiAPI(messages: Array<{ role: string; content: string }>, apiKey: string, query: string) {
  const conversationHistory = messages.slice(-5).map(msg => 
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n')

  // Get relevant knowledge context
  const relevantKnowledge = knowledgeBase.searchKnowledge(query, 2)
  const knowledgeContext = relevantKnowledge.map(k => k.content).join('\n')

  const prompt = `${SYSTEM_PROMPT}

RELEVANT KNOWLEDGE CONTEXT:
${knowledgeContext}

CONVERSATION HISTORY:
${conversationHistory}

Current User Message: ${messages[messages.length - 1].content}

Provide a helpful, specific response as Ashfaq's AI assistant. Use the knowledge context to give accurate, detailed information:`

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    })
  })

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)
  
  return response.body
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { message, sessionId } = await request.json()
    
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Initialize analytics tracking
    chatAnalytics.trackSession(sessionId)

    // Get or create conversation context
    let context = conversations.get(sessionId) || {
      sessionId,
      messages: [] as Array<{ role: string; content: string; timestamp: string }>,
      topics: [] as string[]
    }

    // Add user message to context
    const userMessage = { role: 'user', content: message.trim(), timestamp: new Date().toISOString() }
    context.messages.push(userMessage)

    // Detect intent and update topics
    const intent = detectIntent(message)
    if (!context.topics.includes(intent)) {
      context.topics.push(intent)
    }

    let aiResponse: string
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (apiKey) {
      try {
        const stream = await callGeminiAPI(context.messages, apiKey, message)
        
        if (!stream) throw new Error('Empty response from Gemini')
        
        // Return streaming response
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        })
        
      } catch (apiError) {
        console.error('Gemini API error:', apiError)
        aiResponse = getIntelligentFallback(message, intent, context)
      }
    } else {
      aiResponse = getIntelligentFallback(message, intent, context)
    }

    // Add AI response to context
    const assistantMessage = { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    context.messages.push(assistantMessage)

    // Update conversation store
    conversations.set(sessionId, context)

    // Track analytics
    const responseTime = Date.now() - startTime
    chatAnalytics.trackMessage(sessionId, intent, responseTime)

    // Generate intelligent suggestions based on conversation flow
    const previousIntents = context.messages
      .filter(m => m.role === 'user')
      .map(m => detectIntent(m.content))
    
    const smartSuggestions = knowledgeBase.generateFollowUps(intent, previousIntents)
    const fallbackSuggestions = generateSuggestions(intent)
    const suggestions = smartSuggestions.length > 0 ? smartSuggestions : fallbackSuggestions

    // Clean up old conversations (keep last 100)
    if (conversations.size > 100) {
      const oldestKey = conversations.keys().next().value
      if (oldestKey) {
        conversations.delete(oldestKey)
      }
    }

    return NextResponse.json({
      response: aiResponse,
      intent,
      suggestions,
      context: {
        topics: context.topics,
        messageCount: context.messages.length,
        conversationDepth: previousIntents.length,
        leadQuality: chatAnalytics.getSessionInsights(sessionId)?.leadQuality
      },
      performance: {
        responseTime,
        knowledgeMatches: knowledgeBase.searchKnowledge(message, 1).length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      response: "I'm Ashfaq's advanced AI assistant with deep knowledge of his expertise. I can provide detailed insights about his skills, projects, experience, and help you connect with him. What would you like to explore?",
      intent: 'general',
      suggestions: ["What are his core technical skills?", "Show me his most impactful projects", "How can I get in touch with him?"],
      context: { topics: [], messageCount: 1 },
      timestamp: new Date().toISOString()
    })
  }
}

function getIntelligentFallback(message: string, intent: string, context: ConversationContext): string {
  const { personal, skills, projects, about } = portfolioData

  switch (intent) {
    case 'skills':
      return `Ashfaq specializes in:\n\n🤖 **AI/ML**: ${skills.ai_ml.slice(0, 4).join(', ')}\n💻 **Programming**: ${skills.programming.slice(0, 4).join(', ')}\n🛠️ **Tools**: ${skills.tools.slice(0, 4).join(', ')}\n⚡ **Automation**: ${skills.automation.slice(0, 3).join(', ')}\n\nHe's particularly strong in AI integration and workflow automation. Want to know about a specific technology?`

    case 'projects':
      const featuredProjects = projects.filter(p => p.featured).slice(0, 2)
      return `Here are Ashfaq's key projects:\n\n${featuredProjects.map(p => 
        `🚀 **${p.title}**\n${p.description}\n💡 Impact: ${p.impact}\n🔗 [View Demo](${p.demo})`
      ).join('\n\n')}\n\nWant to see more projects or learn about the technical implementation?`

    case 'contact':
      return `Ready to connect with Ashfaq? Here's how:\n\n📧 **Email**: ${personal.email}\n📱 **Phone**: ${personal.phone}\n💼 **LinkedIn**: [Connect here](${personal.linkedin})\n🐙 **GitHub**: [View code](${personal.github})\n📍 **Location**: ${personal.location}\n\nHe typically responds within 24 hours and is available for freelance projects!`

    case 'experience':
      return `Ashfaq brings solid experience:\n\n💼 **2+ years** of full-stack development\n🎓 **MCA** from BGSB University (CGPA 8.50)\n🎓 **BCA** from Govt Degree College Ganderbal\n🏆 **50+ companies** served with automation solutions\n📈 **35% cost reduction** achieved for clients\n⚡ **95% system reliability** across projects\n\nWant to know about specific technologies or project outcomes?`

    case 'collaboration':
      return `Ashfaq is available for:\n\n✅ Full-stack web development\n✅ AI/ML integration projects\n✅ Workflow automation solutions\n✅ SaaS product development\n✅ Technical consulting\n\n📅 **Availability**: Open for new projects\n⏱️ **Response time**: Within 24 hours\n🌍 **Work style**: Remote-friendly\n\nReady to discuss your project? Contact him at ${personal.email}`

    case 'technical':
      return `Ashfaq's technical approach:\n\n🏗️ **Architecture**: Scalable, modular design patterns\n🤖 **AI Integration**: OpenAI, LangChain, custom prompts\n⚡ **Performance**: Optimized for speed and reliability\n🔒 **Security**: Enterprise-grade best practices\n🧪 **Testing**: Comprehensive testing strategies\n\nNeed specifics about implementation or want to discuss your technical requirements?`

    default:
      return `Hi! I'm Ashfaq's AI assistant. I can help you explore:\n\n💻 His technical skills and expertise\n🚀 Featured projects with live demos\n💼 Professional experience and achievements\n📧 Contact information and availability\n🤝 Collaboration opportunities\n\nWhat interests you most about Ashfaq's work?`
  }
}
