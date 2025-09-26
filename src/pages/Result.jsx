import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { FaTrophy, FaSkullCrossbones, FaDoorOpen, FaClock } from "react-icons/fa";

// Import your sounds
import winSound from "../assets/sounds/win.mp3";
import loseSound from "../assets/sounds/lose.mp3";
import quitSound from "../assets/sounds/quit.mp3";
import timeoutSound from "../assets/sounds/timeUp.mp3";

function Result() {
  const location = useLocation();
  const earnedPrize = location.state?.earnedPrize ?? "$0";
  const status = location.state?.status ?? "lose"; // default is lose
  const audioRef = useRef(null);

  // Spicy messages with icons
  const MESSAGES = {
    win: [
      { icon: <FaTrophy />, text: "Brilliant. You crushed it — claim your glory." },
      { icon: <FaTrophy />, text: "Perfect execution. The scoreboard just bowed to you." },
      { icon: <FaTrophy />, text: "That was surgical. Rewards incoming." },
    ],
    lose: [
      { icon: <FaSkullCrossbones />, text: "Ouch. That one slipped through. Plot your comeback." },
      { icon: <FaSkullCrossbones />, text: "Close, but the universe had other plans. Try again." },
      { icon: <FaSkullCrossbones />, text: "A loss for now, not forever. Learn, adapt, return." },
    ],
    quit: [
      { icon: <FaDoorOpen />, text: "You left at your own terms. Respect the exit." },
      { icon: <FaDoorOpen />, text: "Walked away with dignity. There is art in quitting well." },
      { icon: <FaDoorOpen />, text: "Paused, not defeated. Resume when ready." },
    ],
    timeout: [
      { icon: <FaClock />, text: "Time's up. The clock wins this round." },
      { icon: <FaClock />, text: "The seconds betrayed you. Try again with a swifter hand." },
      { icon: <FaClock />, text: "Tick tock went the opportunity. Come back faster." },
    ],
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const message = pickRandom(MESSAGES[status] || MESSAGES.lose);

  // Title for top heading
  let title = "Game Over!";
  if (status === "win") {
    title = "Congratulations! You Won the Jackpot!";
  } else if (status === "quit") {
    title = "You Ended the Game!";
  } else if (status === "timeout") {
    title = "Time’s Up!";
  }

  // Play audio depending on status
  useEffect(() => {
    let audioFile;
    if (status === "win") audioFile = winSound;
    else if (status === "quit") audioFile = quitSound;
    else if (status === "timeout") audioFile = timeoutSound;
    else audioFile = loseSound;

    audioRef.current = new Audio(audioFile);
    audioRef.current.play().catch((err) => console.log("Audio blocked:", err));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [status]);

  return (
    <div className="text-center space-y-6">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-yellow-400">{title}</h2>

      {/* Spicy Message */}
      <div className="flex items-center justify-center gap-3 text-xl text-gray-200">
        <span className="text-2xl">{message.icon}</span>
        <span>{message.text}</span>
      </div>

      {/* Prize Info */}
      <p className="text-xl text-gray-300">
        {status === "quit" ? "You walked away with: " : "You won: "} {earnedPrize} 🎉
      </p>

      {/* Play Again */}
      <Link
        to="/"
        className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-2xl shadow-lg hover:bg-yellow-400 transition"
      >
        Play Again
      </Link>
    </div>
  );
}

export default Result;
