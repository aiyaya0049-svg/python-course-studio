import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)))
const siteRoot = resolve(projectRoot, 'dist')
const host = '0.0.0.0'
const candidatePorts = [5173, 5174, 5175, 5176, 5177, 5178, 5179]
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.whl': 'application/octet-stream',
  '.zip': 'application/zip',
}

function safePath(urlPath) {
  const requested = decodeURIComponent(urlPath).replace(/^\/+/, '') || 'index.html'
  const normalized = normalize(requested).replace(/^([.][.][/\\])+/, '')
  const candidate = resolve(siteRoot, normalized)
  return candidate.startsWith(siteRoot) ? candidate : join(siteRoot, 'index.html')
}

const server = createServer(async (request, response) => {
  const requestPath = new URL(request.url ?? '/', `http://${host}`).pathname
  let filePath = safePath(requestPath)
  try {
    if (!existsSync(filePath) || (await stat(filePath)).isDirectory()) filePath = join(siteRoot, 'index.html')
    const data = await readFile(filePath)
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=86400',
    })
    response.end(data)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('课程资源未找到。请确认已在课程文件夹中执行构建。')
  }
})

function openTeacherPage(port) {
  const teacherUrl = `http://localhost:${port}/#/teacher`
  const studentUrl = `http://localhost:${port}/#/student`
  console.log(`\nPython 课程网站已在本机离线启动。\n教师端：${teacherUrl}\n学生端：${studentUrl}\n\n保持此窗口打开即可持续使用。`) 
  if (process.platform === 'win32') {
    const child = spawn('cmd.exe', ['/d', '/c', 'start', '', teacherUrl], { detached: true, stdio: 'ignore' })
    child.unref()
  }
}

function listenAt(index = 0) {
  const port = candidatePorts[index]
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && index < candidatePorts.length - 1) {
      listenAt(index + 1)
      return
    }
    console.error(`无法启动本地课程网站：${error.message}`)
    process.exitCode = 1
  })
  server.listen(port, host, () => openTeacherPage(port))
}

listenAt()
