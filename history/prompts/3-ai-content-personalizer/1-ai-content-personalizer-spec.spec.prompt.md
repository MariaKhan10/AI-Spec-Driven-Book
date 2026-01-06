---
id: 1
title: ai-content-personalizer-spec
stage: spec
date: 2025-12-26
surface: agent
model: Claude Sonnet 4.5
feature: 3-ai-content-personalizer
branch: 3-ai-content-personalizer
user: Claude Code User
command: /sp.specify
labels: ["specification", "ai", "content-personalization", "markdown"]
links:
  spec: specs/3-ai-content-personalizer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/3-ai-content-personalizer/spec.md
  - specs/3-ai-content-personalizer/checklists/requirements.md
  - history/prompts/3-ai-content-personalizer/
tests:
  - specs/3-ai-content-personalizer/checklists/requirements.md
---

## Prompt

({
  userId: state.user?.id, // Better Auth logged-in user (optional chaining for safety)
  instructions: `
You are an AI content personalizer for a book written in Markdown.
The book has multiple chapters located in the 'docs' folder as separate .md files, processed in alphabetical order by filename (or numerical prefix if present, e.g., '01-intro.md' before '02-basics.md').

Task:
1. If the user is not logged in (userId is undefined or null), output the original content as-is for all chapters without changes.
2. Otherwise, for each chapter in 'docs/' (process sequentially, one at a time if invoked iteratively, or all at once if possible; batch if >10 chapters to avoid overload):
   a. Read the Markdown content.
   b. Personalize it based on the logged-in user's information from Better Auth:
      - Preferred Name: Use ${state.user?.name} if available; otherwise, derive a friendly alias from ${state.user?.email?.split('@')[0]} (e.g., capitalize the username part). If neither is available, use a generic "Reader".
      - Software Background: ${state.user?.softwareBackground || 'Unknown'} (map to levels: 'Beginner' if words like 'new', 'novice', or empty; 'Intermediate' if 'some experience'; 'Advanced' if 'expert', 'years of experience', etc.).
      - Hardware Background: ${state.user?.hardwareBackground || 'Unknown'} (use similar mapping as above).
   c. Adjust complexity, examples, and technical explanations according to the combined backgrounds (average if they differ; err toward simpler if 'Unknown'):
      - Beginner: Use simple language, basic analogies (e.g., compare code to recipes), avoid jargon or define it immediately, short examples.
      - Intermediate: Balanced depth with practical tips (e.g., common pitfalls), moderate examples with code snippets.
      - Advanced: Detailed explanations, advanced techniques (e.g., optimizations, edge cases), extra resources or challenges.
   d. Maintain all learning objectives, section structure, headings, formatting, links, and code blocks. Only personalize explanatory text, examples, and intros/outros.
   e. Output only the personalized Markdown content, ready to display in the chapter.
3. Handle errors gracefully: If a file is not Markdown or unreadable, output the original. If backgrounds are invalid, default to 'Intermediate'.
4. Do NOT access, modify, or delete any files—work only with provided content.

Output Format:
Output as a JSON array of objects, one per chapter:
[
  {
    "filename": "chapter-filename.md",
    "content": "Full personalized Markdown content here (escape newlines if needed)"
  },
  ...
]
If processing a single chapter, output a single-object array.
`
});

## Response snapshot

# Feature Specification: AI Content Personalizer

**Feature Branch**: `3-ai-content-personalizer`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "AI content personalizer for a book written in Markdown that personalizes content based on user background and preferences"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Personalized Content Display (Priority: P1)

As a logged-in user with specific software and hardware backgrounds, I want the book content to be personalized based on my profile information so that I can have an optimal learning experience that matches my skill level.

**Why this priority**: This is the core value proposition of the feature - delivering personalized content that adapts to the user's background and experience level.

**Independent Test**: Can be fully tested by logging in with different user profiles (beginner, intermediate, advanced) and verifying that the content complexity, examples, and explanations adjust accordingly while maintaining all learning objectives and structure.

**Acceptance Scenarios**:

1. **Given** a logged-in user with "beginner" software background, **When** viewing any book chapter, **Then** content uses simple language, basic analogies, avoids jargon or defines it immediately, and provides short examples
2. **Given** a logged-in user with "advanced" software background, **When** viewing any book chapter, **Then** content provides detailed explanations, advanced techniques, and extra resources or challenges
3. **Given** a logged-in user with "intermediate" software background, **When** viewing any book chapter, **Then** content balances depth with practical tips and moderate examples with code snippets

