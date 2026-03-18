export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const algebraQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "If 1 mudu of Gari feeds 1 person 2 wraps, and we need enough for 10 people who (like the poem says) won't even touch the soup, how many total wraps do we need?",
    options: ["10 wraps", "20 wraps", "30 wraps", "15 wraps"],
    correctIndex: 1,
    explanation: "10 people × 2 wraps = 20 wraps.",
  },
  {
    id: 2,
    question:
      "Following the poem's scenario, if 1 mudu costs 150 Naira and we need enough Gari for 20 wraps (answer to question 1), what's the total cost?",
    options: ["1500 Naira", "2250 Naira", "3000", "2000"],
    correctIndex: 0,
    explanation:
      "20 wraps / 2 wraps per mudu = 10 mudu × 150 Naira/mudu = 1500 Naira.",
  },
  {
    id: 3,
    question:
      "The poem mentions the equation 3x + 2 = 11. What value of x makes the equation true?",
    options: ["6", "5", "8", "3"],
    correctIndex: 3,
    explanation:
      "Solve for x by subtracting 2 from both sides then dividing by 3: 3x = 9 → x = 3.",
  },
  {
    id: 4,
    question:
      "If Kasham's brother has twice as many A's as Kasham, and together they have 12 A's, how many A's does Kasham have?",
    options: ["8", "5", "4", "3"],
    correctIndex: 2,
    explanation:
      "Let K be Kasham's A's. Brother has 2K. Together: K + 2K = 12 → 3K = 12 → K = 4.",
  },
  {
    id: 5,
    question:
      'The poem mentions needing an "unknown amount" of mudu (represented by x). If we know 1 mudu = 20 wraps, write an equation to find the number of wraps for 3 mudus.',
    options: [
      "20 mudus x 3 = X wraps",
      "20 mudus x 2 wraps = x",
      "x + 20 mudus = 3 wraps",
      "x = 20 wraps × 3 mudus",
    ],
    correctIndex: 3,
    explanation:
      "We know 20 wraps = 1 mudu. We want total wraps for 3 mudus. Thus, x wraps = 3 mudus × 20 wraps.",
  },
  {
    id: 6,
    question:
      "Imagine the soup recipe requires 3 wraps of Gari per serving. If we have the equation wraps = 20x, how many servings of soup do we need for 5 mudus of Gari?",
    options: [
      "About 33 servings",
      "About 50 servings",
      "About 25 servings",
      "About 100 servings",
    ],
    correctIndex: 0,
    explanation:
      "5 mudus × 20 wraps/mudu = 100 wraps. 100 wraps / 3 wraps per serving ≈ 33 servings.",
  },
  {
    id: 7,
    question: "Solve for y: 5y − 7 = 18",
    options: ["y = 3", "y = 5", "y = 25", "y = 4"],
    correctIndex: 1,
    explanation: "5y = 18 + 7 = 25 → y = 25 / 5 = 5.",
  },
  {
    id: 8,
    question: "What is the value of x if 2(x + 4) = 16?",
    options: ["x = 4", "x = 6", "x = 8", "x = 2"],
    correctIndex: 0,
    explanation: "2x + 8 = 16 → 2x = 8 → x = 4.",
  },
  {
    id: 9,
    question:
      "A market woman sells oranges at x Naira each. If she sells 8 oranges for 400 Naira, what is x?",
    options: ["40", "50", "60", "45"],
    correctIndex: 1,
    explanation: "8x = 400 → x = 400 / 8 = 50.",
  },
  {
    id: 10,
    question: "Simplify: 4a + 3b − 2a + 5b",
    options: ["6a + 8b", "2a + 8b", "2a + 2b", "6a + 2b"],
    correctIndex: 1,
    explanation: "Combine like terms: (4a − 2a) + (3b + 5b) = 2a + 8b.",
  },
  {
    id: 11,
    question: "If x² = 49, what are the possible values of x?",
    options: ["7 only", "−7 only", "7 and −7", "49"],
    correctIndex: 2,
    explanation: "x² = 49 means x = √49 = ±7.",
  },
  {
    id: 12,
    question: "What is the product of (x + 3)(x − 3)?",
    options: ["x² − 9", "x² + 9", "x² − 6", "x² + 6x + 9"],
    correctIndex: 0,
    explanation: "Difference of squares: (x + 3)(x − 3) = x² − 9.",
  },
  {
    id: 13,
    question: "Solve: x/4 + 5 = 8",
    options: ["x = 12", "x = 3", "x = 20", "x = 32"],
    correctIndex: 0,
    explanation: "x/4 = 8 − 5 = 3 → x = 3 × 4 = 12.",
  },
  {
    id: 14,
    question:
      "Adamu has 3 times as many books as Bola. Together they have 24 books. How many does Bola have?",
    options: ["8", "6", "12", "18"],
    correctIndex: 1,
    explanation: "Let Bola = b. Adamu = 3b. b + 3b = 24 → 4b = 24 → b = 6.",
  },
  {
    id: 15,
    question: "What is the value of 3² + 4²?",
    options: ["25", "14", "49", "7"],
    correctIndex: 0,
    explanation: "3² + 4² = 9 + 16 = 25.",
  },
  {
    id: 16,
    question: "Factorise: x² + 5x + 6",
    options: [
      "(x + 2)(x + 3)",
      "(x + 1)(x + 6)",
      "(x − 2)(x − 3)",
      "(x + 5)(x + 1)",
    ],
    correctIndex: 0,
    explanation:
      "Find two numbers that multiply to 6 and add to 5: 2 and 3. So (x + 2)(x + 3).",
  },
  {
    id: 17,
    question:
      "A rectangle has length (2x + 1) and width 3. Its area is 21. Find x.",
    options: ["x = 3", "x = 4", "x = 7", "x = 10"],
    correctIndex: 0,
    explanation:
      "Area = length × width → 3(2x + 1) = 21 → 6x + 3 = 21 → 6x = 18 → x = 3.",
  },
  {
    id: 18,
    question: "If 2ⁿ = 32, what is n?",
    options: ["4", "5", "6", "3"],
    correctIndex: 1,
    explanation: "2⁵ = 32, so n = 5.",
  },
  {
    id: 19,
    question: "Solve the inequality: 3x − 1 > 8",
    options: ["x > 3", "x > 2", "x > 9", "x > 7"],
    correctIndex: 0,
    explanation: "3x > 8 + 1 = 9 → x > 3.",
  },
  {
    id: 20,
    question: "What is the gradient (slope) of the line y = 2x + 5?",
    options: ["5", "2", "7", "2x"],
    correctIndex: 1,
    explanation:
      "In y = mx + c form, the gradient m is the coefficient of x, which is 2.",
  },
];
