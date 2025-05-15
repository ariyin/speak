import { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

function Type() {
  const [selection, setSelection] = useState<Set<string>>(new Set());

  const toggleSelection = (type: string) => {
    setSelection((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  // determine the next route based on the selection
  const getNextRoute = () => {
    if (selection.has("delivery")) return "/video";
    if (selection.has("content")) return "/content";
    return "#"; // fallback if nothing selected
  };

  return (
    <div className="flex h-screen flex-col justify-between gap-10 p-20">
      <h1>What type of analysis are you looking for?</h1>
      <div className="flex flex-1 gap-4">
        {/* TODO: improve selection ui */}
        <div
          className={clsx(
            "selection-card",
            selection.has("content") && "border-blue-500",
          )}
          onClick={() => toggleSelection("content")}
        >
          <h2>Content</h2>
          {/* TODO: insert description text and/or image */}
        </div>
        <div
          className={clsx(
            "selection-card",
            selection.has("delivery") && "border-blue-500",
          )}
          onClick={() => toggleSelection("delivery")}
        >
          <h2>Delivery</h2>
          {/* TODO: insert description text and/or image */}
        </div>
      </div>
      <NavLink to={getNextRoute()}>
        <button disabled={selection.size === 0}>next</button>
      </NavLink>
    </div>
  );
}

export default Type;
