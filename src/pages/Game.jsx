import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Moneytree from "../components/MoneyTree";
import LifelinePanel from "../components/LifelinePanel";
import QuestionBox from "../components/QuestionBox";
import AudiencePoll from "../components/AudiencePoll";
import PhoneAFriend from "../components/PhoneAFriend";
import { fetchQuestion } from "../api/questions2";
import logo from "../assets/images/logo.jpg";
import questionSound from "../assets/sounds/question_load.mp3";
import suspenseSound from "../assets/sounds/suspense.mp3"; // 👈 add suspense audio
import fiftyFiftySound from "../assets/sounds/fiftyFifty.mp3";
import answerSound from "../assets/sounds/answer.mp3"; // add your answer sound

const prizeLadder = [
  "$0",
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000", // Milestone 1
  "$2,000",
  "$4,000",
  "$8,000",
  "$16,000",
  "$32,000", // Milestone 2
  "$64,000",
  "$125,000",
  "$250,000",
  "$500,000",
  "$1 Million", // Final Milestone
];

// Milestone indexes (keep same as MoneyTree component)
const milestones = [0, 5, 10, 15];

function getMilestonePrize(index) {
  // find the highest milestone index that is <= current step index
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
  const [stepIndex, setStepIndex] = useState(0); // current prize index
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

const suspenseTimeoutRef = useRef(null); // store timeout to clear it

 const stopAllAudio = () => {
  [questionAudioRef, suspenseAudioRef, answerAudioRef, fiftyAudioRef].forEach(ref => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  });
  if (suspenseTimeoutRef.current) {
    clearTimeout(suspenseTimeoutRef.current);
    suspenseTimeoutRef.current = null;
  }
};

  // when loading a question, also set options
 const loadQuestion = async () => {
  const data = await fetchQuestion();
  setQuestionData(data);
  setOptions(data.options);
  setSelected(null);
  setIsCorrect(null);
  setTimeLeft(30);

  stopAllAudio(); // stop previous sounds

  questionAudioRef.current.play().catch(err => console.log(err));

  // After 2.5s, play suspense audio in loop
  suspenseTimeoutRef.current = setTimeout(() => {
    questionAudioRef.current.pause();
    questionAudioRef.current.currentTime = 0;

    suspenseAudioRef.current.loop = true;
    suspenseAudioRef.current.play().catch(err => console.log(err));
  }, 2500);
};

useEffect(() => {
  loadQuestion();

  return () => stopAllAudio(); // stop everything when leaving page
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  // Timer logic: on timeout treat as a loss and give last milestone prize
  useEffect(() => {
    // If Phone a Friend modal is open, pause the timer
    if (showPhoneModal || audienceVotes) return;

    if (timeLeft <= 0) {
      const earnedPrize = getMilestonePrize(stepIndex);
      navigate("/result", { state: { earnedPrize } });
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate, stepIndex, showPhoneModal, audienceVotes]);

  // Handle answer click
  const handleAnswer = (opt) => {
    if (selected) return; // prevent double clicking
    setSelected(opt);

    stopAllAudio(); // stop suspense/question audio

    // Play answer audio
    answerAudioRef.current.currentTime = 0;
    answerAudioRef.current
      .play()
      .catch((err) => console.log("Audio play blocked", err));

    // short delay to show selection before revealing correct/incorrect
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
        }, 15000);
      } else {
        setIsCorrect(false);

        setTimeout(() => {
          const earnedPrize = getMilestonePrize(stepIndex);
          navigate("/result", { state: { earnedPrize, status: "lose" } });
        }, 1500);
      }
    }, 2000);
  };

  // 50-50 lifeline: remove 2 wrong options
  const handleFiftyFifty = () => {
    if (usedLifelines.fiftyFifty || !questionData) return;

    // Pause suspense
    if (suspenseAudioRef.current) suspenseAudioRef.current.pause();

    stopAllAudio();

    // Play fifty-fifty audio
    fiftyAudioRef.current.currentTime = 0;
    fiftyAudioRef.current.play();

    // Resume suspense when fifty-fifty finishes
    fiftyAudioRef.current.onended = () => {
      if (suspenseAudioRef.current) suspenseAudioRef.current.play();
    };

    // Remove 2 wrong options
    const wrong = questionData.options.filter(
      (opt) => opt !== questionData.correct
    );
    const removeTwo = wrong.sort(() => 0.5 - Math.random()).slice(0, 2);
    const newOptions = questionData.options.filter(
      (opt) => !removeTwo.includes(opt)
    );

    setOptions(newOptions);
    setUsedLifelines((prev) => ({ ...prev, fiftyFifty: true }));
  };

  //Phone a Friend lifeline: suggest the correct option

  const handlePhoneFriend = () => {
    if (usedLifelines.phone || !questionData) return;
    stopAllAudio();
    setShowPhoneModal(true);
    setUsedLifelines((prev) => ({ ...prev, phone: true }));
  };

  // Ask the Audience lifeline: show percentages
  const handleAskAudience = () => {
    if (usedLifelines.audience || !questionData) return;
    stopAllAudio();

    const votes = {};
    questionData.options.forEach((opt) => {
      votes[opt] =
        opt === questionData.correct
          ? Math.floor(Math.random() * 40) + 60 // 60–100%
          : Math.floor(Math.random() * 40); // 0–40%
    });

    // instead of alert, store in state
    setAudienceVotes(votes);

    setUsedLifelines((prev) => ({ ...prev, audience: true }));
  };

  if (!questionData) return <div>Loading...</div>;

  return (
    <div
      className="flex w-full h-screen text-white"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "300px",
        backgroundColor: "#1e3a8a", // Tailwind blue-900 base
        backgroundBlendMode: "overlay",
        opacity: 0.95,
      }}
    >
      <Moneytree stepIndex={stepIndex} />
      <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-blue-800 to-blue-600 rounded-lg shadow-xl">
        <LifelinePanel
          onFiftyFifty={handleFiftyFifty}
          onPhoneFriend={handlePhoneFriend}
          onAskAudience={handleAskAudience}
          used={usedLifelines}
        />
        <QuestionBox
          question={questionData.question}
          options={options}
          onAnswer={handleAnswer}
          selected={selected}
          isCorrect={isCorrect}
          correct={questionData.correct}
        />
        <div className="flex justify-between items-center mt-8">
          <div className="text-2xl font-bold text-red-500">
            Time Left: {timeLeft}s
          </div>
          <Link
            to="/result"
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:bg-red-500 transition transform hover:scale-105 ring-4 ring-red-400/50"
            onClick={(e) => {
              // override direct link: pass earned prize based on current stepIndex
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
            suspenseAudioRef={suspenseAudioRef} // 👈 pass down
          />
        )}

        {showPhoneModal && (
          <PhoneAFriend
            correctAnswer={questionData.correct}
            onClose={() => setShowPhoneModal(false)}
            suspenseAudioRef={suspenseAudioRef} // 👈 pass down the ref
          />
        )}
      </div>
    </div>
  );
}

export default Game;
