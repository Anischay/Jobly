'use client'

import { useState, useEffect, useRef } from 'react'
import { FiX, FiPlus, FiChevronRight } from 'react-icons/fi'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface Skill {
  id: string
  name: string
  category: string
  categoryId?: string
  categoryName?: string
  categoryColor?: string
  popularity?: number
  proficiencyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  marketDemand?: {
    trend: 'RISING' | 'STABLE' | 'DECLINING'
    score: number
  }
}

interface SelectedSkill extends Skill {
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  importance: number
}

interface Category {
  id: string
  name: string
  description: string
  color: string
  skillCount: number
}

interface SkillSelectProps {
  selectedSkills: SelectedSkill[]
  onSkillsChange: (skills: SelectedSkill[]) => void
  placeholder?: string
  maxSkills?: number
  showProficiency?: boolean
  className?: string
}

export function SkillSelect({
  selectedSkills,
  onSkillsChange,
  placeholder = 'Search skills...',
  maxSkills = 10,
  showProficiency = true,
  className = ''
}: SkillSelectProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Skill[]>([])
  const [relatedSkills, setRelatedSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/skills?includeCategories=true')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchSkills = async () => {
      if (!debouncedQuery.trim() && !selectedCategory) {
        setSuggestions([])
        setRelatedSkills([])
        return
      }

      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          ...(debouncedQuery && { q: debouncedQuery }),
          ...(selectedCategory && { categoryId: selectedCategory }),
          limit: '5'
        })

        const response = await fetch(`/api/skills?${params}`)
        if (!response.ok) throw new Error('Failed to fetch skills')
        const data = await response.json()
        setSuggestions(data.skills)
        setRelatedSkills(data.related)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [debouncedQuery, selectedCategory])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddSkill = (skill: Skill) => {
    if (selectedSkills.length >= maxSkills) return
    if (!selectedSkills.find(s => s.id === skill.id)) {
      const selectedSkill: SelectedSkill = {
        ...skill,
        proficiencyLevel: 'INTERMEDIATE',
        importance: 1.0
      }
      onSkillsChange([...selectedSkills, selectedSkill])
    }
    setQuery('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleRemoveSkill = (skillId: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill.id !== skillId))
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
  }

  const handleProficiencyChange = (skillId: string, level: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT') => {
    onSkillsChange(
      selectedSkills.map(skill =>
        skill.id === skillId ? { ...skill, proficiencyLevel: level } : skill
      )
    )
  }

  const handleImportanceChange = (skillId: string, importance: number) => {
    onSkillsChange(
      selectedSkills.map(skill =>
        skill.id === skillId ? { ...skill, importance } : skill
      )
    )
  }

  const renderMarketDemand = (demand?: { trend: 'RISING' | 'STABLE' | 'DECLINING'; score: number }) => {
    if (!demand) return null

    const trendColors = {
      RISING: 'text-green-500',
      STABLE: 'text-blue-500',
      DECLINING: 'text-yellow-500'
    }

    const trendIcons = {
      RISING: '↗',
      STABLE: '→',
      DECLINING: '↘'
    }

    return (
      <span className={`text-xs ${trendColors[demand.trend]} ml-2`}>
        {trendIcons[demand.trend]} {Math.round(demand.score * 100)}% demand
      </span>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-purple-500 transition-colors">
        {selectedSkills.map(skill => (
          <div
            key={skill.id}
            className="flex flex-col space-y-1 p-2 rounded-md"
            style={{
              backgroundColor: skill.categoryColor || '#374151',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-white">{skill.name}</span>
              {renderMarketDemand(skill.marketDemand)}
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-gray-200 hover:text-white transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {showProficiency && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex rounded-md overflow-hidden">
                  {(['BEGINNER', 'INTERMEDIATE', 'EXPERT'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => handleProficiencyChange(skill.id, level)}
                      className={`px-2 py-0.5 text-xs transition-colors ${
                        skill.proficiencyLevel === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-300">Importance:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={skill.importance * 5}
                    onChange={(e) => handleImportanceChange(skill.id, Number(e.target.value) / 5)}
                    className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-300">{skill.importance.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {selectedSkills.length < maxSkills && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={selectedSkills.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[200px] bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
          />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden"
        >
          {/* Categories */}
          <div className="p-2 border-b border-gray-700">
            <div className="text-xs text-gray-500 px-2 pb-2">Categories</div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-opacity-100'
                      : 'bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  style={{
                    backgroundColor: category.color || '#374151',
                    color: '#fff'
                  }}
                >
                  {category.name}
                  <span className="text-xs opacity-75">
                    ({category.skillCount})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-2 pb-2">
                    {selectedCategory
                      ? `Skills in ${categories.find(c => c.id === selectedCategory)?.name}`
                      : 'Suggestions'}
                  </div>
                  {suggestions.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => handleAddSkill(skill)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-md flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200">{skill.name}</span>
                        {skill.categoryName && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: skill.categoryColor || '#374151',
                              color: '#fff'
                            }}
                          >
                            {skill.categoryName}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 group-hover:text-gray-300">
                        <FiPlus size={16} />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Related Skills */}
              {relatedSkills.length > 0 && (
                <div className="p-2 border-t border-gray-700">
                  <div className="text-xs text-gray-500 px-2 pb-2">Related Skills</div>
                  {relatedSkills.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => handleAddSkill(skill)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-md flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200">{skill.name}</span>
                        {skill.categoryName && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: skill.categoryColor || '#374151',
                              color: '#fff'
                            }}
                          >
                            {skill.categoryName}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 group-hover:text-gray-300">
                        <FiPlus size={16} />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {!isLoading && suggestions.length === 0 && relatedSkills.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No skills found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
