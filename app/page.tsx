'use client';

import { useState } from 'react';
import { AssistantChat } from '../components/assistant-chat';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Compass,
  Instagram,
  MapPin,
  Menu,
  Mountain,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

const images = {
  hero: 'https://images.pexels.com/photos/7214101/pexels-photo-7214101.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  coast: 'https://images.pexels.com/photos/15663631/pexels-photo-15663631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  cliff: 'https://images.pexels.com/photos/5216060/pexels-photo-5216060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  tandem: 'https://images.pexels.com/photos/39057821/pexels-photo-39057821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const packages = [
  {
    name: 'The First Leap',
    eyebrow: 'For the curious',
    description: 'A considered introduction to the view from above, with every detail taken care of.',
    features: ['Tandem jump with an instructor', 'Pre-flight briefing', 'Scenic flight over the coast'],
    accent: 'sand',
  },
  {
    name: 'The Full Send',
    eyebrow: 'Most loved',
    description: 'Our signature experience for those who want the whole story, from runway to horizon.',
    features: ['Everything in The First Leap', 'Jump-day photo moments', 'Extended coastal flight'],
    accent: 'orange',
  },
  {
    name: 'The Keepsake',
    eyebrow: 'For the memory makers',
    description: 'A private-feeling day designed to be remembered long after your feet touch down.',
    features: ['A personal jump-day host', 'Curated photo moments', 'Post-flight coastline toast'],
    accent: 'blue',
  },
];

const faqs = [
  ['Do I need previous experience?', 'Not at all. Our illustrative experience is designed around tandem skydiving, where a qualified instructor guides you through each stage. Final requirements and availability would be confirmed directly with the operator.'],
  ['What should I bring?', 'Come in comfortable clothes and closed-toe shoes, and bring a sense of adventure. Exact clothing, age, weight, weather, and arrival requirements are demo details for this prototype and would need to be confirmed.'],
  ['What happens if the weather changes?', 'Safety comes first. If conditions are not suitable, the operator would decide whether to delay or reschedule. This prototype does not include live weather or booking availability.'],
  ['Can I bring someone who is not jumping?', 'Spectators may be possible depending on the real location and operator. Please treat this as an experience question to confirm when the service is live.'],
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d67c4d]"><span className="h-px w-8 bg-[#d67c4d]" />{children}</p>;
}

