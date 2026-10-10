import { MappingSpec, MappingRule, Lead, CompanyProfile } from "../schemas";

/**
 * Safely resolve a nested source field path (e.g. "company.name" or "email")
 */
function resolveSourceValue(path: string, lead: Lead, company?: CompanyProfile): any {
  if (path.startsWith("company.")) {
    const prop = path.replace("company.", "") as keyof CompanyProfile;
    return company ? company[prop] : undefined;
  }
  const prop = path as keyof Lead;
  return lead[prop];
}

/**
 * Execute safe DSL transformation rules
 */
export function executeTransformation(
  rule: MappingRule,
  lead: Lead,
  company?: CompanyProfile
): any {
  const rawValue = resolveSourceValue(rule.source, lead, company);

  switch (rule.transform) {
    case "direct":
      return rawValue !== undefined ? rawValue : rule.defaultValue;

    case "trim":
      return typeof rawValue === "string" ? rawValue.trim() : rawValue;

    case "lowercase":
      return typeof rawValue === "string" ? rawValue.toLowerCase().trim() : rawValue;

    case "uppercase":
      return typeof rawValue === "string" ? rawValue.toUpperCase().trim() : rawValue;

    case "date_iso": {
      if (!rawValue && rule.defaultValue) return rule.defaultValue;
      const str = String(rawValue || "").trim();

      // Check if already in strict ISO format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return str;
      }

      // Convert MM/DD/YYYY or MM-DD-YYYY or localized date
      const slashParts = str.split(/[/.-]/);
      if (slashParts.length === 3) {
        if (slashParts[0].length === 2 && slashParts[1].length === 2 && slashParts[2].length === 4) {
          // MM/DD/YYYY -> YYYY-MM-DD
          return `${slashParts[2]}-${slashParts[0].padStart(2, "0")}-${slashParts[1].padStart(2, "0")}`;
        }
      }

      const parsed = new Date(str);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }

      return str; // return raw if unparseable so validator can catch it
    }

    case "lookup": {
      if (rule.lookupMap && typeof rawValue === "string") {
        return rule.lookupMap[rawValue] || rule.defaultValue || rawValue;
      }
      return rule.notes || rule.defaultValue || rawValue;
    }

    case "template": {
      let templ = rule.templateString || "";
      templ = templ.replace(/{company_name}/g, company?.name || "");
      templ = templ.replace(/{company_domain}/g, company?.domain || "");
      templ = templ.replace(/{lead_name}/g, lead.name || "");
      templ = templ.replace(/{lead_email}/g, lead.email || "");
      templ = templ.replace(/{industry}/g, company?.industry || "");
      templ = templ.replace(/{headcount}/g, String(company?.headcount || ""));
      return templ || rule.defaultValue;
    }

    default:
      return rawValue !== undefined ? rawValue : rule.defaultValue;
  }
}

/**
 * Execute complete mapping transformation against source lead & company data
 */
export function executeWorkflowMapping(
  mapping: MappingSpec,
  lead: Lead,
  company?: CompanyProfile
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const rule of mapping.rules) {
    const transformed = executeTransformation(rule, lead, company);
    if (transformed !== undefined) {
      result[rule.destination] = transformed;
    }
  }

  // Ensure default structure if unmapped
  if (!result.company_name && company?.name) result.company_name = company.name;
  if (!result.company_domain && company?.domain) result.company_domain = company.domain;
  if (!result.industry && company?.industry) result.industry = company.industry;
  if (!result.headcount_range && company?.headcount) result.headcount_range = `${company.headcount} employees`;

  return result;
}
