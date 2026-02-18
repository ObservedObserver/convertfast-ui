import path from "path";

export const DEFAULT_TEMPLATE_NAME = "default";

export const TEMPLATE_NAMES = [DEFAULT_TEMPLATE_NAME, "editorial"] as const;
export type TemplateName = (typeof TEMPLATE_NAMES)[number];

type TemplateConfig = {
  description: string;
  segmentsDir: string;
};

export function getTemplateConfigs(projectRoot: string): Record<TemplateName, TemplateConfig> {
  return {
    default: {
      description: "Current ConvertFast segment design",
      segmentsDir: path.join(projectRoot, "./templates/src/segments"),
    },
    editorial: {
      description: "Editorial-style segment design",
      segmentsDir: path.join(projectRoot, "./templates/src/editorial/segments"),
    },
  };
}

export function resolveTemplateConfig(projectRoot: string, templateName: string): TemplateConfig {
  const templateConfigs = getTemplateConfigs(projectRoot);
  if (!TEMPLATE_NAMES.includes(templateName as TemplateName)) {
    const available = TEMPLATE_NAMES.join(", ");
    throw new Error(`Template '${templateName}' is not valid. Available templates: ${available}.`);
  }

  return templateConfigs[templateName as TemplateName];
}
