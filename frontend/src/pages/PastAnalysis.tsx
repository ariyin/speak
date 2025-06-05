import { useState, useEffect, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import AnalysisContent from "../components/AnalysisContent";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";
import type { ContentAnalysis } from "../utils/contentAnalysis";
import { deleteCurrentRehearsal } from "@/utils/auth";
import Loading from "./Loading";

function PastAnalysis() {
  const [deliveryData, setDeliveryData] = useState<DeliveryAnalysis | null>(
    null,
  );
  const [contentData, setContentData] = useState<ContentAnalysis | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const { rehearsalId } = useParams();
  const [speechId, setSpeechId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const analyze = async () => {
      try {
        // Check type of analysis selected for this rehearsal
        const response = await axios.get(
          `http://localhost:8000/rehearsal/${rehearsalId}`,
        );
        setSpeechId(response.data.speech);
        const content = response.data.content;
        const deliveryAnalysis = response.data.deliveryAnalysis;
        const contentAnalysis = response.data.contentAnalysis;
        const videoUrl = response.data.videoUrl;

        // Load analysis if done
        setTextContent(content ? content.text : null);
        setDeliveryData(deliveryAnalysis);
        setContentData(contentAnalysis);
        setVideoUrl(videoUrl);
      } catch (error) {
        console.error("Error calling analysis API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      analyze();
    }
  }, []);

  if (loading) return <Loading className="h-screen" />;

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] gap-y-8 p-6">
      <NavLink
        to={`/speech/${speechId}/summary`}
        onClick={() => deleteCurrentRehearsal()}
        className="justify-self-end"
      >
        <button>back to summary</button>
      </NavLink>
      <AnalysisContent
        url={videoUrl}
        content={textContent}
        deliveryData={deliveryData}
        contentData={contentData}
      />
    </div>
  );
}

export default PastAnalysis;
