"""
NLP Analyzer for processing resumes and job descriptions.
"""
import spacy
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from langdetect import detect

class NLPAnalyzer:
    def __init__(self):
        """Initialize NLP models and components."""
        self.nlp = spacy.load('en_core_web_sm')
        self.transformer = SentenceTransformer('all-mpnet-base-v2')

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts."""
        # Get embeddings
        embedding1 = self.transformer.encode([text1])[0]
        embedding2 = self.transformer.encode([text2])[0]
        
        # Calculate cosine similarity
        similarity = cosine_similarity([embedding1], [embedding2])[0][0]
        return float(similarity)

    def extract_skills(self, text: str) -> set:
        """Extract skills from text using NLP."""
        doc = self.nlp(text.lower())
        skills = set()
        
        # Common skill-related words
        skill_patterns = [
            'proficient', 'experienced', 'skilled', 'knowledge', 'expertise',
            'certified', 'trained', 'competent', 'specialist'
        ]
        
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN']:
                # Check if preceded by skill-related words
                if any(skill in [t.text.lower() for t in token.lefts] for skill in skill_patterns):
                    skills.add(token.text)
                    
            # Add compound nouns
            if token.dep_ == 'compound' and token.head.pos_ in ['NOUN', 'PROPN']:
                skills.add(f"{token.text} {token.head.text}")
        
        return skills

    def extract_experience(self, text: str) -> int:
        """Extract years of experience from text."""
        doc = self.nlp(text.lower())
        years = []
        
        for token in doc:
            if token.like_num:
                next_token = token.nbor() if token.i + 1 < len(token.doc) else None
                if next_token and next_token.text.lower() in ['year', 'years', 'yr', 'yrs']:
                    years.append(float(token.text))
        
        return int(max(years)) if years else 0

    def detect_language(self, text: str) -> str:
        """Detect the language of the text."""
        try:
            return detect(text)
        except:
            return 'en'  # Default to English if detection fails

    def extract_keywords(self, text: str) -> list:
        """Extract important keywords from text."""
        doc = self.nlp(text.lower())
        keywords = []
        
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN', 'ADJ'] and not token.is_stop:
                keywords.append(token.text)
        
        return list(set(keywords))

    def analyze_sentiment(self, text: str) -> dict:
        """Analyze sentiment of the text."""
        doc = self.nlp(text)
        
        # Simple rule-based sentiment analysis
        positive_words = set(['excellent', 'good', 'great', 'best', 'outstanding'])
        negative_words = set(['poor', 'bad', 'worst', 'terrible', 'inadequate'])
        
        words = [token.text.lower() for token in doc]
        pos_count = sum(1 for word in words if word in positive_words)
        neg_count = sum(1 for word in words if word in negative_words)
        
        total = pos_count + neg_count if pos_count + neg_count > 0 else 1
        polarity = (pos_count - neg_count) / total
        
        return {
            'polarity': polarity,
            'subjectivity': (pos_count + neg_count) / len(words)
        }

    def match_role(self, resume_text: str, job_desc: str) -> dict:
        """Match resume against job description."""
        # Calculate overall similarity
        similarity = self.calculate_similarity(resume_text, job_desc)
        
        # Extract and compare skills
        resume_skills = self.extract_skills(resume_text)
        job_skills = self.extract_skills(job_desc)
        skill_match = len(resume_skills.intersection(job_skills)) / len(job_skills) if job_skills else 0
        
        # Extract and compare experience
        resume_exp = self.extract_experience(resume_text)
        job_exp = self.extract_experience(job_desc)
        exp_match = min(resume_exp / job_exp if job_exp > 0 else 1, 1)
        
        return {
            'overall_match': similarity,
            'skill_match': skill_match,
            'experience_match': exp_match
        }
