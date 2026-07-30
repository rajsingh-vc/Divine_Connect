import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

/**
 * Fetches the currently logged-in user.
 * Requires a backend endpoint that returns the current user, e.g. a DRF view at
 * /auth/me/ (adjust the path below if yours differs):
 *
 *   class MeView(APIView):
 *       permission_classes = [IsAuthenticated]
 *       def get(self, request):
 *           return Response({
 *               "id": request.user.id,
 *               "username": request.user.username,
 *               "email": request.user.email,
 *               "is_staff": request.user.is_staff,
 *           })
 */
export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/auth/me/");
        return data;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return { user, isLoading, isAuthenticated: !!user };
}