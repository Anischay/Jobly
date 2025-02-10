export const DEMO_CANDIDATES = [
  {
    id: '1',
    name: "Alex Chen",
    title: "Senior Full Stack Engineer",
    location: "San Francisco, CA",
    imageUrl: "/avatars/alex.jpg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
    bio: "Full stack engineer with 8+ years of experience building scalable web applications. Previously at Stripe and Google. Passionate about AI/ML and cloud architecture.",
    skills: [
      "React", "Node.js", "TypeScript", "Python",
      "AWS", "Kubernetes", "TensorFlow", "System Design"
    ],
    projects: [
      {
        id: 'p1',
        title: "AI-Powered Trading Platform",
        description: "Built a real-time trading platform using machine learning to predict market trends. Processes $10M+ in daily transactions.",
        technologies: ["Python", "TensorFlow", "React", "AWS"],
        imageUrl: "/projects/alex-trading.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://github.com/alexchen/trading-ai",
        verified: true
      },
      {
        id: 'p2',
        title: "Real-time Collaboration Suite",
        description: "Developed an enterprise collaboration platform used by 100k+ users. Featured real-time editing and video conferencing.",
        technologies: ["WebRTC", "Socket.io", "Redis", "Kubernetes"],
        imageUrl: "/projects/alex-collab.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://github.com/alexchen/collab-suite",
        verified: true
      }
    ],
    experience: [
      {
        id: 'e1',
        role: "Senior Software Engineer",
        company: "Stripe",
        location: "San Francisco, CA",
        duration: "2020 - 2023",
        description: "Led the core payments infrastructure team, focusing on scalability and reliability",
        achievements: [
          "Technical Leadership:",
          "• Led team of 5 engineers in rebuilding the payment processing pipeline",
          "• Mentored 3 junior engineers to promotion in 18 months",
          "• Drove adoption of TypeScript across 15+ services",
          
          "System Architecture:",
          "• Designed microservices architecture processing $50B+ annually",
          "• Reduced system latency by 40% through innovative caching",
          "• Implemented real-time fraud detection saving $10M+ annually",
          
          "Development & Innovation:",
          "• Created internal testing framework used by 200+ engineers",
          "• Published 3 open-source tools with 1000+ GitHub stars",
          "• Filed 2 patents for payment processing innovations"
        ],
        technologies: [
          "Backend: Go, Node.js, Python",
          "Infrastructure: Kubernetes, AWS, Terraform",
          "Data: PostgreSQL, Redis, Kafka",
          "Practices: Microservices, DDD, TDD"
        ],
        verified: true
      }
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2018",
        achievements: [
          "Focus on Machine Learning",
          "4.0 GPA",
          "Teaching Assistant for AI courses",
          "Published 2 research papers"
        ]
      }
    ],
    certifications: [
      {
        id: 'c1',
        name: "AWS Solutions Architect Professional",
        issuer: "Amazon Web Services",
        date: "2023",
        verified: true
      }
    ],
    socialLinks: {
      github: "https://github.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
      portfolio: "https://alexchen.dev",
      twitter: "https://twitter.com/alexchen"
    }
  },
  {
    id: '2',
    name: "Sarah Johnson",
    title: "Lead Product Designer",
    location: "New York, NY",
    imageUrl: "/avatars/sarah.jpg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
    bio: "Product designer with 6+ years of experience creating user-centered digital experiences. Previously at Airbnb and Google. Passionate about inclusive design and design systems.",
    skills: [
      "UI/UX Design", "Design Systems", "User Research",
      "Figma", "Design Leadership", "Prototyping"
    ],
    projects: [
      {
        id: 'p3',
        title: "Netflix Kids Redesign",
        description: "Led the redesign of Netflix's kids experience, improving engagement by 45% and reducing cognitive load for young users.",
        technologies: ["UI/UX", "Animation", "User Testing"],
        imageUrl: "/projects/sarah-netflix.jpg",
        fallbackImageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=60",
        liveUrl: "https://dribbble.com/sarahjohnson/netflix",
        verified: true
      }
    ],
    experience: [
      {
        id: 'e3',
        role: "Lead Product Designer",
        company: "Airbnb",
        location: "New York, NY",
        duration: "2021 - Present",
        description: "Leading design strategy for Airbnb's core booking experience",
        achievements: [
          "Design Leadership:",
          "• Led redesign of booking flow used by 150M+ users",
          "• Built and scaled design system used by 40+ designers",
          "• Mentored 4 designers to senior positions"
        ],
        technologies: [
          "Design: Figma, Framer, Principle",
          "Research: UserTesting, Maze, Hotjar",
          "Development: React, CSS, Animation",
          "Process: Design Ops, Design Systems"
        ],
        verified: true
      }
    ],
    education: [
      {
        degree: "M.F.A. Design",
        institution: "Rhode Island School of Design",
        year: "2019",
        achievements: [
          "Focus on Digital Experience Design",
          "Published thesis on inclusive design",
          "Teaching Assistant for UI/UX courses"
        ]
      }
    ],
    certifications: [
      {
        id: 'c3',
        name: "Google UX Design Professional Certificate",
        issuer: "Google",
        date: "2023",
        verified: true
      }
    ],
    socialLinks: {
      dribbble: "https://dribbble.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      portfolio: "https://sarahjohnson.design",
      twitter: "https://twitter.com/sarahjohnson"
    }
  }
] 