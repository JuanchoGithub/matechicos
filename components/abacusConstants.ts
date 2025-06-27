
import { PlaceValueKey } from '../types'; // Import the unified type

// This is the full order as defined in types.ts. Components might use a subset.
export const PLACE_VALUES_ORDER_FROM_TYPES: PlaceValueKey[] = ['umillon', 'cmillon', 'dmillon', 'umil', 'cmil', 'dmil', 'um', 'c', 'd', 'u'];

// ROD_CONFIG now uses keys directly from types.ts's PlaceValueKey definition.
// 'cm' became 'cmil' (Centena de Millar)
// 'dm' became 'dmil' (Decena de Millar)
// 'um' (for Unidad de Millar) maps to 'um' from types.ts (assuming 'um' means U.de Millar in types.ts)
// 'umil' from types.ts is also available for "Unidad de Millar" if a distinction is needed.
export const ROD_CONFIG: Record<PlaceValueKey, { label: string; longLabel: string; color: string; beadColor: string }> = {
    umillon: { label: 'UMillón', longLabel: 'U. de Millón', color: 'bg-pink-600', beadColor: 'bg-pink-800' },
    cmillon: { label: 'CMillón', longLabel: 'C. de Millón', color: 'bg-rose-600', beadColor: 'bg-rose-800' },
    dmillon: { label: 'DMillón', longLabel: 'D. de Millón', color: 'bg-fuchsia-600', beadColor: 'bg-fuchsia-800' },
    
    cmil: { label: 'CMil', longLabel: 'C. de Millar', color: 'bg-purple-600', beadColor: 'bg-purple-800' },
    dmil: { label: 'DMil', longLabel: 'D. de Millar', color: 'bg-indigo-600', beadColor: 'bg-indigo-800' },
    umil: { label: 'UMil', longLabel: 'U. de Mil', color: 'bg-red-600', beadColor: 'bg-red-800' }, // Specific "Unidad de Mil"

    um: { label: 'UM', longLabel: 'U. de Millar', color: 'bg-red-500', beadColor: 'bg-red-700' }, // "Unidad de Millar" as 'um' from types.ts
    c: { label: 'C', longLabel: 'Centena', color: 'bg-blue-500', beadColor: 'bg-blue-700' },
    d: { label: 'D', longLabel: 'Decena', color: 'bg-green-500', beadColor: 'bg-green-700' },
    u: { label: 'U', longLabel: 'Unidad', color: 'bg-yellow-500', beadColor: 'bg-yellow-700' },
};

// Order for typical abacus display, filtering for keys present in ROD_CONFIG
// This helps ensure that if types.ts has more keys than ROD_CONFIG, we only use configured ones.
// Assuming typical abacus goes up to UMillón and down to Unidad.
export const PLACE_VALUES_ORDER_FOR_DISPLAY: PlaceValueKey[] = 
    ['umillon', 'cmil', 'dmil', 'um', 'c', 'd', 'u']
    .filter(key => key in ROD_CONFIG) as PlaceValueKey[];

// If 'umil' and 'um' are both meant to represent "Unidad de Millar" and should be displayed,
// the PLACE_VALUES_ORDER_FOR_DISPLAY and components using it would need to handle this.
// For now, 'um' from types.ts is used for "U. de Millar" in ROD_CONFIG.
// 'umil' is also in types.ts, if it's distinct and needed, ROD_CONFIG and display order should be updated.
// Based on current errors, focusing on cm -> cmil, dm -> dmil.
// The original abacus constants used 'um' for "U. de Millar". If types.ts `um` means "U. de Millar", that's a direct map.
// If `types.ts` `umil` means "U. de Millar", then `um` in abacus should map to `umil`.
// The type error wasn't about `um` vs `umil`, so let's assume `um` for "Unidad de Millar" is the intended mapping for now.
// This would mean data using `placeValuesToShow: ['um', 'c', 'd', 'u']` would still work.
// The crucial change is `cm` -> `cmil` and `dm` -> `dmil`.
