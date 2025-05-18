import { uploadFileToCloudinary } from "../lib/cloudinaryService";

interface UploadModalProps {
  onRecorded: (url: string) => void;
}

function UploadModal({ onRecorded }: UploadModalProps) {
  async function handleUpload(file: File) {
    try {
      const url = await uploadFileToCloudinary(file);
      onRecorded(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  return (
    <label className="border-cherry font-gs hover:bg-cherry inline-block cursor-pointer rounded-2xl border-2 border-solid bg-white px-9 py-3 transition-colors hover:cursor-pointer hover:border-black hover:text-white disabled:cursor-default disabled:border-black disabled:bg-gray-400 disabled:hover:text-black">
      choose file
      <input
        type="file"
        id="fileElem"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.[0]) {
            handleUpload(files[0]);
          }
        }}
      />
    </label>
  );
}

export default UploadModal;
