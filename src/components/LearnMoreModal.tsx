import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaChevronRight } from 'react-icons/fa'

export interface LearnMoreModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: {
    sections: {
      title: string
      description: string
      items?: string[]
      image?: string
    }[]
  }
}

export const LearnMoreModal = ({ isOpen, onClose, title, content }: LearnMoreModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[85vh] shadow-2xl"
          >
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white pr-8">{title}</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="space-y-8">
                {content.sections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaChevronRight className="text-purple-400" />
                      <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed pl-7">{section.description}</p>
                    {section.items && (
                      <ul className="space-y-2 pl-7">
                        {section.items.map((item, itemIndex) => (
                          <li 
                            key={itemIndex}
                            className="text-gray-300 flex items-start gap-2"
                          >
                            <span className="text-purple-400 mt-1.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.image && (
                      <div className="pl-7 mt-4">
                        <img 
                          src={section.image} 
                          alt={section.title}
                          className="rounded-lg border border-gray-700 w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 