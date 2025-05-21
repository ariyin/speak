import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ExitButton from "../components/ExitButton";

function Content() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"speech" | "outline" | null>(
    null,
  );
  const navigate = useNavigate();
  const { rehearsalId } = useParams();

  const handleNext = async () => {
    if (!content || !contentType) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/rehearsal/content/${rehearsalId}`,
        {
          content: {
            type: contentType,
            text: content,
          },
        },
      );

      if (response.status === 200) {
        navigate(`/rehearsal/${rehearsalId}/video`);
      }
    } catch (error) {
      console.error("Failed to update content:", error);
    }
  };

  return (
    <div className="layout-tb">
      <ExitButton />
      <div className="flex h-full w-full max-w-4/5 flex-col gap-8 justify-self-center">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1>what are you uploading?</h1>
          <div className="flex gap-5">
            <button
              className={contentType === "speech" ? "selected-button" : ""}
              onClick={() => setContentType("speech")}
            >
              speech
            </button>
            <button
              className={contentType === "outline" ? "selected-button" : ""}
              onClick={() => setContentType("outline")}
            >
              outline
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="input text here..."
          className="h-full w-full focus:outline-none"
        />
      </div>
      <div className="flex justify-between">
        <NavLink to={`/rehearsal/${rehearsalId}/type`}>
          <button>back</button>
        </NavLink>
        <button onClick={handleNext} disabled={!content || !contentType}>
          next
        </button>
      </div>
    </div>
  );
}

export default Content;
