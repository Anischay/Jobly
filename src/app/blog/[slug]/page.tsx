'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaShare } from 'react-icons/fa'

// Import the blog posts data
const blogPosts = {
  'traditional-hiring-process': {
    title: 'The Stale, Soul-Crushing Process of Traditional Hiring',
    content: `The Machine We've Created: A Dystopian Hiring System

We live in an age where technology is meant to save us from ourselves, to give us more time to do the things that matter. And yet, here we are, still trapped in the same mechanical loop we've been in for decades. The hiring process—a symbol of modern efficiency—has become a digital factory, cranking out bodies to fill roles with little regard for the individuals behind the applications. This should be an era of connection, of discovery, of nuance. Instead, it has become one of alienation. A cold, clinical process where we are not valued for our complexities but stripped down to a mere set of qualifications.

A machine we created to bring ease has, ironically, trapped us in a cycle of inefficiency and emotional disconnection.

Think about it. You craft your resume—tailored, polished, a mirror of your professional self—and send it into the digital void. What do you hear in return? Silence. A rejection email. An automated, soul-crushing notification informing you that, despite all your effort, you were not what they were looking for. Not the right keyword. Not the right template.

This system—this soulless bureaucracy—has no room for the humanity that drives us. It only wants the perfect match, the clean-cut fit, the "right" kind of person. But are we really willing to reduce human beings to a collection of keywords and checkboxes? To an algorithm that determines your worth with the cold precision of a machine? I think not.

And yet, we persist. Why? Because we have accepted that this is the way things must be. We've built this system, and we're now too afraid to question its fundamental flaws. A machine that was created to help us has become the very thing that distances us from each other.

The Cost of Automation: The Price We Pay for Efficiency

People often say that automation will solve our problems—streamlining processes, eliminating human error, increasing objectivity. There's truth to that, but there's also a dark side. When the very systems designed to improve efficiency only perpetuate bias, we must pause and ask ourselves: At what cost?

Let's take a moment to understand the consequences. A 2019 study by the Career Advisory Board found that 72% of employers are relying on automated systems to screen resumes. At first glance, that seems practical. But when you dig deeper, the flaw is clear. These systems do not see us as human beings—they see us as data points. Our histories, our stories, our experiences—things that can't be neatly packaged into a keyword search—are overlooked. Women, people of color, and candidates from underrepresented backgrounds suffer disproportionately as these algorithms unknowingly reinforce systemic biases.

And it's not just the candidates who suffer. Employers, too, are losing out on talent. A 2021 Harvard Business Review study revealed that these automated filters often miss out on candidates who could bring invaluable perspective, creativity, and innovation—people whose resumes don't fit neatly into the rigid framework of traditional hiring practices. In chasing efficiency, we've lost the most important thing: human connection. We've missed the people who don't just match the job description, but redefine it.

This is the machine we've created. A system that ignores the soul.

A Human Approach: The Path to Meaningful Hiring

But there's hope. A light glimmering through the cracks in this sterile process. We have the tools—tools not just to connect, but to create. If we can stop pretending that hiring is a cold, mechanical transaction and recognize it for what it really is—a dance of human connection—we could redefine what it means to find the "perfect fit."

Imagine, if you will, a hiring process that begins with something far more personal than a resume. Imagine that the first step in finding the right person isn't about filling out a form, but about having a conversation. A dialogue. An exchange where both sides are allowed to explore the depths of one another's potential. Not in a sterile interview room, but in spaces where the human element takes centre stage.

What if the process of hiring was more like dating?

The concept of "dating" has become synonymous with discovery—both personal and relational. It's messy, it's complex, it's beautiful. In a world where we reduce people to qualifications and experience, maybe what we need is to reframe hiring as an opportunity for two entities to connect, to experience one another before making a commitment.

This concept isn't far-fetched. Psychologists like Carl Jung have long recognized the power of deep connection in shaping our identities. In the hiring process, we too must engage in a kind of mutual discovery, where both candidates and employers are encouraged to become who they truly are. After all, when people feel seen and understood, they bring their best selves to the table—whether in a coffee shop, a lunch meeting, or even a team brainstorming session.

Rethinking The Traditional Resume: Human-Centric Hiring

Let's be clear: the resume isn't the problem—the problem is how we use it. We've reduced it to a mere tool of judgment, a piece of paper that determines whether you are "enough" for the role. But let's be honest with ourselves—does the piece of paper really capture who you are? The world's best engineers, designers, marketers—are they all defined by what fits neatly into a resume?

A 2020 McKinsey report found that companies with diverse teams are 35% more likely to outperform their competitors. This data tells us that diversity isn't just good for society—it's good for business. And yet, the system we've built continues to promote homogeneity, focusing more on the technical fit than the creative, diverse perspectives that are so crucial for innovation.

A great candidate isn't just a checklist of skills and experiences—they're a person. And people cannot be reduced to bullet points.

Imagine if we could break free from this endless loop. Imagine if hiring wasn't just about matching skills with job descriptions. Imagine if it were about matching people with teams, cultures, and values—aligning not just experience, but soul.

The Future of Hiring: A Paradigm Shift

We have the tools to revolutionize this process. We don't need to abandon technology—rather, we need to embrace it in a way that humanizes the experience. What if AI and automation could work with us, not against us? What if they could help us discover potential, not just scan resumes for keywords? What if the future of hiring was about building relationships, not filling seats?

The data is clear: diverse teams perform better, employees are more engaged when they feel heard, and candidates who are given a voice perform better. Yet, we're still clinging to outdated processes that only serve to perpetuate bias and inefficiency.

This is why the future of hiring is not about checking boxes. It's about allowing people to show up as their true selves, to connect on a deeper level before being reduced to a "perfect fit."

In the end, we are not robots. We are not resumes. We are human beings, capable of far more than the process currently allows.`,
    author: 'Team Jobly',
    date: 'March 15, 2024',
    readTime: '8 min',
    tags: ['Hiring', 'HR Tech', 'Future of Work', 'Innovation'],
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop'
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  useEffect(() => {
    // Add styling to paragraphs that start with specific phrases
    const paragraphs = document.getElementsByTagName('p')
    Array.from(paragraphs).forEach(p => {
      if (p.textContent?.startsWith('Key Point:')) {
        p.classList.add('text-purple-400', 'font-medium')
      }
      // Add emphasis to impactful sentences
      const text = p.textContent || ''
      const impactfulPhrases = [
        'This is the machine we\'ve created',
        'What if the process of hiring was more like dating?',
        'A great candidate isn\'t just a checklist'
      ]
      if (impactfulPhrases.some(phrase => text.includes(phrase))) {
        p.classList.add('text-lg', 'font-medium', 'text-purple-300')
      }
    })
  }, [])

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="text-purple-400 hover:text-purple-300">
            Return to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            >
              {post.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-sm text-gray-300"
            >
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} read</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg prose-invert max-w-none"
        >
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Share this article</h3>
              <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                <FaShare />
                Share
              </button>
            </div>
            <Link
              href="/blog"
              className="px-6 py-3 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              More Articles
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 