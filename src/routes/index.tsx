import { paths } from "@/common";
import DashboardPage from "@/pages/dashboard/page";
import ErrorBoundary from "@/pages/error";
import HomePage from "@/pages/home";
import InvoicePreviewPage from "@/pages/invoice-preview/page";
import LoginPage from "@/pages/login/page";
import PrintPage from "@/pages/print";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: paths.login,
    element: <LoginPage />,
  },
  {
    path: paths.dashboard,
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: paths.print,
        element: <PrintPage />,
      },
      {
        path: paths.invoicePreview,
        element: <InvoicePreviewPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);
