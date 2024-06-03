// Создаем кастомый хук, для того, чтобы постоянно не отлавливать ошибка и не писать одно и тоже

import { useMutation } from "convex/react";
import { useState } from "react";

export const useApiMutation = (mutationFnction: any) => {

  // Создаем состояние загрузки
  const [pending, setPending] = useState(false);

  // Вызываем стандартную функцию convex (useMutation), которая принемает функци
  const apiMutation = useMutation(mutationFnction);

  // Создаем функцию, которая принемает в себя другую функцию, делаем состояние загрузки и отлавливаем ошибки
  // и возвращаем результат
  const mutate = (payload: any) => {
    setPending(true);
    return apiMutation(payload)
      .finally(() => setPending(false))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    mutate,
    pending,
  };
};
