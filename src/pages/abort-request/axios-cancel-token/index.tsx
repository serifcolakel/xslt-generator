import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios, { CancelTokenSource } from "axios";
import { LoaderIcon, Receipt } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const CancelToken = axios.CancelToken;

async function getPosts<T>(
  url: string,
  cancelToken: CancelTokenSource
): Promise<T> {
  const response = await axios.get<T>(url, {
    cancelToken: cancelToken.token,
  });
  return response.data;
}

const AxiosCancelTokenExample = () => {
  const { toast } = useToast();
  const cancelToken = useRef<CancelTokenSource | null>(null);

  const [posts, setPosts] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleError = (err: unknown) => {
    let message = `[UNKNOWN_ERROR ${new Date().toISOString()}] ${JSON.stringify(
      err,
      Object.getOwnPropertyNames(err)
    )}`;
    if (axios.isCancel(err)) {
      message = `[REQUEST_CANCELLED ${new Date().toISOString()}] ${
        err.message
      }`;
    } else if (axios.isAxiosError(err)) {
      message = `[AXIOS_ERROR ${new Date().toISOString()}] ${err.message}`;
    } else if (err instanceof Error) {
      message = `[GENERIC_ERROR ${new Date().toISOString()}] ${err.message}`;
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
    const source = CancelToken.source();
    cancelToken.current = source;
    setPosts([]);
    setLoading(true);
    try {
      const response = await getPosts<Todo[]>(
        "https://jsonplaceholder.typicode.com/posts",
        source
      );
      setPosts(response);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todo: Omit<Todo, "id">) => {
    const source = CancelToken.source();
    cancelToken.current = source;
    setLoading(true);
    try {
      const response = await axios.post<Todo>(
        "https://jsonplaceholder.typicode.com/posts",
        todo,
        {
          cancelToken: source.token,
        }
      );
      setPosts((prev) => [...prev, response.data]);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const patchTodo = async (todo: Todo) => {
    const source = CancelToken.source();
    cancelToken.current = source;
    setLoading(true);
    try {
      const response = await axios.patch<Todo>(
        `https://jsonplaceholder.typicode.com/posts/${todo.id}`,
        todo,
        {
          cancelToken: source.token,
        }
      );
      setPosts((prev) =>
        prev.map((item) =>
          item.id === response.data.id ? response.data : item
        )
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    const source = CancelToken.source();
    cancelToken.current = source;
    setLoading(true);
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${todoId}`,
        {
          cancelToken: source.token,
        }
      );
      setPosts((prev) => prev.filter((item) => item.id !== todoId));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (cancelToken.current) {
      cancelToken.current.cancel("Request canceled by the user.");
    }
  };

  const replaceTodo = async (todo: Todo) => {
    const source = CancelToken.source();
    cancelToken.current = source;
    setLoading(true);
    try {
      const response = await axios.put<Todo>(
        `https://jsonplaceholder.typicode.com/posts/${todo.id}`,
        todo,
        {
          cancelToken: source.token,
        }
      );
      setPosts((prev) =>
        prev.map((item) =>
          item.id === response.data.id ? response.data : item
        )
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel("Request canceled by the user.");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <header className="flex flex-row items-center justify-between w-full gap-4">
        <div />
        <Label size={"3xl"} weight={"bold"} className="text-center uppercase">
          Axios Cancel Token Example
        </Label>
        <Button
          onClick={() => {
            const todo = {
              userId: 1,
              title: "New Todo",
              completed: false,
            };
            createTodo(todo);
          }}
          disabled={loading}
        >
          Create Todo
        </Button>
      </header>
      <Alert variant={"info"}>
        <AlertTitle className="font-bold">Abort Request</AlertTitle>
        <AlertDescription>
          This example demonstrates how to use Axios Cancel Token to abort a
          request. Click the "Cancel Request" button to cancel the request. The
          request will be aborted, and an error message will be displayed in the
          toast notification. The request will be retried automatically after 5
          seconds. You can test with network throttling in the browser developer
          tools to simulate a slow network and see the cancel token in action.
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
          <div className="flex justify-center">
            <LoaderIcon className="animate-spin text-primary" />
          </div>
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

export default AxiosCancelTokenExample;
