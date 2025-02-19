export default function ProfileLayout({ children }) {
  return (
    <>
      <section className="max-w-screen-xl overflow-hidden mx-auto">
        {children}
      </section>
    </>
  );
}
