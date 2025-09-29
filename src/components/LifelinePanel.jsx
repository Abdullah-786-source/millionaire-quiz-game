/* eslint-disable no-unused-vars */
// src/components/LifelinePanel.jsx
import { FaUserFriends, FaPhone, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

function LifelinePanel({ onFiftyFifty, onPhoneFriend, onAskAudience, used }) {
  const lifelines = [
    {
      name: "50-50",
      onClick: onFiftyFifty,
      used: used.fiftyFifty,
      icon: <FaUsers className="mr-1 sm:mr-2" />,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      name: "Phone a Friend",
      onClick: onPhoneFriend,
      used: used.phone,
      icon: <FaPhone className="mr-1 sm:mr-2" />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      name: "Ask the Audience",
      onClick: onAskAudience,
      used: used.audience,
      icon: <FaUserFriends className="mr-1 sm:mr-2" />,
      gradient: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mb-4 sm:mb-6">
      {lifelines.map((lifeline) => (
        <motion.button
          key={lifeline.name}
          onClick={lifeline.onClick}
          disabled={lifeline.used}
          initial={{ opacity: 0 }}
          animate={
            lifeline.used
              ? { opacity: 0.6 }
              : { opacity: [1, 0.3, 1] }
          }
          transition={
            lifeline.used
              ? { duration: 0.5 }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          whileTap={!lifeline.used ? { scale: 0.95 } : {}}
          className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-lg shadow-lg ${
            lifeline.used
              ? "bg-gray-700 cursor-not-allowed"
              : `bg-gradient-to-r ${lifeline.gradient}`
          }`}
        >
          {lifeline.icon} {lifeline.name}
        </motion.button>
      ))}
    </div>
  );
}

export default LifelinePanel;
