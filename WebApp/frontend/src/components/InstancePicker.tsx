import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInstanceNames } from "@/lib/api";
import { useRunStore } from "@/store/runStore";
import {
  CUSTOMERS, DEMAND, DEPOT, ROUTE_LENGTH,
  availableNumbers, buildInstance, parseInstance,
  type Choice, type Parts,
} from "@/lib/instances";

function Pick({ label, value, choices, onChange }: {
  label: string; value: string | undefined; choices: Choice[]; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <Select value={value ?? null} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full text-xs bg-background/50 h-8">
          <SelectValue placeholder="Choose...">
            {(v: string | null) => choices.find((c) => c.value === v)?.label ?? "Choose..."}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {choices.map((c) => (
            <SelectItem key={c.value} value={c.value} className="text-xs">{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function InstancePicker() {
  const instance = useRunStore((s) => s.settings.instance);
  const setSettings = useRunStore((s) => s.setSettings);

  const [all, setAll] = useState<string[] | null>(null);     
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typed, setTyped] = useState(instance);             

  useEffect(() => {
    getInstanceNames().then(setAll).catch((e: Error) => setLoadError(e.message));
  }, []);
  useEffect(() => setTyped(instance), [instance]);           

  const known = useMemo(() => new Set(all ?? []), [all]);
  const parts = parseInstance(instance);
  const numbers = parts && all ? availableNumbers(all, parts) : [];

  function change(patch: Partial<Parts>) {
    if (!parts || !all) return;
    const next = { ...parts, ...patch };
    const nums = availableNumbers(all, next);
    if (nums.length === 0) return;                          
    if (!nums.includes(next.num)) next.num = nums[0];       
    setSettings({ instance: buildInstance(next) });
  }

  // only accept names that really exist
  function onType(text: string) {
    setTyped(text);
    if (known.has(text)) setSettings({ instance: text });
  }
  const typedOk = typed === "" || known.has(typed) || all === null;

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium">Instance</Label>

      <div className="grid grid-cols-2 gap-2">
        <Pick label="Depot Position" value={parts?.depot} choices={DEPOT} onChange={(v) => change({ depot: v })} />
        <Pick label="Customers Positions" value={parts?.customers} choices={CUSTOMERS} onChange={(v) => change({ customers: v })} />
        <Pick label="Demand" value={parts?.demand} choices={DEMAND} onChange={(v) => change({ demand: v })} />
        <Pick label="Customers per truck" value={parts?.route} choices={ROUTE_LENGTH} onChange={(v) => change({ route: v })} />
        <Pick
          label="Number"
          value={parts ? String(parts.num) : undefined}
          choices={numbers.map((n) => ({ value: String(n), label: String(n).padStart(2, "0") }))}
          onChange={(v) => change({ num: Number(v) })}
        />
      </div>


      <div className="space-y-1">
        <Label htmlFor="instance" className="text-[11px] text-muted-foreground">Or type a name</Label>
        <Input
          id="instance"
          list="instance-names"
          value={typed}
          onChange={(e) => onType(e.target.value.trim())}
          autoComplete="off"
          aria-invalid={!typedOk}
          className="font-mono text-xs bg-background/50 h-8"
        />
        <datalist id="instance-names">
          {(all ?? []).map((n) => <option key={n} value={n} />)}
        </datalist>
        {!typedOk && <p className="text-[11px] text-destructive">No instance with this name.</p>}
        {loadError && <p className="text-[11px] text-destructive">{loadError}</p>}
      </div>
    </div>
  );
}