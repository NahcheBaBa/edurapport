import { QuizQuestion } from "./quizQuestions";

export const partsOfSpeechQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Which part of speech is used to name a specific group of people like the Ratpack?",
    options: ["Verb", "Adjective", "Pronoun", "Proper Noun"],
    correctIndex: 3,
    explanation:
      "Proper nouns name specific people, places, or groups — like 'Rat Pack' in the song.",
  },
  {
    id: 2,
    question: 'In the line "Mr. Nah is He," what part of speech is "He"?',
    options: ["Adverb", "Conjunction", "Pronoun", "Interjection"],
    correctIndex: 2,
    explanation: "Pronouns like 'He' replace nouns to avoid repetition.",
  },
  {
    id: 3,
    question:
      'The song uses the word "blurp" as an example of what part of speech?',
    options: ["Verb", "Conjunction", "Pronoun", "Interjection"],
    correctIndex: 0,
    explanation: "'Blurp' is an action word — verbs describe actions.",
  },
  {
    id: 4,
    question: "What is the main function of adjectives according to the song?",
    options: ["Replace nouns", "Describe nouns", "Describe verbs", "Show position"],
    correctIndex: 1,
    explanation: "Adjectives add flavor by describing nouns.",
  },
  {
    id: 5,
    question:
      "Which of these words is MOST LIKELY an adverb based on the clues in the song?",
    options: ["Quickly", "Knowledge", "Hopeful", "Teacher"],
    correctIndex: 0,
    explanation:
      "Adverbs often end in -ly and answer how, where, or when — 'Quickly' answers how.",
  },
  {
    id: 6,
    question: 'In the line "I\'m coming from town," what part of speech is "from"?',
    options: ["Adjectives", "Preposition", "Pronoun", "Interjection"],
    correctIndex: 1,
    explanation:
      "Prepositions show the relationship of a noun to something else — here, direction.",
  },
  {
    id: 7,
    question:
      'The song uses the phrase "yet and neither" as examples of what part of speech?',
    options: ["Interjection", "Conjunction", "Pronoun", "Adverb"],
    correctIndex: 1,
    explanation: "Conjunctions like 'yet' and 'neither' join words or clauses.",
  },
  {
    id: 8,
    question: "Which of these sentences uses a conjunction to join two clauses?",
    options: [
      "The teacher rapped, the class listened.",
      "Boldly I answered but there was no response.",
      "Knowledge is power.",
      "Waiyo! That answer was wrong.",
    ],
    correctIndex: 1,
    explanation: "'But' is a conjunction joining two clauses.",
  },
  {
    id: 9,
    question: 'The song uses "Waiyo!" as an example of what part of speech?',
    options: ["Conjunction", "Pronoun", "Adverb", "Interjection"],
    correctIndex: 3,
    explanation: "Interjections express sudden emotion or surprise — like 'Waiyo!'.",
  },
  {
    id: 10,
    question: 'The phrase "it\'s a vibe" used at the end is most likely:',
    options: ["A simile", "A metaphor", "A slang", "A hyperbole"],
    correctIndex: 2,
    explanation: "'It's a vibe' is a common slang expression.",
  },
];
