import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface MatchRequest {
  resume_text: string;
  job_description: string;
}

interface AnalysisRequest extends MatchRequest {
  weights?: {
    technical?: number;
    experience?: number;
    semantic?: number;
    culture?: number;
    future?: number;
  };
}

interface FeedbackRequest {
  job_id: string;
  resume_id: string;
  match_score: number;
  user_rating: number;
  feedback_text?: string;
  feedback_categories?: Record<string, number>;
}

export const useMLService = () => {
  const [error, setError] = useState<string | null>(null);

  // Match resume with job
  const matchResume = useMutation({
    mutationFn: async (data: MatchRequest) => {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'match', ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to match resume');
      }

      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Analyze resume in detail
  const analyzeResume = useMutation({
    mutationFn: async (data: AnalysisRequest) => {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Submit feedback
  const submitFeedback = useMutation({
    mutationFn: async (data: FeedbackRequest) => {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'feedback', ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get feedback stats
  const feedbackStats = useQuery({
    queryKey: ['feedbackStats'],
    queryFn: async () => {
      const response = await fetch('/api/ml?action=stats');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback stats');
      }
      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get feedback history
  const getFeedbackHistory = useQuery({
    queryKey: ['feedbackHistory'],
    queryFn: async ({ queryKey, pageParam }) => {
      const [_, { jobId, resumeId, limit }] = queryKey;
      const params = new URLSearchParams({
        action: 'history',
        ...(jobId && { jobId }),
        ...(resumeId && { resumeId }),
        ...(limit && { limit: limit.toString() }),
      });

      const response = await fetch(`/api/ml?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback history');
      }
      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get feedback trends
  const feedbackTrends = useQuery({
    queryKey: ['feedbackTrends'],
    queryFn: async () => {
      const response = await fetch('/api/ml?action=trends');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback trends');
      }
      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get improvement suggestions
  const improvementSuggestions = useQuery({
    queryKey: ['improvementSuggestions'],
    queryFn: async () => {
      const response = await fetch('/api/ml?action=suggestions');
      if (!response.ok) {
        throw new Error('Failed to fetch improvement suggestions');
      }
      return response.json();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    matchResume,
    analyzeResume,
    submitFeedback,
    feedbackStats,
    getFeedbackHistory,
    feedbackTrends,
    improvementSuggestions,
    error,
  };
};
