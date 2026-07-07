import ednaWave from "@/assets/edna-wave5.gif.asset.json";
import { SHOP_ITEMS, type RoomItem } from "@/hooks/use-rewards";

type Props = {
  equipped: Partial<Record<RoomItem["slot"], string>>;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { wrap: "w-32 h-32", edna: "w-24 h-24", emoji: "text-2xl" },
  md: { wrap: "w-56 h-56", edna: "w-40 h-40", emoji: "text-4xl" },
  lg: { wrap: "w-72 h-72 md:w-80 md:h-80", edna: "w-52 h-52 md:w-60 md:h-60", emoji: "text-5xl" },
};

const bySlot = (equipped: Props["equipped"], slot: RoomItem["slot"]) => {
  const id = equipped[slot];
  return id ? SHOP_ITEMS.find((i) => i.id === id) ?? null : null;
};

const bgTint: Record<string, string> = {
  "bg-forest": "from-emerald-100 to-emerald-50",
  "bg-space": "from-indigo-200 to-purple-100",
  "bg-beach": "from-amber-100 to-sky-100",
};

const EdnaAvatar = ({ equipped, size = "md" }: Props) => {
  const s = sizeMap[size];
  const hat = bySlot(equipped, "hat");
  const accessory = bySlot(equipped, "accessory");
  const bg = bySlot(equipped, "background");
  const pet = bySlot(equipped, "companion");
  const tint = bg ? bgTint[bg.id] ?? "from-muted to-background" : "from-muted to-background";

  return (
    <div
      className={`relative ${s.wrap} rounded-3xl overflow-hidden bg-gradient-to-br ${tint} border border-border flex items-end justify-center`}
    >
      {bg && (
        <span className="absolute top-2 right-2 text-xl opacity-70" aria-hidden>
          {bg.emoji}
        </span>
      )}
      <div className="relative">
        <img src={ednaWave.url} alt="Edna" className={`${s.edna} object-contain drop-shadow`} />
        {hat && (
          <span
            className={`absolute -top-2 left-1/2 -translate-x-1/2 ${s.emoji}`}
            aria-label={hat.name}
          >
            {hat.emoji}
          </span>
        )}
        {accessory && (
          <span
            className={`absolute top-1/3 -right-2 ${s.emoji}`}
            aria-label={accessory.name}
          >
            {accessory.emoji}
          </span>
        )}
      </div>
      {pet && (
        <span className={`absolute bottom-2 left-2 ${s.emoji}`} aria-label={pet.name}>
          {pet.emoji}
        </span>
      )}
    </div>
  );
};

export default EdnaAvatar;
