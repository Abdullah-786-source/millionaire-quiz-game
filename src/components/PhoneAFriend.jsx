/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import phoneMusic from "../assets/sounds/phoneAfriend.mp3";

function PhoneAFriend({ correctAnswer, onClose, suspenseAudioRef }) {
  const [message, setMessage] = useState("Dialing your friend...");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isThinking, setIsThinking] = useState(false);

  const phoneAudioRef = useRef(null);

  useEffect(() => {
    // Pause suspense audio from parent
    if (suspenseAudioRef?.current) {
      suspenseAudioRef.current.pause();
    }

    // Play phone-a-friend audio
    phoneAudioRef.current = new Audio(phoneMusic);
    phoneAudioRef.current.play().catch((err) => console.log(err));

    const callTimer = setTimeout(() => {
      setMessage("Your friend is now thinking...");
      setIsThinking(true);
    }, 12000);

    return () => {
      clearTimeout(callTimer);

      // Stop phone audio
      if (phoneAudioRef.current) {
        phoneAudioRef.current.pause();
        phoneAudioRef.current.currentTime = 0;
      }

      // Resume suspense audio
      if (suspenseAudioRef?.current) {
        suspenseAudioRef.current.play().catch((err) =>
          console.log("Autoplay blocked when resuming suspense", err)
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isThinking) return;

    if (timeLeft <= 0) {
      setMessage(`Your friend thinks the answer is: ${correctAnswer}`);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isThinking, timeLeft, correctAnswer]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(30,58,138,0.8)]"
    >
      <div className="bg-white text-black p-6 rounded-3xl shadow-2xl w-[400px] text-center relative">
        <h2 className="text-2xl font-extrabold mb-4">Phone a Friend</h2>
        <p className="text-lg font-semibold">{message}</p>
        {isThinking && (
          <div className="mt-2 text-red-500 font-bold text-xl animate-pulse">
            Time left: {timeLeft}s
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PhoneAFriend;
