import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpeechCard from "../components/SpeechCard";
import { getUserId, addSpeech, addRehearsal } from "../utils/auth";
import type { Speech } from "../utils/speechService";
import logo from "../assets/speak-full.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

function Home() {
  const navigate = useNavigate();
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [speechName, setSpeechName] = useState("Untitled Speech");

  const fetchSpeeches = async () => {
    try {
      const userId = getUserId();
      const response = await axios.get(
        `http://localhost:8000/speech/user/${userId}`,
      );
      if (response.data.speeches) {
        setSpeeches(response.data.speeches.map((speech: Speech) => speech));
      } else {
        setSpeeches([]);
      }
    } catch (err) {
      // setError("Failed to load speeches");
      console.error("Error fetching speeches:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
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
          name: speechName,
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
      <div className="flex items-center justify-between">
        <img src={logo} className="h-12" />
        <Dialog>
          <DialogTrigger>create new speech</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>create new speech</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col items-start gap-2">
                  <label>name</label>
                  <input
                    value={speechName}
                    onChange={(e) => setSpeechName(e.target.value)}
                    className="w-full"
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button onClick={handleCreateSpeech}>create</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {speeches.length === 0 ? (
        <div className="justify-self-center text-center text-gray-400">
          <h1>no speeches available</h1>
          <p className="mt-2">create your first speech to get started!</p>
        </div>
      ) : (
        <div className="grid h-full grid-cols-3 gap-10">
          {speeches.map((speech) => (
            <SpeechCard
              key={speech.id}
              speech={speech}
              onSpeechUpdate={fetchSpeeches}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
