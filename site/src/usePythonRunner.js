import { useCallback, useRef, useState } from 'react'

// The course package includes Pyodide and the teaching packages locally.
// No CDN or public network is needed after the course folder is copied.
const PYODIDE_INDEX = new URL(`${import.meta.env.BASE_URL}pyodide/`, window.location.href).href
const PYODIDE_MODULE = new URL(`${import.meta.env.BASE_URL}pyodide/pyodide.mjs`, window.location.href).href

function lineFromError(text) {
  const userCodeLine = text.match(/File\s+"<exec>",\s+line\s+(\d+)/i)
  if (userCodeLine) return Number(userCodeLine[1])
  const tracebackLines = [...text.matchAll(/line\s+(\d+)/ig)]
  return tracebackLines.length ? Number(tracebackLines.at(-1)[1]) : null
}

export function diagnosePythonError(errorText) {
  const text = String(errorText)
  const line = lineFromError(text)
  const entries = [
    [/SyntaxError|IndentationError|TabError/i, '语法或缩进错误', 'Python 无法把这段文本理解为合法程序。常见原因是漏了冒号、括号或引号没有配对，或者同一代码块的缩进不一致。', '从错误行及其上一行开始，检查冒号、括号、引号和空格缩进；不要只盯着被标出的最后一行。', '修复后先运行最小片段，再用一组正常输入确认规则没有被改坏。'],
    [/NameError/i, '名称未定义', '程序使用了尚未创建的名称，或名称拼写、大小写与前面的定义不一致。', '确认名称在使用前已经赋值或导入；逐字符核对拼写、大小写与作用域。', '修复后改一个输入再运行，确认代码没有依赖偶然存在的旧变量。'],
    [/TypeError/i, '类型不匹配', '某个运算、函数或索引操作收到的值类型不符合要求，例如把字符串与数字直接相加。', '在报错前用 type() 和 print() 查看关键值；检查 input()、文件或 JSON 读入的数据是否仍是字符串或缺失值。', '修复后分别测试正常值和一个不符合格式的输入，确认提示或处理符合规则。'],
    [/ValueError/i, '值不合法', '值的类型可能正确，但内容无法按要求转换或超出允许范围，例如 int("abc") 或不合法的日期。', '先写清允许范围和格式，再定位转换或校验发生的位置；不要用裸 except 把问题隐藏掉。', '修复后测试一个合法值、一个边界值和一个非法值。'],
    [/IndexError/i, '索引越界', '程序访问了序列中不存在的位置。Python 的索引从 0 开始，最后一个合法索引是 len(sequence) - 1。', '检查列表/字符串长度、循环范围和负索引；运行前打印 len(...) 与当前索引。', '分别测试空序列、只有一个元素和多个元素的情况。'],
    [/KeyError/i, '字典键不存在', '代码用方括号访问了字典中不存在的键。外部数据的字段尤其不能假设一定存在。', '打印字典的 keys()；确认字段名大小写、拼写和数据契约。对于可选字段考虑 get() 或显式报出友好错误。', '测试字段存在、字段缺失和字段值为空的三种情况。'],
    [/ZeroDivisionError/i, '除数为零', '除法运算的分母为 0。通常这意味着输入或统计数据缺少一个前置校验。', '定位分母来自哪里；先判断它是否为 0，再决定应拒绝输入、返回空结果还是给出提示。', '用正常分母、0 和可能导致 0 的空数据各运行一次。'],
    [/ModuleNotFoundError|ImportError/i, '模块或导入错误', '运行环境找不到要导入的模块，或导入名称与实际文件/包不一致。', '检查模块拼写、文件名、运行环境和依赖安装；浏览器实验环境只提供课程指定的基础包。', '先运行一个不依赖该模块的最小片段，再确认导入和版本要求。'],
  ]
  const found = entries.find(([pattern]) => pattern.test(text))
  if (found) {
    const [, title, explanation, nextStep, verify] = found
    return { kind: title, title, explanation, nextStep, verify, line, raw: text }
  }
  return { kind: '运行期错误', title: '运行期错误', explanation: '程序已开始执行，但某个运行条件没有满足。错误文本是定位线索，不是应该被忽略的噪音。', nextStep: '从最靠近 Traceback 底部的代码行开始，打印关键变量、缩小输入，并将实际行为同任务规则比较。', verify: '修复后保留导致失败的最小输入，再增加一个正常和一个边界场景。', line, raw: text }
}

