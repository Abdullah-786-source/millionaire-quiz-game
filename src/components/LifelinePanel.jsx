import { FaUserFriends, FaPhone, FaUsers } from "react-icons/fa";

function LifelinePanel({ onFiftyFifty, onPhoneFriend, onAskAudience, used }) {
  const lifelines = [
    {
      name: "50-50",
      onClick: onFiftyFifty,
      used: used.fiftyFifty,
      icon: <FaUsers className="mr-2" />,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      name: "Phone a Friend",
      onClick: onPhoneFriend,
      used: used.phone,
      icon: <FaPhone className="mr-2" />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      name: "Ask the Audience",
      onClick: onAskAudience,
      used: used.audience,
      icon: <FaUserFriends className="mr-2" />,
      gradient: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="flex justify-center space-x-6 mb-6">
      {lifelines.map((lifeline) => (
        <button
          key={lifeline.name}
          onClick={lifeline.onClick}
          disabled={lifeline.used}
          className={`flex items-center px-6 py-3 rounded-2xl text-white font-bold text-lg shadow-lg transform transition-all duration-300 ${
            lifeline.used
              ? "bg-gray-700 cursor-not-allowed opacity-60"
              : `bg-gradient-to-r ${lifeline.gradient} hover:scale-105 hover:shadow-2xl animate-pulse`
          }`}
        >
          {lifeline.icon} {lifeline.name}
        </button>
      ))}
    </div>
  );
}

export default LifelinePanel;
