'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SkillSelect } from '@/components/Skills/SkillSelect'
import { useAuth } from '@clerk/nextjs'
import { SkillAnalyzer, type SkillSuggestion } from '@/lib/ai/skillAnalyzer'
import { FiInfo } from 'react-icons/fi'

interface Skill {
  id: string
  name: string
  category: string
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  importance: number
  required: boolean
}

export default function PostJobPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('FULL_TIME')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [salary, setSalary] = useState('')
  const [requiredSkills, setRequiredSkills] = useState<Skill[]>([])
  const [preferredSkills, setPreferredSkills] = useState<Skill[]>([])
  const [suggestedSkills, setSuggestedSkills] = useState<SkillSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Analyze job description for skill suggestions
  useEffect(() => {
    const analyzeDescription = async () => {
      if (!description.trim()) {
        setSuggestedSkills([])
        return
      }

      // Only analyze if description is substantial
      if (description.length < 50) return

      setIsAnalyzing(true)
      try {
        const analysis = await SkillAnalyzer.analyzeJobDescription(description)
        setSuggestedSkills(analysis.suggestedSkills)
      } catch (error) {
        console.error('Error analyzing description:', error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    const timeoutId = setTimeout(analyzeDescription, 1000)
    return () => clearTimeout(timeoutId)
  }, [description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          company,
          location,
          type,
          description,
          requirements,
          salary,
          userId,
          skills: [
            ...requiredSkills.map(skill => ({
              ...skill,
              required: true
            })),
            ...preferredSkills.map(skill => ({
              ...skill,
              required: false
            }))
          ]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create job posting')
      }

      router.push('/jobs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSuggestedSkill = (suggestion: SkillSuggestion) => {
    const skill: Skill = {
      id: Math.random().toString(), // This will be replaced with actual ID from database
      name: suggestion.name,
      category: suggestion.category,
      proficiencyLevel: suggestion.proficiencyLevel || 'INTERMEDIATE',
      importance: suggestion.relevance,
      required: suggestion.relevance > 0.7
    }

    if (skill.required) {
      setRequiredSkills(prev => [...prev, skill])
    } else {
      setPreferredSkills(prev => [...prev, skill])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic Job Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              Job Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">
              Salary Range (Optional)
            </label>
            <input
              type="text"
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $80,000 - $100,000"
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Job Description with AI Analysis */}
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Job Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
              {isAnalyzing && (
                <div className="absolute top-2 right-2 text-gray-400 text-sm">
                  Analyzing...
                </div>
              )}
            </div>
          </div>

          {/* AI Skill Suggestions */}
          {suggestedSkills.length > 0 && (
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="text-purple-500" />
                <h3 className="text-sm font-medium text-gray-300">
                  AI-Suggested Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddSuggestedSkill(suggestion)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-200 transition-colors"
                  >
                    <span>{suggestion.name}</span>
                    <span className="text-xs text-gray-400">
                      ({Math.round(suggestion.relevance * 100)}% match)
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Click on a skill to add it to your job posting. Skills with over 70% relevance will be added as required skills.
              </p>
            </div>
          )}
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Required Skills
          </label>
          <SkillSelect
            selectedSkills={requiredSkills}
            onSkillsChange={setRequiredSkills}
            placeholder="Search required skills..."
            maxSkills={5}
            showProficiency={true}
            className="mb-4"
          />
          <p className="text-sm text-gray-500">
            Add up to 5 required skills that candidates must have. Set proficiency levels and importance for better matching.
          </p>
        </div>

        {/* Preferred Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Preferred Skills
          </label>
          <SkillSelect
            selectedSkills={preferredSkills}
            onSkillsChange={setPreferredSkills}
            placeholder="Search preferred skills..."
            maxSkills={5}
            showProficiency={true}
            className="mb-4"
          />
          <p className="text-sm text-gray-500">
            Add up to 5 preferred skills that would be nice for candidates to have.
          </p>
        </div>

        {/* Additional Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1">
            Additional Requirements
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
            placeholder="List any additional requirements or qualifications..."
            className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
