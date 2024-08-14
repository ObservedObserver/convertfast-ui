import { ISegment } from "../interfaces.ts";

export function getTemplatePageCode(segments: ISegment[]) {
  return `${segments.map((seg) => `import { ${seg.name} } from './${seg.file}'`).join("\n")}

function LandingPage() {
  return (
    <>
      ${segments.map((seg) => `<${seg.name} />`).join("\n\t\t\t")}
    </>
  )
}

export default LandingPage`;
}
