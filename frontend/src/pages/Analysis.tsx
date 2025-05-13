import { NavLink } from "react-router-dom";

function Analysis() {
  return (
    <>
      <h1>Analysis</h1>
      <NavLink to="/type">Rehearse again</NavLink>
      <NavLink to="/">Exit</NavLink>
    </>
  );
}

export default Analysis;
