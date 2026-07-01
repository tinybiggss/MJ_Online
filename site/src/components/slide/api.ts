/** Typed client helpers for the slide-fund endpoints. */
export interface PublicView {
  goal: number;
  raisedSelfReported: number;
  raisedConfirmed: number;
  count: number;
  recent: { amount: number; name: string; note: string; ts: number }[];
}

export async function fetchView(): Promise<PublicView> {
  const res = await fetch("/api/slide", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("Could not load the total.");
  return res.json();
}

export async function submitDonation(input: {
  amount: number;
  name?: string;
  note?: string;
}): Promise<PublicView> {
  const res = await fetch("/api/slide/donate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "Could not record your chip-in.");
  return data.view as PublicView;
}
