import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Type from "./pages/Type";
import Content from "./pages/Content";
import Video from "./pages/Video";
import Analysis from "./pages/Analysis";
import Summary from "./pages/Summary";
import { getCurrentRehearsal, getCurrentSpeech } from "./utils/auth";
import PastAnalysis from "./pages/PastAnalysis";

// route protection component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const rehearsalId = getCurrentRehearsal();
  const speechId = getCurrentSpeech();

  // for rehearsal routes, we need a current rehearsal
  if (location.pathname.includes("/rehearsal/") && !rehearsalId) {
    return <Navigate to="/" replace />;
  }

  // for speech routes, we need a current speech
  if (location.pathname.includes("/speech/") && !speechId) {
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
          path="/rehearsal/:rehearsalId/saved"
          element={
            <ProtectedRoute>
              <PastAnalysis />
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
