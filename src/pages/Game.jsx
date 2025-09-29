// src/pages/Game.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Moneytree from "../components/MoneyTree";
import LifelinePanel from "../components/LifelinePanel";
import QuestionBox from "../components/QuestionBox";
import AudiencePoll from "../components/AudiencePoll";
import PhoneAFriend from "../components/PhoneAFriend";
import { fetchQuestion } from "../api/questions2";
import questionSound from "../assets/sounds/question_load.mp3";
import suspenseSound from "../assets/sounds/suspense.mp3";
import fiftyFiftySound from "../assets/sounds/fiftyFifty.mp3";
import answerSound from "../assets/sounds/answer.mp3";

const prizeLadder = [
  "$0",
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000",
  "$2,000",
  "$4,000",
  "$8,000",
  "$16,000",
  "$32,000",
  "$64,000",
  "$125,000",
  "$250,000",
  "$500,000",
  "$1 Million",
];

const milestones = [0, 5, 10, 15];

function getMilestonePrize(index) {
  const passed = milestones.filter((m) => m <= index);
  if (passed.length === 0) return "$0";
  const lastMilestoneIndex = passed[passed.length - 1];
  return prizeLadder[lastMilestoneIndex];
}

function Game() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    phone: false,
    audience: false,
  });
  const [audienceVotes, setAudienceVotes] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [options, setOptions] = useState([]);

  const navigate = useNavigate();

  const questionAudioRef = useRef(new Audio(questionSound));
  const suspenseAudioRef = useRef(new Audio(suspenseSound));
  const answerAudioRef = useRef(new Audio(answerSound));
  const fiftyAudioRef = useRef(new Audio(fiftyFiftySound));
  const suspenseTimeoutRef = useRef(null);

  const stopAllAudio = () => {
    [questionAudioRef, suspenseAudioRef, answerAudioRef, fiftyAudioRef].forEach(
      (ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      }
    );
    if (suspenseTimeoutRef.current) {
      clearTimeout(suspenseTimeoutRef.current);
      suspenseTimeoutRef.current = null;
    }
  };

  const loadQuestion = async () => {
    const data = await fetchQuestion();
    setQuestionData(data);
    setOptions(data.options);
    setSelected(null);
    setIsCorrect(null);
    setTimeLeft(30);

    stopAllAudio();

    questionAudioRef.current.play().catch((err) => console.log(err));

    suspenseTimeoutRef.current = setTimeout(() => {
      questionAudioRef.current.pause();
      questionAudioRef.current.currentTime = 0;

      suspenseAudioRef.current.loop = true;
      suspenseAudioRef.current.play().catch((err) => console.log(err));
    }, 2500);
  };

  useEffect(() => {
    loadQuestion();
    return () => stopAllAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showPhoneModal || audienceVotes) return;

    if (timeLeft <= 0) {
      const earnedPrize = getMilestonePrize(stepIndex);
      navigate("/result", { state: { earnedPrize } });
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate, stepIndex, showPhoneModal, audienceVotes]);

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);

    stopAllAudio();

    answerAudioRef.current.currentTime = 0;
    answerAudioRef.current.play().catch((err) => console.log("Audio play blocked", err));

    setTimeout(() => {
      if (opt === questionData.correct) {
        setIsCorrect(true);

        const nextIndex = Math.min(stepIndex + 1, prizeLadder.length - 1);

        setTimeout(() => {
          setStepIndex(nextIndex);

          if (nextIndex === prizeLadder.length - 1) {
            navigate("/result", {
              state: { earnedPrize: prizeLadder[nextIndex], status: "win" },
            });
          } else {
            loadQuestion();
          }
        }, 1500);
      } else {
        setIsCorrect(false);

        setTimeout(() => {
          const earnedPrize = getMilestonePrize(stepIndex);
          navigate("/result", { state: { earnedPrize, status: "lose" } });
        }, 1500);
      }
    }, 2000);
  };

  const handleFiftyFifty = () => {
    if (usedLifelines.fiftyFifty || !questionData) return;

    stopAllAudio();

    fiftyAudioRef.current.currentTime = 0;
    fiftyAudioRef.current.play();

    fiftyAudioRef.current.onended = () => {
      if (suspenseAudioRef.current) suspenseAudioRef.current.play();
    };

    const wrong = questionData.options.filter((opt) => opt !== questionData.correct);
    const removeTwo = wrong.sort(() => 0.5 - Math.random()).slice(0, 2);
    const newOptions = questionData.options.filter((opt) => !removeTwo.includes(opt));

    setOptions(newOptions);
    setUsedLifelines((prev) => ({ ...prev, fiftyFifty: true }));
  };

  const handlePhoneFriend = () => {
    if (usedLifelines.phone || !questionData) return;
    stopAllAudio();
    setShowPhoneModal(true);
    setUsedLifelines((prev) => ({ ...prev, phone: true }));
  };

  const handleAskAudience = () => {
    if (usedLifelines.audience || !questionData) return;
    stopAllAudio();

    const votes = {};
    questionData.options.forEach((opt) => {
      votes[opt] =
        opt === questionData.correct
          ? Math.floor(Math.random() * 40) + 60
          : Math.floor(Math.random() * 40);
    });

    setAudienceVotes(votes);
    setUsedLifelines((prev) => ({ ...prev, audience: true }));
  };

  if (!questionData) return <div>Loading...</div>;

  return (
    <div
      className="flex flex-col md:flex-row w-full h-screen text-white">
      {/* Sidebar (MoneyTree) — single instance, fills height on large screens */}
      <div className="w-full md:w-1/4 md:h-full p-2 md:p-4 flex-shrink-0">
        {/* the wrapper ensures the sidebar fills the parent height (parent is h-screen) */}
        <div className="h-full">
          <Moneytree stepIndex={stepIndex} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-blue-800 to-blue-600 rounded-t-2xl md:rounded-lg shadow-xl">
        <LifelinePanel
          onFiftyFifty={handleFiftyFifty}
          onPhoneFriend={handlePhoneFriend}
          onAskAudience={handleAskAudience}
          used={usedLifelines}
        />

        <div className="flex-1 flex items-center justify-center mt-4">
          <QuestionBox
            question={questionData.question}
            options={options}
            onAnswer={handleAnswer}
            selected={selected}
            isCorrect={isCorrect}
            correct={questionData.correct}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-lg sm:text-2xl font-bold text-red-500">
            Time Left: {timeLeft}s
          </div>
          <Link
            to="/result"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg hover:bg-red-500 transition transform hover:scale-105 ring-2 sm:ring-4 ring-red-400/50 text-sm sm:text-base"
            onClick={(e) => {
              e.preventDefault();
              const earnedPrize = prizeLadder[stepIndex];
              navigate("/result", { state: { earnedPrize, status: "quit" } });
            }}
          >
            Walk Away
          </Link>
        </div>

        {audienceVotes && (
          <AudiencePoll
            votes={audienceVotes}
            onClose={() => setAudienceVotes(null)}
            suspenseAudioRef={suspenseAudioRef}
          />
        )}

        {showPhoneModal && (
          <PhoneAFriend
            correctAnswer={questionData.correct}
            onClose={() => setShowPhoneModal(false)}
            suspenseAudioRef={suspenseAudioRef}
          />
        )}
      </div>
    </div>
  );
}

export default Game;
