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
