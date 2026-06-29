import { Routes, Route } from "react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import ToolPage from "@/pages/ToolPage";
import ImageLibrary from "@/pages/ImageLibrary";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tools/image" element={<ImageLibrary />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
