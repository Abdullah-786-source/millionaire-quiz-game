/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import audiencePollMusic from "../assets/sounds/audiencePoll.mp3";

function AudiencePoll({ votes, onClose, suspenseAudioRef }) {
  const [message, setMessage] = useState("Audience is preparing to vote...");
  const [countdown, setCountdown] = useState(15); // extended to 30 sec
  const [showResults, setShowResults] = useState(false);
  const barRefs = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!votes || Object.keys(votes).length === 0) return;

    // Pause parent suspense audio
    if (suspenseAudioRef?.current && !suspenseAudioRef.current.paused) {
      suspenseAudioRef.current.pause();
    }

    // Play Audience Poll audio
    audioRef.current = new Audio(audiencePollMusic);
    audioRef.current.loop = false;
    audioRef.current.play().catch(err => console.warn("Audio blocked:", err));

    // Dramatic messages during countdown
    const messages = [
      "Audience is preparing to vote...",
      "Some audience members are unsure...",
      "Some are confused between A & C",
      "Some are confused between B & D",
      "They are making their final decision...",
      "Almost ready to reveal the results..."
    ];

    let messageIndex = 0;

    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setMessage("Audience has voted!");
          setShowResults(true);

          // Animate bars after 1 sec
          setTimeout(() => {
            Object.keys(votes).forEach((opt, index) => {
              const bar = barRefs.current[index];
              if (bar) bar.style.width = `${votes[opt]}%`;
            });
          }, 1000);

          return 0;
        }

        // Change message every 6 seconds
        if (prev % 6 === 0 && messageIndex < messages.length - 1) {
          messageIndex += 1;
          setMessage(messages[messageIndex]);
        }

        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(countdownTimer);
      if (audioRef.current) audioRef.current.pause();
      if (suspenseAudioRef?.current) suspenseAudioRef.current.play().catch(err => console.warn("Audio blocked:", err));
    };
  }, [votes, suspenseAudioRef]);

  if (!votes || Object.keys(votes).length === 0) return null;

  const optionKeys = Object.keys(votes);

  const handleClose = () => {
    if (audioRef.current) audioRef.current.pause();
    if (suspenseAudioRef?.current) suspenseAudioRef.current.play();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(30,58,138,0.8)]">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[420px] max-w-[90vw] text-center transform transition-all duration-500 scale-100 opacity-100">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Ask the Audience</h2>

        {!showResults ? (
          <div className="text-lg font-semibold text-blue-800 animate-pulse">
            {message} {countdown > 0 && `(${countdown}s left)`}
          </div>
        ) : (
          <div className="space-y-4">
            {optionKeys.map((opt, index) => {
              const percentage = Math.max(0, Math.min(100, votes[opt] || 0));
              const optionLetter = String.fromCharCode(65 + index);

              return (
                <div key={opt} className="mb-3">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 w-6 text-center bg-gray-100 rounded">
                        {optionLetter}
                      </span>
                      <span className="text-gray-700 font-medium">{opt}</span>
                    </div>
                    <span className="font-bold text-blue-700 text-lg">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
                    <div
                      ref={(el) => (barRefs.current[index] = el)}
                      data-percentage={percentage}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-1000 ease-out shadow-md"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleClose}
          className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AudiencePoll;
