import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="layout-t">
      <NavLink to="/type" className="justify-self-end">
        <button>create new speech</button>
      </NavLink>
      <div className="justify-self-center">
        <h1>no speeches available</h1>
      </div>
    </div>
  );
}

export default Home;
