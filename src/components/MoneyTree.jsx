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
  "$1 Million"  // Final Milestone
];

// Milestone indexes
const milestones = [0, 5, 10, 15];

function Moneytree({ stepIndex }) {
  return (
    <div className="w-1/4 bg-gradient-to-b from-blue-900 to-blue-950 text-yellow-400 p-4 rounded-lg shadow-lg border-2 border-yellow-500">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-yellow-300 drop-shadow-lg">
        Prize Ladder
      </h2>
      <ul className="flex flex-col-reverse space-y-3 space-y-reverse text-right">
        {prizeLadder.map((prize, i) => {
          const isActive = i === stepIndex;
          const isMilestone = milestones.includes(i);

          return (
            <li
              key={i}
              className={`px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-yellow-400 text-black font-extrabold shadow-[0_0_20px_rgba(255,255,0,0.8)] scale-105" : ""}
                ${isMilestone && !isActive ? "border border-yellow-400 font-bold text-yellow-300" : ""}
                ${!isActive && !isMilestone ? "hover:bg-blue-800" : ""}
              `}
            >
              {prize}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Moneytree;
