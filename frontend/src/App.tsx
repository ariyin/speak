import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Type from "./pages/Type";
import Content from "./pages/Content";
import Video from "./pages/Video";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/type" element={<Type />} />
        <Route path="/content" element={<Content />} />
        <Route path="/video" element={<Video />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;
