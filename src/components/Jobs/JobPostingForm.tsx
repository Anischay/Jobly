'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  skills: string[];
}

const jobTypes = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE', label: 'Remote' },
];

const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Java', 'SQL', 'AWS', 'Docker', 'Git', 'REST APIs',
  'GraphQL', 'MongoDB', 'PostgreSQL', 'DevOps'
];

export default function JobPostingForm() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: 'FULL_TIME',
    description: '',
    requirements: '',
    salary: '',
    skills: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a job posting');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'Validation Error' && data.errors) {
          throw new Error(data.errors.map((err: any) => err.message).join(', '));
        }
        throw new Error(data.error || 'Failed to create job posting');
      }

      router.push('/jobs');
      router.refresh(); // Refresh the jobs list
    } catch (error: any) {
      console.error('Error creating job:', error);
      setError(error.message || 'Failed to create job posting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen py-8">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-8">Create a New Job Posting</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="e.g., Senior Full Stack Developer"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-gray-300 mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              required
              placeholder="Your company name"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              required
              placeholder="e.g., New York, NY or Remote"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-300 mb-2">
              Job Type
            </label>
            <select
              id="type"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              {jobTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              id="description"
              required
              rows={6}
              placeholder="Describe the role, responsibilities, and ideal candidate..."
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-semibold text-gray-300 mb-2">
              Requirements
            </label>
            <textarea
              id="requirements"
              required
              rows={4}
              placeholder="List the required qualifications, experience, and skills..."
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.requirements}
              onChange={e => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-semibold text-gray-300 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              id="salary"
              placeholder="e.g., $80,000 - $100,000"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
              value={formData.salary}
              onChange={e => setFormData(prev => ({ ...prev, salary: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Required Skills
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-200 border border-purple-700"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-purple-300 hover:text-purple-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type skills and press Enter"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors mb-2"
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
            />
            <div className="flex flex-wrap gap-2">
              {commonSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:bg-purple-900/30 hover:text-purple-200 hover:border-purple-700 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Job Posting'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
