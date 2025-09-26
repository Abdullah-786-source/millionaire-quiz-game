import React from "react";

function QuestionBox({ question, options = [], onAnswer, selected, isCorrect, correct }) {
  if (!question) return <div className="text-yellow-400 text-center text-xl">Loading question...</div>;

  return (
    <div className="text-center">
      {/* Question */}
      <h2
        key={question} // ensures fade-in runs on every new question
        className="text-3xl font-bold text-yellow-400 mb-6 opacity-0 animate-fade-in"
        style={{ animationDelay: "0.5s" }} // suspense before showing the question
      >
        {question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {options.map((opt, i) => {
          let btnClass = "bg-gray-800 text-white hover:bg-yellow-400 hover:text-black";

          if (selected === opt) btnClass = "bg-yellow-500 text-black";

          if (isCorrect !== null && selected === opt) {
            btnClass =
              isCorrect && opt === correct
                ? "bg-green-500 text-black animate-flash"
                : "bg-red-600 text-white animate-shake";
          }

          if (isCorrect === false && opt === correct) {
            btnClass = "bg-green-500 text-black animate-flash";
          }

          return (
            <button
              key={`${question}-${i}`}
              onClick={() => onAnswer(opt)}
              disabled={!!selected}
              className={`py-4 rounded-2xl shadow-lg transform hover:scale-105 opacity-0 ${btnClass}`}
              style={{
                animation: `fade-in 0.8s ease-in-out forwards`,
                animationDelay: `${1.5 + i * 0.8}s`, // delay after question for drama
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionBox;
