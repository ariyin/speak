import { NavLink } from "react-router-dom";

function Home() {
  return (
    <>
      <h1>Home</h1>
      <NavLink to="/type">To type page</NavLink>
    </>
  );
}

export default Home;
