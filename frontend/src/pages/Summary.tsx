import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import type { Speech } from "../utils/speechService";
import type { Rehearsal } from "../utils/rehearsalService";
import RehearsalCard from "../components/RehearsalCard";
import axios from "axios";

function Summary() {
  const { speechId } = useParams();
  const [speech, setSpeech] = useState<Speech | null>(null);
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

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
        // setError("Failed to load speech");
        console.error("Error fetching speech:", err);
      }
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchSpeech();
  }, [speechId]);

  // redirect to home if there's an error
  // if (error) {
  //   return <Navigate to="/" replace />;
  // }

  // show loading state
  // if (loading || !speech) {
  //   return (
  //     <div className="layout-tb">
  //       <NavLink to="/">
  //         <button>back to home</button>
  //       </NavLink>
  //       <div className="flex h-full items-center justify-center">
  //         <p>Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="layout-t">
      <NavLink to="/">
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
          {rehearsals.map((rehearsal) => (
            <div key={rehearsal.id} className="w-1/2">
              <RehearsalCard rehearsal={rehearsal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Summary;
