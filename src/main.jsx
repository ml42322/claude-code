import { createRoot } from "react-dom/client";
import "./storage.js";          // sets window.storage before App initializes
import App from "./RecipeBox.jsx";
createRoot(document.getElementById("root")).render(<App />);
