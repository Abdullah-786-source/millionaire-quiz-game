
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Welcome() {
  return (
    <div className="text-center space-y-6">
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Who Wants to Be a Millionaire?
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-300 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Step into the hot seat and test your knowledge.
      </motion.p>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Link
          to="/rules"
          className="px-8 py-4 bg-yellow-500 text-black text-xl font-bold rounded-2xl shadow-lg hover:bg-yellow-400 transition relative"
        >
          Start Game
        </Link>
      </motion.div>
    </div>
  );
}

export default Welcome;
