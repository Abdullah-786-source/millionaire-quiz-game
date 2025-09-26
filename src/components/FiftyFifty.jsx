import { useEffect, useRef } from "react";
import fiftyFiftySound from "../assets/sounds/fiftyFifty.mp3";

function FiftyFifty({ questionData, setOptions, usedLifelines, setUsedLifelines }) {
  const fiftyAudioRef = useRef(null);

  // Initialize audio once
  useEffect(() => {
    fiftyAudioRef.current = new Audio(fiftyFiftySound);
  }, []);

  // Stop audio if component unmounts
  useEffect(() => {
    return () => {
      if (fiftyAudioRef.current) {
        fiftyAudioRef.current.pause();
        fiftyAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleActivate = () => {
    if (usedLifelines.fiftyFifty || !questionData) return;

    // Stop other audio
    if (window.stopAllAudio) window.stopAllAudio(); // assuming stopAllAudio is global or passed via props

    // Play Fifty-Fifty sound
    if (fiftyAudioRef.current) fiftyAudioRef.current.play();

    // Lifeline logic: remove 2 wrong options
    const wrong = questionData.options.filter(opt => opt !== questionData.correct);
    const removeTwo = wrong.sort(() => 0.5 - Math.random()).slice(0, 2);
    const newOptions = questionData.options.filter(opt => !removeTwo.includes(opt));
    setOptions(newOptions);

    // Mark lifeline as used
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
  };

  return (
    <button
      onClick={handleActivate}
      disabled={usedLifelines.fiftyFifty}
      className="lifeline-btn"
    >
      50:50
    </button>
  );
}

export default FiftyFifty;
