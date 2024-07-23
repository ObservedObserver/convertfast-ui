import { ISegment } from "../interfaces.ts";
import { metadata } from "./meta-data.ts"
// TODO: different templates for different frameworks
export function getTemplatePageCode(segments: ISegment[]) {
  return `${segments.map((seg) => `import { ${seg.name} } from './${seg.file}'`).join("\n")}

export const metadata = ${JSON.stringify(metadata)}
  
function LandingPage() {
  return (
    <>
      ${segments.map((seg) => `<${seg.name} />`).join("\n\t\t\t")}
    </>
  )
}

export default LandingPage`;
}
