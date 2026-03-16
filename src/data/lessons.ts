export interface LyricAnnotation {
  /** Substring of the lyric line that triggers the annotation */
  matchText: string;
  /** The annotation body shown on click */
  body: string;
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
  videoUrl?: string;
  videoCaption?: string;
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
    annotation:
      'EduRapport Annotations\n\nIn music, a "rat pack" can be used as a reference to describe any group of disorderly young people. Rat pack is also a group of entertainers from the 1960s and 50s. Members: Frank Sinatra, Dean Martin, Sammy Davis Jr., Peter Lawford, and Joey Bishop.',
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
    annotation: "Tenses help us understand when an action takes place — past, present, or future.",
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
    annotation: "The cell theory states that all living things are made of cells, cells are the basic unit of life, and all cells come from pre-existing cells.",
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
    annotation: "Newton's three laws of motion form the foundation of classical mechanics and describe the relationship between forces and motion.",
    videoCaption: "Watch the video below to see Newton's Laws in action",
    comments: [],
  },
];

export function getLessonsForSubject(subject: string): Lesson[] {
  return lessonsData.filter((l) => l.subject.toLowerCase() === subject.toLowerCase());
}

export function getLessonById(id: string): Lesson | undefined {
  return lessonsData.find((l) => l.id === id);
}
