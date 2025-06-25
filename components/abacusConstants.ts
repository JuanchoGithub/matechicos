export type PlaceValue = 'um' | 'c' | 'd' | 'u';

export const PLACE_VALUES_ORDER: PlaceValue[] = ['um', 'c', 'd', 'u'];

export const ROD_CONFIG: Record<PlaceValue, { label: string, color: string, beadColor: string }> = {
    um: { label: 'UM', color: 'bg-red-500', beadColor: 'bg-red-700' },
    c: { label: 'C', color: 'bg-blue-500', beadColor: 'bg-blue-700' },
    d: { label: 'D', color: 'bg-green-500', beadColor: 'bg-green-700' },
    u: { label: 'U', color: 'bg-yellow-500', beadColor: 'bg-yellow-700' },
};
