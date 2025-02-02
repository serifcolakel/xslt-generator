import App from "@/App";
import { paths } from "@/common";
import ErrorBoundary from "@/pages/error";
import PrintPage from "@/pages/print";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <App />,
  },
  {
    path: paths.print,
    element: <PrintPage />,
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);
