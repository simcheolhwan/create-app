import fs from "node:fs"
import prompts from "prompts"
import { red, reset } from "kolorist"
import { PACKAGES } from "./packages"

export default async function prompt() {
  return prompts(
    [
      {
        type: "text",
        name: "projectName",
        message: reset("Project name:"),
        initial: "project",
        onState: (state) => {
          const projectName = state.value
          if (fs.existsSync(projectName)) {
            throw new Error(red("✖") + ` Directory ${projectName} exists`)
          }
        },
      },
      {
        type: "multiselect",
        name: "packages",
        message: reset("Select packages:"),
        choices: Object.keys(PACKAGES).map((packageName) => {
          return { title: packageName, value: packageName }
        }),
      },
    ],
    {
      onCancel: () => {
        throw new Error(red("✖") + " Operation cancelled")
      },
    },
  )
}
