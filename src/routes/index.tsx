import { paths } from "@/common";
import AbortRequestPage from "@/pages/abort-request";
import DashboardPage from "@/pages/dashboard/page";
import ErrorBoundary from "@/pages/error";
import HomePage from "@/pages/home";
import ParentApp from "@/pages/iframe";
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
      {
        path: paths.iFrame,
        element: <ParentApp />,
      },
      {
        path: paths.abortRequest,
        element: <AbortRequestPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);
