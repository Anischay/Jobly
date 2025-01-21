export const SAMPLE_PROFILES = [
  {
    id: '1',
    name: 'Alex Thompson',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    bio: 'Passionate about creating scalable web applications and mentoring junior developers. I thrive in collaborative environments where I can contribute to architectural decisions and implement best practices. My approach combines technical expertise with a strong focus on user experience and business value.',
    videoUrl: '/videos/alex-intro.mp4',
    imageUrl: '/images/alex.jpg',
    skills: [
      'React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'MongoDB', 
      'System Design', 'Team Leadership', 'Agile Methodologies'
    ],
    experience: [
      {
        company: 'TechCorp Solutions',
        role: 'Senior Full Stack Developer',
        duration: '2020 - Present',
        description: [
          'Lead a team of 6 developers in building a microservices-based e-commerce platform',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
          'Architected real-time inventory management system handling 100K+ SKUs',
          'Mentored junior developers and conducted technical interviews'
        ],
        achievements: [
          'Reduced API response time by 40% through caching and optimization',
          'Successfully migrated monolith to microservices with zero downtime',
          'Implemented automated testing increasing code coverage to 90%'
        ],
        technologies: ['React', 'Node.js', 'AWS', 'Docker', 'MongoDB', 'Redis']
      },
      {
        company: 'InnovateSoft',
        role: 'Full Stack Developer',
        duration: '2018 - 2020',
        description: [
          'Developed and maintained multiple client-facing web applications',
          'Implemented responsive designs and cross-browser compatibility',
          'Collaborated with UX team to improve user engagement metrics',
          'Participated in code reviews and technical documentation'
        ],
        achievements: [
          'Reduced page load time by 50% through optimization techniques',
          'Implemented PWA features increasing mobile user retention by 35%',
          'Developed reusable component library used across multiple projects'
        ],
        technologies: ['React', 'Express.js', 'PostgreSQL', 'Redux', 'SASS']
      }
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce platform handling 10K+ daily transactions. Implemented real-time inventory management, payment processing, and order tracking features.',
        technologies: ['React', 'Node.js', 'GraphQL', 'AWS', 'Stripe'],
        link: 'https://github.com/alexthompson/ecommerce',
        image: '/images/projects/ecommerce.jpg'
      },
      {
        title: 'Real-time Analytics Dashboard',
        description: 'Developed a real-time analytics dashboard for monitoring system metrics and user behavior. Implemented WebSocket connections for live updates.',
        technologies: ['React', 'D3.js', 'WebSocket', 'Node.js'],
        link: 'https://github.com/alexthompson/analytics',
        image: '/images/projects/analytics.jpg'
      }
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        year: '2018',
        achievements: [
          'Specialization in Distributed Systems',
          'Research Assistant in Cloud Computing Lab',
          'Published paper on microservices architecture'
        ]
      },
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: '2016',
        achievements: [
          'Dean\'s List all semesters',
          'Led University Coding Club',
          'Hackathon Winner - Best Technical Innovation'
        ]
      }
    ],
    resumeUrl: '/resumes/alex_thompson_resume.pdf',
    links: {
      github: 'https://github.com/alexthompson',
      linkedin: 'https://linkedin.com/in/alexthompson',
      portfolio: 'https://alexthompson.dev'
    }
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'UX/UI Designer & Frontend Developer',
    location: 'New York, NY',
    bio: 'Creative technologist with a passion for designing and building beautiful, intuitive user interfaces. I combine my design thinking with frontend development skills to create seamless user experiences. Advocate for accessibility and inclusive design.',
    videoUrl: '/videos/sarah-intro.mp4',
    imageUrl: '/images/sarah.jpg',
    skills: [
      'UI/UX Design', 'React', 'Figma', 'TypeScript', 'Animation', 
      'Design Systems', 'User Research', 'Prototyping', 'Frontend Development'
    ],
    experience: [
      {
        company: 'Design Forward Inc.',
        role: 'Senior UX/UI Designer',
        duration: '2019 - Present',
        description: [
          'Lead designer for enterprise SaaS platform serving 1M+ users',
          'Created and maintained comprehensive design system',
          'Conducted user research and usability testing sessions',
          'Collaborated with product and engineering teams on feature implementation'
        ],
        achievements: [
          'Increased user engagement by 45% through UX improvements',
          'Reduced user onboarding time by 60% with intuitive design',
          'Won industry award for best enterprise UX design'
        ],
        technologies: ['Figma', 'React', 'Framer Motion', 'Storybook', 'Adobe CC']
      },
      {
        company: 'Creative Tech Labs',
        role: 'UI Developer',
        duration: '2017 - 2019',
        description: [
          'Developed responsive web applications with focus on animation',
          'Created interactive prototypes for client presentations',
          'Implemented accessibility features for WCAG compliance',
          'Mentored junior designers in frontend development'
        ],
        achievements: [
          'Improved accessibility score to 100% on all projects',
          'Reduced design-to-development handoff time by 40%',
          'Created animation library used across company projects'
        ],
        technologies: ['React', 'GSAP', 'Tailwind CSS', 'TypeScript']
      }
    ],
    projects: [
      {
        title: 'Enterprise Design System',
        description: 'Created a comprehensive design system for enterprise applications, including component library, documentation, and design tokens.',
        technologies: ['Figma', 'React', 'Storybook', 'styled-components'],
        link: 'https://github.com/sarahchen/design-system',
        image: '/images/projects/design-system.jpg'
      },
      {
        title: 'Interactive Data Visualization',
        description: 'Designed and developed interactive data visualizations for financial analytics platform, focusing on user experience and accessibility.',
        technologies: ['D3.js', 'React', 'TypeScript', 'ARIA'],
        link: 'https://github.com/sarahchen/data-viz',
        image: '/images/projects/data-viz.jpg'
      }
    ],
    education: [
      {
        institution: 'Rhode Island School of Design',
        degree: 'Bachelor of Fine Arts',
        field: 'Graphic Design',
        year: '2017',
        achievements: [
          'Graduated with Honors',
          'Best Portfolio Award',
          'Design Innovation Fellowship'
        ]
      },
      {
        institution: 'General Assembly',
        degree: 'Certificate',
        field: 'Frontend Web Development',
        year: '2016',
        achievements: [
          'Capstone Project Winner',
          'Perfect Attendance',
          'Teaching Assistant for HTML/CSS workshops'
        ]
      }
    ],
    resumeUrl: '/resumes/sarah_chen_resume.pdf',
    links: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      portfolio: 'https://sarahchen.design'
    }
  }
] 