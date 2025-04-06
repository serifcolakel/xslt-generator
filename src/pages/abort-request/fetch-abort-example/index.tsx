import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon, Receipt } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const FetchAbortControllerExample = () => {
  const { toast } = useToast();
  const abortController = useRef<AbortController | null>(null);

  const [posts, setPosts] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchPosts = async () => {
    const controller = new AbortController();
    abortController.current = controller;
    setPosts([]);
    setLoading(true);

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        signal: controller.signal,
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todo: Omit<Todo, "id">) => {
    const controller = new AbortController();
    abortController.current = controller;
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(todo),
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      const data = await res.json();
      setPosts((prev) => [...prev, data]);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const patchTodo = async (todo: Todo) => {
    const controller = new AbortController();
    abortController.current = controller;
    setLoading(true);
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${todo.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(todo),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }
      );
      const data = await res.json();
      setPosts((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const replaceTodo = async (todo: Todo) => {
    const controller = new AbortController();
    abortController.current = controller;
    setLoading(true);
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${todo.id}`,
        {
          method: "PUT",
          body: JSON.stringify(todo),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }
      );
      const data = await res.json();
      setPosts((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    const controller = new AbortController();
    abortController.current = controller;
    setLoading(true);
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${todoId}`, {
        method: "DELETE",
        signal: controller.signal,
      });
      setPosts((prev) => prev.filter((item) => item.id !== todoId));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  useEffect(() => {
    fetchPosts();
    return () => {
      abortController.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <header className="flex flex-row items-center justify-between w-full gap-4">
        <div />
        <Label size={"3xl"} weight={"bold"} className="text-center uppercase">
          Fetch Abort Controller Example
        </Label>
        <Button
          onClick={() =>
            createTodo({ userId: 1, title: "New Todo", completed: false })
          }
          disabled={loading}
        >
          Create Todo
        </Button>
      </header>

      <Alert variant={"info"}>
        <AlertTitle className="font-bold">Abort Request</AlertTitle>
        <AlertDescription>
          This example demonstrates how to use Fetch AbortController to cancel a
          request. Click "Cancel Request" to abort an ongoing request. Try
          network throttling in dev tools to simulate a slow network and test
          cancellation.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 *:w-full">
        <Button disabled={!loading} onClick={handleCancel}>
          Cancel Request
        </Button>
        <Button
          disabled={loading}
          aria-label="Retry Request"
          variant="outline"
          onClick={fetchPosts}
        >
          Retry Request
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center">Loading...</p>
          <LoaderIcon className="animate-spin text-primary" />
        </div>
      )}

      <ul className="max-h-[400px] px-2 overflow-y-auto *:border-b border-b-primary">
        {posts.map((post) => (
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
              className="inline-block p-1 m-0 ml-2 h-fit"
              onClick={() => deleteTodo(post.id)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="inline-block p-1 m-0 ml-2 h-fit"
              onClick={() =>
                patchTodo({ ...post, title: `${post.title} (Updated)` })
              }
            >
              Update
            </Button>
            <Button
              variant="secondary"
              className="inline-block p-1 m-0 ml-2 h-fit"
              onClick={() =>
                replaceTodo({
                  ...post,
                  title: `Replaced Todo`,
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

export default FetchAbortControllerExample;
