import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Loader } from "lucide-react";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
        fallbackElement={<Loader />}
      />
    </TooltipProvider>
  </StrictMode>
);
