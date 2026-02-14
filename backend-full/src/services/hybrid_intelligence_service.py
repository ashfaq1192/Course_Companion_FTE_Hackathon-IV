from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.hybrid_intelligence import AdaptiveLearningPath, LLMGradeAssessment, HybridFeatureUsage, CostMetric
from ..models.user import User
from ..models.course_content import CourseContent
from ..models.quiz import QuizAttempt
from ..core.llm_client import get_llm_client
from ..core.config import settings
import json
from datetime import datetime, timedelta


class HybridIntelligenceService:
    """
    Service class for hybrid intelligence features including adaptive learning paths,
    LLM-graded assessments, and cost tracking.
    """

    def __init__(self, db: Session):
        self.db = db
        self.llm_client = get_llm_client()

    async def generate_adaptive_learning_path(
        self,
        user_id: int,
        user_preferences: Dict[str, Any]
    ) -> AdaptiveLearningPath:
        """
        Generate an adaptive learning path for a user based on their progress and preferences.
        
        Args:
            user_id: The ID of the user requesting the path
            user_preferences: Preferences for learning path generation
            
        Returns:
            AdaptiveLearningPath object with recommendations
        """
        from ..services.progress_service import ProgressService
        
        # Get user's progress data
        progress_service = ProgressService(self.db)
        user_progress = progress_service.get_all_progress_for_user(user_id)
        
        # Get user's quiz performance
        quiz_attempts = self.db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
        
        # Prepare context for LLM
        context = {
            "user_progress": [{k: str(v) for k, v in p.__dict__.items() if not k.startswith('_')} for p in user_progress],
            "quiz_performance": [{k: str(v) for k, v in qa.__dict__.items() if not k.startswith('_')} for qa in quiz_attempts],
            "preferences": user_preferences
        }
        
        # Generate prompt for LLM
        prompt = f"""
        Based on the following user data, generate a personalized learning path:
        
        User Progress: {json.dumps(context['user_progress'])}
        Quiz Performance: {json.dumps(context['quiz_performance'])}
        User Preferences: {json.dumps(context['preferences'])}
        
        Please provide recommendations in the following format:
        {{
            "recommended_courses": [
                {{"course_id": "...", "priority": 1-10, "reason": "..."}},
                ...
            ],
            "reasoning": "Explanation of why these recommendations were made",
            "suggested_next_steps": ["...", "..."]
        }}
        """
        
        # Call LLM to generate recommendations
        try:
            llm_response = await self.llm_client.generate_chat_completion(
                [{"role": "user", "content": prompt}], max_tokens=1000
            )
            
            # Parse the response
            try:
                recommendations = json.loads(llm_response)
            except json.JSONDecodeError:
                # If parsing fails, try to extract the JSON portion
                start_idx = llm_response.find('{')
                end_idx = llm_response.rfind('}') + 1
                if start_idx != -1 and end_idx != 0:
                    recommendations = json.loads(llm_response[start_idx:end_idx])
                else:
                    raise ValueError("Could not parse LLM response as JSON")
            
            # Calculate cost (this is a simplified calculation)
            cost_usd = len(llm_response) * 0.00002  # Approximate cost per character
            
            # Create the adaptive learning path
            adaptive_path = AdaptiveLearningPath(
                user_id=user_id,
                recommended_courses=json.dumps(recommendations.get("recommended_courses", [])),
                reasoning=recommendations.get("reasoning", ""),
                valid_until=datetime.utcnow() + timedelta(days=30),  # Valid for 30 days
                is_active=True,
                cost_usd=cost_usd
            )
            
            self.db.add(adaptive_path)
            self.db.commit()
            self.db.refresh(adaptive_path)
            
            # Log the usage for cost tracking
            self._log_hybrid_feature_usage(
                user_id=user_id,
                feature_type="adaptive_path",
                cost_usd=cost_usd,
                request_details=json.dumps({"preferences": user_preferences}),
                response_summary=json.dumps({
                    "recommendation_count": len(recommendations.get("recommended_courses", []))
                })
            )
            
            return adaptive_path
            
        except Exception as e:
            # Log the error and raise an exception
            print(f"Error generating adaptive learning path: {str(e)}")
            raise

    def get_current_adaptive_path(
        self,
        user_id: int
    ) -> Optional[AdaptiveLearningPath]:
        """
        Get the current active adaptive learning path for a user.
        
        Args:
            user_id: The ID of the user
            
        Returns:
            Active AdaptiveLearningPath object or None if not found
        """
        return self.db.query(AdaptiveLearningPath).filter(
            AdaptiveLearningPath.user_id == user_id,
            AdaptiveLearningPath.is_active == True,
            AdaptiveLearningPath.valid_until >= datetime.utcnow()
        ).first()

    async def grade_assessment_with_llm(
        self,
        user_id: int,
        quiz_attempt_id: int,
        question_id: str,
        answer_text: str,
        context: Optional[Dict[str, Any]] = None
    ) -> LLMGradeAssessment:
        """
        Grade a free-form assessment using LLM.
        
        Args:
            user_id: The ID of the user submitting the answer
            quiz_attempt_id: The ID of the quiz attempt
            question_id: The ID of the question being answered
            answer_text: The user's free-form answer
            context: Additional context for grading
            
        Returns:
            LLMGradeAssessment object with grading results
        """
        # Get the quiz attempt and question details
        quiz_attempt = self.db.query(QuizAttempt).filter(QuizAttempt.id == quiz_attempt_id).first()
        if not quiz_attempt:
            raise ValueError(f"Quiz attempt {quiz_attempt_id} not found")
        
        # Prepare context for LLM
        grading_context = {
            "question_context": context or {},
            "user_answer": answer_text,
            "quiz_attempt": {k: str(v) for k, v in quiz_attempt.__dict__.items() if not k.startswith('_')} if quiz_attempt else {}
        }
        
        # Generate prompt for LLM
        prompt = f"""
        Grade the following answer based on the question context:
        
        Question Context: {json.dumps(grading_context['question_context'])}
        User Answer: {grading_context['user_answer']}
        Quiz Attempt Info: {json.dumps(grading_context['quiz_attempt'])}
        
        Please provide grading in the following format:
        {{
            "score": 0.0-1.0,
            "feedback": "Detailed feedback on the answer",
            "strengths": ["...", "..."],
            "areas_for_improvement": ["...", "..."]
        }}
        """
        
        # Call LLM to grade the assessment
        try:
            llm_response = await self.llm_client.generate_chat_completion(
                [{"role": "user", "content": prompt}], max_tokens=800
            )
            
            # Parse the response
            try:
                grading_result = json.loads(llm_response)
            except json.JSONDecodeError:
                # If parsing fails, try to extract the JSON portion
                start_idx = llm_response.find('{')
                end_idx = llm_response.rfind('}') + 1
                if start_idx != -1 and end_idx != 0:
                    grading_result = json.loads(llm_response[start_idx:end_idx])
                else:
                    raise ValueError("Could not parse LLM response as JSON")
            
            # Calculate cost (this is a simplified calculation)
            cost_usd = len(llm_response) * 0.00002  # Approximate cost per character
            
            # Create the LLM grade assessment
            llm_grade = LLMGradeAssessment(
                user_id=user_id,
                quiz_attempt_id=quiz_attempt_id,
                question_id=question_id,
                original_response=answer_text,
                llm_grade=json.dumps(grading_result),
                cost_usd=cost_usd,
                is_valid=True
            )
            
            self.db.add(llm_grade)
            self.db.commit()
            self.db.refresh(llm_grade)
            
            # Log the usage for cost tracking
            self._log_hybrid_feature_usage(
                user_id=user_id,
                feature_type="llm_grading",
                cost_usd=cost_usd,
                request_details=json.dumps({
                    "question_id": question_id,
                    "answer_length": len(answer_text)
                }),
                response_summary=json.dumps({
                    "score": grading_result.get("score"),
                    "feedback_length": len(grading_result.get("feedback", ""))
                })
            )
            
            return llm_grade
            
        except Exception as e:
            # Log the error and raise an exception
            print(f"Error grading assessment with LLM: {str(e)}")
            raise

    def get_cost_metrics(
        self,
        user_id: int,
        period_start: Optional[datetime] = None,
        period_end: Optional[datetime] = None
    ) -> List[CostMetric]:
        """
        Get cost metrics for a user within a specified period.
        
        Args:
            user_id: The ID of the user
            period_start: Start date for the period (defaults to beginning of current month)
            period_end: End date for the period (defaults to end of current month)
            
        Returns:
            List of CostMetric objects
        """
        if period_start is None:
            # Default to beginning of current month
            period_start = datetime(datetime.now().year, datetime.now().month, 1)
        
        if period_end is None:
            # Default to end of current month
            next_month = period_start.replace(day=28) + timedelta(days=4)
            period_end = next_month - timedelta(days=next_month.day)
        
        return self.db.query(CostMetric).filter(
            CostMetric.user_id == user_id,
            CostMetric.metric_period_start >= period_start.date(),
            CostMetric.metric_period_end <= period_end.date()
        ).all()

    def _log_hybrid_feature_usage(
        self,
        user_id: int,
        feature_type: str,
        cost_usd: float,
        request_details: Optional[str] = None,
        response_summary: Optional[str] = None,
        tokens_used: Optional[int] = None
    ):
        """
        Log usage of a hybrid feature for cost tracking.
        
        Args:
            user_id: The ID of the user
            feature_type: Type of feature used
            cost_usd: Cost incurred
            request_details: Details about the request
            response_summary: Summary of the response
            tokens_used: Number of tokens used
        """
        usage_record = HybridFeatureUsage(
            user_id=user_id,
            feature_type=feature_type,
            cost_usd=cost_usd,
            request_details=request_details,
            response_summary=response_summary,
            tokens_used=tokens_used
        )
        
        self.db.add(usage_record)
        self.db.commit()

    def create_cost_metric(
        self,
        user_id: int,
        period_start: datetime,
        period_end: datetime,
        total_cost_usd: float,
        total_tokens: int,
        feature_breakdown: Dict[str, float]
    ) -> CostMetric:
        """
        Create a cost metric record.
        
        Args:
            user_id: The ID of the user
            period_start: Start date of the period
            period_end: End date of the period
            total_cost_usd: Total cost for the period
            total_tokens: Total tokens used in the period
            feature_breakdown: Breakdown of costs by feature
            
        Returns:
            CostMetric object
        """
        cost_metric = CostMetric(
            user_id=user_id,
            metric_period_start=period_start.date(),
            metric_period_end=period_end.date(),
            total_cost_usd=total_cost_usd,
            total_tokens=total_tokens,
            feature_breakdown=json.dumps(feature_breakdown)
        )
        
        self.db.add(cost_metric)
        self.db.commit()
        self.db.refresh(cost_metric)
        
        return cost_metric