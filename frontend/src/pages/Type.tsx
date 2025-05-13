import { NavLink } from "react-router-dom";

function Type() {
  return (
    <>
      <h1>Type</h1>
      <h2>What analysis are you looking for?</h2>
      <h3>Content</h3>
      <h3>Delivery</h3>
      <NavLink to="/content">To content page</NavLink>
    </>
  );
}

export default Type;
