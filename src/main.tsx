import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Loader } from "lucide-react";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 0,
    },
  },
});
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./reduxStore";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RouterProvider
          future={{
            v7_startTransition: true,
          }}
          router={router}
          fallbackElement={<Loader />}
        />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);
