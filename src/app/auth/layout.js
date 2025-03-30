export default function AuthLayout({ children }) {
  return (
    <>
      <section className="max-w-(--breakpoint-xl) overflow-hidden mx-auto">{children}</section>
    </>
  );
}
