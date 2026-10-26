# Lesson AI tutor chat

## What will change
- Replace the “Video coming soon” area with an AI tutor chat for the current lesson.
- Support multiple lesson-specific conversations, each with its own URL and transcript saved in this browser.
- Add a lesson tutor Edge Function that streams responses through Lovable AI, validates signed-in users and lesson context, and keeps prompts and credentials server-side.
- Use the project’s AI chat building blocks and preserve the lesson page’s existing style.

## Technical approach
- Add nested lesson-chat URLs with route-derived conversation IDs and localStorage-backed `UIMessage[]` history.
- Add a chat interface with conversation switching, new-chat action, streaming, stop, errors, and lesson-aware guidance.
- Deploy and verify the streaming function; run typecheck, lint, tests, and preview checks.
