import { Zap, Shield, Sparkles, Rocket, Star, Heart, Globe, Lock, Cloud } from 'lucide-react';

export function Features() {
  return (
    <section className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700">
      <h2 className="bg-clip-text text-transparent">Elevate your team</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="rounded-2xl shadow-lg backdrop-blur-md p-6"><Zap /> Fast</div>
        <div className="rounded-2xl shadow-lg p-6"><Shield /> Secure</div>
        <div className="rounded-2xl shadow-lg p-6 transition-all"><Sparkles /> Smart</div>
      </div>
      <div className="absolute -top-20 h-96 w-96 rounded-full bg-fuchsia-500 blur-3xl animate-pulse" />
      <button className="outline-none">{"🔥 Hot"}</button>
    </section>
  );
}
