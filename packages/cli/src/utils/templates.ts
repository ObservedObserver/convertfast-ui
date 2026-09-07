import { ISegment } from "../interfaces.ts";

export const SECTION_MARKER = "{/* convertfast:sections */}";
export function getTemplatePageCode(segments: ISegment[], importDirectory = ".") {
  return `${segments.map(seg => `import { ${seg.name} } from ${JSON.stringify(`${importDirectory}/${seg.file}`)};`).join("\n")}

export default function LandingPage() {
  return (
    <main>
      ${segments.map(seg => `<${seg.name} />`).join("\n      ")}
      ${SECTION_MARKER}
    </main>
  );
}
`;
}
