"""Add hybrid intelligence models

Revision ID: 9d8c694e3f91
Revises: 
Create Date: 2026-02-03 19:36:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '9d8c694e3f91'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create adaptive_learning_paths table
    op.create_table('adaptive_learning_paths',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('generated_at', sa.DateTime(), nullable=False),
        sa.Column('recommended_courses', sa.Text(), nullable=False),
        sa.Column('reasoning', sa.Text(), nullable=True),
        sa.Column('valid_until', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('cost_usd', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create llm_grade_assessments table
    op.create_table('llm_grade_assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('quiz_attempt_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('question_id', sa.String(), nullable=False),
        sa.Column('original_response', sa.Text(), nullable=False),
        sa.Column('llm_grade', sa.Text(), nullable=False),
        sa.Column('graded_at', sa.DateTime(), nullable=False),
        sa.Column('cost_usd', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('is_valid', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['quiz_attempt_id'], ['quiz_attempts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create hybrid_feature_usage table
    op.create_table('hybrid_feature_usage',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('feature_type', sa.String(length=50), nullable=False),
        sa.Column('usage_timestamp', sa.DateTime(), nullable=False),
        sa.Column('request_details', sa.Text(), nullable=True),
        sa.Column('response_summary', sa.Text(), nullable=True),
        sa.Column('cost_usd', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('tokens_used', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create cost_metrics table
    op.create_table('cost_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('metric_period_start', sa.Date(), nullable=False),
        sa.Column('metric_period_end', sa.Date(), nullable=False),
        sa.Column('total_cost_usd', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('total_tokens', sa.Integer(), nullable=False),
        sa.Column('feature_breakdown', sa.Text(), nullable=False),
        sa.Column('calculated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('cost_metrics')
    op.drop_table('hybrid_feature_usage')
    op.drop_table('llm_grade_assessments')
    op.drop_table('adaptive_learning_paths')