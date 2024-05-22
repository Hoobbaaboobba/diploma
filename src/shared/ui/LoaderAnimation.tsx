import { Loader2 } from "lucide-react";
import { Skeleton } from "./skeleton";

export default function LoaderAnimation() {
  return (
    <div className="w-full container p-0 flex flex-col gap-10 justify-center items-center mt-10">
      <Skeleton className="w-full h-[202px]" />
      <Skeleton className="w-full h-[202px]" />
    </div>
  );
}
