export async function fetchQuestion() {
  try {
    // Fetch from the public folder
    const res = await fetch("/questions.json"); 
    if (!res.ok) throw new Error("Failed to fetch questions");

    const data = await res.json();

    // Select a random question from the array
    const randomQuestion = data[Math.floor(Math.random() * data.length)];

    return {
      id: randomQuestion.id,
      question: randomQuestion.question_text,
      options: [
        randomQuestion.option_a,
        randomQuestion.option_b,
        randomQuestion.option_c,
        randomQuestion.option_d,
      ],
      correct: randomQuestion[`option_${randomQuestion.correct_option.toLowerCase()}`],
      difficulty: randomQuestion.difficulty_level,
      category: randomQuestion.category,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}