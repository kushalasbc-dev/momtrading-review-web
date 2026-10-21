"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { composeHinglishReview, TOPICS, type Rating, type TopicId } from "@/lib/hinglish-review";

function StarRatingBar({
  value,
  onChange,
}: {
  value: Rating;
  onChange: (value: Rating) => void;
}) {
  const [hover, setHover] = useState<Rating | null>(null);
  const shown = hover ?? value;

  function move(next: number) {
    onChange(Math.min(5, Math.max(1, next)) as Rating);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label id="rating-label">Rating</Label>
      <div className="flex items-center gap-3 rounded-lg border border-input bg-white px-2 py-1.5">
        <div
          role="radiogroup"
          aria-labelledby="rating-label"
          className="flex flex-1"
          onMouseLeave={() => setHover(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault();
              move(value + 1);
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault();
              move(value - 1);
            }
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= shown;
            const selected = star === value;
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                tabIndex={selected ? 0 : -1}
                className="flex h-10 flex-1 items-center justify-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                onMouseEnter={() => setHover(star as Rating)}
                onFocus={() => setHover(star as Rating)}
                onBlur={() => setHover(null)}
                onClick={() => onChange(star as Rating)}
              >
                <Star
                  aria-hidden
                  className={
                    filled
                      ? "size-7 fill-[#F5B800] text-[#F5B800]"
                      : "size-7 fill-transparent text-zinc-300"
                  }
                />
              </button>
            );
          })}
        </div>
        <span className="pr-2 text-sm font-medium text-neutral-700">{value}/5</span>
      </div>
    </div>
  );
}

const BUSINESS_NAME = "Mom Trading Company";
const GOOGLE_BUSINESS_LINK = "https://share.google/IVWpvg4b0PeemnYPv";

export function SimpleReview() {
  const [topics, setTopics] = useState<TopicId[]>([]);
  const [rating, setRating] = useState<Rating>(5);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    if (topics.length === 0) {
      setError("Choose at least one topic.");
      return;
    }
    setError("");
    setReview(
      composeHinglishReview({
        businessName: BUSINESS_NAME,
        topics,
        rating,
        seed: Math.floor(Math.random() * 1_000_000_000) + 1,
      }),
    );
    setCopied(false);
  }

  async function copyReview() {
    if (!review) return;
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-full bg-[#f4f6fb] text-[#111827]">
      <header className="border-b border-[#d9dff0] bg-white">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
          <img src="/mom-logo.webp" alt="Mom Trading" className="h-12 w-auto" />
          <div className="border-l border-[#d9dff0] pl-3">
            <h1 className="text-lg font-semibold leading-tight text-[#27315e]">Review generator</h1>
            <span className="mt-1 block h-0.5 w-10 bg-[#F5B800]" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl px-4 py-8">
      <p className="text-sm leading-6 text-[#4b5563]">
        Pick a topic, choose the stars, then generate a review for Mom Trading Company.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label id="topics-label">Topics</Label>
          <div role="group" aria-labelledby="topics-label" className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const selected = topics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  aria-pressed={selected}
                  className={
                    selected
                      ? "rounded-full border border-[#27315e] bg-[#27315e] px-3 py-1.5 text-sm text-white"
                      : "rounded-full border border-[#d9dff0] bg-white px-3 py-1.5 text-sm text-[#374151]"
                  }
                  onClick={() =>
                    setTopics((current) => {
                      const next = new Set(current);
                      const turningOn = !next.has(topic.id);
                      if (turningOn) next.add(topic.id);
                      else next.delete(topic.id);
                      if (turningOn && topic.id === "first-purchase") next.delete("second-purchase");
                      if (turningOn && topic.id === "second-purchase") next.delete("first-purchase");
                      return TOPICS.map((item) => item.id).filter((id) => next.has(id));
                    })
                  }
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        <StarRatingBar value={rating} onChange={setRating} />

        <Button
          type="button"
          className="h-10 w-full bg-[#27315e] text-white hover:bg-[#1f2749] sm:w-auto"
          onClick={generate}
        >
          Generate review
        </Button>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-box">Review</Label>
          <Textarea
            id="review-box"
            value={review}
            placeholder="Your review will show up here."
            className="min-h-48 text-base leading-7"
            onChange={(event) => setReview(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" variant="outline" className="h-10" onClick={copyReview} disabled={!review}>
            Copy review
          </Button>
          <span className="text-sm text-green-700" role="status" aria-live="polite">
            {copied ? "Copied!" : ""}
          </span>
        </div>

        <div className="rounded-lg border border-[#d9dff0] bg-white px-3 py-3">
          <p className="text-sm font-medium text-[#27315e]">Mom Trading on Google</p>
          <p className="mt-1 break-all text-sm text-[#4b5563]">{GOOGLE_BUSINESS_LINK}</p>
          <a
            href={GOOGLE_BUSINESS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#27315e] px-4 text-sm font-medium text-white hover:bg-[#1f2749] sm:w-auto"
          >
            Open Google Business page
          </a>
        </div>
      </div>
      </main>
    </div>
  );
}
