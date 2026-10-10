import { Lead } from "../schemas";

export const DEMO_CRM_LEADS: Lead[] = [
  {
    id: "lead_9821",
    name: "Sarah Chen",
    email: "sarah.chen@stripe.example",
    companyDomain: "stripe.example",
    status: "qualified",
    estimatedValue: 120000,
    isDemo: true,
  },
  {
    id: "lead_4419",
    name: "Alex Rivera",
    email: "alex@linear.example",
    companyDomain: "linear.example",
    status: "qualified",
    estimatedValue: 45000,
    isDemo: true,
  },
  {
    id: "lead_3310",
    name: "Marcus Vance",
    email: "marcus@supabase.example",
    companyDomain: "supabase.example",
    status: "lead",
    estimatedValue: 30000,
    isDemo: true,
  },
  {
    id: "lead_7712",
    name: "Guillermo Rauch",
    email: "guillermo@vercel.example",
    companyDomain: "vercel.example",
    status: "qualified",
    estimatedValue: 240000,
    isDemo: true,
  },
  {
    id: "lead_5521",
    name: "David Hsu",
    email: "david@retool.example",
    companyDomain: "retool.example",
    status: "qualified",
    estimatedValue: 95000,
    isDemo: true,
  },
  {
    id: "lead_6618",
    name: "Michael Truell",
    email: "michael@cursor.example",
    companyDomain: "cursor.example",
    status: "lead",
    estimatedValue: 60000,
    isDemo: true,
  },
];

export function getLeadById(id: string): Lead | undefined {
  return DEMO_CRM_LEADS.find((l) => l.id === id);
}

export function getAllDemoLeads(): Lead[] {
  return [...DEMO_CRM_LEADS];
}
