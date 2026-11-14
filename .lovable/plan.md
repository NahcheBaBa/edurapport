# Voice input for quizzes and Edna

## User experience
- Add an accessible microphone control beside the Edna chat composer; recognized speech becomes editable text and is sent through the existing chat flow.
- Add a microphone answer control to both quiz pages. Match a clearly spoken option or answer text to the existing multiple-choice options, then let the learner confirm before submitting.
- Add an optional read-aloud control for Edna’s replies using browser speech synthesis. Keep typed chat, tapping quiz options, and existing read-aloud quiz controls available.
- Show clear microphone permission, unsupported-browser, listening, and recognition-error states; never silently submit a partial transcript.

## Technical approach
- Build a shared hook around the browser SpeechRecognition API, with feature detection and cleanup on stop/unmount; audio is not uploaded to Lovable Cloud.
- Reuse the hook in the lesson tutor and both quiz pages; keep chat transcript and quiz scoring behavior on their existing paths.
- Test answer matching and voice state logic, then verify microphone interactions and spoken-reply toggle in the preview.