function ImageCard({ src, alt, label, className = '' }: { src: string; alt: string; label: string; className?: string }) {
  return <div className={`group relative overflow-hidden rounded-[2rem] ${className}`}><img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#142c32]/65 via-transparent to-transparent" /><span className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">{label}</span></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="overflow-hidden bg-[#f7f4ee] text-[#17343a]">
      <nav className="absolute left-0 right-0 top-0 z-40 border-b border-white/15 text-white" aria-label="Main navigation">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5 lg:px-10">
          <a href="#top" className="group flex items-center gap-3" aria-label="Greedy Adventures home"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/50 transition group-hover:bg-white group-hover:text-[#17343a]"><Mountain size={17} strokeWidth={1.7} /></span><span className="font-display text-lg font-semibold tracking-tight">GREEDY<span className="text-[#e59a62]">.</span></span></a>
          <div className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.16em] md:flex"><a className="nav-link" href="#experience">Experience</a><a className="nav-link" href="#packages">Packages</a><a className="nav-link" href="#faq">Good to know</a><a className="nav-link" href="/knowledge">Knowledge view</a></div>
          <a href="#packages" className="hidden rounded-full bg-[#e88b50] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#e88b50]/20 transition hover:-translate-y-0.5 hover:bg-[#f2a269] md:block">Explore jumps <ArrowRight className="ml-2 inline" size={14} /></a>
          <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/30 p-2 md:hidden">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {menuOpen && <div className="mx-4 mb-4 rounded-2xl border border-white/15 bg-[#17343a]/95 p-4 backdrop-blur-xl md:hidden"><div className="flex flex-col gap-1 text-sm uppercase tracking-[0.16em]"><a onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10" href="#experience">Experience</a><a onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10" href="#packages">Packages</a><a onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10" href="#faq">Good to know</a><a onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10" href="/knowledge">Knowledge view</a></div></div>}
      </nav>

      <section id="top" className="relative min-h-[720px] bg-[#17343a] text-white lg:min-h-[820px]">
        <img src={images.hero} alt="Tandem skydivers flying above a bright coastline" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102b31]/95 via-[#17343a]/55 to-[#17343a]/15" /><div className="absolute inset-0 bg-gradient-to-t from-[#17343a]/80 via-transparent to-[#17343a]/15" />
        <div className="relative mx-auto flex min-h-[720px] max-w-[1320px] items-end px-6 pb-20 pt-40 lg:min-h-[820px] lg:px-10 lg:pb-28"><div className="max-w-3xl"><p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f1b37c]"><Compass size={16} /> Sea View Skydiving Experience</p><h1 className="font-display max-w-4xl text-6xl font-medium leading-[.94] tracking-[-0.05em] sm:text-7xl lg:text-[108px]">Feel small.<br /><em className="font-editorial font-normal text-[#f5b27d]">Live large.</em></h1><p className="mt-8 max-w-md text-base leading-7 text-white/75 lg:text-lg">Leave the ordinary at the door. Take the long way up, and meet the coastline from a different point of view.</p><div className="mt-9 flex flex-wrap items-center gap-4"><a href="#packages" className="rounded-full bg-[#e88b50] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:-translate-y-1 hover:bg-[#f2a269]">Find your jump <ArrowDownRight className="ml-2 inline" size={15} /></a><a href="#experience" className="group flex items-center gap-3 px-2 text-xs font-bold uppercase tracking-[0.15em] text-white/90">See the experience <span className="grid h-9 w-9 place-items-center rounded-full border border-white/40 transition group-hover:border-white group-hover:bg-white group-hover:text-[#17343a]"><Play size={12} fill="currentColor" /></span></a></div></div></div>
        <div className="absolute bottom-8 right-6 hidden items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55 lg:flex"><span className="h-px w-12 bg-white/40" />Scroll to explore</div>
      </section>

      <section id="experience" className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36"><div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><SectionLabel>The view from here</SectionLabel><h2 className="font-display max-w-xl text-5xl leading-[.98] tracking-[-0.045em] sm:text-6xl">Not just a jump.<br /><span className="font-editorial text-[#d67c4d]">A new perspective.</span></h2></div><div className="max-w-md lg:justify-self-end"><p className="text-lg leading-8 text-[#496168]">There is a particular kind of quiet that arrives above the clouds. Greedy Adventures is a demo experience built around the idea that the best stories begin just beyond your comfort zone.</p><a href="#faq" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d06e40] hover:text-[#17343a]">What to expect <ArrowRight size={15} /></a></div></div><div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><ImageCard src={images.coast} alt="Turquoise water meeting rugged coastal cliffs" label="01 / The coast" className="aspect-[.85] sm:aspect-[.8] lg:col-span-1" /><div className="flex flex-col justify-end rounded-[2rem] bg-[#e8ded0] p-7 sm:p-8"><span className="mb-12 text-[#d67c4d]"><Sparkles size={26} strokeWidth={1.5} /></span><h3 className="font-display text-3xl leading-none">A little<br />more alive.</h3><p className="mt-5 text-sm leading-6 text-[#496168]">For the moments that make the everyday feel brand new.</p></div><ImageCard src={images.tandem} alt="Tandem skydivers floating under a parachute" label="02 / The leap" className="aspect-[.85] sm:aspect-[.8] lg:col-span-1" /><div className="flex flex-col justify-between rounded-[2rem] bg-[#dce8e7] p-7 sm:p-8"><span className="text-[#297078]"><ShieldCheck size={27} strokeWidth={1.5} /></span><div><h3 className="font-display text-3xl leading-none">Guided<br />all the way.</h3><p className="mt-5 text-sm leading-6 text-[#496168]">The confidence to look out, breathe in, and enjoy the ride.</p></div></div></div></section>

      <section id="packages" className="bg-[#17343a] px-6 py-24 text-white lg:px-10 lg:py-32"><div className="mx-auto max-w-[1320px]"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><SectionLabel>Choose your altitude</SectionLabel><h2 className="font-display max-w-2xl text-5xl leading-[.97] tracking-[-0.045em] sm:text-6xl">Make a day of it.<br /><span className="font-editorial font-normal text-[#f1b37c]">Make it yours.</span></h2></div><p className="max-w-xs text-sm leading-6 text-white/60">Illustrative packages for this prototype. Details, inclusions, and pricing would be confirmed by the real operator.</p></div><div className="mt-14 grid gap-4 lg:grid-cols-3">{packages.map((item, index) => <article key={item.name} className={`package-card relative flex min-h-[430px] flex-col rounded-[1.75rem] p-7 sm:p-9 ${item.accent === 'orange' ? 'bg-[#e88b50] text-white' : item.accent === 'blue' ? 'bg-[#285961] text-white' : 'bg-[#f4ede4] text-[#17343a]'}`}><div className="flex items-start justify-between"><div><p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${item.accent === 'sand' ? 'text-[#d06e40]' : 'text-white/65'}`}>{item.eyebrow}</p><h3 className="mt-3 font-display text-3xl">{item.name}</h3></div><span className={`font-display text-4xl ${item.accent === 'sand' ? 'text-[#d8c8b8]' : 'text-white/25'}`}>0{index + 1}</span></div><p className={`mt-7 max-w-xs text-sm leading-6 ${item.accent === 'sand' ? 'text-[#496168]' : 'text-white/75'}`}>{item.description}</p><ul className={`mt-8 space-y-3 border-t pt-6 text-sm ${item.accent === 'sand' ? 'border-[#d9cbbb] text-[#496168]' : 'border-white/20 text-white/80'}`}>{item.features.map((feature) => <li key={feature} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e88b50]" />{feature}</li>)}</ul><a href="#contact" className={`mt-auto flex items-center justify-between border-t pt-5 text-xs font-bold uppercase tracking-[0.15em] ${item.accent === 'sand' ? 'border-[#d9cbbb] text-[#d06e40]' : 'border-white/20 text-white'}`}>View demo details <ArrowUpRight size={16} /></a></article>)}</div></div></section>

      <section className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36"><div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center"><div className="relative h-[500px] overflow-hidden rounded-[2rem] sm:h-[600px]"><img src={images.cliff} alt="Aerial view of waves meeting a green coastal cliff" loading="lazy" className="h-full w-full object-cover" /><div className="absolute left-5 top-5 rounded-full bg-[#f7f4ee]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#17343a]">The good kind of nervous</div><div className="absolute bottom-6 left-6 flex items-center gap-3 text-white"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e88b50]"><Star size={16} fill="currentColor" /></span><span className="text-xs font-semibold uppercase tracking-[0.14em]">Worth the butterflies</span></div></div><div className="lg:pl-12"><SectionLabel>Safety, without the sales pitch</SectionLabel><h2 className="font-display text-5xl leading-[.98] tracking-[-0.045em] sm:text-6xl">Adventure feels<br /><span className="font-editorial text-[#d67c4d]">better</span> when you feel ready.</h2><p className="mt-8 max-w-lg text-lg leading-8 text-[#496168]">Every real skydiving experience should begin with clear information, qualified guidance, and the freedom to ask questions. This prototype intentionally keeps operational details open for the future operator to confirm.</p><div className="mt-9 grid gap-5 sm:grid-cols-2"><div className="flex gap-3"><ShieldCheck className="shrink-0 text-[#d67c4d]" size={21} strokeWidth={1.5} /><div><h3 className="font-semibold">Guidance first</h3><p className="mt-1 text-sm leading-5 text-[#496168]">Instructor-led from briefing to landing.</p></div></div><div className="flex gap-3"><Clock3 className="shrink-0 text-[#d67c4d]" size={21} strokeWidth={1.5} /><div><h3 className="font-semibold">Time to arrive</h3><p className="mt-1 text-sm leading-5 text-[#496168]">A calm pace for a big moment.</p></div></div></div></div></div></section>

      <section id="faq" className="border-t border-[#d9d4cc] bg-[#eee9e1] px-6 py-24 lg:px-10 lg:py-32"><div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><SectionLabel>Good to know</SectionLabel><h2 className="font-display text-5xl leading-[.98] tracking-[-0.045em]">Questions,<br /><span className="font-editorial text-[#d67c4d]">answered.</span></h2><p className="mt-6 max-w-xs text-sm leading-6 text-[#496168]">A few helpful starting points for planning your first view from above.</p></div><div className="divide-y divide-[#d3cbc1] border-y border-[#d3cbc1]">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl font-medium marker:hidden"><span>{question}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#b9b0a5] transition group-open:rotate-180"><ChevronDown size={16} /></span></summary><p className="max-w-2xl pt-4 text-sm leading-7 text-[#496168]">{answer}</p></details>)}</div></div></section>

      <section id="contact" className="bg-[#e88b50] px-6 py-16 text-white lg:px-10"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Ready when you are</p><h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">The view is waiting.</h2></div><a href="#packages" className="group inline-flex items-center gap-3 self-start rounded-full bg-[#17343a] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-[#285961]">Explore the packages <ArrowRight size={15} className="transition group-hover:translate-x-1" /></a></div></section>

      <footer className="bg-[#17343a] px-6 py-12 text-white lg:px-10"><div className="mx-auto max-w-[1320px]"><div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><a href="#top" className="font-display text-xl font-semibold tracking-tight">GREEDY<span className="text-[#e59a62]">.</span></a><p className="mt-5 max-w-xs text-sm leading-6 text-white/55">A sea view skydiving experience concept for people who want a little more from their next day out.</p><div className="mt-5 flex items-center gap-2 text-xs text-white/50"><MapPin size={14} /> Coastal location · Demo</div></div><div><p className="footer-title">Explore</p><div className="footer-links"><a href="#experience">The experience</a><a href="#packages">Packages</a><a href="#faq">Good to know</a><a href="/knowledge">Knowledge view</a></div></div><div><p className="footer-title">Contact</p><div className="footer-links"><span>hello@example.com</span><span>+00 000 000 000</span><span>Demo details only</span></div></div><div><p className="footer-title">Follow along</p><a href="#top" aria-label="Instagram placeholder" className="mt-5 inline-flex rounded-full border border-white/20 p-3 transition hover:border-white"><Instagram size={17} /></a></div></div><div className="flex flex-col justify-between gap-4 pt-7 text-[10px] uppercase tracking-[0.15em] text-white/40 sm:flex-row"><span>© 2026 Greedy Adventures · Prototype</span><span>All operational details shown are illustrative</span></div></div></footer>

      <AssistantChat />
    </main>
  );
}
