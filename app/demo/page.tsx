import DemoShell from "@/components/demo/DemoShell";

export default function DemoPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  return <DemoShell initialTab={searchParams.tab ?? "tryon"} />;
}
