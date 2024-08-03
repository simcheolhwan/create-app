import fs from "node:fs"
import path from "node:path"

export function copySync(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDirSync(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDirSync(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copySync(srcFile, destFile)
  }
}
