import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="p-20">
      <NavLink to="/type" className="flex w-full justify-end">
        <button>create new speech</button>
      </NavLink>
      <h1>Home</h1>
    </div>
  );
}

export default Home;
