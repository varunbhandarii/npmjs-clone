import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PackageDetailPage from "./pages/PackageDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/package/:packageName" element={<PackageDetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
