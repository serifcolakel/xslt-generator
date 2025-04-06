# Canceling Requests in React/React Native: A Comprehensive Guide

In a world of async-heavy apps, canceling unnecessary or outdated requests is key to improving performance and user experience. Imagine you're typing into a search field and triggering a request for every keystroke—without canceling the previous one, you'll be wasting resources and potentially displaying outdated results.

This article dives into various ways to handle cancellation of requests in React and React Native, covering:

- **Axios**: Using `CancelToken` to cancel requests.
- **Fetch**: Leveraging the `AbortController` API.
- **React Query**: Built-in cancellation support.
- **RTK Query**: Using `AbortController` for cancellation.
- **React Native**: Handling cancellation in a mobile context.
- **Conclusion**: Summarizing the key points and best practices.
- **References**: Links to official documentation and further reading.
- **Code Snippets**: Examples for each method.
- **Live Examples**: Interactive code snippets to test and play with.

## Table of Contents

- [Links](#links)
- [Canceling Requests with Axios](#canceling-requests-with-axios)
- [Canceling Requests with Fetch](#canceling-requests-with-fetch)
- [Canceling Requests with React Query](#canceling-requests-with-react-query)
- [Canceling Requests with RTK Query](#canceling-requests-with-rtk-query)
- [Canceling Requests with React Native](#canceling-requests-with-react-native)
- [Conclusion](#conclusion)
- [References](#references)

## Links

- [Full Code](https://github.com/serifcolakel/xslt-generator/tree/main/src/pages/abort-request)
- [Live Example](http://xslt-generator-tvlk.vercel.app/abort-request)

## Canceling Requests with Axios

Axios is a popular HTTP client for JavaScript, and it provides a built-in way to cancel requests using `CancelToken`. Here's how you can implement it:

```tsx
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
```

### Explanation

1. **CancelToken**: Axios provides a `CancelToken` that can be used to cancel requests. You create a new token using `CancelToken.source()` and pass it to the request.

2. **Canceling Requests**: You can cancel a request by calling `cancelToken.current.cancel("Request canceled by the user.")`. This will trigger the `catch` block in the request, where you can handle the cancellation.

3. **Error Handling**: The `handleError` function checks if the error is a cancellation error or an Axios error and displays an appropriate message.

4. **Cleanup**: In the `useEffect` cleanup function, we cancel any ongoing requests when the component unmounts.

5. **Creating Todos**: The `createTodo` function demonstrates how to create a new todo item using a POST request. It also uses the cancel token to allow cancellation of the request.

## Canceling Requests with Fetch

The Fetch API does not have built-in cancellation support, but you can use the `AbortController` to achieve similar functionality. Here's how you can implement it:

```tsx
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
```

### Explanation

1. **AbortController**: The `AbortController` is a built-in browser API that allows you to abort one or more DOM requests as and when desired.

2. **Creating an Instance**: You create a new instance of `AbortController` and pass its `signal` property to the fetch request.

3. **Canceling Requests**: You can cancel a request by calling `abortController.current.abort()`. This will trigger an `AbortError` in the catch block of the request.

4. **Error Handling**: The `handleError` function checks if the error is an `AbortError` and displays an appropriate message.

5. **Cleanup**: In the `useEffect` cleanup function, we abort any ongoing requests when the component unmounts.

## Canceling Requests with React Query

React Query is a powerful library for managing server state in React applications. It has built-in support for canceling requests, making it easy to handle scenarios where you want to cancel a request when the component unmounts or when a new request is made.

```tsx
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
```

### Explanation

1. **useQuery**: The `useQuery` hook is used to fetch data. It automatically handles cancellation when the component unmounts or when a new request is made.

2. **AbortController**: You create a new instance of `AbortController` and pass its `signal` property to the fetch request.

3. **Error Handling**: The `handleError` function checks if the error is an `AbortError` and displays an appropriate message.

4. **Mutations**: The `useMutation` hook is used for creating, updating, and deleting todos. Each mutation also uses an `AbortController` to allow cancellation.

5. **Cleanup**: In the `useEffect` cleanup function, we abort any ongoing requests when the component unmounts.

## Canceling Requests with RTK Query

RTK Query is a powerful data fetching and caching library built on top of Redux Toolkit. It provides a simple API for managing server state and has built-in support for canceling requests.

- First create a post api for the example:

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Post = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Posts"],
    }),
    createPost: builder.mutation<Post, Omit<Post, "id">>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation<Post, Post>({
      query: (body) => ({
        url: `/posts/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    replacePost: builder.mutation<Post, Post>({
      query: (body) => ({
        url: `/posts/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useReplacePostMutation,
  useDeletePostMutation,
} = postsApi;
```

After creating the post api, you can use the following code to implement the RTK Query example:

```tsx
import { useToast } from "@/hooks/use-toast";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useReplacePostMutation,
  useUpdatePostMutation,
} from "@/features/api/postApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Receipt, LoaderIcon } from "lucide-react";
import { useEffect, useRef } from "react";

type AbortFn = (reason?: string) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MutationFn<TArgs> = (args: TArgs) => { abort: AbortFn } & Promise<any>;

function useAbortableMutation() {
  const abortRef = useRef<AbortFn>();

  async function runMutation<TArgs>(
    mutationFn: MutationFn<TArgs>,
    args: TArgs,
    onError?: (err: unknown) => void,
    onFinally?: () => void
  ) {
    const request = mutationFn(args);
    abortRef.current = request.abort;

    try {
      await request;
    } catch (err) {
      if (onError) onError(err);
    } finally {
      if (onFinally) onFinally();
    }
  }

  const abort = (reason = "Aborted by user") => {
    abortRef.current?.(reason);
  };

  return { runMutation, abort };
}

const RTKQueryExample = () => {
  const { toast } = useToast();

  const { runMutation, abort } = useAbortableMutation();

  const { data: posts = [], isFetching, refetch, error } = useGetPostsQuery();

  const [createPost, { isLoading: isCreating, error: createPostError }] =
    useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating, error: updatePostError }] =
    useUpdatePostMutation();
  const [replacePost, { isLoading: isReplacing, error: replacePostError }] =
    useReplacePostMutation();
  const [deletePost, { isLoading: isDeleting, error: deletePostError }] =
    useDeletePostMutation();

  const handleError = (err: unknown) => {
    let message = `[UNKNOWN_ERROR ${new Date().toISOString()}] ${JSON.stringify(
      err,
      Object.getOwnPropertyNames(err)
    )}`;

    if (err instanceof Error) {
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

  const handleCancel = () => {
    abort("Request cancelled by user");
  };

  const initialError =
    error ||
    createPostError ||
    updatePostError ||
    replacePostError ||
    deletePostError;

  const isLoading =
    isFetching || isCreating || isUpdating || isReplacing || isDeleting;

  useEffect(() => {
    if (initialError) {
      handleError(initialError);
    }

    return () => {
      abort("Request cancelled during cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialError]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <header className="flex flex-row items-center justify-between w-full gap-4">
        <div />
        <Label size={"3xl"} weight={"bold"} className="text-center uppercase">
          RTK Query Example
        </Label>
        <Button
          onClick={async () => {
            await runMutation(
              createPost,
              { userId: 1, title: "New Post", completed: false },
              handleError
            );
          }}
          disabled={isLoading}
        >
          Create POST
        </Button>
      </header>

      <Alert variant={"info"}>
        <AlertTitle className="font-bold">RTK Query</AlertTitle>
        <AlertDescription>
          This version demonstrates CRUD with Redux Toolkit Query.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 *:w-full">
        <Button disabled={!isLoading} onClick={handleCancel}>
          Cancel Request
        </Button>
        <Button
          disabled={isLoading}
          aria-label="Retry Request"
          variant="outline"
          onClick={async () => {
            await runMutation(refetch, undefined, (err) => {
              handleError(err);
            });
          }}
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
              className="p-1 ml-2 h-fit"
              onClick={async () => {
                await runMutation(deletePost, post.id, handleError);
              }}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="p-1 ml-2 h-fit"
              onClick={async () =>
                await runMutation(
                  updatePost,
                  { ...post, title: post.title + " (Updated)" },
                  handleError
                )
              }
            >
              Update
            </Button>
            <Button
              variant="secondary"
              className="p-1 ml-2 h-fit"
              onClick={async () =>
                await runMutation(
                  replacePost,
                  { ...post, title: "Replaced Post", completed: true },
                  handleError
                )
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

export default RTKQueryExample;
```

### Explanation

1. **useGetPostsQuery**: This hook is used to fetch the list of posts. It automatically handles cancellation when the component unmounts or when a new request is made.

2. **useCreatePostMutation**: This hook is used to create a new post. It returns a function that can be called to trigger the mutation.

3. **useUpdatePostMutation**: This hook is used to update an existing post. It also returns a function that can be called to trigger the mutation.

4. **useReplacePostMutation**: This hook is used to replace an existing post. It works similarly to the update mutation.

5. **useDeletePostMutation**: This hook is used to delete a post. It returns a function that can be called to trigger the mutation.

6. **useAbortableMutation**: This custom hook is used to run a mutation and handle cancellation. It provides a `runMutation` function that takes a mutation function and its arguments, and an `abort` function to cancel the request.

7. **Error Handling**: The `handleError` function checks if the error is an `AbortError` and displays an appropriate message.

8. **Cleanup**: In the `useEffect` cleanup function, we abort any ongoing requests when the component unmounts.

## Conclusion

In this article, we explored how to cancel requests in React using different libraries and techniques. We covered:

- **Axios**: Using Cancel Tokens to cancel requests.
- **Fetch API**: Using AbortController to cancel requests.
- **React Query**: Built-in support for canceling requests with AbortController.
- **RTK Query**: Using Redux Toolkit Query to manage server state and cancel requests.
- **Custom Hooks**: Creating custom hooks to handle request cancellation.
- **Error Handling**: Implementing error handling for canceled requests.
- **Cleanup**: Ensuring that requests are canceled when the component unmounts.
- **User Experience**: Providing feedback to users when requests are canceled or retried.

By using these techniques, you can improve the performance and user experience of your React applications by managing network requests effectively. Whether you're using Axios, Fetch API, React Query, or RTK Query, you now have the tools to handle request cancellation in your applications.

After implementing these examples, you should have a solid understanding of how to cancel requests in React applications. You can now choose the approach that best fits your needs and integrate it into your projects.

## Additional Resources

- [Axios Cancel Token Documentation](https://axios-http.com/docs/cancellation)
- [Fetch API AbortController Documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [React Query Documentation](https://react-query.tanstack.com/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [JavaScript Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JavaScript Promises Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [JavaScript Async/Await Documentation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
- [JavaScript Error Handling Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [JavaScript Fetch API Error Handling](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#handling_errors)
- [JavaScript Fetch API Cancellation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#fetch)
