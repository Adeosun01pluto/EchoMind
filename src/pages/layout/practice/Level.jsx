import { Link } from "react-router-dom";

function Level() {
    const levels = ["100", "200", "300", "400", "500", "600", "700"];

  return (
    <div className="w-full ">
        <div className="w-[100%] gap-3 grid grid-cols-3">
        {levels.map((level) => (
          <Link
            key={level}
            to={`/practice/${level}`}
            className="p-3 rounded-md dark:bg-[#171517] bg-[#f2e4fb] h-36"
          >
            {level}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Level