import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Starting database seed process...");
    
    // Seed services
    console.log("Seeding services...");
    const services = [
      {
        slug: "mutual-funds",
        title: "Mutual Funds",
        shortDescription: "Diversified investment options with professional management to help you achieve your financial goals.",
        longDescription: "Our mutual fund advisory services provide access to a wide range of funds across various asset classes, risk profiles, and investment objectives. We help you select the right funds based on your financial goals and risk tolerance, whether you're looking for growth, income, or a balanced approach. Our team continuously monitors fund performance and makes recommendations to optimize your portfolio.",
        image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
        icon: "chart-line",
        featured: true
      },
      {
        slug: "portfolio-management",
        title: "Portfolio Management",
        shortDescription: "Personalized investment strategies managed by expert advisors to optimize returns and manage risk.",
        longDescription: "Our portfolio management services provide customized investment strategies designed to meet your specific financial goals. Our team of experienced portfolio managers actively monitors and adjusts your investments to optimize returns while managing risk. We focus on creating a diversified portfolio that aligns with your risk tolerance and time horizon, incorporating a mix of asset classes to maximize growth potential and minimize volatility.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        icon: "chart-pie",
        featured: true
      },
      {
        slug: "alternative-investments",
        title: "Alternative Investments",
        shortDescription: "Access to unique investment opportunities beyond traditional assets for portfolio diversification.",
        longDescription: "Our alternative investment services provide access to non-traditional asset classes such as private equity, hedge funds, real estate, and structured products. These investments can provide diversification benefits and potentially higher returns compared to traditional investments. Our team conducts thorough due diligence on alternative investment options to ensure they meet our stringent criteria for quality, risk, and return potential.",
        image: "https://images.unsplash.com/photo-1607944024060-0450380ddd33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        icon: "building",
        featured: true
      },
      {
        slug: "insurance",
        title: "Insurance Solutions",
        shortDescription: "Comprehensive protection for life, health, and assets to secure your family's financial future.",
        longDescription: "Our insurance advisory services help you navigate the complex world of insurance products. We analyze your needs and recommend appropriate life, health, and general insurance policies to ensure comprehensive protection for you and your family. We work with leading insurance providers to offer a wide range of options at competitive rates, focusing on policies that provide optimal coverage for your specific circumstances.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        icon: "shield-alt",
        featured: false
      },
      {
        slug: "tax-advisory",
        title: "Tax Advisory",
        shortDescription: "Strategic tax planning and compliance services to optimize your financial decisions and investments.",
        longDescription: "Our tax advisory services help you navigate the complex tax landscape to ensure compliance while minimizing your tax burden. We provide strategic advice on tax-efficient investment strategies, retirement planning, and estate planning. Our team stays updated on the latest tax laws and regulations to help you take advantage of available deductions, credits, and exemptions, ultimately maximizing your after-tax returns.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        icon: "file-invoice",
        featured: false
      },
      {
        slug: "retirement-planning",
        title: "Retirement Planning",
        shortDescription: "Comprehensive retirement strategies to ensure financial security and peace of mind in your golden years.",
        longDescription: "Our retirement planning services help you prepare for a financially secure retirement. We analyze your current financial situation, estimate your future needs, and develop a comprehensive strategy to help you achieve your retirement goals. This includes determining the optimal savings rate, investment allocation, and withdrawal strategy to ensure your money lasts throughout retirement, while also planning for contingencies such as healthcare expenses and inflation.",
        image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        icon: "umbrella-beach",
        featured: false
      }
    ];

    for (const service of services) {
      // Check if service already exists
      const existingService = await db.query.services.findFirst({
        where: eq(schema.services.slug, service.slug)
      });

      if (!existingService) {
        await db.insert(schema.services).values(service);
        console.log(`Service "${service.title}" added successfully`);
      } else {
        console.log(`Service "${service.title}" already exists, skipping`);
      }
    }
    
    // Seed testimonials
    console.log("Seeding testimonials...");
    const testimonials = [
      {
        name: "Rajesh Sharma",
        role: "IT Professional, Bangalore",
        quote: "Sai Wealth Creators has been instrumental in helping me plan for retirement. Their expert advice and personalized approach made all the difference.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        featured: true
      },
      {
        name: "Priya Patel",
        role: "Business Owner, Mumbai",
        quote: "I appreciate the transparent approach to fees and investment options. My portfolio has consistently outperformed my expectations thanks to their guidance.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        featured: true
      },
      {
        name: "Vikram Singh",
        role: "Doctor, Delhi",
        quote: "The team at Sai Wealth Creators helped me navigate complex tax implications while maximizing my investment returns. Highly recommended!",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        featured: true
      },
      {
        name: "Ananya Reddy",
        role: "Software Engineer, Hyderabad",
        quote: "Their mutual fund recommendations have consistently performed well. I appreciate the regular portfolio reviews and the detailed explanations of investment strategies.",
        image: "https://randomuser.me/api/portraits/women/22.jpg",
        featured: false
      },
      {
        name: "Rahul Khanna",
        role: "Corporate Executive, Chennai",
        quote: " Sai Wealth Creators's alternative investment options helped me diversify my portfolio effectively. Their expertise in this area is unmatched.",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        featured: false
      }
    ];

    for (const testimonial of testimonials) {
      // Check if testimonial already exists
      const existingTestimonial = await db.query.testimonials.findFirst({
        where: eq(schema.testimonials.name, testimonial.name)
      });

      if (!existingTestimonial) {
        await db.insert(schema.testimonials).values(testimonial);
        console.log(`Testimonial from "${testimonial.name}" added successfully`);
      } else {
        console.log(`Testimonial from "${testimonial.name}" already exists, skipping`);
      }
    }

    // Seed articles
    console.log("Seeding articles...");
    const articles = [
      {
        slug: "policy-changes-investment-strategy",
        title: "How Recent Policy Changes Affect Your Investment Strategy",
        excerpt: "An analysis of the latest financial policies and their implications for investors in the current market conditions.",
        content: `<p>India's financial landscape is constantly evolving, with recent policy shifts having far-reaching implications for investors across the spectrum. This article examines the latest changes and what they mean for your investment strategy.</p>
                 <h2>Key Policy Changes</h2>
                 <p>The Reserve Bank of India has recently adjusted its monetary policy stance, signaling a potential shift in interest rate trajectories. Additionally, the government has introduced new tax provisions that directly impact capital gains taxation and investment return calculations.</p>
                 <p>These changes come at a time when global economic uncertainties remain elevated, necessitating a careful reassessment of investment allocations and expected returns.</p>
                 <h2>Impact on Different Asset Classes</h2>
                 <p>Fixed Income: With the shifting interest rate environment, bonds and fixed deposits are experiencing significant repricing. Short-duration funds may offer better risk-adjusted returns in the coming quarters.</p>
                 <p>Equities: The revised capital gains tax structure brings new considerations for equity holding periods and realization strategies. Long-term investors should review their systematic withdrawal plans.</p>
                 <p>Alternative Investments: Real estate and structured products face new regulatory frameworks that alter their risk-return profiles and liquidity characteristics.</p>
                 <h2>Strategic Adjustments to Consider</h2>
                 <p>1. Review your asset allocation: The changing rate environment may warrant adjustments to your debt-equity balance.</p>
                 <p>2. Tax efficiency: Revisit your investment vehicles to ensure optimal tax efficiency under the new regime.</p>
                 <p>3. Risk management: Consider incorporating hedging strategies for volatile market segments.</p>
                 <p>4. Liquidity planning: Maintain adequate liquid investments to capitalize on emerging opportunities.</p>`,
        category: "Market Analysis",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        author: "Aditya Mehta",
        featured: true
      },
      {
        slug: "top-mutual-funds-long-term-growth",
        title: "Top 5 Mutual Funds to Consider for Long-Term Growth",
        excerpt: "Discover the best performing mutual funds that offer potential for substantial long-term returns with managed risk.",
        content: `<p>Investing in mutual funds remains one of the most accessible ways for individuals to participate in the growth of financial markets. This article highlights five mutual funds with strong track records and promising future potential.</p>
                 <h2>Selection Criteria</h2>
                 <p>Our selection process evaluates funds based on consistent performance across market cycles, fund manager experience, expense ratios, risk-adjusted returns, and alignment with long-term growth objectives.</p>
                 <h2>Top Recommendations</h2>
                 <h3>1. Axis Bluechip Fund</h3>
                 <p>This large-cap fund focuses on established companies with strong governance and competitive advantages. Its disciplined investment approach has delivered consistent returns with lower volatility compared to benchmark indices.</p>
                 <h3>2. HDFC Mid-Cap Opportunities Fund</h3>
                 <p>With its focus on quality mid-sized companies with growth potential, this fund has outperformed its category over 5, 7, and 10-year periods. The fund manager's stock selection skills have been particularly evident during market corrections.</p>
                 <h3>3. Parag Parikh Flexi Cap Fund</h3>
                 <p>This versatile fund invests across market capitalizations and maintains some international exposure, providing effective diversification. Its value-oriented approach has delivered strong risk-adjusted returns.</p>
                 <h3>4. SBI Small Cap Fund</h3>
                 <p>For investors with higher risk tolerance, this fund offers exposure to emerging companies with high growth potential. The management team's rigorous research process has led to several successful picks in undiscovered market segments.</p>
                 <h3>5. Kotak Emerging Equity Fund</h3>
                 <p>This fund targets companies transitioning from small to mid-cap status, often capturing significant value creation in the process. Its balanced sector allocation provides growth exposure with manageable volatility.</p>
                 <h2>Strategic Implementation</h2>
                 <p>Investors should consider these funds as part of a diversified portfolio, with allocation percentages aligned to individual risk tolerance and time horizons. Systematic investment plans (SIPs) remain the recommended approach for most investors to benefit from rupee cost averaging.</p>`,
        category: "Investment Strategy",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80",
        author: "Sanjay Kumar",
        featured: true
      },
      {
        slug: "tax-saving-strategies-financial-year",
        title: "Essential Tax-Saving Strategies for the New Financial Year",
        excerpt: "Learn how to optimize your tax liabilities while maximizing your investment returns with these expert strategies.",
        content: `<p>As we enter a new financial year, it's the perfect time to review and optimize your tax planning approach. Effective tax planning is not merely about reducing tax liability but integrating tax considerations into your broader financial strategy.</p>
                 <h2>Understanding the Tax Framework</h2>
                 <p>The current tax regime offers choices between the traditional system with deductions and the new simplified structure with lower base rates. Your optimal choice depends on income level, investment patterns, and available deductions.</p>
                 <h2>Section 80C Investments</h2>
                 <p>Maximizing your ₹1.5 lakh deduction under Section 80C remains fundamental to tax planning. While tax saving should not be the sole criterion for investment selection, several instruments offer both tax efficiency and solid returns:</p>
                 <ul>
                 <li>Equity-Linked Savings Schemes (ELSS): These mutual funds offer potential for capital appreciation with a relatively short 3-year lock-in period.</li>
                 <li>Public Provident Fund (PPF): A government-backed scheme with guaranteed returns and extended tax benefits.</li>
                 <li>National Pension System (NPS): Offers additional tax benefits beyond the 80C limit and creates retirement corpus.</li>
                 </ul>
                 <h2>Beyond Section 80C</h2>
                 <p>Several additional tax-saving avenues deserve consideration:</p>
                 <ul>
                 <li>Health Insurance Premiums (Section 80D): Deductions up to ₹25,000 for self and family, with additional benefits for senior citizens.</li>
                 <li>Home Loan Benefits: Interest payments qualify for deductions up to ₹2 lakh under Section 24(b).</li>
                 <li>Education Loan Interest (Section 80E): No upper limit on interest deduction for higher education loans.</li>
                 </ul>
                 <h2>Strategic Considerations</h2>
                 <p>1. Asset Location: Place tax-inefficient investments in tax-advantaged accounts where possible.</p>
                 <p>2. Harvest Losses: Strategically realize capital losses to offset gains and reduce tax liability.</p>
                 <p>3. Stagger Redemptions: Time investment redemptions to spread capital gains across tax years.</p>
                 <p>4. Family Planning: Consider distributing investments among family members to utilize individual exemption limits.</p>`,
        category: "Tax Planning",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        author: "Meena Iyer",
        featured: false
      }
    ];

    for (const article of articles) {
      // Check if article already exists
      const existingArticle = await db.query.articles.findFirst({
        where: eq(schema.articles.slug, article.slug)
      });

      if (!existingArticle) {
        await db.insert(schema.articles).values(article);
        console.log(`Article "${article.title}" added successfully`);
      } else {
        console.log(`Article "${article.title}" already exists, skipping`);
      }
    }

    // Seed FAQs
    console.log("Seeding FAQs...");
    const faqs = [
      {
        question: "What is the minimum investment amount?",
        answer: "The minimum investment amount varies depending on the specific investment product or service. For mutual funds, it can be as low as ₹500 for SIPs, while portfolio management services typically require a minimum of ₹25 lakhs.",
        category: "general",
        sortOrder: 1
      },
      {
        question: "How do your fees work?",
        answer: "We believe in transparent fee structures. Depending on the service, we may charge a percentage-based fee on assets under management or a fixed fee for specific advisory services. All fees are disclosed upfront before you make any investment.",
        category: "general",
        sortOrder: 2
      },
      {
        question: "How often will I receive updates on my investments?",
        answer: "We provide monthly performance reports and quarterly portfolio reviews. Additionally, you can access your portfolio information through our online portal at any time. For significant market events, we send special updates and recommendations.",
        category: "general",
        sortOrder: 3
      },
      {
        question: "Can I schedule a meeting before investing?",
        answer: "Absolutely! We encourage an initial consultation to understand your financial goals, risk tolerance, and time horizon. This helps us create a personalized investment strategy. You can schedule a free consultation using our contact form.",
        category: "general",
        sortOrder: 4
      },
      {
        question: "What types of mutual funds do you recommend?",
        answer: "We recommend funds based on your specific financial goals, risk tolerance, and time horizon. Our selections include equity funds (large, mid, and small cap), debt funds, balanced funds, and specialized thematic funds. We focus on funds with consistent performance, experienced fund managers, and reasonable expense ratios.",
        category: "mutual-funds",
        sortOrder: 1
      },
      {
        question: "What is the difference between active and passive investment strategies?",
        answer: "Active strategies involve fund managers who select investments aiming to outperform market indices. Passive strategies track market indices without active selection, typically offering lower fees. We can help you determine which approach or combination best suits your financial goals and preferences.",
        category: "portfolio-management",
        sortOrder: 1
      }
    ];

    for (const faq of faqs) {
      // Check if FAQ already exists
      const existingFaq = await db.query.faqs.findFirst({
        where: eq(schema.faqs.question, faq.question)
      });

      if (!existingFaq) {
        await db.insert(schema.faqs).values(faq);
        console.log(`FAQ "${faq.question.substring(0, 30)}..." added successfully`);
      } else {
        console.log(`FAQ "${faq.question.substring(0, 30)}..." already exists, skipping`);
      }
    }
    
    console.log("✅ Seed process completed successfully!");
  } catch (error) {
    console.error("❌ Seed process failed:", error);
  }
}

seed();
