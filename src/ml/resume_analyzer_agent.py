"""
Resume Analyzer Agent for advanced resume analysis and matching.
"""
from typing import Dict, Any, List
import spacy
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class ResumeAnalyzerAgent:
    def __init__(self, agent_id: str, config: Dict[str, Any] = None):
        """Initialize the agent with models and configurations."""
        self.agent_id = agent_id
        self.config = config or {}
        
        # Load models
        self.nlp = spacy.load('en_core_web_sm')
        self.transformer = SentenceTransformer('all-mpnet-base-v2')
        
        # Technical skills dictionary
        self.common_skills = {
            'languages': ['python', 'java', 'javascript', 'c++', 'ruby', 'golang', 'rust', 'kotlin'],
            'frameworks': ['react', 'angular', 'django', 'flask', 'spring', 'express', 'next.js', 'vue'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'serverless', 'microservices'],
            'databases': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra'],
            'ai_ml': ['tensorflow', 'pytorch', 'scikit-learn', 'nlp', 'computer vision', 'machine learning'],
            'tools': ['git', 'jenkins', 'jira', 'ci/cd', 'agile', 'terraform', 'ansible'],
            'emerging': ['blockchain', 'web3', 'ar/vr', 'iot', 'quantum computing', '5g', 'edge computing']
        }
        
        # Culture indicators
        self.culture_indicators = {
            'innovation': [
                'innovative', 'creative', 'pioneering', 'experimental', 'cutting-edge',
                'research', 'prototype', 'explore', 'discover', 'invent'
            ],
            'teamwork': [
                'collaborate', 'team player', 'cross-functional', 'partnership',
                'mentor', 'coach', 'support', 'assist', 'coordinate'
            ],
            'leadership': [
                'lead', 'manage', 'direct', 'guide', 'influence', 'strategic',
                'vision', 'inspire', 'motivate', 'drive'
            ],
            'growth_mindset': [
                'learn', 'grow', 'adapt', 'improve', 'develop', 'study',
                'curious', 'eager', 'passionate', 'enthusiastic'
            ],
            'problem_solving': [
                'solve', 'analyze', 'debug', 'troubleshoot', 'optimize',
                'improve', 'enhance', 'streamline', 'innovate'
            ],
            'communication': [
                'communicate', 'present', 'write', 'speak', 'articulate',
                'document', 'explain', 'train', 'teach', 'engage'
            ]
        }
        
        # Future readiness indicators
        self.future_indicators = {
            'continuous_learning': [
                'certifications', 'courses', 'training', 'workshop', 'conference',
                'self-taught', 'learning', 'studying', 'developing'
            ],
            'adaptability': [
                'pivot', 'adapt', 'flexible', 'versatile', 'dynamic',
                'agile', 'responsive', 'adjustable'
            ],
            'innovation_mindset': [
                'research', 'experiment', 'prototype', 'poc', 'innovative',
                'creative', 'design thinking', 'brainstorm'
            ],
            'digital_transformation': [
                'automation', 'digitization', 'modernization', 'transformation',
                'cloud migration', 'digital strategy'
            ],
            'sustainability': [
                'sustainable', 'green computing', 'energy efficient', 'eco-friendly',
                'carbon footprint', 'environmental'
            ]
        }

    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a resume against a job description with advanced analysis."""
        if not self.validate_input(input_data):
            raise ValueError("Invalid input data")
        
        job_desc = input_data['job_description']
        resume_text = input_data['resume_text']
        weights = input_data.get('weights', {
            'technical': 0.3,
            'experience': 0.2,
            'semantic': 0.1,
            'culture': 0.2,
            'future': 0.2
        })
        
        # Process texts
        job_doc = self.nlp(job_desc.lower())
        resume_doc = self.nlp(resume_text.lower())
        
        # Get embeddings
        job_embedding = self.transformer.encode([job_desc])[0]
        resume_embedding = self.transformer.encode([resume_text])[0]
        
        # Core analysis
        technical_score = self._analyze_technical_skills(job_doc, resume_doc)
        experience_score = self._analyze_experience(job_doc, resume_doc)
        semantic_score = float(cosine_similarity([job_embedding], [resume_embedding])[0][0])
        
        # Advanced analysis
        culture_score = self._analyze_culture_fit(job_doc, resume_doc)
        future_score = self._analyze_future_readiness(resume_doc)
        
        # Calculate final score
        final_score = (
            weights['technical'] * technical_score +
            weights['experience'] * experience_score +
            weights['semantic'] * semantic_score +
            weights['culture'] * culture_score +
            weights['future'] * future_score
        )
        
        # Generate detailed analysis
        detailed_analysis = {
            'skill_gaps': self._identify_skill_gaps(job_doc, resume_doc),
            'experience_analysis': self._detailed_experience_analysis(job_doc, resume_doc),
            'key_terms': self._analyze_key_terms(job_doc, resume_doc, job_embedding, resume_embedding),
            'culture_analysis': self._detailed_culture_analysis(resume_doc),
            'future_readiness': self._detailed_future_analysis(resume_doc),
            'recommendations': self._generate_recommendations(job_doc, resume_doc)
        }
        
        return {
            'final_score': final_score,
            'technical_score': technical_score,
            'experience_score': experience_score,
            'semantic_score': semantic_score,
            'culture_score': culture_score,
            'future_score': future_score,
            'detailed_analysis': detailed_analysis
        }

    def _analyze_culture_fit(self, job_doc, resume_doc) -> float:
        """Analyze cultural fit based on soft skills and values."""
        culture_scores = {}
        resume_text = resume_doc.text.lower()
        
        for category, indicators in self.culture_indicators.items():
            category_matches = sum(1 for indicator in indicators if indicator in resume_text)
            category_score = category_matches / len(indicators)
            culture_scores[category] = category_score
        
        return np.mean(list(culture_scores.values()))

    def _analyze_future_readiness(self, resume_doc) -> float:
        """Analyze candidate's future readiness."""
        future_scores = {}
        resume_text = resume_doc.text.lower()
        
        for category, indicators in self.future_indicators.items():
            category_matches = sum(1 for indicator in indicators if indicator in resume_text)
            category_score = category_matches / len(indicators)
            future_scores[category] = category_score
        
        return np.mean(list(future_scores.values()))

    def _detailed_culture_analysis(self, resume_doc) -> Dict[str, Any]:
        """Provide detailed culture fit analysis."""
        culture_details = {}
        resume_text = resume_doc.text.lower()
        
        for category, indicators in self.culture_indicators.items():
            matched_indicators = [ind for ind in indicators if ind in resume_text]
            culture_details[category] = {
                'score': len(matched_indicators) / len(indicators),
                'matched_traits': matched_indicators
            }
        
        return culture_details

    def _detailed_future_analysis(self, resume_doc) -> Dict[str, Any]:
        """Provide detailed future readiness analysis."""
        future_details = {}
        resume_text = resume_doc.text.lower()
        
        for category, indicators in self.future_indicators.items():
            matched_indicators = [ind for ind in indicators if ind in resume_text]
            future_details[category] = {
                'score': len(matched_indicators) / len(indicators),
                'matched_indicators': matched_indicators
            }
        
        return future_details

    def _generate_recommendations(self, job_doc, resume_doc) -> Dict[str, List[str]]:
        """Generate personalized recommendations for improvement."""
        recommendations = {
            'technical': [],
            'soft_skills': [],
            'future_growth': []
        }
        
        # Technical skill recommendations
        skill_gaps = self._identify_skill_gaps(job_doc, resume_doc)
        if skill_gaps['missing_skills']:
            recommendations['technical'].extend([
                f"Consider learning {skill}" for skill in skill_gaps['missing_skills'][:3]
            ])
        
        # Soft skills recommendations
        culture_analysis = self._detailed_culture_analysis(resume_doc)
        weak_areas = [
            category for category, details in culture_analysis.items()
            if details['score'] < 0.3
        ]
        for area in weak_areas[:2]:
            recommendations['soft_skills'].append(
                f"Develop {area.replace('_', ' ')} skills through projects or training"
            )
        
        # Future growth recommendations
        future_analysis = self._detailed_future_analysis(resume_doc)
        growth_areas = [
            category for category, details in future_analysis.items()
            if details['score'] < 0.3
        ]
        for area in growth_areas[:2]:
            recommendations['future_growth'].append(
                f"Focus on {area.replace('_', ' ')} to stay competitive"
            )
        
        return recommendations

    def _analyze_technical_skills(self, job_doc, resume_doc) -> float:
        """Analyze technical skills match with semantic understanding."""
        job_skills = self._extract_skills(job_doc)
        resume_skills = self._extract_skills(resume_doc)
        
        if not job_skills:
            return 0.0
        
        # Get embeddings for skills
        job_skill_embeddings = self.transformer.encode([' '.join(job_skills)])[0]
        resume_skill_embeddings = self.transformer.encode([' '.join(resume_skills)])[0]
        
        # Calculate semantic similarity between skill sets
        skill_similarity = float(cosine_similarity([job_skill_embeddings], [resume_skill_embeddings])[0][0])
        
        # Combine exact matches with semantic similarity
        exact_match_score = len(set(job_skills) & set(resume_skills)) / len(job_skills)
        return 0.7 * exact_match_score + 0.3 * skill_similarity

    def _analyze_experience(self, job_doc, resume_doc) -> float:
        """Analyze experience requirements match."""
        year_terms = ['year', 'years', 'yr', 'yrs']
        job_years = []
        resume_years = []
        
        # Extract years from job description
        for token in job_doc:
            if token.like_num:
                next_token = token.nbor() if token.i + 1 < len(token.doc) else None
                if next_token and next_token.text.lower() in year_terms:
                    job_years.append(float(token.text))
        
        # Extract years from resume
        for token in resume_doc:
            if token.like_num:
                next_token = token.nbor() if token.i + 1 < len(token.doc) else None
                if next_token and next_token.text.lower() in year_terms:
                    resume_years.append(float(token.text))
        
        if not job_years:
            return 1.0  # No specific experience requirement
        
        required_years = max(job_years)
        candidate_years = max(resume_years) if resume_years else 0
        
        return min(candidate_years / required_years, 1.0) if required_years > 0 else 1.0

    def _extract_skills(self, doc) -> List[str]:
        """Extract skills from text."""
        skills = []
        text_lower = doc.text.lower()
        
        for category in self.common_skills.values():
            for skill in category:
                if skill.lower() in text_lower:
                    skills.append(skill)
        
        return list(set(skills))

    def _identify_skill_gaps(self, job_doc, resume_doc) -> Dict[str, List[str]]:
        """Identify skill gaps between job requirements and resume."""
        job_skills = set(self._extract_skills(job_doc))
        resume_skills = set(self._extract_skills(resume_doc))
        
        return {
            'missing_skills': list(job_skills - resume_skills),
            'additional_skills': list(resume_skills - job_skills)
        }

    def _detailed_experience_analysis(self, job_doc, resume_doc) -> Dict[str, Any]:
        """Analyze experience in detail."""
        return {
            'relevant_experience': self._extract_relevant_experience(job_doc, resume_doc)
        }

    def _extract_relevant_experience(self, job_doc, resume_doc) -> List[str]:
        """Extract relevant experience snippets using semantic similarity."""
        relevant_snippets = []
        job_text = job_doc.text.lower()
        
        # Get job description embedding
        job_embedding = self.transformer.encode([job_text])[0]
        
        # Analyze each sentence in resume
        for sent in resume_doc.sents:
            sent_text = sent.text.strip()
            if len(sent_text.split()) < 5:  # Skip very short sentences
                continue
                
            # Get sentence embedding
            sent_embedding = self.transformer.encode([sent_text])[0]
            
            # Calculate similarity
            similarity = float(cosine_similarity([job_embedding], [sent_embedding])[0][0])
            
            if similarity > 0.5:  # Threshold for relevance
                relevant_snippets.append(sent_text)
        
        return sorted(relevant_snippets, key=len, reverse=True)[:5]  # Return top 5 longest relevant snippets

    def _analyze_key_terms(self, job_doc, resume_doc, job_embedding, resume_embedding) -> Dict[str, List[str]]:
        """Analyze key terms match using transformer embeddings."""
        # Extract important terms (nouns and proper nouns)
        job_terms = [token.text.lower() for token in job_doc 
                    if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2]
        resume_terms = [token.text.lower() for token in resume_doc 
                       if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2]
        
        # Get embeddings for terms
        job_term_embeddings = {term: self.transformer.encode([term])[0] for term in job_terms}
        resume_term_embeddings = {term: self.transformer.encode([term])[0] for term in resume_terms}
        
        matched_terms = []
        missing_terms = []
        
        # Find semantic matches
        for job_term, job_emb in job_term_embeddings.items():
            best_match = None
            best_score = 0
            
            for resume_term, resume_emb in resume_term_embeddings.items():
                similarity = float(cosine_similarity([job_emb], [resume_emb])[0][0])
                if similarity > best_score:
                    best_score = similarity
                    best_match = resume_term
            
            if best_score > 0.8:  # High similarity threshold
                matched_terms.append(job_term)
            else:
                missing_terms.append(job_term)
        
        return {
            'matched': matched_terms,
            'missing': missing_terms
        }

    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate input data."""
        required_fields = ['job_description', 'resume_text']
        return all(field in input_data for field in required_fields)

    def get_capabilities(self) -> List[str]:
        """List agent capabilities."""
        return [
            "Transformer-based semantic analysis",
            "Technical skill matching",
            "Experience analysis",
            "Semantic understanding",
            "Skill gap identification",
            "Key term analysis",
            "Culture fit analysis",
            "Future readiness analysis"
        ]
    
    def learn(self, input_data: Dict[str, Any]) -> None:
        """Learn from input data to improve future analysis.
        This is a placeholder for future implementation of learning capabilities."""
        pass
