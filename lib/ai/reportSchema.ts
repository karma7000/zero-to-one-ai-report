import { z } from "zod";

export const reportSchema = z.object({
  market_attractiveness: z.object({
    score: z.number().int().min(1).max(100),
    summary: z.string(),
    rationale: z.string(),
    key_factors: z.array(z.string()),
  }),
  ecommerce_channels: z.object({
    overview: z.string(),
    channels: z.array(
      z.object({
        platform_name: z.string(),
        fit_score: z.number().int().min(1).max(10),
        why_it_fits: z.string(),
        entry_strategy: z.string(),
        estimated_fees_or_costs: z.string(),
      })
    ),
  }),
  offline_channels: z.object({
    overview: z.string(),
    distribution_structure: z.string(),
    channels: z.array(
      z.object({
        channel_type: z.string(),
        description: z.string(),
        entry_strategy: z.string(),
      })
    ),
  }),
  business_feasibility: z.object({
    risks: z.array(z.string()),
    opportunities: z.array(z.string()),
    regulatory_notes: z.string(),
    overall_viability: z.string(),
  }),
  business_proposal: z.object({
    recommended_entry_strategy: z.string(),
    recommended_primary_channel: z.string(),
    operations_plan: z.string(),
    roadmap: z.array(
      z.object({
        phase: z.string(),
        actions: z.array(z.string()),
      })
    ),
    next_steps: z.array(z.string()),
  }),
});

export type Report = z.infer<typeof reportSchema>;
