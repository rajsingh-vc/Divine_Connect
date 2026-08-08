import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVideos, createVideo, deleteVideo, type CreateVideoPayload } from "@/api/video";

export function useVideoItems() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });

  const addMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (ids: number[]): Promise<void> => {
      await Promise.all(ids.map((id) => deleteVideo(id)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });

  return {
    items,
    isLoading,
    error: error as Error | null,
    addItem: (payload: CreateVideoPayload) => addMutation.mutateAsync(payload),
    removeItems: (ids: number[]) => removeMutation.mutateAsync(ids),
    isAdding: addMutation.isPending,
  };
}