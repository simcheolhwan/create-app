import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execSync } from "node:child_process"
import { copySync } from "./utils"
import prompt from "./prompt"
import { defaultDependencies, defaultDevDependencies, PACKAGES } from "./packages"
import { makeSrc } from "./src"

const cwd = process.cwd()

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
}

async function main() {
  // Get input from the user
  const { projectName, packages } = await prompt()

  // Create directory
  const root = path.join(cwd, projectName)

  // Copy or create files
  const writeSync = (fileName: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[fileName] ?? fileName)
    const dir = path.dirname(targetPath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copySync(path.join(templateDir, fileName), targetPath)
    }
  }

  // Create folder
  fs.mkdirSync(root, { recursive: true })

  // Copy template files
  const templateDir = path.resolve(fileURLToPath(import.meta.url), "../..", `template`)
  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    writeSync(file)
  }

  // Dynamically configure src folder based on selected packages
  for (const [fileName, render] of Object.entries(makeSrc(packages))) {
    const content = render()
    if (!content) continue
    writeSync(fileName, content)
  }

  // Install packages
  const dependencies = [...defaultDependencies, ...packages]
  const devDependencies = [
    ...defaultDevDependencies,
    ...packages.flatMap((pkg: string) => PACKAGES[pkg]),
  ]

  execSync(`pnpm i ${dependencies.join(" ")}`, { cwd: root, stdio: "inherit" })
  execSync(`pnpm i -D ${devDependencies.join(" ")}`, { cwd: root, stdio: "inherit" })
  execSync(`pnpm prettier --write .`, { cwd: root })

  // git commit
  execSync(`git init`, { cwd: root })
  execSync(`git add .`, { cwd: root })
  execSync(`git commit -m "Initial commit"`, { cwd: root })

  // Print completion message
  console.log(`\nDone. Now run:\n  pnpm dev\n`)
}

main().catch((e) => {
  console.error(e)
})