export function usePythonRunner() {
  const runtimeRef = useRef(null)
  const loadedPackagesRef = useRef(new Set())
  const [runtimeState, setRuntimeState] = useState('idle')
  const [output, setOutput] = useState('')
  const [plotUrl, setPlotUrl] = useState('')

  const reset = useCallback(() => {
    setOutput('')
    setPlotUrl('')
  }, [])

  const loadRuntime = useCallback(async () => {
    if (runtimeRef.current) return runtimeRef.current
    setRuntimeState('loading')
    try {
      const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE_MODULE)
      const runtime = await loadPyodide({ indexURL: PYODIDE_INDEX })
      runtimeRef.current = runtime
      setRuntimeState('ready')
      return runtime
    } catch (error) {
      setRuntimeState('failed')
      throw new Error(`Python 运行环境加载失败：${error.message}`)
    }
  }, [])

  const run = useCallback(async (code, standardInput = '') => {
    setRuntimeState('running')
    setOutput('')
    setPlotUrl('')
    try {
      const runtime = await loadRuntime()
      const lines = []
      const inputLines = standardInput.replace(/\r\n/g, '\n').split('\n')
      let inputIndex = 0
      runtime.setStdout({ batched: (line) => lines.push(line) })
      runtime.setStderr({ batched: (line) => lines.push(`错误输出：${line}`) })
      runtime.setStdin({
        stdin: () => {
          if (inputIndex >= inputLines.length) return undefined
          const next = inputLines[inputIndex]
          inputIndex += 1
          return `${next}\n`
        },
      })

      const requestedPackages = []
      if (/\b(?:import|from)\s+pandas\b/.test(code)) requestedPackages.push('pandas')
      if (/\b(?:import|from)\s+matplotlib\b/.test(code)) requestedPackages.push('matplotlib')
      const packagesToLoad = requestedPackages.filter((item) => !loadedPackagesRef.current.has(item))
      if (packagesToLoad.length) {
        await runtime.loadPackage(packagesToLoad)
        packagesToLoad.forEach((item) => loadedPackagesRef.current.add(item))
      }

      // Execute each classroom attempt in a fresh namespace. Otherwise a name
      // created by a previous example can mask the exact error being taught.
      const isolatedProgram = `
__course_globals__ = {"__name__": "__main__"}
exec(compile(${JSON.stringify(code)}, "<exec>", "exec"), __course_globals__)
`
      const result = await runtime.runPythonAsync(isolatedProgram)
      if (result !== undefined) lines.push(String(result))
      const text = lines.join('\n') || '程序执行完成（无标准输出）。'
      const chart = await runtime.runPythonAsync(`
try:
    import base64 as __base64
    import io as __io
    import matplotlib.pyplot as __plt
    __numbers = __plt.get_fignums()
    if __numbers:
        __buffer = __io.BytesIO()
        __plt.gcf().savefig(__buffer, format="png", dpi=130, bbox_inches="tight")
        __chart = __base64.b64encode(__buffer.getvalue()).decode("ascii")
        __plt.close("all")
    else:
        __chart = ""
except Exception:
    __chart = ""
__chart
`)
      const nextPlot = typeof chart === 'string' && chart ? `data:image/png;base64,${chart}` : ''
      if (nextPlot) setPlotUrl(nextPlot)
      setOutput(text)
      setRuntimeState('ready')
      return { output: text, diagnosis: null, plotUrl: nextPlot }
    } catch (error) {
      const text = error.message ?? String(error)
      const diagnosis = diagnosePythonError(text)
      setOutput(text)
      setRuntimeState(runtimeRef.current ? 'ready' : 'failed')
      return { output: text, diagnosis, plotUrl: '' }
    }
  }, [loadRuntime])

  return { runtimeState, output, plotUrl, setOutput, reset, run }
}
