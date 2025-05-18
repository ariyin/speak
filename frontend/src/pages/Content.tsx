import { NavLink } from "react-router-dom";

function Content() {
  return (
    <div className="layout-tb">
      <NavLink to="/" className="justify-self-end">
        <button>exit</button>
      </NavLink>
      <div className="flex h-full w-full max-w-4/5 flex-col gap-8 justify-self-center">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1>what are you uploading?</h1>
          <div className="flex gap-5">
            {/* TODO: clicking logic */}
            <button>speech</button>
            <button>outline</button>
          </div>
        </div>
        <textarea
          placeholder="input text here..."
          className="h-full w-full focus:outline-none"
        />
      </div>
      <div className="flex justify-between">
        <NavLink to="/type">
          <button>back</button>
        </NavLink>
        <NavLink to="/video">
          {/* TODO: disable if content is required */}
          <button>next</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Content;
