import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "@/components/AppShell";
import Home from "@/pages/Home";
import Employee from "@/pages/Employee";
import Owner from "@/pages/Owner";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/owner" element={<Owner />} />
        </Route>
      </Routes>
    </Router>
  );
}
