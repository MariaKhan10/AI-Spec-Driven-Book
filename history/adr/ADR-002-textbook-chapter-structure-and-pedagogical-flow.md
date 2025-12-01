# ADR-002: Textbook Chapter Structure and Pedagogical Flow

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-11-28
- **Feature:** 1-physical-ai-robotics-textbook
- **Context**: The initial course outline had 4 modules, but the user requested a 3-chapter textbook. This required a re-structuring to ensure a cohesive learning progression that accumulates intelligence towards full humanoid autonomy, as per the specification and constitution.

## Decision

Consolidate the initial 4-module course outline into a 3-chapter textbook, with a specific pedagogical flow that builds cumulatively:
-   **Chapter 1: Foundations of Physical AI & ROS 2 Nervous System**
-   **Chapter 2: Simulation & Digital Twin for Humanoids**
-   **Chapter 3: Vision-Language-Action & Full Humanoid Autonomy**

## Consequences

### Positive

- Directly meets the user's explicit 3-chapter structural constraint.
- Establishes a clear and logical pedagogical progression, building foundational knowledge before advanced topics.
- Ensures intelligence accumulation across chapters, aligning with the project's core principles.
- Optimizes content flow, avoiding redundancy and maximizing chapter effectiveness.

### Negative

- Required careful merging and re-scoping of content from the original 4 modules into 3 chapters.
- Potential for initial content re-ordering challenges if original module dependencies were rigid.

## Alternatives Considered

**Retain 4-Module Structure**
- *Pros*: Might preserve the original content breakdown more easily.
- *Cons*: Directly violates the user's 3-chapter constraint; could lead to rushed or incomplete content per chapter if forced into 3 for compliance.

**Alternative 3-Chapter Groupings**
- *Pros*: Could explore different learning paths or emphasis.
- *Cons*: Might disrupt the natural intelligence accumulation (foundations -> simulation -> advanced autonomy) and optimal pedagogical flow.

## References

- Feature Spec: specs/1-physical-ai-robotics-textbook/spec.md
- Implementation Plan: specs/1-physical-ai-robotics-textbook/plan.md
- Related ADRs: N/A
- Evaluator Evidence: N/A