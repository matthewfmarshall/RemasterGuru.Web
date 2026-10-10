import {
  catchNetworkFailure,
  type CreditsBalanceDto,
} from "@/src/lib/api";
import { createServerAppApiClient } from "@/src/lib/api/server-client";

async function loadCreditsBalance(): Promise<number | null> {
  const client = await createServerAppApiClient();
  const network = await catchNetworkFailure(() =>
    client.GET("/api/v1/credits/balance"),
  );
  if (!network.ok) {
    return null;
  }
  const { data, error, response } = network.result;
  if (error || !response.ok || !data) {
    return null;
  }
  const payload = data as unknown as CreditsBalanceDto;
  return payload.balance;
}

export async function AlbumsAccountCredits() {
  const balance = await loadCreditsBalance();
  if (balance === null) {
    return null;
  }

  const label =
    balance === 1 ? "1 remaster repair left (account)" : `${balance} remaster repairs left (account)`;

  return (
    <p className="mt-1 text-sm text-zinc-600">
      <span className="font-medium text-zinc-800">{label}</span>
    </p>
  );
}
