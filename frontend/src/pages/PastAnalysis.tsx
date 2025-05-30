import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import AnalysisContent from "../components/AnalysisContent";
import type { DeliveryAnalysis } from "../utils/deliveryAnalysis";
import type { ContentAnalysis } from "../utils/contentAnalysis";
import { deleteCurrentRehearsal } from "@/utils/auth";

function getCloudinaryPublicId(url: string) {
  // Handle both HTTP and HTTPS URLs
  const urlObj = new URL(url);

  // Extract the pathname (everything after the domain)
  const pathname = urlObj.pathname;

  // Split the path by '/' and filter out empty strings
  const pathParts = pathname.split("/").filter((part) => part !== "");

  // Find the index of the resource type (video, image, etc.)
  const resourceTypeIndex = pathParts.findIndex((part) =>
    ["video", "image", "raw", "auto"].includes(part),
  );

  if (resourceTypeIndex === -1) {
    throw new Error("Invalid Cloudinary URL: resource type not found");
  }

  // The public ID starts after the upload type (usually 'upload')
  // Typical structure: /[cloud_name]/[resource_type]/[upload_type]/[transformations]/[public_id].[format]
  const uploadTypeIndex = resourceTypeIndex + 1;

  if (uploadTypeIndex >= pathParts.length) {
    throw new Error("Invalid Cloudinary URL: upload type not found");
  }

  // Find where the public ID starts (after upload type and any transformations)
  let publicIdStartIndex = uploadTypeIndex + 1;

  // Skip transformation parameters (they contain commas, underscores, or specific transformation syntax)
  while (publicIdStartIndex < pathParts.length) {
    const part = pathParts[publicIdStartIndex];
    // If the part contains transformation syntax, skip it
    if (
      part.includes(",") ||
      (part.includes("_") && part.split("_").length > 2)
    ) {
      publicIdStartIndex++;
    } else {
      break;
    }
  }

  if (publicIdStartIndex >= pathParts.length) {
    throw new Error("Invalid Cloudinary URL: public ID not found");
  }

  // Get all remaining parts (public ID can contain folders, separated by '/')
  const publicIdParts = pathParts.slice(publicIdStartIndex);

  // Join the parts and remove the file extension from the last part
  let publicId = publicIdParts.join("/");

  // Remove file extension (everything after the last dot)
  const lastDotIndex = publicId.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    publicId = publicId.substring(0, lastDotIndex);
  }

  return publicId;
}

function PastAnalysis() {
  const [deliveryData, setDeliveryData] = useState<DeliveryAnalysis | null>(
    null,
  );
  const [contentData, setContentData] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { rehearsalId } = useParams();
  const [speechId, setSpeechId] = useState("");
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

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-center text-gray-400">
        <h2>loading...</h2>
      </div>
    );

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] gap-y-8 p-8">
      <NavLink
        to={`/speech/${speechId}/summary`}
        onClick={() => deleteCurrentRehearsal()}
        className="justify-self-end"
      >
        <button>back to summary</button>
      </NavLink>
      <AnalysisContent
        publicId={publicId}
        deliveryData={deliveryData}
        contentData={contentData}
      />
    </div>
  );
}

export default PastAnalysis;
