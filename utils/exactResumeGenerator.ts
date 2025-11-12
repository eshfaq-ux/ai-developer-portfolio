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
  certifications?: {
    title: string
    issuer: string
    date: string
    description: string
  }[]
}

export const generateExactResumePDF = (data: PortfolioData) => {
  const pdf = new jsPDF()
  let yPosition = 25
  const pageWidth = pdf.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  // Exact color matching
  const colors = {
    primary: [0, 0, 0] as [number, number, number],
    secondary: [0, 0, 0] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
  }

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 270) {
      pdf.addPage()
      yPosition = 25
    }
  }

  // HEADER - Exact match to original
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.primary)
  
  // Name without spaces (original format)
  pdf.text(data.personal.name.toUpperCase(), margin, yPosition)
  yPosition += 10
  
  // Contact info - no separators, concatenated
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  const contactText = `${data.personal.location}${data.personal.email}${data.personal.phone || ''}${data.personal.linkedin.replace('https://www.linkedin.com/', '')}`
  pdf.text(contactText, margin, yPosition)
  yPosition += 15

  // SUMMARY
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('SUMMARY', margin, yPosition)
  yPosition += 8
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const summaryText = data.about.description.replace(/\s+/g, ' ')
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth)
  pdf.text(summaryLines, margin, yPosition)
  yPosition += summaryLines.length * 4 + 12

  // EXPERIENCE
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EXPERIENCE', margin, yPosition)
  yPosition += 8
  
  const workExperience = data.experience.filter(exp => exp.type !== 'Education')
  workExperience.forEach((exp) => {
    checkPageBreak(40)
    
    // Job title
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(exp.title, margin, yPosition)
    yPosition += 5
    
    // Company and duration - concatenated format
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const jobLine = `${exp.company} ${exp.duration}${exp.location || 'Remote'} ,`
    pdf.text(jobLine, margin, yPosition)
    yPosition += 6
    
    // Achievements - original bullet format
    if (exp.achievements && exp.achievements.length > 0) {
      exp.achievements.forEach(achievement => {
        checkPageBreak(10)
        const achievementText = `${achievement} •`
        const achievementLines = pdf.splitTextToSize(achievementText, contentWidth)
        pdf.text(achievementLines, margin, yPosition)
        yPosition += achievementLines.length * 4 + 1
      })
    }
    yPosition += 8
  })

  // PROJECTS
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PROJECTS', margin, yPosition)
  yPosition += 8
  
  data.projects.slice(0, 3).forEach((project) => {
    checkPageBreak(20)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(project.title, margin, yPosition)
    yPosition += 5
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const impactText = `${project.impact} •`
    const impactLines = pdf.splitTextToSize(impactText, contentWidth)
    pdf.text(impactLines, margin, yPosition)
    yPosition += impactLines.length * 4 + 6
  })

  // EDUCATION
  const education = data.experience.filter(exp => exp.type === 'Education')
  if (education.length > 0) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('EDUCATION', margin, yPosition)
    yPosition += 8
    
    education.forEach(edu => {
      checkPageBreak(20)
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(edu.title, margin, yPosition)
      yPosition += 5
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const eduLine = `${edu.company}•${edu.duration}`
      pdf.text(eduLine, margin, yPosition)
      yPosition += 5
      
      if (edu.achievements && edu.achievements.length > 0) {
        edu.achievements.slice(0, 3).forEach(achievement => {
          const achievementText = `${achievement} •`
          const achievementLines = pdf.splitTextToSize(achievementText, contentWidth)
          pdf.text(achievementLines, margin, yPosition)
          yPosition += achievementLines.length * 4 + 1
        })
      }
      yPosition += 6
    })
  }

  // CERTIFICATIONS
  if (data.certifications && data.certifications.length > 0) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CERTIFICATIONS', margin, yPosition)
    yPosition += 8
    
    data.certifications.forEach(cert => {
      checkPageBreak(15)
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(cert.title, margin, yPosition)
      yPosition += 5
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const certLine = `${cert.issuer}•${cert.date}`
      pdf.text(certLine, margin, yPosition)
      yPosition += 5
      
      if (cert.description) {
        const descText = `${cert.description} •`
        const descLines = pdf.splitTextToSize(descText, contentWidth)
        pdf.text(descLines, margin, yPosition)
        yPosition += descLines.length * 4 + 6
      }
    })
  }

  // Save
  const fileName = `${data.personal.name.replace(/\s+/g, '_')}_Resume_Exact_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}
