import { createRoot } from "react-dom/client";
import App from "./app/App";
import { ThemeProvider } from "./app/components/theme-provider";
import { ThemeTransitionProvider } from "./app/components/theme-transition-context";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <ThemeTransitionProvider>
      <App />
    </ThemeTransitionProvider>
  </ThemeProvider>
);