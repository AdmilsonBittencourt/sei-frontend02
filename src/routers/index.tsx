import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Professores from "../pages/Professores";
import Disciplinas from "../pages/Disciplinas";
import Turmas from "../pages/Turmas";
import Salas from "../pages/Salas";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/disciplinas" element={<Disciplinas />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/turmas" element={<Salas />} />
      </Routes>
    </BrowserRouter>
  );
}