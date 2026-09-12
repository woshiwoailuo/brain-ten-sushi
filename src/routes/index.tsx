import { createFileRoute } from "@tanstack/react-router";
import { BrainApp } from "@/components/brain-app";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { pk?: string } => ({
    pk: typeof search.pk === "string" && search.pk.length > 0 ? search.pk : undefined,
  }),
  component: Home,
});

function Home() {
  const { pk } = Route.useSearch();
  return <BrainApp pk={pk} />;
}
