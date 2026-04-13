import { 
  Snowflake, ThermometerSun, Tv, Lock, ShieldCheck, DoorOpen, Wifi, 
  Maximize, Refrigerator, Bath, Lightbulb, BedSingle, Layers, Sun, Moon, 
  ChefHat, Utensils, Flame, ConciergeBell, Coffee, Sparkles, Wind as WindIcon, 
  Droplets, ArrowUpDown, Accessibility, Brush, CheckCircle2 
} from 'lucide-react';

export const ROOM_AMENITIES = [
  { id: 'aire_acondicionado', label: 'Aire Acondicionado', icon: Snowflake },
  { id: 'calefaccion', label: 'Calefacción', icon: ThermometerSun },
  { id: 'tv_50', label: "TV Smart (50')", icon: Tv },
  { id: 'tv_55', label: "TV Smart (55')", icon: Tv },
  { id: 'tv_65', label: "TV Smart (65')", icon: Tv },
  { id: 'tv_70', label: "TV Smart (70')", icon: Tv },
  { id: 'cerradura', label: 'Cerradura', icon: Lock },
  { id: 'caja_seguridad', label: 'Caja de Seguridad', icon: ShieldCheck },
  { id: 'armario', label: 'Armario', icon: DoorOpen },
  { id: 'wifi_5g', label: 'Wi-Fi 5G', icon: Wifi },
  { id: 'espejo_grande', label: 'Espejo Grande', icon: Maximize },
  { id: 'nevera_privada', label: 'Nevera Privada', icon: Refrigerator },
  { id: 'bano_suite', label: 'Baño en Suite', icon: Bath },
  { id: 'iluminacion_regulable', label: 'Ilum. Ambiental Regulable', icon: Lightbulb },
  { id: 'sabanas_ilimitadas', label: 'Sábanas Ilimitadas', icon: BedSingle },
  { id: 'toallas_ilimitadas', label: 'Toallas Ilimitadas', icon: Layers },
  { id: 'mantas', label: 'Mantas', icon: Layers },
  { id: 'habitacion_exterior', label: 'Habitación Exterior', icon: Sun },
  { id: 'habitacion_interior', label: 'Habitación Interior', icon: Moon },
];

export const GENERAL_AMENITIES = [
  { id: 'cocina_completa', label: 'Cocina Completa', icon: ChefHat },
  { id: 'utensilios_cocina', label: 'Utensilios de Cocina', icon: Utensils },
  { id: 'microondas', label: 'Microondas', icon: Refrigerator },
  { id: 'air_fryer', label: 'Air Fryer', icon: Flame },
  { id: 'arrocera_electrica', label: 'Arrocera Eléctrica', icon: ConciergeBell },
  { id: 'batidora', label: 'Batidora', icon: Coffee },
  { id: 'lavadora', label: 'Lavadora', icon: Sparkles },
  { id: 'secadora', label: 'Secadora', icon: WindIcon },
  { id: 'productos_limpieza', label: 'Productos Limpieza', icon: Sparkles },
  { id: 'agua_caliente', label: 'Agua Caliente', icon: Droplets },
  { id: 'ascensor', label: 'Ascensor', icon: ArrowUpDown },
  { id: 'acceso_minusvalidos', label: 'Acceso Minusválidos', icon: Accessibility },
  { id: 'limpieza_diaria', label: 'Limpieza Diaria Zonas', icon: Brush },
];

export const ALL_AMENITIES = [...ROOM_AMENITIES, ...GENERAL_AMENITIES];

export function getAmenity(id: string) {
  return ALL_AMENITIES.find(a => a.id === id) || { id, label: id, icon: CheckCircle2 };
}
