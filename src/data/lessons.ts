export interface LyricAnnotation {
  /** Substring of the lyric line that triggers the annotation */
  matchText: string;
  /** The annotation body shown on click */
  body: string;
}

export interface DesignArtCard {
  image: string;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  subject: string;
  title: string;
  coverImage?: string;
  artist: string;
  producer: string;
  date: string;
  plays: number;
  lyrics: string;
  annotations: LyricAnnotation[];
  designArtCards?: DesignArtCard[];
  videoUrl?: string;
  videoCaption?: string;
  audioUrl?: string;
  comments: Comment[];

}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

export const lessonsData: Lesson[] = [
  {
    id: "parts-of-speech",
    subject: "English",
    title: "PARTS OF SPEECH",
    artist: "Ict Natche",
    producer: "Jimoh Soundz and Sopahojq",
    date: "23 April 2024",
    plays: 7400,
    lyrics: `Okay, let me break it down Let's begin,
Let's start with a noun, the realest thing,
Alright my dear, a Noun is the name of people
Place or a bright idea,
Whether concrete or abstract, you find them in words like Rat pack

It is about to go down, we are onto the Pronoun,
They replace nouns with ease,
Mr. Nah is He, Mrs. John is she, excuse me please,
more examples are that and them, those, and these,
in this part of speech, It is what it is.

We are now onto the third, you all know its a verb,
Action is the word, okay OBSERVE,
(blurp) Mr. Toti just blurped. Blurp is a verb
Another e.g is Slurp
Verbs just tell what a noun does, that's just how it goes

Now let's get to the Adjectives, there are a lot we can rap to this,
The flavour in the mix, They describe nouns, give language a fix,
Like Mr. Toti is good, he is just so dope but he's learning the rope,
be kind and i hope you can cope. The Adje' there are, kind good and dope

Okay, listen up let's dive real deep, deep in the scene, scene so serene
Adverb is the Scene, they describe verbs and how they seem,
Modify Adje' keeping it so clean,
They answer the How, the where, and when for the keen
e.g BOLDLY, LYRICALLY, opportunity no be wetin I go de look them pass, QUICKLY

prep. So we can be in tune with this preposition, true
they stick words together like Glue
which is what they do, they show the position of a noun
e.g I'm coming from town. From is the prep.
We are not about to back down.
Hey, you the class clown,
more e.g are at, on, in, with and about and I'm out

while I de function, let's get to conjunction,
supposing I fall in with my mic like yet and neither,
I'm just the teacher, but, yet and neither are perfect examples,

Examples Of conjunction and at this juncture, going from A to Z
they join clauses, and words in a spree
Like branches to tree, like wetin join KIS and Me,

Okay Before Abdullahi Interject, what is interjection?
Waiyo,`,
    annotations: [
      {
        matchText: "Whether concrete or abstract, you find them in words like Rat pack",
        body: 'In music, a "rat pack" can be used as a reference to describe any group of disorderly young people. Rat pack is also a group of entertainers from the 1960s and 50s. Members: Frank Sinatra, Dean Martin, Sammy Davis Jr., Peter Lawford, and Joey Bishop.',
      },
      {
        matchText: "Mr. Nah is He, Mrs. John is she, excuse me please",
        body: "Pronouns replace nouns so we don't repeat them. 'He' replaces a male noun, 'She' replaces a female noun. This line demonstrates how pronouns work in everyday speech.",
      },
      {
        matchText: "Action is the word, okay OBSERVE",
        body: "Notice how the rapper uses the verb 'OBSERVE' in all caps — it's a double entendre. He's telling you to watch him perform (observe) while simultaneously using a verb as a live example of what a verb is. The word itself becomes the lesson!",
      },
      {
        matchText: "Modify Adje' keeping it so clean",
        body: "Adverbs can modify adjectives — for example, 'very tall' where 'very' (adverb) modifies 'tall' (adjective). This is one of the key functions of adverbs beyond modifying verbs.",
      },
      {
        matchText: "more examples are that and them, those, and these",
        body: "'That', 'them', 'those', and 'these' are demonstrative pronouns. They point to specific things. 'This/these' refer to things nearby, while 'that/those' refer to things farther away.",
      },
      {
        matchText: "Verbs just tell what a noun does, that's just how it goes",
        body: "This is the simplest definition of a verb — it describes the action a noun performs. Every complete sentence needs at least one verb. Without verbs, language would have no movement or action!",
      },
      {
        matchText: "The flavour in the mix, They describe nouns, give language a fix",
        body: "Adjectives are like seasoning in food — they add detail and color to nouns. Without adjectives, language would be bland: 'the dog' vs 'the big, fluffy, golden dog.' They make descriptions vivid!",
      },
      {
        matchText: "e.g BOLDLY, LYRICALLY, opportunity no be wetin I go de look them pass, QUICKLY",
        body: "BOLDLY, LYRICALLY, and QUICKLY are all adverbs ending in '-ly', which is the most common adverb suffix. The Pidgin English line 'opportunity no be wetin I go de look them pass' means 'opportunity is not something I'll let pass by' — and QUICKLY modifies how fast he seizes it!",
      },
      {
        matchText: "they stick words together like Glue",
        body: "Prepositions connect nouns or pronouns to other words in a sentence, showing relationships of time, place, or direction. Think of them as the glue holding sentence parts together: 'the book ON the table', 'she arrived BEFORE noon'.",
      },
      {
        matchText: "they join clauses, and words in a spree",
        body: "Conjunctions are the connectors of language. There are three types: coordinating (and, but, or), subordinating (because, although, when), and correlative (either...or, neither...nor). They let us build complex thoughts from simple ones!",
      },
      {
        matchText: "Okay Before Abdullahi Interject, what is interjection?",
        body: "An interjection is a word or phrase that expresses sudden emotion — like 'Wow!', 'Ouch!', or the Yoruba 'Waiyo!' that follows. The rapper cleverly uses a student's name (Abdullahi) with the verb 'interject' to introduce the concept. Interjections often stand alone and are followed by exclamation marks!",
      },
    ],
    videoCaption: "Watch the video below to understand more about Parts of speech",
    comments: [
      {
        id: "1",
        author: "Dan",
        text: "Easily the most catchy and easy to relate and memorise song out there",
        timeAgo: "1 month ago",
      },
    ],
  },
  {
    id: "tenses",
    subject: "English",
    title: "TENSES",
    artist: "Ict Natche",
    producer: "Jimoh Soundz",
    date: "10 May 2024",
    plays: 3200,
    lyrics: `Let's talk about tenses, past present and future,
Time is the essence, language is the suture,
Present tense is now, what's happening today,
I walk, I talk, I learn, I play.

Past tense is done, already been through,
I walked, I talked, I learned, that's true,
Add -ed to the end or change the whole word,
Irregular verbs, haven't you heard?

Future tense coming, what's yet to be,
I will walk, I will talk, just wait and see,
Will and shall, gonna make it clear,
The future is bright, the future is here.`,
    annotations: [
      {
        matchText: "Time is the essence, language is the suture",
        body: "Tenses help us understand when an action takes place — past, present, or future. They are the 'suture' that stitches meaning to time.",
      },
    ],
    videoCaption: "Watch the video below to learn more about Tenses",
    comments: [],
  },
  {
    id: "cell-biology",
    subject: "Biology",
    title: "THE CELL",
    artist: "Ict Natche",
    producer: "Bio Beats",
    date: "15 June 2024",
    plays: 5100,
    lyrics: `The cell is the basic unit of life,
From the smallest bacteria to you and I,
Robert Hooke discovered them way back when,
Looking at cork under a microscope lens.

The cell membrane holds it all inside,
A protective barrier, a gatekeeper guide,
The nucleus is the brain, the control center,
DNA inside, the genetic inventor.

Mitochondria is the powerhouse, making ATP,
Energy for the cell, powering you and me,
Ribosomes make proteins, the endoplasmic reticulum too,
Golgi apparatus packages, sending them through.`,
    annotations: [
      {
        matchText: "The cell is the basic unit of life",
        body: "The cell theory states that all living things are made of cells, cells are the basic unit of life, and all cells come from pre-existing cells.",
      },
    ],
    videoCaption: "Watch the video below to explore cell structures",
    comments: [],
  },
  {
    id: "newtons-laws",
    subject: "Physics",
    title: "NEWTON'S LAWS OF MOTION",
    artist: "Ict Natche",
    producer: "Physics Flow",
    date: "5 July 2024",
    plays: 4300,
    lyrics: `Sir Isaac Newton had three laws to share,
About motion and forces, everywhere,

First law: an object stays at rest or moves straight,
Unless a force acts on it, that's its fate,
Inertia is the word, resistance to change,
A ball won't roll unless you push — not strange.

Second law: Force equals mass times acceleration,
F = ma, the famous equation,
More mass means more force you need to apply,
Push harder to move that boulder — now you know why.

Third law: every action has a reaction,
Equal and opposite in every interaction,
Push a wall, it pushes back on you,
Jump off a boat, the boat moves too.`,
    annotations: [
      {
        matchText: "First law: an object stays at rest or moves straight",
        body: "Newton's first law, also called the Law of Inertia, states that an object will remain at rest or in uniform motion unless acted upon by an external force.",
      },
    ],
    videoCaption: "Watch the video below to see Newton's Laws in action",
    comments: [],
  },
  {
    id: "algebra",
    subject: "Mathematics",
    title: "ALGEBRA",
    artist: "Ict Natche",
    producer: "Feshie",
    date: "24 April 2024",
    plays: 8700,
    lyrics: `Pay no mind to the language cos already,
The world speaks in riddles. In buying Gari for Eba,
You needed an "unknown amount" of mudu for 10 people,
Each can consume 2 wraps; we won't even go into the soup.
That too is a "sauce of mystery" like a Van Herring on Mystique.
The perfect measure remains a frustrating tape worm,
Like if 1 mudu is 150 naira, how much would 12 mudu cost?
That Question Mark seems hard to stomach, hook and crook.
But then came Algebra. It gifted us with letters like Ron does,
"X" was ready to stand in for that "unknown amount"
Reveal hidden values, using what's known to find the unknown,
But the easier question to stomach is how does learning
Algebra help solve my personal problems in real life?
It was this same question that made me to think Math,
But I eventually find the answers whenever I do the Math.
Do the Math. Add, subtract, multiply, and divide, you'll
See how those Ops like tools helped build our understanding.
3x + 3 = another, punching with "x" meaning pieces denoted as "x" again!
The challenge is to find the elusive "x." I began to try my Shaor luck.
A Calculative detective sifting through clues, balancing scales
Of knowledge, isolating the variable culprit! Is it really equal to?
To keep the balance I treat each sides equally, impartial as Judge Falana.
This just means I am old enough to know my left from my right.
Eureka! Now x becomes 2 in 3x +2 = 5, check that by just substituting
But Algebra's magic extended far beyond simple equations,
You may be presented with a situation in which Kasham's brother
Has twice as many A's as Kasham. Given that both together have T A's.
Na here we go ask how you go take know how many A's Kasyr get.
Algebra is like that playful lady Justice, she compares quantities.
She holds the scales to balance "greater than" or "less than."
Alphabets is just them as the ultimate gold standard.
She leads the input by the hand, transforming it into an elegant output.
Almighty formula became that giant superhero that packed a punch.
The world, once fractals of unknowns, began to crystallize.
We could calculate the perfect number of space to house so many tiles,
And even unlock the secrets of music, with its harmonious ratios hidden in plain sight.
This journey, however, isn't for the faint of heart but we can bear it.
Algebra, transformed the world from a place of unknowns to fractals of patterns.
Waiting to be unraveled, one equation, one variable, one beautiful solution at a time.`,
    annotations: [
      {
        matchText: "That too is a \"sauce of mystery\" like a Van Herring on Mystique",
        body: "A playful metaphor comparing algebraic unknowns to a \"sauce of mystery.\" The reference to Van Herring on Mystique plays on the idea of red herrings — misleading clues — and the X-Men character Mystique, who can take any form, just like the variable \"x\" can represent any value.",
      },
      {
        matchText: "\"X\" was ready to stand in for that \"unknown amount\"",
        body: "In algebra, letters like x, y, and z are used as variables to represent unknown values. This convention was popularized by René Descartes in the 17th century. The variable \"x\" is the most commonly used letter in algebra.",
      },
      {
        matchText: "See how those Ops like tools helped build our understanding",
        body: "\"Ops\" refers to mathematical operations: addition (+), subtraction (−), multiplication (×), and division (÷). These are the fundamental tools of algebra that allow us to manipulate equations and solve for unknowns.",
      },
      {
        matchText: "A Calculative detective sifting through clues, balancing scales",
        body: "Solving algebra is like detective work — you gather clues (known values), balance the equation (keep both sides equal), and isolate the variable to find the answer. The \"scales\" metaphor emphasizes that whatever you do to one side, you must do to the other.",
      },
      {
        matchText: "Eureka! Now x becomes 2 in 3x +2 = 5, check that by just substituting",
        body: "To solve 3x + 2 = 5: subtract 2 from both sides → 3x = 3, then divide by 3 → x = 1. You verify by substituting back: 3(1) + 2 = 5 ✓. Note: the lyric says x = 2, but the correct solution is x = 1. Always check your work!",
      },
      {
        matchText: "Algebra, transformed the world from a place of unknowns to fractals of patterns",
        body: "Fractals are infinitely repeating patterns found in nature and mathematics. Algebra provides the equations that generate these patterns. The Mandelbrot set, one of the most famous fractals, is generated by the simple equation z = z² + c.",
      },
    ],
    designArtCards: [
      {
        image: "/assets/fractal-art.jpg",
        title: "Fractals & Art",
        description: "Fractals, those infinitely detailed self-similar patterns, are a fascinating bridge between math and art. Algebra plays a starring role in their creation. Artists like Vincent Van Gogh & Jackson Pollock all used and applied Fractals...",
      },
      {
        image: "/assets/web-design-math.jpg",
        title: "Web Design",
        description: "Algebra plays a foundational role in responsive design techniques. While you won't be solving complex equations, the underlying principles of proportions, relationships between elements...",
      },
    ],
    videoCaption: "Watch the video below to understand more about Algebra",
    comments: [
      {
        id: "1",
        author: "Dan",
        text: "Easily the most relatable poem out there. I like how you use local examples.",
        timeAgo: "1 month ago",
      },
    ],
  },
];

export function getLessonsForSubject(subject: string): Lesson[] {
  return lessonsData.filter((l) => l.subject.toLowerCase() === subject.toLowerCase());
}

export function getLessonById(id: string): Lesson | undefined {
  return lessonsData.find((l) => l.id === id);
}
