import { PaginationCursorDto, UserProfileDto } from "@/lib/Api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import { HiveMimeComment } from "../../comment/hm-comment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

interface UserProfileCommentsProps {
  user: UserProfileDto;
}

export function UserProfileComments(props: UserProfileCommentsProps) {
  const router = useRouter();

  const data = useInfiniteQuery({
    queryKey: ['userComments', props.user.id],
    queryFn: async ({ pageParam }) => {
      const task = api.api.commentBrowseCreate({ pageSize: 20, cursor: pageParam }, { userId: props.user.id! });
      toast.promise(task, {
        loading: 'Loading comments...'
      });

      const response = await task;
      return response.data;
    },
    initialPageParam: undefined as PaginationCursorDto | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const comments = data.data?.pages.flatMap(p => p.items!) ?? [];

  return (
    <InfiniteScroll
      hasMore={data.hasNextPage}
      loader={<p>Loading...</p>}
      endMessage={<p className="text-center">No more comments.</p>}
      next={() => data.fetchNextPage()}
      dataLength={comments.length}>
      <div className="flex flex-col items-center gap-2 w-full">
        {comments.map(comment => (
          <Card key={comment.id} className="w-full">
            <CardHeader>
              <CardTitle>
                Commented on post
                <Button variant="link" className="p-0 px-2 h-auto" onClick={() => router.push(`/posts/view?postId=${comment.postId}`)}>
                  #{comment.postId}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HiveMimeComment comment={comment} isRoot={false} allowLoadParent={true} />
            </CardContent>
          </Card>
        ))}
      </div>
    </InfiniteScroll>
  );
}