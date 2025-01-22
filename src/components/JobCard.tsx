'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaMapMarkerAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaTasks,
  FaGraduationCap,
  FaUsers,
  FaTimes,
  FaCheck
} from 'react-icons/fa'

export interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  type: string // Full-time, Part-time, etc.
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  companyInfo: {
    name: string
    size: string
    industry: string
    description: string
    culture: string[]
  }
  imageUrl: string
  onSwipe: (direction: 'left' | 'right', reason?: string) => void
}

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
  description,
  requirements,
  responsibilities,
  benefits,
  companyInfo,
  imageUrl,
  onSwipe
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'details' | 'company'>('overview')
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [interestReason, setInterestReason] = useState('')

  const sections = [
    { id: 'overview', icon: FaBriefcase, label: 'Overview' },
    { id: 'details', icon: FaTasks, label: 'Details' },
    { id: 'company', icon: FaBuilding, label: 'Company' }
  ]

  const handleShowInterest = () => {
    if (interestReason.trim()) {
      onSwipe('right', interestReason)
      setShowInterestModal(false)
      setInterestReason('')
    }
  }

  return (
    <motion.div
      layout
      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden mx-auto transition-all duration-500 ease-in-out flex flex-col ${
        isExpanded 
          ? 'fixed inset-x-0 bottom-0 rounded-b-none md:relative md:rounded-xl md:w-full md:max-w-4xl' 
          : 'w-full max-w-md'
      }`}
      style={{
        height: isExpanded ? 'calc(100vh - env(safe-area-inset-top))' : '580px',
        maxHeight: isExpanded ? '100vh' : '580px',
        zIndex: isExpanded ? 50 : 1
      }}
    >
      {/* Header Section */}
      <div className={`${isExpanded ? 'h-24' : 'h-56'} shrink-0 transition-all duration-500 relative`}>
        <div className="absolute inset-0">
          <img 
            src={imageUrl} 
            alt={company} 
            className={`w-full h-full object-cover ${isExpanded ? 'object-top' : 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className={`${isExpanded ? 'text-lg' : 'text-2xl'} font-bold text-white mb-1`}>{title}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-purple-400 font-medium text-sm">{company}</p>
            <div className="flex items-center text-gray-400 text-sm">
              <FaMapMarkerAlt className="mr-1" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-800 shrink-0">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
            {sections.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as typeof activeSection)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaChevronDown size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">
        <div className="p-6">
          {!isExpanded && (
            <>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <FaClock className="text-purple-400 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white font-medium">{type}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaDollarSign className="text-purple-400 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white font-medium">{salary}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm line-clamp-3 mb-4">{description}</p>

              <div className="flex flex-wrap gap-2">
                {requirements.slice(0, 3).map(req => (
                  <span
                    key={req}
                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                  >
                    {req}
                  </span>
                ))}
                {requirements.length > 3 && (
                  <span className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full text-sm">
                    +{requirements.length - 3} more
                  </span>
                )}
              </div>
            </>
          )}

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1"
              >
                <div className="p-6 space-y-6">
                  {activeSection === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">About the Role</h3>
                        <p className="text-gray-300 whitespace-pre-line">{description}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Key Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <FaClock className="text-purple-400" />
                              <h4 className="text-white font-medium">Job Type</h4>
                            </div>
                            <p className="text-gray-300">{type}</p>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <FaDollarSign className="text-purple-400" />
                              <h4 className="text-white font-medium">Salary Range</h4>
                            </div>
                            <p className="text-gray-300">{salary}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'details' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
                        <div className="space-y-2">
                          {requirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-gray-300"
                            >
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Responsibilities</h3>
                        <div className="space-y-2">
                          {responsibilities.map((resp, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-gray-300"
                            >
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{resp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Benefits</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {benefits.map((benefit, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                            >
                              <p className="text-gray-300">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'company' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">About {companyInfo.name}</h3>
                        <p className="text-gray-300 whitespace-pre-line">{companyInfo.description}</p>
                      </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <FaUsers className="text-purple-400" />
                              <h4 className="text-white font-medium">Company Size</h4>
                            </div>
                            <p className="text-gray-300">{companyInfo.size}</p>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <FaBuilding className="text-purple-400" />
                              <h4 className="text-white font-medium">Industry</h4>
                            </div>
                            <p className="text-gray-300">{companyInfo.industry}</p>
                          </div>
                        </div>

                        <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Company Culture</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {companyInfo.culture.map((value, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                            >
                              <p className="text-gray-300">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="shrink-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-4">
        {!isExpanded && (
          <div className="px-6 mb-3">
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm hover:bg-purple-500/20 transition-colors"
            >
              View Full Details <FaChevronUp size={12} />
            </button>
          </div>
        )}

        <div className="p-6 pt-3">
          <div className="flex gap-3">
            <button
              onClick={() => onSwipe('left')}
              className="flex-1 py-2.5 px-4 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes /> Pass
            </button>
            <button
              onClick={() => setShowInterestModal(true)}
              className="flex-1 py-2.5 px-4 bg-green-500/10 text-green-400 rounded-lg font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <FaCheck /> Connect
            </button>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      <AnimatePresence>
        {showInterestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative bg-gray-900 rounded-xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Why are you interested?</h3>
              <textarea
                value={interestReason}
                onChange={(e) => setInterestReason(e.target.value)}
                placeholder="Share what interests you about this role..."
                className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowInterestModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShowInterest}
                  disabled={!interestReason.trim()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  )
} 