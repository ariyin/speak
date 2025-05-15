export interface CloudinaryPlayer {
  duration(): number;
  currentTime(time: number): void;
  dispose(): void;
}

export async function uploadFileToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET!);
  fd.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: fd,
    });

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("No secure_url returned from Cloudinary.");
    }

    const transformedUrl = data.secure_url.replace(
      "/upload/",
      "/upload/w_150,c_scale/",
    );

    return transformedUrl;
  } catch (error) {
    console.error("Error uploading the file:", error);
    throw error;
  }
}
