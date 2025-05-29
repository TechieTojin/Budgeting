export interface Testimonial {
  id: string;
  tipId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  savings: number;
  date: string;
  verified: boolean;
}

export const tipTestimonials: Testimonial[] = [
  {
    id: "t1",
    tipId: "bt1",
    userName: "Michael S.",
    rating: 5,
    text: "Zero-based budgeting completely transformed my finances. After three months, I found an extra $380 I was wasting on random purchases. Now I have purpose for every dollar.",
    savings: 380,
    date: "2023-12-15",
    verified: true
  },
  {
    id: "t2",
    tipId: "bt1",
    userName: "Jessica T.",
    rating: 5,
    text: "I was skeptical at first because it seemed like a lot of work, but the zero-based approach forced me to be intentional with my spending. Already saved over $400 in the first month!",
    savings: 410,
    date: "2024-02-03",
    verified: true
  },
  {
    id: "t3",
    tipId: "bt2",
    userName: "Robert K.",
    rating: 5,
    text: "The cash envelope system stopped my impulse buying completely. When the 'dining out' envelope is empty, I'm done for the month. Simple but incredibly effective!",
    savings: 285,
    date: "2024-01-22",
    verified: true
  },
  {
    id: "t4",
    tipId: "bt3",
    userName: "Amelia P.",
    rating: 5,
    text: "Using the debt avalanche method, I've already saved $870 in interest on my credit cards. The visualization of the decreasing balances keeps me motivated.",
    savings: 870,
    date: "2023-11-08",
    verified: true
  },
  {
    id: "t5",
    tipId: "bt4",
    userName: "Daniel M.",
    rating: 5,
    text: "I can't believe I wasn't maximizing my 401(k) match before! It took 15 minutes to update my contribution and now I'm getting an extra $2,400 per year from my employer.",
    savings: 2400,
    date: "2024-01-15",
    verified: true
  },
  {
    id: "t6",
    tipId: "bt5",
    userName: "Sophia L.",
    rating: 4,
    text: "The subscription audit was eye-opening. I found 6 subscriptions I had forgotten about and was able to negotiate better rates on my streaming services. Saving $22/month!",
    savings: 22,
    date: "2023-12-30",
    verified: true
  },
  {
    id: "t7",
    tipId: "bt6",
    userName: "Nathan R.",
    rating: 5,
    text: "The grocery shopping system works amazingly well. By planning meals around sales and using cashback apps, I've cut our monthly food budget by $165 without sacrificing quality.",
    savings: 165,
    date: "2024-02-10",
    verified: true
  },
  {
    id: "t8",
    tipId: "bt7",
    userName: "Olivia W.",
    rating: 4,
    text: "The no-spend challenge month was tough but eye-opening. I realized how much of my spending was purely habitual. Saved over $580 and developed better awareness of my triggers.",
    savings: 580,
    date: "2023-11-28",
    verified: true
  },
  {
    id: "t9",
    tipId: "bt8",
    userName: "William H.",
    rating: 5,
    text: "By following the utility optimization tips, I managed to reduce our electric bill by 22% and our internet bill by $15/month after a single phone call. Well worth the effort!",
    savings: 190,
    date: "2024-01-05",
    verified: true
  },
  {
    id: "t10",
    tipId: "bt9",
    userName: "Emma C.",
    rating: 5,
    text: "Strategic credit card usage has been a game-changer. I created a simple system for which card to use where, and I'm now earning over $340 more in cashback annually!",
    savings: 340,
    date: "2023-12-11",
    verified: true
  },
  {
    id: "t11",
    tipId: "bt10",
    userName: "James B.",
    rating: 5,
    text: "Micro-investing seemed insignificant at first, but after 8 months my round-ups and small weekly transfers have grown to over $840. It really adds up without feeling the pinch!",
    savings: 840,
    date: "2024-02-15",
    verified: true
  },
  {
    id: "t12",
    tipId: "1",
    userName: "Laura M.",
    rating: 5,
    text: "The 50/30/20 rule finally gave me a framework that works. I've been able to build my emergency fund while still enjoying life. Wish I had found this years ago!",
    savings: 295,
    date: "2024-01-20",
    verified: true
  },
  {
    id: "t13",
    tipId: "2",
    userName: "Tyler J.",
    rating: 5,
    text: "Automating my savings has been life-changing. I don't even think about it anymore, and my emergency fund has grown to $1,800 in just 6 months!",
    savings: 225,
    date: "2023-12-05",
    verified: true
  },
  {
    id: "t14",
    tipId: "3",
    userName: "Chloe B.",
    rating: 4,
    text: "The debt snowball method gave me the motivation I needed. Paying off my smallest debt first created momentum, and now I'm tackling the bigger ones with confidence.",
    savings: 380,
    date: "2024-01-18",
    verified: true
  },
  {
    id: "t15",
    tipId: "4",
    userName: "Vincent P.",
    rating: 5,
    text: "I never realized how much I was spending on takeout until I implemented the food expense reduction strategy. Meal planning has saved me over $130/month!",
    savings: 130,
    date: "2023-11-22",
    verified: true
  }
]; 