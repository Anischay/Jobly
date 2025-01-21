'use client'

import { motion } from 'framer-motion'
import { FaDownload, FaEye } from 'react-icons/fa'

interface ResumeDownloadProps {
  resumeUrl: string
  previewUrl?: string
  fileName?: string
}

export function ResumeDownload({ resumeUrl, previewUrl, fileName = 'resume.pdf' }: ResumeDownloadProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <FaDownload />
        <span>Download Resume</span>
      </motion.button>

      {previewUrl && (
        <motion.a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FaEye />
          <span>Preview</span>
        </motion.a>
      )}
    </div>
  )
} 