import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import RehearsalCard from "../components/RehearsalCard";
import type { Speech } from "../utils/speechService";
import type { Rehearsal } from "../utils/rehearsalService";
import { addRehearsal } from "../utils/auth";

function Summary() {
  const { speechId } = useParams();
  const navigate = useNavigate();
  const [speech, setSpeech] = useState<Speech | null>(null);
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeech = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/speech/${speechId}`,
        );
        setSpeech(response.data);

        // fetch each rehearsal's full data
        const rehearsalPromises = response.data.rehearsals.map((id: string) =>
          axios.get(`http://localhost:8000/rehearsal/${id}`),
        );
        const rehearsalResponses = await Promise.all(rehearsalPromises);
        const rehearsalData = rehearsalResponses.map((res) => res.data);
        setRehearsals(rehearsalData);
      } catch (err) {
        console.error("Error fetching speech:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeech();
  }, [speechId]);

  const handleAddRehearsal = async () => {
    try {
      // create a new rehearsal for the current speech
      const response = await axios.post("http://localhost:8000/rehearsal/", {
        speech: speechId,
      });

      // update current rehearsal in localStorage
      addRehearsal(response.data.rehearsal.id);

      // navigate to the type page for the new rehearsal
      navigate(`/rehearsal/${response.data.rehearsal.id}/type`);
    } catch (error) {
      console.error("Error creating new rehearsal:", error);
    }
  };

  // loading state
  if (loading || !speech) {
    return (
      <div className="layout-tb">
        <NavLink to="/" className="justify-self-end">
          <button>back to home</button>
        </NavLink>
        <div className="flex h-full items-center justify-center">
          <h2 className="text-gray-400">loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-t">
      <NavLink to="/" className="justify-self-end">
        <button>back to home</button>
      </NavLink>
      <div className="flex flex-col gap-8">
        <div>
          <h1>{speech?.name}</h1>
          <p className="text-gray-600">
            {rehearsals.length} rehearsal{rehearsals.length !== 1 ? "s" : ""} |{" "}
            {speech?.practiceTime ? (speech.practiceTime / 60).toFixed(1) : 0}{" "}
            minutes of practice
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-10">
          {/* rehearsal cards */}
          {rehearsals.map((rehearsal) => (
            <div
              key={rehearsal.id}
              className="flex w-full flex-col items-center gap-5"
            >
              <div className="w-1/2">
                <RehearsalCard rehearsal={rehearsal} />
              </div>
              {/* vertical line */}
              <div className="bg-cherry h-10 w-0.5" />
            </div>
          ))}
          <button className="w-fit" onClick={handleAddRehearsal}>
            add new rehearsal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;
