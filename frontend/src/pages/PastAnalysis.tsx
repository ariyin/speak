import { useRef, useCallback, useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";

function getCloudinaryPublicId(url: string) {
  // Handle both HTTP and HTTPS URLs
  const urlObj = new URL(url);
  
  // Extract the pathname (everything after the domain)
  const pathname = urlObj.pathname;
  
  // Split the path by '/' and filter out empty strings
  const pathParts = pathname.split('/').filter(part => part !== '');
  
  // Find the index of the resource type (video, image, etc.)
  const resourceTypeIndex = pathParts.findIndex(part => 
    ['video', 'image', 'raw', 'auto'].includes(part)
  );
  
  if (resourceTypeIndex === -1) {
    throw new Error('Invalid Cloudinary URL: resource type not found');
  }
  
  // The public ID starts after the upload type (usually 'upload')
  // Typical structure: /[cloud_name]/[resource_type]/[upload_type]/[transformations]/[public_id].[format]
  const uploadTypeIndex = resourceTypeIndex + 1;
  
  if (uploadTypeIndex >= pathParts.length) {
    throw new Error('Invalid Cloudinary URL: upload type not found');
  }
  
  // Find where the public ID starts (after upload type and any transformations)
  let publicIdStartIndex = uploadTypeIndex + 1;
  
  // Skip transformation parameters (they contain commas, underscores, or specific transformation syntax)
  while (publicIdStartIndex < pathParts.length) {
    const part = pathParts[publicIdStartIndex];
    // If the part contains transformation syntax, skip it
    if (part.includes(',') || part.includes('_') && part.split('_').length > 2) {
      publicIdStartIndex++;
    } else {
      break;
    }
  }
  
  if (publicIdStartIndex >= pathParts.length) {
    throw new Error('Invalid Cloudinary URL: public ID not found');
  }
  
  // Get all remaining parts (public ID can contain folders, separated by '/')
  const publicIdParts = pathParts.slice(publicIdStartIndex);
  
  // Join the parts and remove the file extension from the last part
  let publicId = publicIdParts.join('/');
  
  // Remove file extension (everything after the last dot)
  const lastDotIndex = publicId.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    publicId = publicId.substring(0, lastDotIndex);
  }
  
  return publicId;
}

function PastAnalysis() {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryAnalysis | null>(
    null,
  );
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rehearsalId } = useParams();
  const [speechId, setSpeechId] = useState("")
  const [publicId, setPublicId] = useState("");

  useEffect(() => {
    const analyze = async () => {
      try {
        // Check type of analysis selected for this rehearsal
        const response = await axios.get(
          `http://localhost:8000/rehearsal/${rehearsalId}`,
        );
        setSpeechId(response.data.speech);
        setPublicId(getCloudinaryPublicId(response.data.videoUrl));
        let deliveryAnalysis = response.data.deliveryAnalysis;
        let contentAnalysis = response.data.contentAnalysis;

        // Load analysis if done
        setDeliveryData(deliveryAnalysis);
        setContentData(contentAnalysis);
      } catch (error) {
        console.error("Error calling analysis API:", error);
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, []);

  const handleReady = useCallback((player: CloudinaryPlayer) => {
    playerRef.current = player;
  }, []);

  if (loading)
    return (
      <div className="layout-t">
        <div className="justify-self-center text-center text-gray-400">
          <h1>Analyzing video...</h1>
        </div>
      </div>
    );

  return (
    <div className="layout-tb">
      <div className="grid h-full grid-cols-2 gap-4">
        <div>
          <VideoPlayer publicId={publicId} onReady={handleReady} />
        </div>
        <div className="space-y-4 rounded-2xl border-2 border-black p-4">
          <h2>Delivery Analysis</h2>
          {deliveryData?.transcript_analysis ? (
            <>
              <details className="rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Filler Words
                </summary>
                <ul className="list-disc pl-4">
                  {deliveryData?.transcript_analysis?.analysis?.filler_words &&
                  Object.keys(
                    deliveryData.transcript_analysis.analysis.filler_words,
                  ).length > 0 ? (
                    Object.entries(
                      deliveryData.transcript_analysis.analysis.filler_words,
                    ).map(([word, count], idx) => (
                      <li key={idx}>
                        {" "}
                        {word}: {count}{" "}
                      </li>
                    ))
                  ) : (
                    <li>None found</li>
                  )}
                </ul>
              </details>

              <details className="rounded-lg border p-2">
                <summary className="cursor-pointer text-lg font-medium">
                  Speaking Rate
                </summary>
                <p className="pl-4">
                  {deliveryData.transcript_analysis.analysis?.speech_rate_wpm ??
                    "N/A"}
                </p>
              </details>
            </>
          ) : (
            <p>No delivery analysis available.</p>
          )}
          {deliveryData?.body_language_analysis ? (
            <details className="mb-4 rounded-lg border p-2">
              <summary className="cursor-pointer text-lg font-medium">
                Body Language
              </summary>

              <details className="mt-2 ml-4 rounded-lg border p-2">
                <summary className="cursor-pointer font-semibold">Pros</summary>
                <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                  {deliveryData.body_language_analysis.pros.length > 0 ? (
                    deliveryData.body_language_analysis.pros.map(
                      ({ timestamp, description }, idx) => (
                        <li key={idx}>
                          <strong>{timestamp}</strong>: {description}
                        </li>
                      ),
                    )
                  ) : (
                    <li>No pros found</li>
                  )}
                </ul>
              </details>

              <details className="mt-2 ml-4 rounded-lg border p-2">
                <summary className="cursor-pointer font-semibold">
                  Areas of Improvement
                </summary>
                <ul className="max-h-48 list-disc overflow-y-auto pl-4">
                  {deliveryData.body_language_analysis.cons.length > 0 ? (
                    deliveryData.body_language_analysis.cons.map(
                      ({ timestamp, description }, idx) => (
                        <li key={idx}>
                          <strong>{timestamp}</strong>: {description}
                        </li>
                      ),
                    )
                  ) : (
                    <li>No areas of improvement found, you did perfect!</li>
                  )}
                </ul>
              </details>
            </details>
          ) : (
            <p>No body language analysis available</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4">
      <NavLink to={`/speech/${speechId}/summary`}>
          <button>back to summary</button>
        </NavLink>
        <NavLink to={`/`}>
          <button>back to home</button>
        </NavLink>
      </div>
    </div>
  );
}

export default PastAnalysis;
