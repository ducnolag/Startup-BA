'use client';

import { useEffect, useRef } from 'react';
import {
  VOTE_SURVEY_URL,
  VOTE_TELEGRAM_URL,
  VOTE_TELEGRAM_HANDLE,
} from '@/lib/constants';
import { ArrowUpRight, ClipboardList, Send } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const hasSurvey = VOTE_SURVEY_URL.trim().length > 0;
const hasTelegram = VOTE_TELEGRAM_URL.trim().length > 0;

export default function VoteTool() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    const ctx = gsap.context(() => {
      // ── Left side slides in from left ──
      gsap.fromTo(
        left,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Right side slides in from right ──
      gsap.fromTo(
        right,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── CTA buttons stagger ──
      const buttons = right.querySelectorAll('a');
      if (buttons.length > 0) {
        gsap.fromTo(
          buttons,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            delay: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vote"
      className="py-20 md:py-28 bg-surface-muted border-y border-line"
    >
      <div className="container-page">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* LEFT — Title + description */}
          <div ref={leftRef} className="md:col-span-7" style={{ opacity: 0 }}>
            <span className="eyebrow mb-4 inline-flex">
              Cộng đồng quyết định
            </span>
            <h2
              className="font-display font-bold text-ink tracking-tight leading-[1.1] text-balance"
              style={{
                letterSpacing: '-0.03em',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              }}
            >
              Tool tiếp theo nên là gì? Bạn hãy đóng góp cho chúng mình nhé.
            </h2>
            <p className="mt-4 text-ink-muted text-sm md:text-base max-w-md">
              Chọn một trong hai cách bên cạnh — vài giây là xong, ý kiến
              của bạn sẽ được ghi nhận và phản hồi lại trên kênh cộng đồng.
            </p>
          </div>

          {/* RIGHT — CTA stack */}
          <div ref={rightRef} className="md:col-span-5" style={{ opacity: 0 }}>
            {(hasSurvey || hasTelegram) ? (
              <div className="flex flex-col gap-3">
                {hasSurvey && (
                  <a
                    href={VOTE_SURVEY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl bg-ink text-white px-5 py-4 hover:bg-ink/90 transition-colors"
                    style={{ opacity: 0 }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <ClipboardList className="h-4 w-4" />
                      </span>
                      <span className="text-left">
                        <span className="block font-semibold text-sm">
                          Điền khảo sát chọn tool
                        </span>
                        <span className="block text-xs text-white/60">
                          ~30 giây · 3 câu hỏi
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}

                {hasTelegram && (
                  <a
                    href={VOTE_TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl bg-white border border-line text-ink px-5 py-4 hover:border-line-strong transition-colors"
                    style={{ opacity: 0 }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-ink">
                        <Send className="h-4 w-4" />
                      </span>
                      <span className="text-left">
                        <span className="block font-semibold text-sm">
                          Nhắn Telegram
                        </span>
                        {VOTE_TELEGRAM_HANDLE ? (
                          <span className="block text-xs text-ink-subtle">
                            @{VOTE_TELEGRAM_HANDLE}
                          </span>
                        ) : (
                          <span className="block text-xs text-ink-subtle">
                            Chat trực tiếp với team
                          </span>
                        )}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}

                {/* small reassurance note */}
                <p className="mt-1 text-xs text-ink-subtle pl-1">
                  Cảm ơn bạn đã góp ý 💙
                </p>
              </div>
            ) : (
              /* Fallback: survey not yet open */
              <div className="rounded-2xl border border-line bg-white px-5 py-4">
                <div className="inline-flex items-center gap-2 text-sm text-ink-muted">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
                  </span>
                  Khảo sát &amp; kênh nhắn tin sẽ được mở sớm — quay lại sau nhé.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}