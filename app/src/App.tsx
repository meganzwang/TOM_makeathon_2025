import { Routes, Route, useLocation } from "react-router-dom";
import { AppStateProvider } from "./context/AppState";
import Header from "./layout/Header";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const location = useLocation();
  // Set a contextual title for menu pages
  const isMenu = location.pathname.startsWith("/menu/");
  const title = isMenu ? "Folder" : "Sound & Menu Board";

  return (
    <AppStateProvider>
      <div className="mx-auto flex min-h-full max-w-3xl flex-col">
        <Header title={title} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu/:id" element={<MenuPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <footer className="pb-6 text-center text-xs text-zinc-500">
          <span>Built with React, Vite, Tailwind</span>
        </footer>
      </div>
    </AppStateProvider>
  );
}