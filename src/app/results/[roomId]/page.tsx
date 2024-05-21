import { useQuery } from "convex/react";
import { Check, Clock, Loader2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { getSession } from "../../../../lib";
import ResultsLayout from "@/widgets/Results/ui/ResultsLayout";

interface ResultsPageProps {
  params: {
    roomId: string;
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const session = await getSession();

  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  return <ResultsLayout session={sessionData} roomId={params.roomId} />;
}
