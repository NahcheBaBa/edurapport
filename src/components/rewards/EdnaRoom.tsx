import { Coins, Check, Lock } from "lucide-react";
import EdnaAvatar from "./EdnaAvatar";
import { SHOP_ITEMS, useRewards, type RoomItem } from "@/hooks/use-rewards";

const SLOTS: { key: RoomItem["slot"]; label: string }[] = [
  { key: "hat", label: "Hats" },
  { key: "accessory", label: "Accessories" },
  { key: "background", label: "Scenes" },
  { key: "companion", label: "Companions" },
];

const EdnaRoom = () => {
  const { state, buyItem, equipItem } = useRewards();

  return (
    <section aria-labelledby="edna-room-heading" className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] items-start">
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center">
        <h2 id="edna-room-heading" className="text-xl font-heading font-extrabold text-primary mb-4">
          Edna's Room
        </h2>
        <EdnaAvatar equipped={state.equipped} size="lg" />
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Spend coins to unlock outfits, scenes, and study buddies for Edna.
        </p>
      </div>

      <div className="space-y-6">
        {SLOTS.map((slot) => {
          const items = SHOP_ITEMS.filter((i) => i.slot === slot.key);
          const equippedId = state.equipped[slot.key];
          return (
            <div key={slot.key} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-heading font-extrabold uppercase tracking-wide text-foreground">
                  {slot.label}
                </h3>
                {equippedId && (
                  <button
                    onClick={() => equipItem(null, slot.key)}
                    className="text-xs font-semibold text-muted-foreground hover:text-primary"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item) => {
                  const owned = state.ownedItems.includes(item.id);
                  const equipped = equippedId === item.id;
                  const canAfford = state.coins >= item.price;
                  return (
                    <button
                      key={item.id}
                      onClick={() => (owned ? equipItem(item.id, slot.key) : buyItem(item.id))}
                      disabled={!owned && !canAfford}
                      aria-pressed={equipped}
                      className={`relative rounded-2xl border p-3 text-left transition-colors ${
                        equipped
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary/60"
                      } ${!owned && !canAfford ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="text-3xl" aria-hidden>
                        {item.emoji}
                      </div>
                      <div className="mt-1 text-xs font-bold text-foreground">{item.name}</div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        {owned ? (
                          <span className="inline-flex items-center gap-1 text-primary font-bold">
                            <Check className="h-3 w-3" aria-hidden />
                            {equipped ? "Worn" : "Owned"}
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              canAfford ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {canAfford ? (
                              <Coins className="h-3 w-3" aria-hidden />
                            ) : (
                              <Lock className="h-3 w-3" aria-hidden />
                            )}
                            {item.price}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EdnaRoom;
