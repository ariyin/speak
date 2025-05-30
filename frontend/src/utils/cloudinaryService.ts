export interface CloudinaryPlayer {
  duration(): number;
  currentTime(time: number): void;
  dispose(): void;
  play(): void;
  source(
    publicId: string,
    options?: {
      transformation?: {
        height?: number;
        width?: number;
        crop?: string;
        gravity?: string;
      };
      sourceTypes?: string[];
    },
  ): void;
}

export async function uploadFileToCloudinary(
  file: File,
): Promise<{ secureUrl: string; publicId: string; duration: number }> {
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

    if (!data.secure_url || !data.public_id) {
      throw new Error(
        "No secure_url and/or public_id returned from Cloudinary.",
      );
    }

    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
      duration: data.duration,
    };
  } catch (error) {
    console.error("Error uploading the file:", error);
    throw error;
  }
}
