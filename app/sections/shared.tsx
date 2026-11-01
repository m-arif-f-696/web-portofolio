export const ASSET_PATH = "/assets";

export function SectionTitle({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: string;
}) {
  return (
    <header className="section-title">
      <p>{eyebrow}</p>
      <h2>{children}</h2>
    </header>
  );
}

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
