import { UserProfileDto } from "@/lib/Api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/contexts";
import { HiveMimeComment } from "../../comment/hm-comment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UserProfileCommentsProps {
  user: UserProfileDto;
}

export function UserProfileComments(props: UserProfileCommentsProps) {
  const router = useRouter();

  const {data} = useQuery({
    queryKey: ["userComments", props.user.id],
    queryFn: async () => {
      const task = api.api.commentBrowseCreate({}, { userId: props.user.id! });
      toast.promise(task, {
        loading: 'Loading user comments...'
      });
      const response = await task;
      return response.data;
    }
  });

  return (
    <div className="flex flex-col items-center gap-2 w-full">
        {data ? data.map(comment => (
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
        )) : <p>No comments found.</p>}
    </div>
  );
}