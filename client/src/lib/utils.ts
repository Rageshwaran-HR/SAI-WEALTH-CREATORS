import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    role: "IT Professional, Bangalore",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Sai Wealth Creators has been instrumental in helping me plan for retirement. Their expert advice and personalized approach made all the difference."
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Business Owner, Mumbai",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "I appreciate the transparent approach to fees and investment options. My portfolio has consistently outperformed my expectations thanks to their guidance."
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Doctor, Delhi",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    quote: "The team at Sai Wealth Creators helped me navigate complex tax implications while maximizing my investment returns. Highly recommended!"
  }
];

export const features = [
  {
    id: 1,
    title: "Expert Advisors",
    description: "Our team of certified financial advisors brings decades of market experience to your portfolio.",
    icon: "chart-line"
  },
  {
    id: 2,
    title: "Personalized Strategy",
    description: "Customized investment plans tailored to your financial goals, risk tolerance, and time horizon.",
    icon: "hand-holding-usd"
  },
  {
    id: 3,
    title: "Transparent Process",
    description: "Clear fee structure with no hidden charges and complete transparency in all our services.",
    icon: "shield-alt"
  },
  {
    id: 4,
    title: "Regular Reviews",
    description: "Ongoing portfolio monitoring and regular review meetings to keep your investments on track.",
    icon: "sync-alt"
  }
];

export const newsItems = [
  {
    id: 1,
    title: "How Recent Policy Changes Affect Your Investment Strategy",
    excerpt: "An analysis of the latest financial policies and their implications for investors in the current market conditions.",
    category: "Market Analysis",
    date: "June 15, 2023",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    slug: "policy-changes-investment-strategy"
  },
  {
    id: 2,
    title: "Top 5 Mutual Funds to Consider for Long-Term Growth",
    excerpt: "Discover the best performing mutual funds that offer potential for substantial long-term returns with managed risk.",
    category: "Investment Strategy",
    date: "June 8, 2023",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80",
    slug: "top-mutual-funds-long-term-growth"
  },
  {
    id: 3,
    title: "Essential Tax-Saving Strategies for the New Financial Year",
    excerpt: "Learn how to optimize your tax liabilities while maximizing your investment returns with these expert strategies.",
    category: "Tax Planning",
    date: "June 1, 2023",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    slug: "tax-saving-strategies-financial-year"
  }
];

export const contactInfo = {
  address: "5th Floor, Prestige Tower, MG Road, Bangalore - 560001, Karnataka, India",
  emails: ["info@vismayamcapital.com", "support@vismayamcapital.com"],
  phones: ["+91 80 4567 8900", "+91 98765 43210"],
  hours: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00 PM"],
  location: {
    lat: 12.9716,
    lng: 77.5946
  }
};
