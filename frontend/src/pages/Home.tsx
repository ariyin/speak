import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpeechCard from "../components/SpeechCard";
import { getUserId, addSpeech, addRehearsal } from "../utils/auth";
import type { Speech } from "../utils/speechService";

function Home() {
  const navigate = useNavigate();
  const [speeches, setSpeeches] = useState<Speech[]>([]);

  useEffect(() => {
    const fetchSpeeches = async () => {
      try {
        const userId = getUserId();
        const response = await axios.get(
          `http://localhost:8000/speech/user/${userId}`,
        );
        if (response.data.speeches) {
          setSpeeches(response.data.speeches.map((speech: Speech) => speech));
        }
      } catch (err) {
        // setError("Failed to load speeches");
        console.error("Error fetching speeches:", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchSpeeches();
  }, []);

  // TODO: implement later
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const handleCreateSpeech = async () => {
    try {
      const userId = getUserId();
      const response = await axios.post("http://localhost:8000/speech/", {
        speech: {
          userId: userId,
          name: "Untitled Speech",
          practiceTime: 0,
          rehearsals: [],
        },
        rehearsal: {
          analysis: [],
          speech: "", // temporary ObjectId
          videoUrl: "",
        },
      });
      addSpeech(response.data.speech.id);
      addRehearsal(response.data.rehearsal.id);
      navigate(`/rehearsal/${response.data.rehearsal.id}/type`);
    } catch (error) {
      console.error("Error creating speech:", error);
    }
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  return (
    <div className="layout-t">
      <button className="justify-self-end" onClick={handleCreateSpeech}>
        create new speech
      </button>
      {speeches.length === 0 ? (
        <div className="justify-self-center text-center text-gray-400">
          <h1>no speeches available</h1>
          <p className="mt-2">create your first speech to get started!</p>
        </div>
      ) : (
        <div className="grid h-full grid-cols-3 gap-10">
          {speeches.map((speech) => (
            <SpeechCard key={speech.id} speech={speech} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
