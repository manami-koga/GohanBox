import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AddPage } from "./pages/AddPage";
import { ListPage } from "./pages/ListPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/add" element={<AddPage />} />
      </Routes>
    </BrowserRouter>
  );
}
