import { Command } from "commander"
import { add } from "./commands/add"

async function main() {
  
    const program = new Command()
      .name("convertfast")
      .description("add components and dependencies to your project")
  
    program.addCommand(add)
  
    program.parse()
  }
  
  main()
  