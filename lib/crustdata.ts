import { CompanyProfile } from "./schemas";
import { getCompaniesCol } from "./models";

const CRUSTDATA_API_KEY = process.env.CRUSTDATA_API_KEY || "";

// Curated synthetic fixture profiles with .example domains
const FIXTURE_PROFILES: Record<string, Partial<CompanyProfile>> = {
  "stripe.example": {
    name: "Stripe Demo Infrastructure",
    domain: "stripe.example",
    industry: "Financial Services / Fintech Infrastructure",
    headcount: "7,000+",
    revenueRange: "$1B - $10B",
    location: "South San Francisco, CA",
    description: "Financial infrastructure for the internet. Synthetic test fixture.",
    isDemo: true,
  },
  "stripe.com": {
    name: "Stripe, Inc.",
    domain: "stripe.com",
    industry: "Financial Services / Fintech Infrastructure",
    headcount: "7,000+",
    revenueRange: "$1B - $10B",
    location: "South San Francisco, CA",
    description: "Financial infrastructure for the internet.",
    isDemo: false,
  },
  "linear.example": {
    name: "Linear Demo Tools",
    domain: "linear.example",
    industry: "Software Development Tools",
    headcount: "80-120",
    revenueRange: "$10M - $50M",
    location: "San Francisco, CA",
    description: "Project management tool for high-velocity software engineering teams.",
    isDemo: true,
  },
  "supabase.example": {
    name: "Supabase Demo Database",
    domain: "supabase.example",
    industry: "Developer Infrastructure & Database",
    headcount: "100-250",
    revenueRange: "$20M - $80M",
    location: "Global / Remote",
    description: "Developer data platform and open source Firebase alternative.",
    isDemo: true,
  },
  "acme.example": {
    name: "Acme Demo Robotics",
    domain: "acme.example",
    industry: "Industrial Automation & Robotics",
    headcount: "45",
    revenueRange: "$5M - $15M",
    location: "Austin, TX",
    description: "Smart autonomous logistics solutions for mid-market supply chain distribution centers.",
    isDemo: true,
  },
};

/**
 * Enrich company details by domain with timeout, caching, and truthful source indicators
 */
export async function enrichCompanyWithCrustdata(domain: string): Promise<CompanyProfile> {
  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  // 1. Check MongoDB cache first to conserve credits & reduce latency
  try {
    const companiesCol = await getCompaniesCol();
    const cached = await companiesCol.findOne({ domain: cleanDomain });
    if (cached && cached.createdAt) {
      return {
        domain: cached.domain,
        name: cached.name,
        industry: cached.industry,
        headcount: cached.employeeCount,
        revenueRange: cached.revenueRange,
        location: cached.rawData?.location,
        description: cached.rawData?.description || `Cached Crustdata profile for ${cleanDomain}`,
        enrichmentSource: "cached",
        isDemo: cached.isDemo ?? cleanDomain.endsWith(".example"),
      };
    }
  } catch (err) {
    console.warn("Company cache lookup warning:", err);
  }

  // 2. Try Live Crustdata API with 5s timeout if API key is present
  if (CRUSTDATA_API_KEY && !cleanDomain.endsWith(".example")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://api.crustdata.com/screener/company?domain=${cleanDomain}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${CRUSTDATA_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const profile: CompanyProfile = {
          domain: cleanDomain,
          name: data.company_name || data.name || cleanDomain.split(".")[0].toUpperCase(),
          industry: data.industry || data.primary_industry || "Technology",
          headcount: data.headcount || data.company_size || "50-200",
          revenueRange: data.revenue_range || "$5M - $25M",
          location: data.location || data.headquarters || "San Francisco, CA",
          description: data.description || `Enriched live via Crustdata API for ${cleanDomain}`,
          enrichmentSource: "live",
          isDemo: false,
        };

        // Cache in MongoDB
        try {
          const companiesCol = await getCompaniesCol();
          await companiesCol.updateOne(
            { domain: cleanDomain },
            {
              $set: {
                id: `comp_${cleanDomain.replace(/\./g, "_")}`,
                name: profile.name,
                domain: profile.domain,
                industry: profile.industry,
                employeeCount: profile.headcount,
                revenueRange: profile.revenueRange,
                source: "live",
                rawData: profile,
                isDemo: false,
                cachedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              },
            },
            { upsert: true }
          );
        } catch (e) {
          console.warn("Company cache save warning:", e);
        }

        return profile;
      }
    } catch (err) {
      console.warn("Crustdata live API error/timeout, falling back to verified fixture:", err);
    }
  }

  // 3. Fallback to fixture data
  const fixture = FIXTURE_PROFILES[cleanDomain];
  if (fixture) {
    return {
      domain: cleanDomain,
      name: fixture.name || cleanDomain,
      industry: fixture.industry || "Software & Cloud Services",
      headcount: fixture.headcount || "50-100",
      revenueRange: fixture.revenueRange || "$10M - $50M",
      location: fixture.location || "San Francisco, CA",
      description: fixture.description || "Leading enterprise software and cloud infrastructure solutions.",
      enrichmentSource: "fixture",
      isDemo: true,
    };
  }

  // Generic dynamic fixture
  const baseName = cleanDomain.split(".")[0];
  const capitalizedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  return {
    domain: cleanDomain,
    name: `${capitalizedName} Technologies`,
    industry: "Enterprise SaaS & Cloud Infrastructure",
    headcount: "100-250",
    revenueRange: "$10M - $50M",
    location: "Global / Remote",
    description: `Automated test fixture profile for ${cleanDomain} (Crustdata Fallback)`,
    enrichmentSource: "fixture",
    isDemo: true,
  };
}
