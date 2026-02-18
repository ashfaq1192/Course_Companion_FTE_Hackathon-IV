"""
L1 — Kafka Event Backbone for Course Companion FTE.

Provides an async event producer and consumer for educational domain events.
Topics: quiz_completed, content_viewed, progress_updated.

Uses aiokafka for async Kafka integration.  Not wired into live routes —
demonstrates architectural intent for the event-driven backbone.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any, Callable, Awaitable

from aiokafka import AIOKafkaProducer, AIOKafkaConsumer

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Event topics
# ---------------------------------------------------------------------------

TOPIC_QUIZ_COMPLETED = "edu.quiz_completed"
TOPIC_CONTENT_VIEWED = "edu.content_viewed"
TOPIC_PROGRESS_UPDATED = "edu.progress_updated"

ALL_TOPICS = [
    TOPIC_QUIZ_COMPLETED,
    TOPIC_CONTENT_VIEWED,
    TOPIC_PROGRESS_UPDATED,
]


# ---------------------------------------------------------------------------
# Event envelope
# ---------------------------------------------------------------------------

@dataclass
class EducationalEvent:
    """Canonical event envelope for all educational domain events."""

    topic: str
    user_id: int
    payload: dict[str, Any] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    event_id: str = ""

    def serialize(self) -> bytes:
        return json.dumps(asdict(self)).encode("utf-8")

    @classmethod
    def deserialize(cls, raw: bytes) -> "EducationalEvent":
        data = json.loads(raw.decode("utf-8"))
        return cls(**data)


# ---------------------------------------------------------------------------
# Kafka event producer
# ---------------------------------------------------------------------------

class KafkaEventProducer:
    """Async Kafka producer for educational events."""

    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self._bootstrap = bootstrap_servers
        self._producer: AIOKafkaProducer | None = None

    async def start(self) -> None:
        self._producer = AIOKafkaProducer(bootstrap_servers=self._bootstrap)
        await self._producer.start()
        logger.info("KafkaEventProducer started (%s)", self._bootstrap)

    async def stop(self) -> None:
        if self._producer:
            await self._producer.stop()
            logger.info("KafkaEventProducer stopped")

    async def publish(self, event: EducationalEvent) -> None:
        if not self._producer:
            raise RuntimeError("Producer not started — call start() first")
        await self._producer.send_and_wait(event.topic, event.serialize())
        logger.debug("Published %s for user %s", event.topic, event.user_id)


# ---------------------------------------------------------------------------
# Kafka event consumer
# ---------------------------------------------------------------------------

EventHandler = Callable[[EducationalEvent], Awaitable[None]]


class KafkaEventConsumer:
    """Async Kafka consumer that dispatches to registered handlers."""

    def __init__(
        self,
        topics: list[str] | None = None,
        group_id: str = "course-companion",
        bootstrap_servers: str = "localhost:9092",
    ):
        self._topics = topics or ALL_TOPICS
        self._group_id = group_id
        self._bootstrap = bootstrap_servers
        self._consumer: AIOKafkaConsumer | None = None
        self._handlers: dict[str, list[EventHandler]] = {}

    def on(self, topic: str, handler: EventHandler) -> None:
        """Register a handler for a specific topic."""
        self._handlers.setdefault(topic, []).append(handler)

    async def start(self) -> None:
        self._consumer = AIOKafkaConsumer(
            *self._topics,
            bootstrap_servers=self._bootstrap,
            group_id=self._group_id,
            auto_offset_reset="earliest",
        )
        await self._consumer.start()
        logger.info("KafkaEventConsumer started (%s)", self._topics)

    async def stop(self) -> None:
        if self._consumer:
            await self._consumer.stop()
            logger.info("KafkaEventConsumer stopped")

    async def consume_forever(self) -> None:
        """Poll messages and dispatch to handlers. Runs until cancelled."""
        if not self._consumer:
            raise RuntimeError("Consumer not started — call start() first")
        async for msg in self._consumer:
            try:
                event = EducationalEvent.deserialize(msg.value)
                for handler in self._handlers.get(event.topic, []):
                    await handler(event)
            except Exception:
                logger.exception("Error processing message from %s", msg.topic)
