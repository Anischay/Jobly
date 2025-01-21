'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaArrowRight } from 'react-icons/fa'

const blogPosts = [
  {
    id: 'paradox-of-progress',
    title: 'The Paradox of Progress: How Technology Destroys the Things It Claims to Improve',
    excerpt: 'In our pursuit of progress, we have created a paradox: technology, once hailed as the savior of humanity, now seems to be the very thing that undermines the core values it promises to enhance.',
    author: 'John Doe',
    date: 'May 20, 2024',
    readTime: '12 min',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop',
    tags: ['Technology', 'Society', 'Progress', 'Digital Age', 'Philosophy']
  },
  {
    id: 'recruitment-illusion',
    title: 'The Illusion of Choice in Job Recruitment',
    excerpt: 'In the digital age, we are told that we are empowered—given the keys to endless possibilities, our futures just a click away. But in this sea of options, what if the illusion of choice is the trap itself?',
    author: 'John Doe',
    date: 'May 15, 2024',
    readTime: '15 min',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
    tags: ['Recruitment', 'AI Ethics', 'Job Search', 'Technology', 'Career Development', 'Algorithmic Bias']
  },
  {
    id: 'traditional-hiring-process',
    title: 'The Stale, Soul-Crushing Process of Traditional Hiring',
    excerpt: 'A deep dive into the inefficiencies and emotional disconnection in the current hiring process, and how we can make it more human.',
    author: 'Team Jobly',
    date: 'March 15, 2024',
    readTime: '8 min',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop',
    tags: ['Hiring', 'HR Tech', 'Future of Work', 'Innovation']
  }
]

export default function PerspectivesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Contact', href: '/#contact' }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-white">
              Jobly
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Perspectives
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Insights and thoughts on revolutionizing the hiring process, building meaningful connections, and creating a more human-centric approach to recruitment.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <motion.article
                whileHover={{ y: -4 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
              >
                <div className="aspect-video relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <span>{post.author}</span>
                    <span>{post.date} · {post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
} 