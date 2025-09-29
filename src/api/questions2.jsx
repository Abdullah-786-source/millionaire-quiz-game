let questionsPool = [];
let usedIndexes = [];

export async function fetchQuestion() {
  try {
    // Load all questions once if not already loaded
    if (questionsPool.length === 0) {
      const res = await fetch("/questions.json");
      if (!res.ok) throw new Error("Failed to fetch questions");

      questionsPool = await res.json();
      usedIndexes = [];
    }

    // If all questions are used, reset for a new game
    if (usedIndexes.length === questionsPool.length) {
      usedIndexes = [];
      // Optional: reshuffle for the new game
    }

    // Pick a random unused question
    let index;
    do {
      index = Math.floor(Math.random() * questionsPool.length);
    } while (usedIndexes.includes(index));

    usedIndexes.push(index);
    const randomQuestion = questionsPool[index];

    return {
      id: randomQuestion.id,
      question: randomQuestion.question_text,
      options: [
        randomQuestion.option_a,
        randomQuestion.option_b,
        randomQuestion.option_c,
        randomQuestion.option_d,
      ],
      correct:
        randomQuestion[
          `option_${randomQuestion.correct_option.toLowerCase()}`
        ],
      difficulty: randomQuestion.difficulty_level,
      category: randomQuestion.category,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
