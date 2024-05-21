import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import ResultQuestion from "./ResultQuestion";

interface ResultsListProps {
  roomId: string;
  userId: string;
  userName: string;
}

export default function ResultsList({
  roomId,
  userId,
  userName,
}: ResultsListProps) {
  const getQuestions = useQuery(api.questions.get, {
    roomId: roomId as Id<"Rooms">,
  });
  return getQuestions?.map((question, index) => (
    <div key={question._id}>
      <ResultQuestion
        index={index}
        roomId={roomId}
        questionId={question._id}
        questionContent={question.content}
        userId={userId}
        userName={userName}
      />
    </div>
  ));
}
