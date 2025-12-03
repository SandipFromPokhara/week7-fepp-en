import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from  "./pages/JobPage"
import NotFoundPage from "./pages/NotFoundPage"

const App = () => {

    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/add-job" element={<AddJobPage />} />
              <Route path="/jobs/:id" element={<JobPage />} />             
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }
  
  export default App;
