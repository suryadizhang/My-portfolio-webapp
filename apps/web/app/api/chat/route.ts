import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// AI-powered chatbot for Suryadi Zhang's portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle both message formats for compatibility
    let userMessage = ''
    if (body.message) {
      // Single message format from frontend
      userMessage = body.message
    } else if (body.messages && body.messages.length > 0) {
      // Messages array format
      userMessage = body.messages[body.messages.length - 1]?.content || ''
    }
    
    const lowerMessage = userMessage.toLowerCase()
    
    // Enhanced intelligent responses with personality
    let reply = ""
    let useCustomResponse = false
    
    // Greeting patterns
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      reply = "Hey there! 👋 I'm Suryadi's AI assistant. I'd love to tell you about his journey as a passionate full-stack developer! Feel free to ask about:\n\n✨ **Projects** - Cool stuff he's built\n🛠️ **Tech Stack** - His favorite tools and technologies\n💼 **Experience** - His development journey\n🎯 **Work Style** - How he approaches problems\n📞 **Contact** - How to reach him\n\nWhat sparks your curiosity?"
      useCustomResponse = true
    }
    
    // About capabilities
    else if (lowerMessage.includes('what can you do') || lowerMessage.includes('what do you do')) {
      reply = "Great question! I'm here to share insights about Suryadi Zhang - a passionate full-stack developer who loves creating elegant solutions to complex problems. 🚀\n\nI can tell you about:\n\n💻 **His technical projects** and the cool challenges he's solved\n🔧 **Technologies he masters** and why he chose them\n📈 **His growth journey** from curiosity to expertise\n🎨 **His development philosophy** and problem-solving approach\n🤝 **How to connect** for collaborations or opportunities\n\nWhat aspect interests you most?"
      useCustomResponse = true
    }
    
    // Personality and personal traits
    else if (lowerMessage.includes('personality') || lowerMessage.includes('personal') || lowerMessage.includes('character') || lowerMessage.includes('person')) {
      reply = "Great question! While I focus on Suryadi's professional work, I can share that his **coding style reflects his personality**:\n\n🎯 **Detail-oriented** - He writes clean, well-documented code\n🚀 **Problem solver** - Loves tackling complex technical challenges\n🤝 **Collaborative** - Enjoys working with teams and sharing knowledge\n📚 **Continuous learner** - Always exploring new technologies\n💡 **Creative thinker** - Finds elegant solutions to tough problems\n\nFor more personal insights, I'd recommend connecting with him directly! Want to know how to reach out?"
      useCustomResponse = true
    }
    
    // Projects
    else if (lowerMessage.includes('project')) {
      reply = "Suryadi has built some really impressive stuff! Here are his standout projects:\n\n🏢 **Live Booking System**\nFull-stack application with React/Next.js frontend and Python/FastAPI backend. Real-time booking management with clean UI/UX.\n\n🌐 **Portfolio Website** (you're on it!)\nModern, responsive design with custom AI chatbot integration. Built with Next.js 15 and advanced optimization.\n\n⚡ **API Development**\nRESTful services with PostgreSQL integration, proper authentication, and comprehensive documentation.\n\n🔄 **CI/CD Automation**\nStreamlined deployment pipelines using GitHub Actions for seamless development workflows.\n\nWhich one catches your eye? I can dive deeper!"
      useCustomResponse = true
    }
    
    // Tech stack
    else if (lowerMessage.includes('stack') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      reply = "Suryadi's got a solid modern tech arsenal! 🛠️\n\n**Frontend Magic:**\n• React & Next.js (his go-to for building sleek UIs)\n• TypeScript (for rock-solid type safety)\n• Tailwind CSS (rapid, beautiful styling)\n\n**Backend Power:**\n• Python & FastAPI (fast, efficient APIs)\n• Node.js (when JavaScript rules)\n• PostgreSQL & MongoDB (data that scales)\n\n**DevOps Excellence:**\n• Docker (consistent environments)\n• GitHub Actions (automated workflows)\n• Vercel (lightning-fast deployments)\n\n**Daily Tools:**\n• Git (version control mastery)\n• VS Code (productivity powerhouse)\n• Postman (API testing wizard)\n\nWhat technology interests you most?"
      useCustomResponse = true
    }
    
    // Experience and skills
    else if (lowerMessage.includes('experience') || lowerMessage.includes('skill')) {
      reply = "Suryadi brings a well-rounded skill set to the table! 💪\n\n🌟 **Core Strengths:**\n• **Full-Stack Development** - Seamless frontend-to-backend integration\n• **API Architecture** - RESTful services that scale and perform\n• **Database Design** - Efficient data modeling and optimization\n• **DevOps Practices** - Automated pipelines and deployment strategies\n\n🚀 **What Sets Him Apart:**\n• **Problem-First Thinking** - Understands business needs before coding\n• **Clean Code Advocate** - Maintainable, readable, testable solutions\n• **Performance Focused** - Optimizes for speed and user experience\n• **Team Player** - Collaborates well and mentors others\n\nHe's passionate about building applications that users actually love using! Want to know more about any specific area?"
      useCustomResponse = true
    }
    
    // Contact and hiring
    else if (lowerMessage.includes('hire') || lowerMessage.includes('work') || lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      reply = "Suryadi is definitely open to exciting opportunities! 🎯\n\n**Ready to Connect?**\n📧 **Email:** suryadizhang.swe@gmail.com\n💼 **LinkedIn:** linkedin.com/in/suryadi-zhang\n🌐 **Portfolio:** suryadizhang.dev\n\n**What He's Looking For:**\n• Challenging full-stack development roles\n• Teams that value clean code and innovation\n• Projects with real impact and growth potential\n• Collaborative environments where he can contribute and learn\n\n**His Availability:**\n✅ Full-time positions\n✅ Contract/freelance projects\n✅ Technical consultations\n\nDon't hesitate to reach out - he's always excited to discuss new opportunities and interesting projects!"
      useCustomResponse = true
    }
    
    // OpenAI or AI source question
    else if (lowerMessage.includes('openai') || lowerMessage.includes('open ai') || lowerMessage.includes('ai source') || lowerMessage.includes('based on')) {
      reply = "Good eye! 🔍 This chatbot is now **hybrid-powered**! Here's the tech behind me:\n\n🛠️ **Hybrid Implementation:**\n• Custom responses for Suryadi-specific questions (portfolio, projects, experience)\n• OpenAI integration for general knowledge and conversations\n• Smart pattern matching to decide which system to use\n• Best of both worlds approach\n\n💡 **Why Hybrid vs. Pure OpenAI?**\n• Perfect accuracy for portfolio-specific information\n• Natural conversation ability for general topics\n• Cost-effective (only uses OpenAI when needed)\n• Controlled responses for professional content\n• Enhanced user experience\n\nPretty cool hybrid system, right? Want to test it by asking about something non-portfolio related?"
      useCustomResponse = true
    }
    
    // If no custom response was triggered, use OpenAI for general questions
    if (!useCustomResponse) {
      try {
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are Suryadi Zhang's AI assistant for his portfolio website. You are helpful, friendly, and professional. 

When users ask about Suryadi specifically (his projects, experience, tech stack, contact info), you should politely redirect them to ask more specific questions about his work, as you have detailed information about his professional background.

For general questions not related to Suryadi's portfolio, feel free to provide helpful and informative responses while maintaining a professional and friendly tone.

Keep responses concise but informative. Use emojis sparingly and appropriately.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        reply = completion.choices[0]?.message?.content || 
                "I'm here to help! Feel free to ask me about Suryadi's work and experience, or anything else you'd like to know!"
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        reply = "I'd love to help you learn more about Suryadi! 🌟\n\nI'm his AI assistant, designed to share insights about his work as a passionate full-stack developer. Here's what I can tell you about:\n\n🚀 **His Projects** - From booking systems to AI chatbots\n⚡ **His Tech Skills** - Modern full-stack development\n💼 **His Experience** - Problem-solving and clean code\n🎯 **His Approach** - User-focused, performance-driven development\n📞 **How to Connect** - For opportunities and collaborations\n\nWhat would you like to explore? Just ask me anything about his work!"
      }
    }
    
    return Response.json({ 
      message: reply 
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    return Response.json({ 
      message: "Oops! I'm having a technical hiccup 🤖⚡ But hey, that's what makes development interesting, right? \n\nFor now, feel free to reach out to Suryadi directly:\n📧 suryadizhang.swe@gmail.com\n\nHe'd love to chat about his projects and experience!"
    }, { status: 500 })
  }
}