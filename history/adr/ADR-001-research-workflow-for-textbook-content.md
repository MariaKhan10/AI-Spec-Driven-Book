# ADR-001: Research Workflow for Textbook Content

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-11-28
- **Feature:** 1-physical-ai-robotics-textbook
- **Context**: The textbook on Physical AI & Humanoid Robotics covers a rapidly evolving field with complex, interconnected technologies (ROS 2, Isaac Sim, LLMs). A dynamic research approach is needed to ensure content remains current and practical examples are well-informed.

## Decision

Adopt a "research-concurrent" approach for textbook content development, allowing continuous research to inform and run in parallel with writing phases (Foundation Writing, Analysis & Example Integration). This contrasts with a "research-first" (waterfall) approach.

## Consequences

### Positive

- Content stays relevant and up-to-date in a fast-evolving field.
- Improved agility and responsiveness to new discoveries and best practices.
- Better integration of practical examples and real-world scenarios.
- Continuous feedback loop between research findings and content creation.

### Negative

- Requires robust research management to avoid scope creep or unmanaged dependencies.
- Potential for rework if foundational research shifts significantly mid-writing, though minimized by iterative approach.
- Requires careful coordination between research and writing teams.

## Alternatives Considered

**Research-First (Waterfall) Approach**
- *Pros*: Potentially more structured, ensures a complete understanding before committing to content.
- *Cons*: High risk of outdated information in a fast-moving field; delays content production; less agile to new discoveries; could lead to less practical, more theoretical content.

## References

- Feature Spec: specs/1-physical-ai-robotics-textbook/spec.md
- Implementation Plan: specs/1-physical-ai-robotics-textbook/plan.md
- Related ADRs: N/A
- Evaluator Evidence: N/A