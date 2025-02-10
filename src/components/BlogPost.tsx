'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaClock, FaUser, FaTags, FaShare, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa'
import { useEffect, useRef } from 'react'

interface BlogPostProps {
  title: string
  subtitle: string
  content: string
  readTime?: number
  publishDate?: string
  author?: string
  tags?: string[]
  imageUrl?: string
}

export default function BlogPost({
  title,
  subtitle,
  content,
  readTime = 10,
  publishDate = 'May 15, 2024',
  author = 'Anonymous',
  tags = [],
  imageUrl
}: BlogPostProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Find paragraphs that start with "Key Point:" or contain important phrases
      const paragraphs = contentRef.current.getElementsByTagName('p')
      Array.from(paragraphs).forEach(p => {
        if (p.textContent?.startsWith('Key Point:')) {
          p.className = 'text-lg font-semibold text-purple-300 my-6 pl-4 border-l-4 border-purple-500'
        }
      })

      // Add emphasis to specific phrases
      const emphasisPhrases = [
        'traditional hiring',
        'human connection',
        'automation',
        'emotional intelligence',
        'future of work',
        'innovation'
      ]

      const textNodes = document.evaluate(
        '//text()',
        contentRef.current,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      )

      for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i)
        if (node?.textContent) {
          let html = node.textContent
          emphasisPhrases.forEach(phrase => {
            const regex = new RegExp(`(${phrase})`, 'gi')
            html = html.replace(regex, '<em class="text-purple-300 not-italic">$1</em>')
          })
          
          if (html !== node.textContent) {
            const span = document.createElement('span')
            span.innerHTML = html
            node.parentNode?.replaceChild(span, node)
          }
        }
      }
    }
  }, [content])

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim())

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="mb-12 border-b border-gray-800 pb-8">
        {imageUrl && (
          <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {title}
        </h1>
        <h2 className="text-xl md:text-2xl text-purple-400 font-medium mb-6">
          {subtitle}
        </h2>
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <div className="flex items-center gap-4">
            <span>{author}</span>
            <span>•</span>
            <span>{publishDate}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-purple-400 transition-colors">
              <FaLinkedin size={20} />
            </button>
            <button className="hover:text-purple-400 transition-colors">
              <FaTwitter size={20} />
            </button>
            <button className="hover:text-purple-400 transition-colors">
              <FaFacebook size={20} />
            </button>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-purple max-w-none">
        {paragraphs.map((paragraph, index) => {
          // Check if paragraph is a heading (starts with #)
          if (paragraph.startsWith('#')) {
            return (
              <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                {paragraph.replace('#', '').trim()}
              </h2>
            )
          }
          return (
            <p key={index} className="mb-6 leading-relaxed text-gray-300">
              {paragraph}
            </p>
          )
        })}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors">
              Previous Post
            </button>
            <button className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors">
              Next Post
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Share this article:</span>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                <FaLinkedin size={20} />
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                <FaTwitter size={20} />
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors">
                <FaFacebook size={20} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </article>
  )
} 