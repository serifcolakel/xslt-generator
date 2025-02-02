import { paths } from "@/common";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
        <p>
          Back to <Link to={paths.dashboard}>home</Link>
        </p>
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return (
    <div className="text-center h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1>Oops!</h1>
      <p>
        Back to{" "}
        <Link className="text-blue-500" to={paths.dashboard}>
          home
        </Link>
      </p>
    </div>
  );
}

export default ErrorBoundary;
