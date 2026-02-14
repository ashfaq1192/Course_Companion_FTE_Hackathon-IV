"""
Seed script for Course Companion FTE.
Loads course content, quiz questions, and a demo user into the database.

Usage:
    cd backend-phase1-zero-backend-llm
    source venv/bin/activate
    python seed_data.py
"""

import json
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.database.database import engine, SessionLocal
from src.models import Base
from src.models.user import User
from src.models.course_content import CourseContent
from src.models.quiz import QuizQuestion
from src.models.subscription import Subscription
from src.core.security import get_password_hash
from datetime import datetime, date


COURSE_ID = "gen-ai-fundamentals"

# ─── Course Content (5 chapters, free chapters 1-3, premium 4-5) ──────────

CHAPTERS = [
    {
        "title": "Chapter 1: What Are Large Language Models?",
        "chapter_number": 1,
        "content_type": "text",
        "is_available": True,
        "content_data": """# What Are Large Language Models?

## Introduction

Large Language Models (LLMs) are artificial intelligence systems trained on vast amounts of text data to understand and generate human language. They represent one of the most significant breakthroughs in AI, enabling machines to write, translate, summarize, and reason about text with remarkable fluency.

## How LLMs Work

At their core, LLMs are **neural networks** built on the **Transformer architecture** (introduced by Vaswani et al. in 2017). They work by:

1. **Tokenization**: Breaking text into smaller units called tokens (words or subwords)
2. **Embedding**: Converting tokens into numerical vectors that capture meaning
3. **Attention**: Using self-attention mechanisms to understand relationships between all tokens in a sequence
4. **Prediction**: Generating the next most likely token given the preceding context

## Key Concepts

### Parameters
LLMs are defined by their **parameter count** — the number of adjustable weights in the neural network. More parameters generally means more capacity to learn patterns:
- GPT-2 (2019): 1.5 billion parameters
- GPT-3 (2020): 175 billion parameters
- GPT-4 (2023): Estimated 1+ trillion parameters (multi-expert)

### Training Data
LLMs are trained on massive text corpora from books, websites, code repositories, and academic papers. The quality and diversity of training data directly impacts the model's capabilities.

### Context Window
The **context window** is the maximum number of tokens an LLM can process at once. Larger context windows allow the model to consider more information when generating responses:
- Early models: 2,048 tokens
- Modern models: 128,000 - 200,000 tokens

## Why LLMs Matter

LLMs have transformed how we interact with technology because they can:
- **Understand intent** from natural language instructions
- **Generate coherent text** across many domains
- **Reason about problems** (to varying degrees)
- **Transfer knowledge** across tasks without retraining

## Summary

Large Language Models are powerful AI systems that learn language patterns from massive datasets. Understanding their architecture (Transformers), scale (parameters), and capabilities is the foundation for working effectively with generative AI.

### Key Takeaways
- LLMs use the Transformer architecture with self-attention
- More parameters generally means more capability
- Training data quality determines model quality
- Context windows determine how much information the model can use at once
""",
    },
    {
        "title": "Chapter 2: Prompt Engineering Fundamentals",
        "chapter_number": 2,
        "content_type": "text",
        "is_available": True,
        "content_data": """# Prompt Engineering Fundamentals

## What Is Prompt Engineering?

Prompt engineering is the practice of crafting effective inputs (prompts) to get desired outputs from Large Language Models. It's both an art and a science — understanding how to communicate with LLMs to maximize the quality and relevance of their responses.

## Why Prompts Matter

LLMs don't truly "understand" — they predict the most likely continuation of text. The way you frame your input dramatically affects the output:

- **Vague prompt**: "Tell me about Python" → Generic, unfocused response
- **Specific prompt**: "Explain Python list comprehensions with 3 examples for a beginner" → Targeted, useful response

## Core Prompting Techniques

### 1. Zero-Shot Prompting
Ask the model to perform a task without any examples:
```
Classify the following review as positive or negative:
"The product arrived on time and works perfectly!"
```

### 2. Few-Shot Prompting
Provide examples to demonstrate the desired output format:
```
Classify reviews:
"Great product!" → Positive
"Terrible quality" → Negative
"Works as advertised" → Positive
"Broke after one day" → ?
```

### 3. Chain-of-Thought (CoT) Prompting
Ask the model to show its reasoning step by step:
```
Solve this problem step by step:
A store sells apples at $2 each. If you buy 5 apples and pay with a $20 bill, how much change do you receive?
```

### 4. System Prompts
Set the behavior and persona of the model before the conversation:
```
You are a helpful Python tutor for beginners. Explain concepts simply,
use analogies, and always provide code examples.
```

## The CRAFT Framework

A useful framework for writing effective prompts:

| Letter | Meaning | Example |
|--------|---------|---------|
| **C** | Context | "You are helping a college student study for an exam" |
| **R** | Role | "Act as an experienced data scientist" |
| **A** | Action | "Explain the concept of overfitting" |
| **F** | Format | "Use bullet points with examples" |
| **T** | Tone | "Keep it conversational and encouraging" |

## Common Mistakes

1. **Being too vague**: "Help me with code" vs "Debug this Python function that should sort a list"
2. **Not specifying format**: Getting prose when you wanted a table
3. **Overloading**: Asking too many things in one prompt
4. **Ignoring context**: Not providing relevant background information

## Summary

Prompt engineering is essential for getting the most out of LLMs. Master zero-shot, few-shot, and chain-of-thought techniques, and use frameworks like CRAFT to structure your prompts systematically.

### Key Takeaways
- How you ask is as important as what you ask
- Few-shot examples dramatically improve output quality
- Chain-of-thought prompting improves reasoning tasks
- The CRAFT framework provides a systematic approach to prompt design
""",
    },
    {
        "title": "Chapter 3: Retrieval-Augmented Generation (RAG)",
        "chapter_number": 3,
        "content_type": "text",
        "is_available": True,
        "content_data": """# Retrieval-Augmented Generation (RAG)

## The Problem RAG Solves

LLMs have two fundamental limitations:
1. **Knowledge cutoff**: They only know what was in their training data
2. **Hallucination**: They can confidently generate incorrect information

RAG solves both by giving the LLM access to external, up-to-date, verified information at query time.

## How RAG Works

RAG combines **information retrieval** with **text generation** in a pipeline:

```
User Query → Retrieval System → Relevant Documents → LLM + Context → Response
```

### Step-by-Step Process

1. **Index**: Convert your documents into vector embeddings and store them in a vector database
2. **Query**: When a user asks a question, convert the query into an embedding
3. **Retrieve**: Find the most similar document chunks using vector similarity search
4. **Augment**: Inject the retrieved documents into the LLM's prompt as context
5. **Generate**: The LLM generates a response grounded in the retrieved content

## Key Components

### Vector Embeddings
Text is converted into numerical vectors (arrays of numbers) that capture semantic meaning. Similar concepts have similar vectors:
- "dog" and "puppy" → vectors close together
- "dog" and "airplane" → vectors far apart

### Vector Databases
Specialized databases optimized for similarity search:
- **Pinecone**: Managed cloud service
- **Weaviate**: Open-source, self-hosted
- **ChromaDB**: Lightweight, great for prototyping
- **pgvector**: PostgreSQL extension

### Chunking Strategies
Documents must be split into manageable pieces (chunks) before embedding:
- **Fixed-size**: Split every N characters/tokens
- **Semantic**: Split at paragraph or section boundaries
- **Recursive**: Split hierarchically (document → sections → paragraphs)

## RAG vs Fine-Tuning

| Aspect | RAG | Fine-Tuning |
|--------|-----|-------------|
| Data freshness | Always current | Frozen at training time |
| Cost | Low (retrieval cost only) | High (GPU training) |
| Transparency | Can cite sources | Black box |
| Best for | Factual Q&A, search | Style/behavior changes |

## When to Use RAG

RAG is ideal when you need:
- **Up-to-date information** (news, documentation, inventory)
- **Source attribution** (citing where information came from)
- **Domain-specific knowledge** (company docs, legal texts, medical records)
- **Reduced hallucination** (grounding responses in verified content)

## Summary

RAG is one of the most practical patterns in generative AI. By combining retrieval with generation, you get LLM responses that are grounded in real data, reducing hallucination and enabling knowledge-current applications.

### Key Takeaways
- RAG = Retrieve relevant context + Generate grounded response
- Vector embeddings capture semantic meaning of text
- Chunking strategy affects retrieval quality
- RAG is preferred over fine-tuning for factual, knowledge-heavy applications
""",
    },
    {
        "title": "Chapter 4: Fine-Tuning and Model Customization",
        "chapter_number": 4,
        "content_type": "text",
        "is_available": True,
        "content_data": """# Fine-Tuning and Model Customization

## What Is Fine-Tuning?

Fine-tuning is the process of taking a pre-trained LLM and training it further on a specific dataset to specialize it for a particular task or domain. Think of it as teaching a general-purpose assistant to become a specialist.

## When to Fine-Tune

Fine-tuning makes sense when you need to:
- **Change the model's style or tone** (e.g., making it sound like your brand)
- **Teach specialized vocabulary** (e.g., medical, legal, or technical terms)
- **Improve performance on specific tasks** (e.g., classification, extraction)
- **Reduce prompt length** (baking instructions into the model weights)

## Fine-Tuning Methods

### Full Fine-Tuning
Retrain all model parameters on your dataset. Expensive but thorough.
- Requires significant GPU resources
- Risk of catastrophic forgetting (losing general knowledge)
- Best for: Large organizations with specific needs

### LoRA (Low-Rank Adaptation)
Train only a small number of additional parameters, leaving the base model frozen.
- 10-100x less compute than full fine-tuning
- Original model knowledge preserved
- Easy to swap adapters for different tasks
- Best for: Most practical fine-tuning scenarios

### QLoRA (Quantized LoRA)
Combine LoRA with model quantization to fine-tune on consumer hardware.
- Fine-tune a 65B parameter model on a single GPU
- Minimal quality loss from quantization
- Best for: Budget-conscious teams and experimentation

## The Fine-Tuning Process

1. **Prepare data**: Collect examples in prompt-completion format
2. **Format dataset**: Convert to the model's expected format (JSONL)
3. **Choose hyperparameters**: Learning rate, epochs, batch size
4. **Train**: Run fine-tuning (minutes to hours depending on data size)
5. **Evaluate**: Test on held-out examples
6. **Deploy**: Serve the fine-tuned model

## Data Quality > Data Quantity

A critical insight: **100 high-quality examples often outperform 10,000 mediocre ones**.

Good fine-tuning data is:
- Representative of real-world use cases
- Diverse (covers edge cases)
- Correctly labeled
- Consistent in format

## Summary

Fine-tuning customizes LLMs for specific domains and tasks. Modern techniques like LoRA make it accessible without massive compute budgets. The key to success is high-quality training data, not quantity.

### Key Takeaways
- Fine-tune for style/behavior changes; use RAG for knowledge
- LoRA/QLoRA make fine-tuning practical on modest hardware
- Data quality matters more than quantity
- Always evaluate on held-out examples before deploying
""",
    },
    {
        "title": "Chapter 5: Building AI Agents",
        "chapter_number": 5,
        "content_type": "text",
        "is_available": True,
        "content_data": """# Building AI Agents

## What Are AI Agents?

An AI agent is an LLM-powered system that can **take actions** in the real world, not just generate text. Agents combine language understanding with tool use, planning, and autonomous execution.

## From Chatbots to Agents

| Capability | Chatbot | Agent |
|-----------|---------|-------|
| Text generation | Yes | Yes |
| Tool use | No | Yes |
| Planning | No | Yes |
| Memory | Limited | Persistent |
| Autonomy | Reactive | Proactive |

## Core Agent Architecture

```
User Request → Agent Loop:
  1. Think (reason about what to do)
  2. Act (call tools or APIs)
  3. Observe (process results)
  4. Repeat until task complete
→ Final Response
```

This is known as the **ReAct pattern** (Reasoning + Acting).

## Agent Components

### 1. LLM (The Brain)
The language model that reasons about tasks, plans steps, and decides which tools to use.

### 2. Tools (The Hands)
External capabilities the agent can invoke:
- Web search
- Database queries
- API calls
- File operations
- Code execution

### 3. Memory (The Notebook)
Storage for context across interactions:
- **Short-term**: Current conversation context
- **Long-term**: Persistent knowledge base (vector store)
- **Working**: Scratchpad for intermediate reasoning

### 4. Planning (The Strategy)
How the agent breaks complex tasks into steps:
- **Sequential**: Do steps one at a time
- **Parallel**: Do independent steps simultaneously
- **Adaptive**: Adjust plan based on intermediate results

## Agent Frameworks

| Framework | Creator | Key Feature |
|-----------|---------|-------------|
| Claude Agent SDK | Anthropic | Tool use with safety guardrails |
| OpenAI Agents SDK | OpenAI | Function calling + code interpreter |
| LangGraph | LangChain | Graph-based agent workflows |
| CrewAI | Open source | Multi-agent collaboration |

## Safety and Guardrails

Agents can take real actions, so safety is critical:
- **Confirmation gates**: Require human approval for destructive actions
- **Scope limits**: Restrict which tools and data an agent can access
- **Cost caps**: Set maximum spending per request
- **Audit logs**: Record all actions for review
- **Sandboxing**: Run agent code in isolated environments

## The Agent Factory Pattern

In production systems, you don't build one agent — you build an **Agent Factory**:
1. **General Agents** (like Claude Code) build and maintain the system
2. **Specialized Agents** (like Course Companion FTE) serve end users
3. **Specs and Skills** define agent behavior declaratively

This separation means the agent can be updated, improved, and scaled without manual coding.

## Summary

AI agents extend LLMs from text generators to autonomous actors that can use tools, plan multi-step tasks, and maintain memory. Building safe, effective agents requires careful architecture with proper guardrails.

### Key Takeaways
- Agents = LLM + Tools + Memory + Planning
- The ReAct pattern (Think → Act → Observe) is fundamental
- Safety guardrails are non-negotiable for production agents
- The Agent Factory pattern separates building agents from running them
""",
    },
]

