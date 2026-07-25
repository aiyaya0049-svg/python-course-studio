const CONTROL_LINE = /^([ \t]*)(if|elif|else|for|while|def|class|try|except|finally)\b(.*)$/

function lineNumber(code, predicate) {
  const index = code.split('\n').findIndex(predicate)
  return index === -1 ? null : index + 1
}

function suggestSyntaxRepair(code, runtimeError) {
  const lines = code.replace(/\t/g, '    ').split('\n')
  const index = lines.findIndex((line) => {
    const match = line.match(CONTROL_LINE)
    return match && !line.trimEnd().endsWith(':')
  })
  if (index !== -1) {
    lines[index] = `${lines[index].trimEnd()}:`
    return {
      code: lines.join('\n'),
      reason: `第 ${index + 1} 行是控制语句。Python 用冒号表示“下面开始一个代码块”。先补冒号，再重新运行。`,
    }
  }
  if (/\bpritn\s*\(/.test(code)) {
    return {
      code: code.replace(/\bpritn\s*\(/g, 'print('),
      reason: '这里是 print 的常见拼写错误。只改动该名称，其他逻辑保持不变。',
    }
  }
  const errorName = String(runtimeError?.raw ?? '').match(/name ['"]([A-Za-z_]\w*)['"] is not defined/i)
  const targetName = errorName?.[1]
  if (targetName) {
    const definedNames = [...code.matchAll(/^\s*([A-Za-z_]\w*)\s*=/gm)].map((match) => match[1])
    const replacement = definedNames.find((name) => name.startsWith(`${targetName}_`) || targetName.startsWith(`${name}_`))
    if (replacement) {
      return {
        code: code.replace(new RegExp(`\\b${targetName}\\b`, 'g'), replacement),
        reason: `运行结果表明名称 ${targetName} 尚未定义；代码中已有相近的 ${replacement}。先只统一这一处名称，再重新运行原案例确认。`,
      }
    }
  }
  return null
}

function staticChecks(code) {
  const checks = []
  const inputVariable = code.match(/\b([A-Za-z_]\w*)\s*=\s*input\s*\(/)
  if (inputVariable) {
    const name = inputVariable[1]
    const usedInArithmetic = new RegExp(`\\b${name}\\s*[+*/-]|[+*/-]\\s*${name}\\b`).test(code)
    if (usedInArithmetic && !new RegExp(`(?:int|float)\\s*\\(\\s*${name}\\s*\\)`).test(code)) {
      checks.push({ level: '重点检查', text: `变量 ${name} 来自 input()，当前仍是字符串。若要参与计算，应在计算前转换并处理转换失败。` })
    }
  }
  if (/except\s*:\s*(?:\n|\r\n?)\s*pass\b/.test(code) || /except\s*:\s*pass\b/.test(code)) {
    checks.push({ level: '风险', text: '发现裸 except 或 except: pass。它会把真实错误悄悄吞掉；请只捕获预期异常，并给出可行动的提示。' })
  }
  if (/\beval\s*\(/.test(code)) {
    checks.push({ level: '风险', text: '不要用 eval() 处理输入。它会把文本当作代码执行；应使用 int()、float()、json.loads() 等明确转换。' })
  }
  if (/\bwhile\s+True\s*:/.test(code) && !/\bbreak\b/.test(code)) {
    checks.push({ level: '重点检查', text: 'while True 未看到 break。请确认循环是否有能到达的退出条件，避免死循环。' })
  }
  if (/\bprint\s*\([^)]*\)\s*\n\s*return\b/.test(code)) {
    checks.push({ level: '提示', text: '函数里既 print 又 return 时，先想清楚：调用者需要的是“显示结果”，还是“得到一个可继续计算的值”。' })
  }
  return checks
}

function testPrompts(code, lessonTitle) {
  const prompts = ['用一组正常输入验证主规则。', '选择一个临界值或空值，写下运行前的预期。']
  if (/\b(?:int|float|input)\b/.test(code)) prompts.push('再输入一个不符合格式的值，确认程序给出的提示是否清楚。')
  else if (/\bif\b|\belif\b/.test(code)) prompts.push('为每个分支至少准备一个测试值，特别检查临界值两侧。')
  else if (/\bfor\b|\bwhile\b/.test(code)) prompts.push('测试空数据或最小次数，确认循环仍能结束且结果合理。')
  else prompts.push(`把一个输入或初始值改掉，解释 ${lessonTitle} 中哪条规则仍然成立。`)
  return prompts
}

export function buildCodeDebugReport({ code, result, lessonTitle }) {
  const hasRun = Boolean(result)
  const runtimeError = result?.diagnosis
  const checks = staticChecks(code)
  const repair = runtimeError ? suggestSyntaxRepair(code, runtimeError) : null
  const firstExecutable = lineNumber(code, (line) => line.trim() && !line.trim().startsWith('#'))
  const observations = !hasRun
    ? [
      `尚未运行当前代码。${firstExecutable ? `第一条有效语句在第 ${firstExecutable} 行，先根据案例规则写下预期。` : '请先写出最小可运行片段和预期行为。'}`,
      ...checks.map((item) => item.text),
      '点击“运行”后，再依据实际输出或报错的类型、行号和上下文定位问题。',
    ]
    : runtimeError
    ? [
      `运行结果：${runtimeError.title}${runtimeError.line ? `，优先查看第 ${runtimeError.line} 行附近` : ''}。`,
      runtimeError.explanation,
      ...checks.map((item) => item.text),
    ]
    : checks.length
      ? checks.map((item) => item.text)
      : [
        `已完成本次运行。${firstExecutable ? `程序的第一条有效语句在第 ${firstExecutable} 行。` : ''}`,
        '当前未发现明显的课堂级风险。下一步不要只保留一次成功输出，而要用变式输入验证规则。',
      ]

  return {
    heading: !hasRun
      ? '准备运行：先明确预期，再获取证据'
      : runtimeError ? '运行结果分析：先定位根因，再做最小修复' : '运行检查：让一次运行变成可解释的结论',
    summary: !hasRun
      ? '当前面板只完成静态规则检查；它不能替代一次真实运行。'
      : runtimeError
      ? '先处理最靠近报错位置的一个根因；不要同时改很多行。'
      : '已结合本次代码和运行结果完成规则检查。',
    observations,
    repair,
    tests: testPrompts(code, lessonTitle),
  }
}
