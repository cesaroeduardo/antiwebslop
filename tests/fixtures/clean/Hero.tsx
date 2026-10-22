import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="grid gap-12 px-6 py-24 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h1 className="font-display text-5xl tracking-tight text-balance">Spin a random Path of Exile 2 build.</h1>
        <a href="/spin" className="rounded-md bg-accent px-5 py-3 transition-colors focus-visible:ring-2 motion-safe:animate-[rise_.3s_ease-out]">
          Spin the wheel <ArrowRight aria-hidden />
        </a>
      </div>
    </section>
  );
}
