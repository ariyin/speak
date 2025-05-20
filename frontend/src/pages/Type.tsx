import { useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import clsx from "clsx";
import { getCurrentRehearsal } from "../utils/auth";
import axios from "axios";

function Type() {
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { rehearsalId } = useParams();

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
    if (selection.has("content")) return `/rehearsal/${rehearsalId}/content`;
    if (selection.has("delivery")) return `/rehearsal/${rehearsalId}/video`;
    return "#"; // fallback if nothing selected
  };

  const handleNext = async () => {
    const rehearsalId = getCurrentRehearsal();

    const response = await axios.patch(
      `http://localhost:8000/rehearsal/type/${rehearsalId}`,
      {
        analysis: Array.from(selection),
      },
    );

    if (response.status === 200) {
      navigate(getNextRoute());
    } else {
      console.error("Failed to update rehearsal");
    }
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
              selection.has("content") && "selected-button",
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
              selection.has("delivery") && "selected-button",
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
      <button
        className="justify-self-end"
        disabled={selection.size === 0}
        onClick={handleNext}
      >
        next
      </button>
    </div>
  );
}

export default Type;
