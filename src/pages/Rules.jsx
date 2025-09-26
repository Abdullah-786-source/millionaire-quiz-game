import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Crown, Phone, Users, XCircle, Play } from "lucide-react"; 
import welcomeSound from "../assets/sounds/intro.mp3";

function Rules() {
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize and play music when Rules page loads
    audioRef.current = new Audio(welcomeSound);
    audioRef.current.loop = false;
    audioRef.current
      .play()
      .then(() => console.log("Intro music playing..."))
      .catch((err) => console.log("Autoplay blocked:", err));

    // Cleanup: stop music when leaving the page
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset playback
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <motion.div
        className="max-w-2xl w-full text-center space-y-8 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.h2
          className="text-4xl font-extrabold text-yellow-400 flex items-center justify-center gap-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Crown className="w-8 h-8 text-yellow-500" />
          Game Rules
        </motion.h2>

        {/* Rules List */}
        <motion.ul
          className="text-lg text-gray-200 space-y-4 text-left"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.li
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
          >
            <Crown className="w-6 h-6 text-yellow-400" />
            Answer 15 questions correctly to win the grand prize.
          </motion.li>
          <motion.li
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
          >
            <XCircle className="w-6 h-6 text-red-400" />
            Wrong answer ends the game, unless you reached a safe level.
          </motion.li>
          <motion.li
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
          >
            <Phone className="w-6 h-6 text-green-400" />
            <Users className="w-6 h-6 text-blue-400" />
            You have 3 lifelines: 50-50, Phone a Friend, Ask the Audience.
          </motion.li>
        </motion.ul>

        {/* CTA Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            to="/game"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-black font-bold rounded-2xl shadow-xl hover:bg-green-400 hover:scale-105 transition transform"
          >
            <Play className="w-5 h-5" />
            I’m Ready
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Rules;
