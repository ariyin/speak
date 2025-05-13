import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Type from "./pages/Type";
import Content from "./pages/Content";
import Video from "./pages/Video";
import Upload from "./pages/Upload";
import Record from "./pages/Record";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/type" element={<Type />} />
        <Route path="/content" element={<Content />} />
        <Route path="/video" element={<Video />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/record" element={<Record />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;
