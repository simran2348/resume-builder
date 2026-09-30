export default function Background() {
  return (
    <>
      {/* Dotted background */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--brand-blue-glow) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top blue gradient */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none -z-10 h-[500px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--brand-blue-glow), transparent)",
        }}
      />
    </>
  );
}
