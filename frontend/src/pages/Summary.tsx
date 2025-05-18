import { NavLink } from "react-router-dom";

function Summary() {
  return (
    <div>
      <NavLink to="/">
        <button>back to home</button>
      </NavLink>
    </div>
  );
}

export default Summary;
