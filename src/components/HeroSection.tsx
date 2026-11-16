import { useState } from "react";
import { ArrowUpRight, Terminal } from "lucide-react";
import { CORE_CAPABILITIES, PROFILE } from "../data/kalyanData";

const HERO_PORTRAIT_SRC =
  "/assets/aistudio/file_00000000101c8211a5934cb71d9606fd_e8b3c8a1.png";

const CURIOSITY_NOTES = [
  "while (curious) { learn(); build(); ship(); }",
  "rag.retrieve(hybrid=True, rerank=True) -> grounded",
  "ollama.run('qwen2.5:7b') // zero cloud lock-in",
  "prototype -> github.com/kalyan870 -> production",
];

export default function HeroSection() {
  const [noteIdx, setNoteIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="top" className="bg-[#f4eff2]">
      <div className="editorial-wrap pt-10 md:pt-14 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr] gap-10 lg:gap-12 items-stretch">
          {/* Left Editorial Copy */}
          <div className="pb-10 lg:pb-14 flex flex-col justify-between">
            <div>
              <p className="font-mono-code text-[11px] font-semibold tracking-[0.08em] text-black/80 mb-5 flex items-center gap-2.5">
                <span className="inline-block w-2 h-2 bg-[#de4ba4]" aria-hidden="true" />
                <span>{PROFILE.roleLine}</span>
              </p>

              <h1
                className="text-[clamp(2.9rem,6.3vw,5.75rem)] font-extrabold leading-[0.96] tracking-[-0.055em] text-black mb-6"
                style={{ textWrap: "balance" }}
              >
                {PROFILE.name}
                <span className="text-[#9084ff]">.</span>
              </h1>

              <h2
                className="text-[clamp(1.5rem,2.35vw,2.15rem)] font-bold leading-[1.14] tracking-[-0.035em] text-black mb-5 max-w-xl"
                style={{ textWrap: "balance" }}
              >
                {PROFILE.headline}
              </h2>

              <p className="text-[16px] md:text-[17px] leading-[1.65] text-black/80 max-w-[510px] mb-7">
                {PROFILE.bio}
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 bg-black text-[#f4eff2] px-6 py-3.5 text-sm font-semibold border border-black hover:bg-[#9084ff] hover:text-black transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href="#resume"
                  className="inline-flex items-center gap-2 bg-[#dff247] text-black px-5 py-3.5 text-sm font-semibold border border-black hover:bg-[#9084ff] transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <span>Resume</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href="#writing"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-black border-b border-black pb-0.5 hover:text-[#4d3fab] hover:border-[#4d3fab] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Read my Substack</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Interactive curiosity.exe block matching reference */}
            <div className="mt-10 pt-6 border-t border-black/15 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={() => setNoteIdx((i) => (i + 1) % CURIOSITY_NOTES.length)}
                className="group text-left bg-white border border-black px-4 py-3 shadow-[4px_4px_0_#000] hover:bg-[#dff247] transition-colors duration-150 flex-1"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-mono-code text-[11px] font-semibold text-black inline-flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#de4ba4]" aria-hidden="true" />
                    curiosity.exe
                  </span>
                  <span className="font-mono-code text-[10px] text-black/60 group-hover:text-black">
                    Click to cycle
                  </span>
                </div>
                <code className="font-mono-code text-xs text-black block truncate">
                  {CURIOSITY_NOTES[noteIdx]}
                </code>
              </button>

              <div className="font-mono-code text-[11px] leading-snug text-black/75 shrink-0">
                <span className="block font-semibold text-black">still figuring things out.</span>
                <span>still building in public.</span>
              </div>
            </div>
          </div>

          {/* Right Stepped Violet Portrait Panel */}
          <div className="portrait-panel-cutout min-h-[460px] lg:min-h-[600px] px-6 pt-16 pb-0 flex items-end justify-center overflow-visible">
            {/* Pixel accents */}
            <div className="pixel-cluster-pink left-8 top-14" aria-hidden="true" />
            <div className="pixel-cluster-lime right-0 bottom-16" aria-hidden="true" />

            {/* Vertical label */}
            <span className="font-mono-code text-[10px] tracking-[0.14em] text-black/80 absolute right-4 top-6 [writing-mode:vertical-rl] z-10">
              AI &amp; FULL-STACK
            </span>

            {/* Portrait Image or Fallback */}
            {!imgFailed ? (
              <div className="relative z-10 w-full max-w-[390px] border-t border-x border-black bg-[#101418] overflow-hidden shadow-[6px_6px_0_#000]">
                <img
                  src={HERO_PORTRAIT_SRC}
                  alt="Portrait of Saragadam Kalyan, AI Engineer and Full-Stack Developer"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-[410px] lg:h-[515px] object-cover object-top"
                />
              </div>
            ) : (
              <div className="relative z-10 w-full h-[460px] lg:h-[580px] flex flex-col items-center justify-center bg-[#9084ff] p-8 text-center">
                <span className="font-mono-code text-xs tracking-widest text-black/80 mb-2">
                  PORTRAIT
                </span>
                <p className="text-3xl font-extrabold text-black tracking-tight">
                  Saragadam Kalyan
                </p>
              </div>
            )}

            {/* Offset Acid Lime Stamp */}
            <div className="absolute -left-2 sm:-left-6 bottom-14 z-20 bg-[#dff247] border border-black px-5 py-3.5 -rotate-3 shadow-[5px_5px_0_#000]">
              <strong className="block font-mono-code text-3xl md:text-4xl font-bold leading-none tabular-nums text-black">
                51+
              </strong>
              <span className="font-mono-code text-[10px] tracking-[0.08em] text-black uppercase">
                Public GitHub Repos
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-0 right-0 z-20 bg-black text-[#f4eff2] font-mono-code text-[10px] tracking-[0.06em] px-4 py-2.5">
              GITHUB.COM/KALYAN870 · INDIA
            </div>
          </div>
        </div>
      </div>

      {/* Black Credentials / Focus Bar directly below hero */}
      <div className="bg-black text-[#f4eff2] border-y border-black py-5 overflow-hidden">
        <div className="editorial-wrap flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <p className="font-mono-code text-[10px] tracking-[0.1em] text-[#9084ff] uppercase shrink-0">
            CORE STACK &amp; FOCUS
          </p>
          <div className="overflow-hidden flex-1">
            <div className="marquee-track flex items-center gap-8">
              {[...CORE_CAPABILITIES, ...CORE_CAPABILITIES].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="text-base md:text-lg font-semibold tracking-tight text-[#f4eff2] whitespace-nowrap inline-flex items-center gap-8"
                >
                  <span>{item}</span>
                  <span className="text-[#dff247] text-sm" aria-hidden="true">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
