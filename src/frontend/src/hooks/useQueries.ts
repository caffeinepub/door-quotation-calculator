import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CoatingType } from '../backend';

export function useGetCoatingRate(coatingType: CoatingType) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['coatingRate', coatingType],
    queryFn: async () => {
      if (!actor) return null;
      const rate = await actor.getCoatingRate(coatingType);
      return Number(rate);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetAllCoatingRates() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allCoatingRates'],
    queryFn: async () => {
      if (!actor) return null;
      const [single, double_, doubleSagwanpatti, laminate] = await Promise.all([
        actor.getSingleRate(),
        actor.getDoubleRate(),
        actor.getDoubleSagwanpattiRate(),
        actor.getLaminateRate(),
      ]);
      return {
        [CoatingType.single]: Number(single),
        [CoatingType.double_]: Number(double_),
        [CoatingType.doubleSagwanpatti]: Number(doubleSagwanpatti),
        [CoatingType.laminate]: Number(laminate),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateCoatingRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ coatingType, rate }: { coatingType: CoatingType; rate: number }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.updateCoatingRate(coatingType, BigInt(rate));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCoatingRates'] });
      queryClient.invalidateQueries({ queryKey: ['coatingRate'] });
    },
  });
}

// Legacy aliases kept for backward compatibility (unused but safe to keep)
export const useGetAllRates = useGetAllCoatingRates;
export const useAddRate = () => ({ mutateAsync: async () => {}, isPending: false });
export const useUpdateRate = useUpdateCoatingRate;
