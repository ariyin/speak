import { NavLink } from "react-router-dom";
import { useState } from "react";

function Upload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  function uploadFile(file: File) {
    const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/upload`;
    const fd = new FormData();
    fd.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET!);
    fd.append("file", file);

    fetch(url, {
      method: "POST",
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        // File uploaded successfully
        const url = data.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        const transformedUrl = url.replace(
          "/upload/",
          "/upload/w_150,c_scale/",
        );
        setImageUrl(transformedUrl);
      })
      .catch((error) => {
        console.error("Error uploading the file:", error);
      });
  }

  return (
    <>
      <h1>Video</h1>
      <div id="dropbox">
        <form className="my-form">
          <div className="form_line">
            <div className="form_controls">
              <div className="upload_button_holder">
                <input
                  type="file"
                  id="fileElem"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        uploadFile(files[i]);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </form>
        <div id="gallery">
          {" "}
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded" style={{ width: "100px" }} />
          )}
        </div>
        <NavLink to="/analysis">To analysis page</NavLink>
      </div>
    </>
  );
}

export default Upload;
