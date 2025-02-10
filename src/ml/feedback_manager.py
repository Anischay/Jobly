"""
Feedback Manager for Resume Matcher.
Handles collection, storage, and analysis of user feedback to improve matching results.
"""
from typing import Dict, Any, List, Optional
import json
import os
from datetime import datetime
import sqlite3
from pathlib import Path

class FeedbackManager:
    def __init__(self, db_path: Optional[str] = None):
        """Initialize FeedbackManager with database connection."""
        if db_path is None:
            db_path = str(Path(__file__).parent / 'feedback.db')
        
        self.db_path = db_path
        self._init_database()

    def _init_database(self) -> None:
        """Initialize the SQLite database and create necessary tables."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Create feedback table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    job_id TEXT,
                    resume_id TEXT,
                    match_score REAL,
                    user_rating INTEGER,
                    feedback_text TEXT,
                    feedback_categories TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(job_id, resume_id)
                )
            ''')
            
            # Create feedback categories table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS feedback_categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    feedback_id INTEGER,
                    category TEXT,
                    score REAL,
                    FOREIGN KEY(feedback_id) REFERENCES feedback(id)
                )
            ''')
            
            conn.commit()

    def record_feedback(self, 
                       job_id: str,
                       resume_id: str,
                       match_score: float,
                       user_rating: int,
                       feedback_text: Optional[str] = None,
                       feedback_categories: Optional[Dict[str, float]] = None) -> bool:
        """
        Record user feedback for a job-resume match.
        
        Args:
            job_id: Unique identifier for the job posting
            resume_id: Unique identifier for the resume
            match_score: Original match score from the system
            user_rating: User rating (1-5)
            feedback_text: Optional text feedback
            feedback_categories: Optional category-specific feedback scores
            
        Returns:
            bool: True if feedback was successfully recorded
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Convert feedback categories to JSON string
                categories_json = json.dumps(feedback_categories) if feedback_categories else None
                
                # Insert or update main feedback
                cursor.execute('''
                    INSERT OR REPLACE INTO feedback 
                    (job_id, resume_id, match_score, user_rating, feedback_text, feedback_categories)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (job_id, resume_id, match_score, user_rating, feedback_text, categories_json))
                
                feedback_id = cursor.lastrowid
                
                # Record category-specific feedback if provided
                if feedback_categories:
                    for category, score in feedback_categories.items():
                        cursor.execute('''
                            INSERT INTO feedback_categories (feedback_id, category, score)
                            VALUES (?, ?, ?)
                        ''', (feedback_id, category, score))
                
                conn.commit()
                return True
                
        except Exception as e:
            print(f"Error recording feedback: {e}")
            return False

    def get_feedback_stats(self) -> Dict[str, Any]:
        """Get statistical analysis of feedback data."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Get overall statistics
            cursor.execute('''
                SELECT 
                    COUNT(*) as total_feedback,
                    AVG(user_rating) as avg_rating,
                    AVG(ABS(match_score - user_rating/5.0)) as avg_score_diff
                FROM feedback
            ''')
            
            total, avg_rating, avg_diff = cursor.fetchone()
            
            # Get category-specific statistics
            cursor.execute('''
                SELECT 
                    category,
                    AVG(score) as avg_score,
                    COUNT(*) as count
                FROM feedback_categories
                GROUP BY category
            ''')
            
            category_stats = {row[0]: {'avg_score': row[1], 'count': row[2]} 
                            for row in cursor.fetchall()}
            
            return {
                'total_feedback': total,
                'average_rating': avg_rating,
                'average_score_difference': avg_diff,
                'category_statistics': category_stats
            }

    def get_feedback_history(self, 
                           job_id: Optional[str] = None,
                           resume_id: Optional[str] = None,
                           limit: int = 100) -> List[Dict[str, Any]]:
        """
        Get feedback history, optionally filtered by job_id or resume_id.
        
        Args:
            job_id: Optional job ID to filter by
            resume_id: Optional resume ID to filter by
            limit: Maximum number of records to return
            
        Returns:
            List of feedback records
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM feedback WHERE 1=1"
            params = []
            
            if job_id:
                query += " AND job_id = ?"
                params.append(job_id)
            
            if resume_id:
                query += " AND resume_id = ?"
                params.append(resume_id)
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            
            cursor.execute(query, params)
            columns = [desc[0] for desc in cursor.description]
            
            return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def analyze_feedback_trends(self) -> Dict[str, Any]:
        """Analyze trends in feedback data over time."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Analyze rating trends over time
            cursor.execute('''
                SELECT 
                    strftime('%Y-%m', timestamp) as month,
                    AVG(user_rating) as avg_rating,
                    COUNT(*) as feedback_count
                FROM feedback
                GROUP BY month
                ORDER BY month DESC
                LIMIT 12
            ''')
            
            monthly_trends = [
                {'month': row[0], 'avg_rating': row[1], 'feedback_count': row[2]}
                for row in cursor.fetchall()
            ]
            
            # Analyze common feedback categories
            cursor.execute('''
                SELECT 
                    category,
                    AVG(score) as avg_score,
                    COUNT(*) as frequency
                FROM feedback_categories
                GROUP BY category
                ORDER BY frequency DESC
            ''')
            
            category_trends = [
                {'category': row[0], 'avg_score': row[1], 'frequency': row[2]}
                for row in cursor.fetchall()
            ]
            
            return {
                'monthly_trends': monthly_trends,
                'category_trends': category_trends
            }

    def get_improvement_suggestions(self) -> List[Dict[str, Any]]:
        """Generate suggestions for system improvement based on feedback patterns."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Find categories with consistently low scores
            cursor.execute('''
                SELECT 
                    category,
                    AVG(score) as avg_score,
                    COUNT(*) as frequency
                FROM feedback_categories
                GROUP BY category
                HAVING avg_score < 0.6 AND frequency >= 10
                ORDER BY avg_score ASC
            ''')
            
            low_performing_categories = [
                {
                    'category': row[0],
                    'avg_score': row[1],
                    'frequency': row[2],
                    'suggestion': f"Improve matching algorithm for {row[0]} category"
                }
                for row in cursor.fetchall()
            ]
            
            # Find patterns in negative feedback text
            cursor.execute('''
                SELECT feedback_text
                FROM feedback
                WHERE user_rating <= 2 AND feedback_text IS NOT NULL
                ORDER BY timestamp DESC
                LIMIT 100
            ''')
            
            negative_feedback = cursor.fetchall()
            # Here you could implement text analysis on negative_feedback
            # to identify common themes and generate suggestions
            
            return low_performing_categories  # Add more suggestion types as needed
