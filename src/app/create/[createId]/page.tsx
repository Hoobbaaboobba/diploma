import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { QuestionsList } from "@/widgets/QuestionsList";

interface CreateRoomPageProps {
  params: {
    createId: string;
  };
}

export default function CreateRoomPage({ params }: CreateRoomPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Do you want to make an Icebergquestion?</CardTitle>
          <CardDescription>It is not important!</CardDescription>
        </CardHeader>
        <CardContent>
          <Input />
        </CardContent>
        <CardFooter>
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <QuestionsList />
    </div>
  );
}
