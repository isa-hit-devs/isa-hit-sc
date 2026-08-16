export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 pt-20 pb-12 sm:px-12 md:px-16 lg:px-24">
      {/* Decorative dot grids */}
      <div className="absolute left-8 top-8 grid grid-cols-6 gap-2 opacity-40">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        ))}
      </div>
      <div className="absolute bottom-8 right-8 grid grid-cols-6 gap-2 opacity-40">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        ))}
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full border border-blue-200/60" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      {/* Full screen flex content */}
      <div className="relative flex w-full flex-col items-center justify-center gap-6 sm:gap-8 md:flex-row md:gap-12 lg:gap-16">
        {/* Image */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 scale-110 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="relative h-60 w-60 overflow-hidden rounded-full border-8 border-white shadow-2xl sm:h-72 sm:w-72 md:h-88 md:w-88 lg:h-96 lg:w-96">
            <img
              src="/images/isa_hero.png"
              alt="ISA Automation Hero Visual"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center md:text-left">
          <h1 className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-7xl font-extrabold leading-none text-transparent sm:text-8xl md:text-9xl lg:text-[10rem]">
            ISA
          </h1>
          <p className="mt-4 text-2xl font-semibold leading-tight text-slate-800 sm:text-3xl md:text-4xl lg:text-5xl">
            International Society
            <br className="hidden md:block" /> of Automation
          </p>
          <p className="mt-4 text-base font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-lg md:text-xl">
            HIT Student Chapter
          </p>
        </div>
      </div>
    </section>
  );
}
