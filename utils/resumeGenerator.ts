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
    certificate?: string
  }[]
}

export const generateResumePDF = (data: PortfolioData) => {
  const pdf = new jsPDF()
  let yPosition = 30
  const pageWidth = pdf.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  // Color scheme matching the original PDF
  const colors = {
    nameColor: [31, 41, 55] as [number, number, number], // Dark blue-gray for name
    titleColor: [100, 116, 139] as [number, number, number], // Medium gray for title
    contactColor: [100, 116, 139] as [number, number, number], // Medium gray for contact
    headerColor: [41, 98, 255] as [number, number, number], // Blue for section headers
    textColor: [31, 41, 55] as [number, number, number], // Dark text
    bulletColor: [16, 185, 129] as [number, number, number], // Green for bullets
  }

export const generateResumePDF = (data: PortfolioData) => {
  const pdf = new jsPDF()
  let yPosition = 30
  const pageWidth = pdf.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  // Color scheme matching the original PDF
  const colors = {
    nameColor: [31, 41, 55] as [number, number, number], // Dark blue-gray for name
    titleColor: [100, 116, 139] as [number, number, number], // Medium gray for title
    contactColor: [100, 116, 139] as [number, number, number], // Medium gray for contact
    headerColor: [41, 98, 255] as [number, number, number], // Blue for section headers
    textColor: [31, 41, 55] as [number, number, number], // Dark text
    bulletColor: [16, 185, 129] as [number, number, number], // Green for bullets
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
    pdf.setTextColor(...colors.headerColor)
    pdf.text(title.toUpperCase(), margin, yPosition)
    
    // Add underline
    const textWidth = pdf.getTextWidth(title.toUpperCase())
    pdf.setDrawColor(...colors.headerColor)
    pdf.setLineWidth(1.5)
    pdf.line(margin, yPosition + 2, margin + textWidth, yPosition + 2)
    
    yPosition += 10
    pdf.setTextColor(...colors.textColor)
  }

  // HEADER SECTION - Name
  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.nameColor)
  pdf.text('ASHFAQ NABI', margin, yPosition)
  yPosition += 8

  // Title
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.titleColor)
  pdf.text('Full Stack Developer & AI Developer', margin, yPosition)
  yPosition += 10

  // Contact Information - Better aligned
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.contactColor)
  
  pdf.text('Location: Srinagar, India | Open to Relocation (India / Abroad)', margin, yPosition)
  yPosition += 5
  pdf.text('Email: eshfaqnabi11@gmail.com', margin, yPosition)
  pdf.text('Phone: +91 6006331941', margin + 200, yPosition)
  yPosition += 5
  pdf.text('LinkedIn: linkedin.com/in/ashfaq-nabi-6882401b7', margin, yPosition)
  pdf.text('GitHub: eshfaq-ux', margin + 200, yPosition)
  yPosition += 12

  // PROFESSIONAL SUMMARY
  addSectionHeader('Professional Summary')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.textColor)
  
  const summary = `Innovative and results-driven Software Developer with a strong academic foundation and over 1.5 years of combined internship and freelance experience in full-stack web development, backend systems, and software engineering. Proficient in building high-performance, scalable web applications using React.js, Node.js, Express.js, MongoDB, and Spring Boot, with strong knowledge of Java, OOP principles, and RESTful API design.

Holds a Master of Computer Applications (MCA, 2023) from BGSB University, achieving academic excellence with a CGPA of 8.50. Adept at applying modern development practices, integrating cloud and AI-driven tools, and designing reliable software architectures that meet real-world business needs.

Motivated to work in dynamic IT environments where innovation, learning, and impact converge — with a strong interest in backend engineering, cloud-based deployment, and intelligent automation.`
  
  const summaryLines = pdf.splitTextToSize(summary, contentWidth)
  pdf.text(summaryLines, margin, yPosition)
  yPosition += summaryLines.length * 3.8 + 8

  // CORE COMPETENCIES
  addSectionHeader('Core Competencies')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.textColor)
  
  const competencies = [
    'Full Stack Web Application Development',
    'Java Programming & Object-Oriented Design', 
    'RESTful API Development & Integration',
    'MERN Stack (MongoDB, Express.js, React.js, Node.js)',
    'Spring Boot Framework & Microservices',
    'Database Design, Query Optimization, & SQL Tuning',
    'Cloud Platforms (AWS, Vercel, Render)',
    'Workflow Automation (n8n, Zapier, Make.com)',
    'Software Testing, Debugging, and CI/CD Basics',
    'Responsive Web Design & UI/UX Implementation',
    'Agile Methodologies, Version Control (Git), and SDLC'
  ]
  
  competencies.forEach(comp => {
    checkPageBreak(6)
    pdf.setTextColor(...colors.bulletColor)
    pdf.text('•', margin, yPosition)
    pdf.setTextColor(...colors.textColor)
    const compLines = pdf.splitTextToSize(comp, contentWidth - 10)
    pdf.text(compLines, margin + 8, yPosition)
    yPosition += compLines.length * 3.8 + 1
  })
  yPosition += 6

  // TECHNICAL SKILLS
  addSectionHeader('Technical Skills')
  pdf.setFontSize(10)
  
  const skillCategories = [
    { label: 'Languages:', skills: 'Java, JavaScript, Python, SQL, HTML, CSS' },
    { label: 'Frameworks:', skills: 'React.js, Node.js, Express.js, Spring Boot, Django, Bootstrap' },
    { label: 'Databases:', skills: 'MongoDB, MySQL, PostgreSQL' },
    { label: 'Cloud & Deployment:', skills: 'AWS, Vercel, Render' },
    { label: 'Tools & Platforms:', skills: 'Git, GitHub, Postman, VS Code, Eclipse, Figma' },
    { label: 'Concepts:', skills: 'MVC Architecture, Microservices, OOP, API Integration, Data Structures & Algorithms' },
    { label: 'Soft Skills:', skills: 'Analytical Thinking, Team Collaboration, Leadership, Adaptability, Communication, Time Management' }
  ]
  
  skillCategories.forEach(category => {
    checkPageBreak(6)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(category.label, margin, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    pdf.text(category.skills, margin + pdf.getTextWidth(category.label) + 5, yPosition)
    yPosition += 4.5
  })
  yPosition += 8

  // PROFESSIONAL EXPERIENCE & INTERNSHIPS
  addSectionHeader('Professional Experience & Internships')
  
  const experiences = [
    {
      title: 'Software Development Intern – A2IT Online',
      duration: '6 Months (2023) | Mode: Remote / Chandigarh-based Company',
      achievements: [
        'Completed a structured Full Stack Development Internship focused on Python, Django, and REST API frameworks.',
        'Developed multi-tiered web applications that included backend APIs, frontend integration, and authentication systems.',
        'Collaborated with senior mentors to refine code quality, improve performance, and follow software development best practices.',
        'Applied MVC architecture principles to design modular, maintainable systems.',
        'Participated in debugging sessions, resolving UI inconsistencies, and testing database connectivity.',
        'Strengthened practical understanding of software lifecycles, agile development, and cloud deployment workflows.'
      ]
    },
    {
      title: 'Freelance Full Stack Developer',
      duration: 'Jan 2024 – Dec 2024 | Mode: Remote',
      achievements: [
        'Designed and delivered end-to-end web applications for startups and entrepreneurs using the MERN stack (MongoDB, Express.js, React.js, Node.js).',
        'Engineered robust backend APIs with Node.js, implemented secure authentication, and integrated modern frontend interfaces with React.js.',
        'Provided scalable deployment solutions using AWS and Vercel, improving uptime and application performance.',
        'Maintained version control, project documentation, and continuous integration pipelines.',
        'Enhanced debugging, refactoring, and testing processes through iterative real-world deployments.',
        'Developed strong project management, communication, and remote collaboration skills while working directly with clients.'
      ]
    },
    {
      title: 'Web Development Intern – Abun.com',
      duration: '6 Months (2025) | Mode: Remote',
      achievements: [
        'Worked as a Frontend and Backend Developer Intern, contributing to the development and enhancement of multiple live web projects.',
        'Implemented responsive interfaces and reusable UI components using React.js, Tailwind CSS, and Bootstrap.',
        'Supported backend development tasks using Node.js and Express.js, ensuring smooth data flow between server and frontend.',
        'Collaborated with product managers and senior engineers to develop, test, and deploy new features.',
        'Conducted performance audits and implemented optimization techniques, resulting in faster page load times and better API efficiency.',
        'Actively participated in agile sprints, code reviews, and documentation updates to maintain software consistency.'
      ]
    }
  ]
  
  experiences.forEach(exp => {
    checkPageBreak(50)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(exp.title, margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(exp.duration, margin, yPosition)
    yPosition += 10
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    
    exp.achievements.forEach(achievement => {
      checkPageBreak(12)
      pdf.setTextColor(...colors.bulletColor)
      pdf.text('•', margin, yPosition)
      pdf.setTextColor(...colors.textColor)
      const achievementLines = pdf.splitTextToSize(achievement, contentWidth - 10)
      pdf.text(achievementLines, margin + 8, yPosition)
      yPosition += achievementLines.length * 4 + 2
    })
    yPosition += 10
  })

  // Check if we need a new page for projects
  checkPageBreak(100)

  // MAJOR PROJECTS
  addSectionHeader('Major Projects')
  
  const projects = [
    {
      title: '1. LinkVault – URL Shortening Service',
      tech: 'Tech Stack: Node.js, Express.js, MongoDB, React.js, JWT',
      description: [
        'Developed a secure, scalable URL shortening platform with analytics, authentication, and user dashboards.',
        'Designed and implemented RESTful APIs for user registration, URL generation, and usage statistics.',
        'Integrated JWT-based authentication for user access control and session management.',
        'Delivered an interactive frontend interface using React.js and Chart.js for tracking link performance.'
      ]
    },
    {
      title: '2. Workflow Automation System',
      tech: 'Tech Stack: Node.js, n8n, MongoDB, REST APIs',
      description: [
        'Designed and deployed an intelligent process automation tool connecting APIs for repetitive business workflows.',
        'Integrated third-party services (Google Sheets, CRMs, and Notion) for real-time synchronization.',
        'Reduced operational time by up to 35% through workflow optimization.',
        'Delivered cloud-based architecture ensuring scalability and minimal latency.'
      ]
    },
    {
      title: '3. AI-Powered Resume Builder (Capstone Project)',
      tech: 'Tech Stack: React.js, Node.js, OpenAI API',
      description: [
        'Conceptualized and developed an AI-driven web platform that automatically generates keyword-optimized resumes.',
        'Implemented backend logic for user data parsing and content generation using OpenAI API.',
        'Designed a dynamic, responsive UI for real-time resume previews.',
        'Delivered this as a final-year project during MCA, achieving top academic evaluation.'
      ]
    },
    {
      title: '4. Personal Portfolio Website',
      tech: 'Tech Stack: React.js, Tailwind CSS',
      description: [
        'Created and deployed a responsive developer portfolio highlighting projects, certifications, and skills.',
        'Applied SEO best practices, optimized image rendering, and ensured cross-device compatibility.',
        'Integrated contact form APIs for automated response handling.'
      ]
    }
  ]
  
  projects.forEach(project => {
    checkPageBreak(40)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(project.title, margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(project.tech, margin, yPosition)
    yPosition += 8
    
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    
    project.description.forEach(desc => {
      checkPageBreak(8)
      pdf.setTextColor(...colors.bulletColor)
      pdf.text('•', margin, yPosition)
      pdf.setTextColor(...colors.textColor)
      const descLines = pdf.splitTextToSize(desc, contentWidth - 10)
      pdf.text(descLines, margin + 8, yPosition)
      yPosition += descLines.length * 4 + 2
    })
    yPosition += 8
  })

  // Check if we need a new page for education
  checkPageBreak(80)

  // EDUCATION
  addSectionHeader('Education')
  
  const educationData = [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'Baba Ghulam Shah Badshah University (BGSB University) – 2023 | CGPA: 8.50',
      details: [
        'Specialized in Full Stack Development, Cloud Computing, and Artificial Intelligence.',
        'Coursework Highlights: Advanced Java Programming, Software Engineering, Web Technologies, Cloud Architecture, Data Science, Machine Learning, Database Management Systems.',
        'Capstone Project: AI-Powered Resume Builder — developed using React.js, Node.js, and OpenAI API integration.',
        'Contributed to research seminars on cloud deployment automation and AI-assisted code generation.',
        'Achieved consistent academic distinction across all semesters and received faculty commendations for innovation and code efficiency.'
      ]
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Govt. Degree College, Ganderbal (University of Kashmir) – 2021 | CGPA: 7.20',
      details: [
        'Built a solid foundation in Programming Fundamentals, Data Structures, DBMS, Operating Systems, and Networking.',
        'Hands-on experience in C, C++, Java, and Web Development through lab projects and coursework.',
        'Final-year project: Online Attendance Management System using PHP and MySQL, focusing on data integrity and efficient record retrieval.',
        'Developed analytical and coding proficiency essential for real-world software projects.'
      ]
    }
  ]
  
  educationData.forEach(edu => {
    checkPageBreak(40)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(edu.degree, margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(edu.institution, margin, yPosition)
    yPosition += 10
    
    pdf.setTextColor(...colors.textColor)
    edu.details.forEach(detail => {
      checkPageBreak(8)
      pdf.setTextColor(...colors.bulletColor)
      pdf.text('•', margin, yPosition)
      pdf.setTextColor(...colors.textColor)
      const detailLines = pdf.splitTextToSize(detail, contentWidth - 10)
      pdf.text(detailLines, margin + 8, yPosition)
      yPosition += detailLines.length * 4 + 2
    })
    yPosition += 10
  })

  // CERTIFICATIONS
  addSectionHeader('Certifications')
  
  const certifications = [
    {
      title: 'Full Stack Development in Python and Django – A2IT Online, 2023',
      description: 'Certified professional program covering full-stack development with Python and Django framework'
    },
    {
      title: 'Prompt Engineering Professional Certificate – Professional Program, 2024',
      description: 'Advanced certification in prompt engineering techniques, AI model optimization, and conversational AI development'
    }
  ]
  
  certifications.forEach(cert => {
    checkPageBreak(15)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(cert.title, margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    const descLines = pdf.splitTextToSize(cert.description, contentWidth)
    pdf.text(descLines, margin, yPosition)
    yPosition += descLines.length * 4 + 10
  })

  // INTERESTS & CAREER OBJECTIVE
  addSectionHeader('Interests')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.textColor)
  pdf.text('Software Automation • AI & Cloud Technologies • SaaS Product Design • Backend Optimization • Full Stack Development • Continuous Learning', margin, yPosition)
  yPosition += 15

  addSectionHeader('Career Objective')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.textColor)
  const objective = 'To secure a position in the IT and Software Development industry where I can apply my expertise in Full Stack Development, Java, and Cloud-based technologies to design innovative, high-performing solutions. My goal is to contribute to cutting-edge digital transformation projects while continuously advancing my technical and leadership skills in a collaborative environment.'
  const objectiveLines = pdf.splitTextToSize(objective, contentWidth)
  pdf.text(objectiveLines, margin, yPosition)

  // Save with enhanced filename
  const fileName = `ASHFAQ_NABI_Resume_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

  // PROFESSIONAL EXPERIENCE & INTERNSHIPS
  addSectionHeader('Professional Experience & Internships')
  
  const experiences = [
    {
      title: 'Software Development Intern – A2IT Online',
      duration: '6 Months (2023) | Mode: Remote / Chandigarh-based Company',
      achievements: [
        'Completed a structured Full Stack Development Internship focused on Python, Django, and REST API frameworks.',
        'Developed multi-tiered web applications that included backend APIs, frontend integration, and authentication systems.',
        'Collaborated with senior mentors to refine code quality, improve performance, and follow software development best practices.',
        'Applied MVC architecture principles to design modular, maintainable systems.',
        'Participated in debugging sessions, resolving UI inconsistencies, and testing database connectivity.',
        'Strengthened practical understanding of software lifecycles, agile development, and cloud deployment workflows.'
      ]
    },
    {
      title: 'Freelance Full Stack Developer',
      duration: 'Jan 2024 – Dec 2024 | Mode: Remote',
      achievements: [
        'Designed and delivered end-to-end web applications for startups and entrepreneurs using the MERN stack (MongoDB, Express.js, React.js, Node.js).',
        'Engineered robust backend APIs with Node.js, implemented secure authentication, and integrated modern frontend interfaces with React.js.',
        'Provided scalable deployment solutions using AWS and Vercel, improving uptime and application performance.',
        'Maintained version control, project documentation, and continuous integration pipelines.',
        'Enhanced debugging, refactoring, and testing processes through iterative real-world deployments.',
        'Developed strong project management, communication, and remote collaboration skills while working directly with clients.'
      ]
    },
    {
      title: 'Web Development Intern – Abun.com',
      duration: '6 Months (2025) | Mode: Remote',
      achievements: [
        'Worked as a Frontend and Backend Developer Intern, contributing to the development and enhancement of multiple live web projects.',
        'Implemented responsive interfaces and reusable UI components using React.js, Tailwind CSS, and Bootstrap.',
        'Supported backend development tasks using Node.js and Express.js, ensuring smooth data flow between server and frontend.',
        'Collaborated with product managers and senior engineers to develop, test, and deploy new features.',
        'Conducted performance audits and implemented optimization techniques, resulting in faster page load times and better API efficiency.',
        'Actively participated in agile sprints, code reviews, and documentation updates to maintain software consistency.'
      ]
    }
  ]
  
  experiences.forEach(exp => {
    checkPageBreak(35)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(exp.title, margin, yPosition)
    yPosition += 6
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(exp.duration, margin, yPosition)
    yPosition += 7
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    
    exp.achievements.slice(0, 4).forEach(achievement => {
      checkPageBreak(8)
      pdf.setTextColor(...colors.bulletColor)
      pdf.text('•', margin, yPosition)
      pdf.setTextColor(...colors.textColor)
      const achievementLines = pdf.splitTextToSize(achievement, contentWidth - 10)
      pdf.text(achievementLines, margin + 8, yPosition)
      yPosition += achievementLines.length * 3.2 + 1
    })
    yPosition += 6
  })

  // Check if we need a new page for projects
  checkPageBreak(80)

  // MAJOR PROJECTS - Condensed
  addSectionHeader('Major Projects')
  
  const projects = [
    {
      title: '1. LinkVault – URL Shortening Service',
      tech: 'Node.js, Express.js, MongoDB, React.js, JWT',
      description: 'Developed secure, scalable URL shortening platform with analytics, authentication, user dashboards, and RESTful APIs for registration and usage statistics.'
    },
    {
      title: '2. Workflow Automation System',
      tech: 'Node.js, n8n, MongoDB, REST APIs',
      description: 'Designed intelligent process automation tool connecting APIs for business workflows. Integrated third-party services reducing operational time by 35%.'
    },
    {
      title: '3. AI-Powered Resume Builder',
      tech: 'React.js, Node.js, OpenAI API',
      description: 'Developed AI-driven platform generating keyword-optimized resumes with backend logic for data parsing and dynamic UI for real-time previews.'
    }
  ]
  
  projects.forEach(project => {
    checkPageBreak(25)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(project.title, margin, yPosition)
    yPosition += 6
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(`Tech Stack: ${project.tech}`, margin, yPosition)
    yPosition += 5
    
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    const descLines = pdf.splitTextToSize(project.description, contentWidth)
    pdf.text(descLines, margin, yPosition)
    yPosition += descLines.length * 3.2 + 5
  })

  // EDUCATION - Condensed
  addSectionHeader('Education')
  
  const educationData = [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'BGSB University – 2023 | CGPA: 8.50',
      details: 'Specialized in Full Stack Development, Cloud Computing, AI. Capstone: AI-Powered Resume Builder using React.js, Node.js, OpenAI API.'
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Govt. Degree College, Ganderbal – 2021 | CGPA: 7.20',
      details: 'Foundation in Programming, Data Structures, DBMS. Final project: Online Attendance Management System using PHP and MySQL.'
    }
  ]
  
  educationData.forEach(edu => {
    checkPageBreak(20)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.textColor)
    pdf.text(edu.degree, margin, yPosition)
    yPosition += 6
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.headerColor)
    pdf.text(edu.institution, margin, yPosition)
    yPosition += 5
    
    pdf.setTextColor(...colors.textColor)
    const detailLines = pdf.splitTextToSize(edu.details, contentWidth)
    pdf.text(detailLines, margin, yPosition)
    yPosition += detailLines.length * 3.2 + 6
  })

  // CERTIFICATIONS - Condensed
  addSectionHeader('Certifications')
  
  const certifications = [
    'Full Stack Development in Python and Django – A2IT Online, 2023',
    'Prompt Engineering Professional Certificate – Professional Program, 2024'
  ]
  
  certifications.forEach(cert => {
    checkPageBreak(8)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.textColor)
    pdf.setTextColor(...colors.bulletColor)
    pdf.text('•', margin, yPosition)
    pdf.setTextColor(...colors.textColor)
    pdf.text(cert, margin + 8, yPosition)
    yPosition += 4
  })
  yPosition += 6

  // CAREER OBJECTIVE - Final section
  addSectionHeader('Career Objective')
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...colors.textColor)
  const objective = 'To secure a position in IT and Software Development where I can apply expertise in Full Stack Development, Java, and Cloud technologies to design innovative solutions and contribute to digital transformation projects.'
  const objectiveLines = pdf.splitTextToSize(objective, contentWidth)
  pdf.text(objectiveLines, margin, yPosition)

  // Save with enhanced filename
  const fileName = `ASHFAQ_NABI_Resume_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}
