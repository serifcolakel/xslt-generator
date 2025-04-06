// ReactQueryAbortControllerExample.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoaderIcon, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const fetchTodos = async (signal: AbortSignal): Promise<Todo[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    signal,
  });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
};

const ReactQueryAbortControllerExample = () => {
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const handleError = (err: unknown) => {
    let message = `[UNKNOWN_ERROR ${new Date().toISOString()}] ${JSON.stringify(
      err,
      Object.getOwnPropertyNames(err)
    )}`;
    if (err instanceof DOMException && err.name === "AbortError") {
      message = `[REQUEST_ABORTED ${new Date().toISOString()}] ${err.message}`;
    } else if (err instanceof Error) {
      message = `[FETCH_ERROR ${new Date().toISOString()}] ${err.message}`;
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      draggable: true,
      duration: 5000,
    });
  };

  const {
    data: todos,
    isFetching,
    refetch,
    isError,
    error,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const abortController = new AbortController();
      controllerRef.current = abortController;
      return fetchTodos(abortController.signal);
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
    return () => {
      controllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  const createMutation = useMutation({
    mutationFn: async (todo: Omit<Todo, "id">) => {
      const abortController = new AbortController();
      controllerRef.current = abortController;
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(todo),
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const abortController = new AbortController();
      controllerRef.current = abortController;
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${todo.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(todo),
          headers: { "Content-Type": "application/json" },
          signal: abortController.signal,
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const replaceMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const abortController = new AbortController();
      controllerRef.current = abortController;
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${todo.id}`,
        {
          method: "PUT",
          body: JSON.stringify(todo),
          headers: { "Content-Type": "application/json" },
          signal: abortController.signal,
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const abortController = new AbortController();
      controllerRef.current = abortController;
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
        signal: abortController.signal,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const isLoading =
    isFetching ||
    createMutation.isPending ||
    updateMutation.isPending ||
    replaceMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <header className="flex flex-row items-center justify-between w-full gap-4">
        <div />
        <Label size={"3xl"} weight={"bold"} className="text-center uppercase">
          React Query AbortController Example
        </Label>
        <Button
          onClick={() =>
            createMutation.mutate({
              userId: 1,
              title: "New Todo",
              completed: false,
            })
          }
          disabled={isLoading || createMutation.isPending}
        >
          Create Todo
        </Button>
      </header>

      <Alert variant={"info"}>
        <AlertTitle className="font-bold">Abort Request</AlertTitle>
        <AlertDescription>
          This example demonstrates how to cancel a fetch request with React
          Query using AbortController.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 *:w-full">
        <Button
          disabled={!isLoading}
          onClick={() => controllerRef.current?.abort()}
        >
          Cancel Request
        </Button>
        <Button
          disabled={isLoading}
          aria-label="Retry Request"
          variant="outline"
          onClick={() => refetch()}
        >
          Retry Request
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center">Loading...</p>
          <LoaderIcon className="animate-spin text-primary" />
        </div>
      )}

      <ul className="max-h-[400px] px-2 overflow-y-auto *:border-b border-b-primary">
        {todos?.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between w-full border-b last:border-none hover:bg-gray-100"
          >
            <div className="flex items-center w-full gap-2">
              <Receipt className="inline-block" />
              {post.title}
            </div>
            <Button
              variant="destructive"
              className="p-1 ml-2 h-fit"
              onClick={() => deleteMutation.mutate(post.id)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="p-1 ml-2 h-fit"
              onClick={() =>
                updateMutation.mutate({
                  ...post,
                  title: post.title + " (Updated)",
                })
              }
            >
              Update
            </Button>
            <Button
              variant="secondary"
              className="p-1 ml-2 h-fit"
              onClick={() =>
                replaceMutation.mutate({
                  ...post,
                  title: "Replaced Todo",
                  completed: true,
                })
              }
            >
              Replace
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReactQueryAbortControllerExample;
