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
    <div className="layout-tb">
      <NavLink to="/" className="justify-self-end">
        <button>exit</button>
      </NavLink>
      <div className="flex h-full max-w-4/5 flex-col gap-10 justify-self-center">
        <div className="text-center">
          <h1>what type of analysis are you looking for?</h1>
          <p className="mt-4">select all that apply.</p>
        </div>
        <div className="flex h-full gap-10">
          <div
            className={clsx(
              "selection-card",
              selection.has("content") && "selected-card",
            )}
            onClick={() => toggleSelection("content")}
          >
            <h2>content</h2>
            <p className="max-w-3/5">
              how well your speech aligns with your planned outline or script,
              covering key points, structure, and clarity of message
            </p>
          </div>
          <div
            className={clsx(
              "selection-card",
              selection.has("delivery") && "selected-card",
            )}
            onClick={() => toggleSelection("delivery")}
          >
            <h2>delivery</h2>
            <p className="max-w-3/5">
              how you present your speech, including filler words, pacing, tone,
              body language, and overall presence
            </p>
          </div>
        </div>
      </div>
      <NavLink to={getNextRoute()} className="justify-self-end">
        <button disabled={selection.size === 0}>next</button>
      </NavLink>
    </div>
  );
}

export default Type;
