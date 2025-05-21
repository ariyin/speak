import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Type from "./pages/Type";
import Content from "./pages/Content";
import Video from "./pages/Video";
import Analysis from "./pages/Analysis";
import Summary from "./pages/Summary";
import { getCurrentRehearsal } from "./utils/auth";

// Route protection component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const rehearsalId = getCurrentRehearsal();
  if (!rehearsalId) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/rehearsal/:rehearsalId/type"
          element={
            <ProtectedRoute>
              <Type />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rehearsal/:rehearsalId/content"
          element={
            <ProtectedRoute>
              <Content />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rehearsal/:rehearsalId/video"
          element={
            <ProtectedRoute>
              <Video />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rehearsal/:rehearsalId/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/speech/:speechId/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
