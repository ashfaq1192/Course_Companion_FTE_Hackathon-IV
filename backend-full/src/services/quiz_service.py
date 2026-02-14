from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from ..models.quiz import QuizQuestion, QuizAttempt
from ..models.course_content import CourseContent


class QuizService:
    def __init__(self, db: Session):
        self.db = db

    def get_questions_by_content_id(self, content_id: int) -> List[QuizQuestion]:
        """Get all quiz questions for a specific content"""
        return (
            self.db.query(QuizQuestion)
            .filter(QuizQuestion.content_id == content_id)
            .all()
        )

    def create_quiz_attempt(self, user_id: int, content_id: int) -> QuizAttempt:
        """Initialize a quiz attempt for the user"""
        quiz_attempt = QuizAttempt(
            user_id=user_id,
            content_id=content_id,
            score=0.0,
            total_questions=0,
            correct_answers=0,
            attempt_date=datetime.utcnow(),
            time_taken_seconds=0,
            answers="{}"  # Empty JSON string initially
        )
        self.db.add(quiz_attempt)
        self.db.commit()
        self.db.refresh(quiz_attempt)
        return quiz_attempt

    def submit_quiz_answers(self, user_id: int, content_id: int, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Submit answers for a quiz and return grading results"""
        # Get the quiz questions
        questions = self.get_questions_by_content_id(content_id)

        if not questions:
            raise ValueError("No questions found for this quiz")

        # Create quiz attempt
        quiz_attempt = self.create_quiz_attempt(user_id, content_id)

        # Grade the quiz
        correct_answers = 0
        total_questions = len(questions)

        # Create a mapping of question_id to question for quick lookup
        question_map = {q.id: q for q in questions}

        results = []
        for answer in answers:
            question_id = answer.get('question_id')
            user_answer = answer.get('answer')

            if question_id not in question_map:
                continue  # Skip invalid question IDs

            question = question_map[question_id]

            # Check if the answer is correct
            is_correct = self._check_answer(question, user_answer)
            if is_correct:
                correct_answers += 1

            results.append({
                'question_id': question_id,
                'user_answer': user_answer,
                'is_correct': is_correct,
                'explanation': question.explanation
            })

        # Calculate score
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

        # Update the quiz attempt with results
        quiz_attempt.total_questions = total_questions
        quiz_attempt.correct_answers = correct_answers
        quiz_attempt.score = score
        quiz_attempt.answers = str(answers)  # Store as string representation

        self.db.commit()
        self.db.refresh(quiz_attempt)

        return {
            'attempt': quiz_attempt,
            'questions': questions,
            'results': results,
            'score': score,
            'total_questions': total_questions,
            'correct_answers': correct_answers
        }

    def _check_answer(self, question: QuizQuestion, user_answer: str) -> bool:
        """Check if the user's answer is correct based on the question type"""
        if question.question_type == 'multiple_choice':
            # For multiple choice, compare the user's answer with the correct answer
            return user_answer.strip().lower() == question.correct_answer.strip().lower()
        elif question.question_type == 'true_false':
            # For true/false, normalize the answer and compare
            normalized_user = user_answer.strip().lower()
            normalized_correct = question.correct_answer.strip().lower()
            return normalized_user == normalized_correct
        elif question.question_type == 'short_answer':
            # For short answer, we might want to implement more sophisticated comparison
            # For now, doing a simple case-insensitive comparison
            return user_answer.strip().lower() == question.correct_answer.strip().lower()
        else:
            # Default to exact string comparison
            return user_answer == question.correct_answer

    def get_quiz_attempt(self, attempt_id: int) -> Optional[QuizAttempt]:
        """Get details of a specific quiz attempt"""
        return self.db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id).first()

    def get_quiz_attempts_by_user(self, user_id: int) -> List[QuizAttempt]:
        """Get all quiz attempts for a user"""
        return self.db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()

    def enhance_with_llm_grading(self, quiz_attempt_id: int, question_id: str, answer_text: str, context: Optional[Dict[str, Any]] = None):
        """
        Enhance quiz grading with LLM for complex answers that require nuanced evaluation.

        Args:
            quiz_attempt_id: The ID of the quiz attempt
            question_id: The ID of the question being answered
            answer_text: The user's answer text
            context: Additional context for grading

        Returns:
            Enhanced grading result from LLM
        """
        # This method would typically call the HybridIntelligenceService
        # to perform LLM-based grading of complex answers
        # Implementation would be in the HybridIntelligenceService
        pass