# ─── Quiz Questions (linked to chapters) ──────────────────────────────────

QUIZ_QUESTIONS = [
    # Chapter 1 Quiz
    {
        "chapter": 1,
        "question_text": "What architecture do modern Large Language Models primarily use?",
        "question_type": "multiple_choice",
        "options": json.dumps(["Recurrent Neural Networks (RNN)", "Transformer Architecture", "Convolutional Neural Networks (CNN)", "Decision Trees"]),
        "correct_answer": "Transformer Architecture",
        "explanation": "The Transformer architecture, introduced by Vaswani et al. in 2017, is the foundation of modern LLMs. Its self-attention mechanism allows the model to process all tokens in a sequence simultaneously, making it more efficient than previous RNN-based approaches.",
        "difficulty_level": "easy",
    },
    {
        "chapter": 1,
        "question_text": "What does the 'context window' of an LLM refer to?",
        "question_type": "multiple_choice",
        "options": json.dumps(["The physical window on your screen", "The maximum number of tokens the model can process at once", "The training time of the model", "The number of parameters in the model"]),
        "correct_answer": "The maximum number of tokens the model can process at once",
        "explanation": "The context window is the maximum number of tokens an LLM can consider at once. Larger context windows allow the model to process longer documents and maintain coherence over extended conversations.",
        "difficulty_level": "easy",
    },
    {
        "chapter": 1,
        "question_text": "True or False: More parameters in an LLM always guarantees better performance on every task.",
        "question_type": "true_false",
        "options": json.dumps(["True", "False"]),
        "correct_answer": "False",
        "explanation": "While more parameters generally increases model capacity, it doesn't guarantee better performance on every task. Training data quality, fine-tuning, and architecture design also play crucial roles. Smaller, well-trained models can outperform larger ones on specific tasks.",
        "difficulty_level": "medium",
    },

    # Chapter 2 Quiz
    {
        "chapter": 2,
        "question_text": "Which prompting technique provides examples to demonstrate the desired output format?",
        "question_type": "multiple_choice",
        "options": json.dumps(["Zero-shot prompting", "Few-shot prompting", "Chain-of-thought prompting", "System prompting"]),
        "correct_answer": "Few-shot prompting",
        "explanation": "Few-shot prompting includes examples in the prompt to show the model the desired output format and behavior. This is different from zero-shot (no examples) and chain-of-thought (step-by-step reasoning).",
        "difficulty_level": "easy",
    },
    {
        "chapter": 2,
        "question_text": "What does the 'R' stand for in the CRAFT prompting framework?",
        "question_type": "multiple_choice",
        "options": json.dumps(["Result", "Role", "Reference", "Reasoning"]),
        "correct_answer": "Role",
        "explanation": "In the CRAFT framework, R stands for Role — defining the persona or expertise you want the model to adopt. For example, 'Act as an experienced data scientist'.",
        "difficulty_level": "medium",
    },
    {
        "chapter": 2,
        "question_text": "Chain-of-thought prompting asks the model to show its reasoning step by step.",
        "question_type": "true_false",
        "options": json.dumps(["True", "False"]),
        "correct_answer": "True",
        "explanation": "Chain-of-thought (CoT) prompting explicitly asks the model to break down its reasoning into steps. This technique significantly improves performance on math, logic, and complex reasoning tasks.",
        "difficulty_level": "easy",
    },

    # Chapter 3 Quiz
    {
        "chapter": 3,
        "question_text": "What fundamental problem does RAG (Retrieval-Augmented Generation) solve?",
        "question_type": "multiple_choice",
        "options": json.dumps(["Making models run faster", "Reducing model size", "Giving LLMs access to external, up-to-date information", "Replacing the need for training data"]),
        "correct_answer": "Giving LLMs access to external, up-to-date information",
        "explanation": "RAG solves the knowledge cutoff and hallucination problems by retrieving relevant external documents and injecting them into the LLM's context at query time, grounding responses in verified information.",
        "difficulty_level": "easy",
    },
    {
        "chapter": 3,
        "question_text": "In a RAG pipeline, what is the purpose of 'chunking'?",
        "question_type": "multiple_choice",
        "options": json.dumps(["Compressing the model", "Splitting documents into smaller pieces for embedding", "Removing irrelevant words", "Encrypting the data"]),
        "correct_answer": "Splitting documents into smaller pieces for embedding",
        "explanation": "Chunking breaks documents into manageable pieces before creating vector embeddings. The chunk size and strategy (fixed-size, semantic, recursive) affect retrieval quality significantly.",
        "difficulty_level": "medium",
    },
    {
        "chapter": 3,
        "question_text": "RAG is preferred over fine-tuning when you need up-to-date factual information with source attribution.",
        "question_type": "true_false",
        "options": json.dumps(["True", "False"]),
        "correct_answer": "True",
        "explanation": "RAG excels at providing current information with citations because it retrieves from an updatable knowledge base. Fine-tuning is better for changing model behavior or style, but its knowledge is frozen at training time.",
        "difficulty_level": "medium",
    },

    # Chapter 4 Quiz (Premium)
    {
        "chapter": 4,
        "question_text": "What is LoRA (Low-Rank Adaptation)?",
        "question_type": "multiple_choice",
        "options": json.dumps(["A new type of LLM", "A technique to fine-tune only a small number of additional parameters", "A vector database", "A prompting strategy"]),
        "correct_answer": "A technique to fine-tune only a small number of additional parameters",
        "explanation": "LoRA trains a small set of adapter parameters while keeping the base model frozen. This reduces compute requirements by 10-100x compared to full fine-tuning while preserving the model's general knowledge.",
        "difficulty_level": "medium",
    },
    {
        "chapter": 4,
        "question_text": "In fine-tuning, data quality is more important than data quantity.",
        "question_type": "true_false",
        "options": json.dumps(["True", "False"]),
        "correct_answer": "True",
        "explanation": "100 high-quality, representative examples often outperform 10,000 mediocre ones. Good fine-tuning data should be representative of real use cases, diverse, correctly labeled, and consistent in format.",
        "difficulty_level": "easy",
    },

    # Chapter 5 Quiz (Premium)
    {
        "chapter": 5,
        "question_text": "What is the ReAct pattern in AI agents?",
        "question_type": "multiple_choice",
        "options": json.dumps(["A JavaScript framework for AI", "A loop of Reasoning + Acting + Observing", "A type of neural network", "A data preprocessing step"]),
        "correct_answer": "A loop of Reasoning + Acting + Observing",
        "explanation": "The ReAct pattern combines reasoning (thinking about what to do) with acting (calling tools or APIs) and observing (processing results). This loop continues until the task is complete.",
        "difficulty_level": "medium",
    },
    {
        "chapter": 5,
        "question_text": "Which of the following is NOT a core component of an AI agent?",
        "question_type": "multiple_choice",
        "options": json.dumps(["LLM (The Brain)", "Tools (The Hands)", "Memory (The Notebook)", "Blockchain (The Ledger)"]),
        "correct_answer": "Blockchain (The Ledger)",
        "explanation": "The four core components of an AI agent are: LLM (brain/reasoning), Tools (actions/capabilities), Memory (short-term, long-term, working), and Planning (strategy for task decomposition). Blockchain is not a standard agent component.",
        "difficulty_level": "easy",
    },
]