### User Story 2 - Anonymous User Content Access (Priority: P2)

As an unregistered visitor, I want to access the original book content without any personalization so that I can browse the material before deciding to register.

**Why this priority**: Essential for onboarding new users and allowing them to experience the book content before committing to registration.

**Independent Test**: Can be fully tested by accessing book chapters without authentication and verifying that original content is displayed without any modifications.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user (userId is undefined/null), **When** viewing any book chapter, **Then** content is displayed exactly as-is without any personalization

### User Story 3 - Profile-Based Personalization (Priority: P3)

As a registered user with specific profile information, I want the system to use my preferred name and background information to personalize the content in a way that feels tailored to me specifically.

**Why this priority**: Enhances user experience by making the content feel more personal and relevant to the individual.

**Independent Test**: Can be tested by having a user with specific profile information (name, software background, hardware background) and verifying that the content personalization reflects these preferences.

**Acceptance Scenarios**:

1. **Given** a logged-in user with a preferred name, **When** viewing personalized content, **Then** the content may address the user by their preferred name when appropriate
2. **Given** a logged-in user with both software and hardware backgrounds, **When** viewing content, **Then** complexity is adjusted based on the average of both backgrounds, erring toward simpler if one is 'Unknown'

### Edge Cases

- What happens when user profile information is incomplete or invalid?
- How does the system handle Markdown files that are not readable or not in the expected format?
- What happens when a user's background changes after they've already viewed some content?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read Markdown content from the 'docs' folder and process chapters in alphabetical order by filename
- **FR-002**: System MUST check if a user is logged in by verifying if userId is defined and not null
- **FR-003**: System MUST personalize content based on logged-in user's information from Better Auth (preferred name, software background, hardware background)
- **FR-004**: System MUST map user backgrounds to appropriate levels: 'Beginner' for words like 'new', 'novice', or empty; 'Intermediate' for 'some experience'; 'Advanced' for 'expert', 'years of experience', etc.
- **FR-005**: System MUST adjust content complexity according to the combined backgrounds (average if they differ; err toward simpler if 'Unknown')
- **FR-006**: System MUST maintain all learning objectives, section structure, headings, formatting, links, and code blocks during personalization
- **FR-007**: System MUST output only personalized Markdown content ready for display when user is logged in
- **FR-008**: System MUST output original content unchanged when user is not logged in
- **FR-009**: System MUST handle errors gracefully by outputting original content if a file is not Markdown or unreadable
- **FR-010**: System MUST default to 'Intermediate' level if user backgrounds are invalid
- **FR-011**: System MUST NOT access, modify, or delete any files—only work with provided content
- **FR-012**: System MUST process chapters sequentially, one at a time if invoked iteratively, or all at once if possible
- **FR-013**: System MUST batch process if there are more than 10 chapters to avoid overload
- **FR-014**: System MUST output content as a JSON array of objects with filename and personalized content
- **FR-015**: System MUST derive a friendly alias from user's email username if preferred name is not available

### Key Entities *(include if feature involves data)*

- **User Profile**: Represents the logged-in user's information from Better Auth, including preferred name, software background, hardware background, and userId
- **Book Chapter**: Represents a Markdown file from the 'docs' folder that contains book content to be personalized
- **Personalized Content**: The transformed Markdown content that has been adjusted based on the user's background and preferences

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users with different skill levels report 80% higher engagement with personalized content compared to non-personalized content
- **SC-002**: System can process all chapters in the 'docs' folder within 5 seconds when user is logged in
- **SC-003**: 95% of users with beginner backgrounds successfully understand the concepts presented without requiring additional explanations
- **SC-004**: All original learning objectives, section structure, headings, formatting, links, and code blocks are preserved in the personalized content
- **SC-005**: Users report 90% satisfaction with content complexity that matches their skill level
- **SC-006**: Error handling works correctly in 100% of edge cases (unreadable files, invalid backgrounds, etc.)

## Outcome

- ✅ Impact: Created comprehensive specification for AI content personalizer feature that adapts book content based on user background and preferences
- 🧪 Tests: Specification includes testable user stories with acceptance criteria and edge cases
- 📁 Files: Created spec.md and requirements checklist in the feature directory
- 🔁 Next prompts: Ready for planning phase with `/sp.plan`
- 🧠 Reflection: Specification successfully captures the core functionality of personalizing Markdown-based book content based on user profiles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All specification requirements met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase