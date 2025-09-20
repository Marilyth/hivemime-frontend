import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostProps {
  title: string;
}

export default function HiveMimePost({ title }: PostProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add content here if needed */}
      </CardContent>
    </Card>
  );
}
