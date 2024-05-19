import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Check, Loader2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

interface IcebergQuestionProps {
  roomId: string;
  icebergQuestionContent: string;
}

export default function IcebergQuestion({
  roomId,
  icebergQuestionContent,
}: IcebergQuestionProps) {
  // Состояание, которое берется из инпута Iceberg question
  const [icebergValue, setIcebergValue] = useState("");

  // Сохранен ли iceberg question
  const [isSavedIceberg, setIsSavedIceberg] = useState(false);

  /*
    Здесь успользуем кастомный хук для создания Iceberg question, из которого мы вытаскиваем саму фунцию (mutate)
    И состояние загрузки (pending)
  */
  const { mutate, pending } = useApiMutation(api.rooms.createIcebergQuestion);

  // Создаем функцию, которая вызывается при сохранении Iceberg question
  function onSaveIceberg() {
    // Вызываем функцию, которую вытащили из useApiMutation выше
    mutate({
      roomId: roomId as Id<"Rooms">, // Чтобы typescript не переживал, с момощью as id<"Rooms" говорим, что уверены, какой тип будет у roomId>
      icebergQuestionContent: icebergValue, // icebergValue берется из useState сверху
    }).then(() => setIsSavedIceberg(true));
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Do you want to make an Icebergquestion?</CardTitle>
        <CardDescription>It is not important!</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Input
          onBlur={onSaveIceberg}
          disabled={pending}
          defaultValue={icebergQuestionContent}
          className={`${isSavedIceberg && icebergValue === icebergQuestionContent && "border-emerald-400"}`}
          onChange={(e) => setIcebergValue(e.target.value)}
        />
        {isSavedIceberg && icebergValue === icebergQuestionContent && (
          <div className="absolute text-sm flex justify-center items-center top-3 right-8">
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
