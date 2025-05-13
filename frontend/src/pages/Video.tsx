import { NavLink } from "react-router-dom";

function Video() {
  return (
    <>
      <h1>Video</h1>
      <NavLink to="/upload">Upload video</NavLink>
      <NavLink to="/record">Record video</NavLink>
    </>
  );
}

export default Video;
