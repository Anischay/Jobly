import React, { useState } from 'react';
import { useMLService } from '@/hooks/useMLService';

interface ResumeAnalyzerProps {
  jobDescription: string;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ jobDescription }) => {
  const [resumeText, setResumeText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const {
    matchResume,
    analyzeResume,
    submitFeedback,
    error,
  } = useMLService();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      setResumeText(text);
    }
  };

  const handleMatch = async () => {
    if (!resumeText || !jobDescription) return;

    try {
      const result = await matchResume.mutateAsync({
        resume_text: resumeText,
        job_description: jobDescription,
      });

      // You can handle the result here
      console.log('Match result:', result);
    } catch (error) {
      console.error('Error matching resume:', error);
    }
  };

  const handleDetailedAnalysis = async () => {
    if (!resumeText || !jobDescription) return;

    try {
      const result = await analyzeResume.mutateAsync({
        resume_text: resumeText,
        job_description: jobDescription,
        weights: {
          technical: 0.3,
          experience: 0.2,
          semantic: 0.1,
          culture: 0.2,
          future: 0.2,
        },
      });

      setShowDetails(true);
      // You can handle the detailed result here
      console.log('Analysis result:', result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    }
  };

  const handleFeedback = async (rating: number) => {
    try {
      await submitFeedback.mutateAsync({
        job_id: 'job123', // Replace with actual job ID
        resume_id: 'resume123', // Replace with actual resume ID
        match_score: 0.85, // Replace with actual match score
        user_rating: rating,
      });

      // Handle successful feedback submission
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">Resume Analyzer</h2>
        
        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume
          </label>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleMatch}
            disabled={!resumeText || !jobDescription}
            className="px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Quick Match
          </button>
          <button
            onClick={handleDetailedAnalysis}
            disabled={!resumeText || !jobDescription}
            className="px-4 py-2 bg-green-600 text-white rounded-md
              hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Detailed Analysis
          </button>
        </div>

        {/* Results Section */}
        {matchResume.data && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Match Results</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Overall Match:</span>
                <span className="ml-2">
                  {(matchResume.data.overall_match * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="font-medium">Skill Match:</span>
                <span className="ml-2">
                  {(matchResume.data.skill_match * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="font-medium">Experience Match:</span>
                <span className="ml-2">
                  {(matchResume.data.experience_match * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Analysis Section */}
        {showDetails && analyzeResume.data && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
            
            {/* Technical Score */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Technical Assessment</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${analyzeResume.data.technical_score * 100}%`
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">
                  {(analyzeResume.data.technical_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Culture Fit */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Culture Fit</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${analyzeResume.data.culture_score * 100}%`
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">
                  {(analyzeResume.data.culture_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Future Readiness */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Future Readiness</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{
                      width: `${analyzeResume.data.future_score * 100}%`
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">
                  {(analyzeResume.data.future_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Skill Gaps */}
            {analyzeResume.data.detailed_analysis?.skill_gaps && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Skill Gaps</h4>
                <div className="space-y-1">
                  {analyzeResume.data.detailed_analysis.skill_gaps.missing_skills.map(
                    (skill: string, index: number) => (
                      <div
                        key={index}
                        className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded"
                      >
                        {skill}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analyzeResume.data.detailed_analysis?.recommendations && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(
                    analyzeResume.data.detailed_analysis.recommendations
                  ).map(([category, items]) => (
                    <li key={category}>
                      <span className="font-medium">
                        {category.charAt(0).toUpperCase() + category.slice(1)}:
                      </span>{' '}
                      {Array.isArray(items) ? items.join(', ') : items}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {(matchResume.data || analyzeResume.data) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Provide Feedback</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFeedback(rating)}
                  className="p-2 hover:bg-blue-100 rounded"
                >
                  {'⭐'.repeat(rating)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
