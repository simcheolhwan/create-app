import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import prompts from "prompts"
import { red, reset } from "kolorist"

const cwd = process.cwd()

const TEMPLATES = ["react-base", "react-boilerplate", "react-crypto"]

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
}

const defaultTargetDir = "project"

async function init() {
  let targetDir = defaultTargetDir
  const getProjectName = () => (targetDir === "." ? path.basename(path.resolve()) : targetDir)

  let result: prompts.Answers<"projectName" | "overwrite" | "packageName" | "template">

  try {
    result = await prompts(
      [
        {
          type: "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm"),
          name: "overwrite",
          message: () =>
            (targetDir === "." ? "Current directory" : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled")
            }

            return null
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) => isValidPackageName(dir) || "Invalid package.json name",
        },
        {
          type: "select",
          name: "template",
          message: reset("Select a template:"),
          initial: 0,
          choices: TEMPLATES.map((template) => {
            return {
              title: template,
              value: template,
            }
          }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled")
        },
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const { template, overwrite, packageName } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(fileURLToPath(import.meta.url), "../..", `template-${template}`)

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file)
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), "utf-8"))

  pkg.name = packageName || getProjectName()

  write("package.json", JSON.stringify(pkg, null, 2))

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }

  console.log(`  pnpm i`)
  console.log(`  pnpm dev`)
  console.log()
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "")
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName)
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-")
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === ".git")
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue
    }

    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

init().catch((e) => {
  console.error(e)
})
