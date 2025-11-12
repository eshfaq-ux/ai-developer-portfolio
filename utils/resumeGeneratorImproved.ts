import jsPDF from 'jspdf'

interface PersonalInfo {
  name: string
  title: string
  email: string
  phone?: string
  linkedin: string
  github: string
  location: string
}

interface ExperienceItem {
  title: string
  company: string
  duration: string
  location?: string
  type?: string
  description: string
  achievements?: string[]
  technologies?: string[]
}

interface ProjectItem {
  title: string
  description: string
  tech: string[]
  impact: string
  github?: string
  demo?: string
}

interface PortfolioData {
  personal: PersonalInfo
  about: {
    description: string
    keywords?: string[]
  }
  skills: {
    programming: string[]
    ai_ml: string[]
    tools: string[]
    automation: string[]
  }
  projects: ProjectItem[]
  experience: ExperienceItem[]
}

export const generateImprovedResumePDF = (data: PortfolioData) => {
  const pdf = new jsPDF()
  let yPosition = 25
  const pageWidth = pdf.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  // Enhanced professional color scheme
  const colors = {
    primary: [0, 0, 0] as [number, number, number], // Black for headers
    secondary: [60, 60, 60] as [number, number, number], // Dark gray
    accent: [100, 100, 100] as [number, number, number], // Medium gray
    text: [40, 40, 40] as [number, number, number], // Dark gray text
  }

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 270) {
      pdf.addPage()
      yPosition = 25
    }
  }

  const addSectionHeader = (title: string) => {
    checkPageBreak(15)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.primary)
    pdf.text(title.toUpperCase(), margin, yPosition)
    yPosition += 8
    pdf.setTextColor(...colors.text)
  }

  // HEADER SECTION - Enhanced professional layout
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.primary)
  
  // Name with letter spacing effect
  const nameText = data.personal.name.toUpperCase().split('').join(' ')
  pdf.text(nameText, margin, yPosition)
  yPosition += 12
  
  // Contact info in single line - professional format
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.secondary)
  
  const contactInfo = [
    data.personal.location,
    data.personal.email,
    data.personal.phone || '',
    data.personal.linkedin.replace('https://www.linkedin.com/in/', 'in/')
  ].filter(info => info).join(' • ')
  
  pdf.text(contactInfo, margin, yPosition)
  yPosition += 15

  // PROFESSIONAL SUMMARY - Clean format
  addSectionHeader('Summary')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.text)
  const summaryLines = pdf.splitTextToSize(data.about.description, contentWidth)
  pdf.text(summaryLines, margin, yPosition)
  yPosition += summaryLines.length * 4 + 12

  // PROFESSIONAL EXPERIENCE - Enhanced format
  addSectionHeader('Experience')
  
  const workExperience = data.experience.filter(exp => exp.type !== 'Education')
  workExperience.forEach((exp) => {
    checkPageBreak(40)
    
    // Job title - bold and prominent
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.primary)
    pdf.text(exp.title, margin, yPosition)
    yPosition += 5
    
    // Company, duration, location in professional format
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.secondary)
    const jobDetails = `${exp.company} • ${exp.duration} • ${exp.location || 'Remote'}`
    pdf.text(jobDetails, margin, yPosition)
    yPosition += 8
    
    // Achievements with clean bullet points
    if (exp.achievements && exp.achievements.length > 0) {
      pdf.setTextColor(...colors.text)
      exp.achievements.forEach(achievement => {
        checkPageBreak(12)
        pdf.text('•', margin, yPosition)
        const achievementLines = pdf.splitTextToSize(achievement, contentWidth - 10)
        pdf.text(achievementLines, margin + 8, yPosition)
        yPosition += achievementLines.length * 4 + 2
      })
    }
    yPosition += 8
  })

  // KEY PROJECTS - Clean professional format
  if (data.projects.length > 0) {
    addSectionHeader('Projects')
    
    data.projects.slice(0, 3).forEach((project) => {
      checkPageBreak(25)
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...colors.primary)
      pdf.text(project.title, margin, yPosition)
      yPosition += 6
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...colors.text)
      pdf.text('•', margin, yPosition)
      const impactLines = pdf.splitTextToSize(project.impact, contentWidth - 10)
      pdf.text(impactLines, margin + 8, yPosition)
      yPosition += impactLines.length * 4 + 8
    })
  }

  // EDUCATION - Professional format
  const education = data.experience.filter(exp => exp.type === 'Education')
  if (education.length > 0) {
    addSectionHeader('Education')
    
    education.forEach(edu => {
      checkPageBreak(25)
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...colors.primary)
      pdf.text(edu.title, margin, yPosition)
      yPosition += 5
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...colors.secondary)
      const eduDetails = `${edu.company} • ${edu.duration}`
      pdf.text(eduDetails, margin, yPosition)
      yPosition += 6
      
      if (edu.achievements && edu.achievements.length > 0) {
        pdf.setTextColor(...colors.text)
        edu.achievements.slice(0, 3).forEach(achievement => {
          pdf.text('•', margin, yPosition)
          const achievementLines = pdf.splitTextToSize(achievement, contentWidth - 10)
          pdf.text(achievementLines, margin + 8, yPosition)
          yPosition += achievementLines.length * 4 + 2
        })
      }
      yPosition += 8
    })
  }

  // Save with enhanced filename
  const fileName = `${data.personal.name.replace(/\s+/g, '_')}_Resume_Enhanced_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}
