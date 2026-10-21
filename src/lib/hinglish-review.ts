export type Rating = 1 | 2 | 3 | 4 | 5;

export const TOPICS = [
  { id: "spare-part", label: "Spare part" },
  { id: "second-purchase", label: "Second time purchase" },
  { id: "first-purchase", label: "First time purchase" },
  { id: "staff-helpful", label: "Staff helpful" },
  { id: "tshirt-embroidery", label: "T-shirt embroidery" },
  { id: "good-quality", label: "Good quality" },
  { id: "fair-price", label: "Fair price" },
  { id: "quick-service", label: "Quick service" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

function tidy(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sentence(value: string): string {
  const text = tidy(value).replace(/[.!?]+$/g, "");
  if (!text) return "";
  const capped = text.charAt(0).toUpperCase() + text.slice(1);
  return `${capped}.`;
}

const LINES: Record<TopicId, Record<"high" | "mid" | "low", readonly string[]>> = {
  "spare-part": {
    high: [
      "Spare part jo chahiye tha woh mil gaya",
      "The spare part fit the machine properly",
      "Spare part genuine laga aur kaam kar gaya",
    ],
    mid: [
      "Spare part mil gaya, lekin thoda time laga",
      "Part sahi tha, fitting average rahi",
      "Spare part available tha, quality theek thi",
    ],
    low: [
      "Spare part ke liye aaya tha, sahi match nahi mila",
      "The spare part did not fit as expected",
      "Part late mila aur use karne mein problem aayi",
    ],
  },
  "second-purchase": {
    high: [
      "Ye meri second time purchase thi aur phir se satisfied hoon",
      "Doosri baar bhi same quality mili",
      "Second time aaya tha, experience pehle jaisa accha raha",
    ],
    mid: [
      "Second time purchase thi, is baar average raha",
      "Doosri baar aaya, pehle se thoda different laga",
      "Second visit theek tha, pehli baar zyada smooth thi",
    ],
    low: [
      "Second time purchase thi, is baar experience weak raha",
      "Doosri baar expectation poori nahi hui",
      "Pehli baar accha tha, second time nahi",
    ],
  },
  "first-purchase": {
    high: [
      "Pehli baar purchase kiya aur experience accha raha",
      "First time aaya tha, samajh aa gaya kya lena hai",
      "First purchase smooth rahi, dobara aa sakta hoon",
    ],
    mid: [
      "First time purchase thi, theek-thaak rahi",
      "Pehli baar aaya, kuch clear tha kuch nahi",
      "First visit average raha, dekhte hain next time",
    ],
    low: [
      "Pehli baar purchase kiya aur satisfied nahi hoon",
      "First time aaya tha, experience accha nahi raha",
      "First purchase confusing rahi aur result weak tha",
    ],
  },
  "staff-helpful": {
    high: [
      "Staff helpful thi aur option clearly samjha diya",
      "Staff ne patiently sahi cheez suggest ki",
      "Staff was helpful and did not rush the explanation",
    ],
    mid: [
      "Staff helpful thi, lekin answer thoda late mila",
      "Staff ne madad ki, detail thodi kam thi",
      "Staff was polite, guidance was only average",
    ],
    low: [
      "Staff se help chahiye thi, properly nahi mili",
      "Staff was not clear about the product",
      "Help mangne par response slow aur incomplete tha",
    ],
  },
  "tshirt-embroidery": {
    high: [
      "T-shirt embroidery clean thi aur stitching tight hai",
      "Embroidery ka kaam neat hai, design sahi jagah par hai",
      "T-shirt pe embroidery even hai aur kapda damage nahi hua",
    ],
    mid: [
      "T-shirt embroidery theek hai, thodi uneven lagi",
      "Embroidery ho gayi, finish average hai",
      "Design aa gaya, stitching could have been cleaner",
    ],
    low: [
      "T-shirt embroidery expected jaisi nahi aayi",
      "Embroidery uneven hai aur thread loose laga",
      "Design shift ho gaya tha, dobara theek karwana pada",
    ],
  },
  "good-quality": {
    high: [
      "Quality acchi thi aur product solid laga",
      "Material quality good hai, use karne layak hai",
      "Quality pe complaint nahi hai",
    ],
    mid: [
      "Quality theek hai, outstanding nahi",
      "Product usable hai, quality average lagi",
      "Quality acceptable thi, thodi better expect ki thi",
    ],
    low: [
      "Quality weak lagi",
      "Product quality expectation se neeche thi",
      "Material accha nahi laga",
    ],
  },
  "fair-price": {
    high: [
      "Price fair lagi, zyada mehnga nahi laga",
      "Rate reasonable tha for the quality",
      "Paise ke hisaab se sahi deal rahi",
    ],
    mid: [
      "Price theek thi, thodi negotiation expect thi",
      "Rate average laga, na sasta na zyada",
      "Price acceptable hai, great deal nahi",
    ],
    low: [
      "Price zyada lagi quality ke hisaab se",
      "Rate expected se high tha",
      "Paise ke hisaab se value nahi mili",
    ],
  },
  "quick-service": {
    high: [
      "Kaam time pe ho gaya",
      "Service quick thi, zyada wait nahi karna pada",
      "Order jaldi ready mil gaya",
    ],
    mid: [
      "Service theek time pe hui, thoda wait hua",
      "Kaam ho gaya, speed average thi",
      "Thodi der lagi, phir bhi manage ho gaya",
    ],
    low: [
      "Service slow thi aur wait lamba ho gaya",
      "Kaam time pe complete nahi hua",
      "Ready hone mein bahut time lag gaya",
    ],
  },
};

function band(rating: Rating): "high" | "mid" | "low" {
  if (rating >= 4) return "high";
  if (rating === 3) return "mid";
  return "low";
}

function opening(name: string, rating: Rating, rng: Rng): string {
  if (rating >= 5) {
    return pick(rng, [
      `${name} pe experience accha raha`,
      `I had a good experience at ${name}`,
      `${name} se purchase karke satisfied hoon`,
    ]);
  }
  if (rating === 4) {
    return pick(rng, [
      `${name} pe experience mostly accha raha`,
      `${name} se liya, overall sahi raha`,
      `I would visit ${name} again`,
    ]);
  }
  if (rating === 3) {
    return pick(rng, [
      `${name} pe experience average raha`,
      `${name} theek tha, kuch points better ho sakte the`,
      `My visit to ${name} was okay`,
    ]);
  }
  if (rating === 2) {
    return pick(rng, [
      `${name} pe experience expected se kam raha`,
      `I was not fully satisfied at ${name}`,
      `${name} se purchase ke baad khush nahi hoon`,
    ]);
  }
  return pick(rng, [
    `${name} pe experience accha nahi raha`,
    `I would not repeat this purchase at ${name}`,
    `${name} se is baar satisfaction nahi mila`,
  ]);
}

function closing(rating: Rating, rng: Rng): string {
  if (rating >= 5) {
    return pick(rng, [
      "Main dobara yahin se lunga",
      "I can recommend this place",
      "Next time bhi yahi choose karunga",
    ]);
  }
  if (rating === 4) {
    return pick(rng, ["Phir se aa sakta hoon", "A reasonable place to buy from", "Mostly satisfied hoon"]);
  }
  if (rating === 3) {
    return pick(rng, [
      "Expectation moderate rakhni chahiye",
      "Theek hai, strongly recommend nahi karunga",
      "Dobara depends karega kya chahiye",
    ]);
  }
  return pick(rng, [
    "Abhi recommend nahi karunga",
    "Next time pehle options check karunga",
    "Is baar experience weak raha",
  ]);
}

export function composeHinglishReview(input: {
  businessName: string;
  topics: TopicId[];
  rating: Rating;
  seed: number;
}): string {
  const name = tidy(input.businessName) || "this shop";
  const rng = mulberry32(input.seed || 1);
  const level = band(input.rating);
  const topics = input.topics.filter((topic, index) => input.topics.indexOf(topic) === index);

  const parts = [opening(name, input.rating, rng)];
  const ordered = [...topics];
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    const current = ordered[index];
    ordered[index] = ordered[swap];
    ordered[swap] = current;
  }
  for (const topic of ordered) {
    parts.push(pick(rng, LINES[topic][level]));
  }
  if (ordered.length === 0) {
    parts.push(
      input.rating >= 4
        ? "Jo chahiye tha woh mil gaya"
        : input.rating === 3
          ? "Visit normal raha"
          : "Jo chahiye tha woh properly nahi mila",
    );
  }
  parts.push(closing(input.rating, rng));

  const seen = new Set<string>();
  const sentences: string[] = [];
  for (const part of parts) {
    const line = sentence(part);
    const key = line.toLowerCase();
    if (!line || seen.has(key)) continue;
    seen.add(key);
    sentences.push(line);
  }
  return sentences.join(" ");
}