def seed_database():
    """Create tables and insert seed data."""
    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if data already exists
        existing = db.query(CourseContent).first()
        if existing:
            print("Database already has content. Skipping seed.")
            print(f"  Found {db.query(CourseContent).count()} content items")
            print(f"  Found {db.query(QuizQuestion).count()} quiz questions")
            print(f"  Found {db.query(User).count()} users")
            return

        # Create demo user
        demo_user = User(
            email="student@example.com",
            full_name="Demo Student",
            hashed_password=get_password_hash("demo123"),
            is_active=True,
        )
        db.add(demo_user)
        db.flush()  # Get the user ID

        # Create subscription for demo user
        subscription = Subscription(
            user_id=demo_user.id,
            subscription_type="premium",
            start_date=date(2026, 1, 1),
            end_date=date(2027, 1, 1),
            is_active=True,
            payment_status="paid",
        )
        db.add(subscription)

        # Create course content
        content_map = {}  # chapter_number -> content_id
        for chapter in CHAPTERS:
            content = CourseContent(
                title=chapter["title"],
                content_type=chapter["content_type"],
                content_data=chapter["content_data"],
                course_id=COURSE_ID,
                chapter_number=chapter["chapter_number"],
                section_number=1,
                is_available=chapter["is_available"],
            )
            db.add(content)
            db.flush()
            content_map[chapter["chapter_number"]] = content.id

        # Create quiz questions
        for q in QUIZ_QUESTIONS:
            question = QuizQuestion(
                content_id=content_map[q["chapter"]],
                question_text=q["question_text"],
                question_type=q["question_type"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                difficulty_level=q["difficulty_level"],
            )
            db.add(question)

        db.commit()

        print("Database seeded successfully!")
        print(f"  Course: {COURSE_ID} (Generative AI Fundamentals)")
        print(f"  Chapters: {len(CHAPTERS)}")
        print(f"  Quiz Questions: {len(QUIZ_QUESTIONS)}")
        print(f"  Demo User: student@example.com / demo123")
        print(f"  Subscription: Premium (active)")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
