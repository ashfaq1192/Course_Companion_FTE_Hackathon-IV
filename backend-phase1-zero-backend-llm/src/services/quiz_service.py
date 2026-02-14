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
            # For short answer, implement rule-based evaluation
            return self._evaluate_short_answer(question, user_answer)
        elif question.question_type == 'matching':
            # For matching questions, evaluate the pairs
            return self._evaluate_matching_question(question, user_answer)
        elif question.question_type == 'ordering':
            # For ordering questions, check the sequence
            return self._evaluate_ordering_question(question, user_answer)
        else:
            # Default to exact string comparison
            return user_answer == question.correct_answer

    def _evaluate_short_answer(self, question: QuizQuestion, user_answer: str) -> bool:
        """Evaluate short answer questions using rule-based evaluation"""
        # Check if the answer contains key terms from the correct answer
        correct_answer_lower = question.correct_answer.strip().lower()
        user_answer_lower = user_answer.strip().lower()

        # Simple keyword matching approach - could be enhanced with more sophisticated rules
        if correct_answer_lower == user_answer_lower:
            return True

        # Split correct answer into key terms/phrases
        key_terms = [term.strip() for term in correct_answer_lower.split() if len(term) > 3]

        # Check if user answer contains most key terms
        matched_terms = sum(1 for term in key_terms if term in user_answer_lower)
        if len(key_terms) > 0 and matched_terms / len(key_terms) >= 0.7:  # 70% match threshold
            return True

        return False

    def _evaluate_matching_question(self, question: QuizQuestion, user_answer: str) -> bool:
        """Evaluate matching questions using rule-based evaluation"""
        # Parse the user's matching pairs and compare with correct answer
        # Format assumption: "A:1,B:2,C:3" where A, B, C are items to match with 1, 2, 3
        try:
            user_pairs = dict(item.split(':') for item in user_answer.split(','))
            correct_pairs = dict(item.split(':') for item in question.correct_answer.split(','))

            return user_pairs == correct_pairs
        except:
            return False

    def _evaluate_ordering_question(self, question: QuizQuestion, user_answer: str) -> bool:
        """Evaluate ordering questions using rule-based evaluation"""
        # Compare the sequence of items
        user_sequence = [item.strip() for item in user_answer.split(',')]
        correct_sequence = [item.strip() for item in question.correct_answer.split(',')]

        return user_sequence == correct_sequence

    def get_quiz_attempt(self, attempt_id: int) -> Optional[QuizAttempt]:
        """Get details of a specific quiz attempt"""
        return self.db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id).first()

    def get_quiz_attempts_by_user(self, user_id: int) -> List[QuizAttempt]:
        """Get all quiz attempts for a user"""
        return self.db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()

