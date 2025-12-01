# ADR-003: Integration of Vision-Language-Action (VLA) in Humanoid Robotics Curriculum

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-11-28
- **Feature:** 1-physical-ai-robotics-textbook
- **Context**: The textbook's core theme is "AI Systems in the Physical World: Embodied Intelligence," emphasizing the convergence of AI with physical robotics. VLA systems represent a frontier in this convergence, enabling natural human-robot interaction and complex autonomous tasks. Including it as a central element reinforces the textbook's AI-native approach.

## Decision

Integrate advanced Vision-Language-Action (VLA) systems and conversational robotics (using OpenAI Whisper and LLMs for cognitive planning) as a core, culminating component of the capstone project and Chapter 3, rather than treating it as an optional or external topic.

## Consequences

### Positive

- Provides a strong emphasis on modern, AI-native robotics, directly aligning with the textbook's core thesis.
- Results in a highly engaging and relevant capstone project that demonstrates full humanoid autonomy.
- Showcases the full potential and complexity of embodied intelligence at the intersection of perception, language, and action.
- Prepares students for cutting-edge industry trends in humanoid AI.

### Negative

- Introduces higher complexity and a potentially steeper learning curve in Chapter 3.
- Requires students to integrate multiple advanced technologies (Whisper, LLMs, Nav2, Isaac Sim) in the final phase.

## Alternatives Considered

**Optional/Advanced Topic**
- *Pros*: Reduces initial complexity for beginners; allows more focus on foundational aspects.
- *Cons*: Diminishes the "AI-native" and "embodied intelligence" focus; might not fully showcase the potential of modern humanoid robotics; results in a less compelling or complete capstone project.

**Delayed Introduction (e.g., after the textbook)**
- *Pros*: Ensures students have strong fundamentals before exposure to VLA.
- *Cons*: Misses the opportunity to integrate VLA into the core learning progression; makes the textbook less comprehensive in terms of modern humanoid AI.

## References

- Feature Spec: specs/1-physical-ai-robotics-textbook/spec.md
- Implementation Plan: specs/1-physical-ai-robotics-textbook/plan.md
- Related ADRs: N/A
- Evaluator Evidence: N/A