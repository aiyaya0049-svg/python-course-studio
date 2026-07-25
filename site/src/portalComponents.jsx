import { CheckCircle2, Code2, Lightbulb, LoaderCircle, Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { buildCodeDebugReport } from './aiTeachingCoach'
import { usePythonRunner } from './usePythonRunner'

export function IconTextButton({ children, className = '', type = 'button', ...props }) {
  return <button type={type} className={`action-button ${className}`} {...props}>{children}</button>
}

export function PythonWorkspace({ code, setCode, readOnly = false, onRun, output: externalOutput, label = 'Python 工作区', footer, minRows = 14, resetKey }) {
  const { runtimeState, output: localOutput, plotUrl, reset, run } = usePythonRunner()
  const [standardInput, setStandardInput] = useState('')
  const output = externalOutput ?? localOutput
  const running = runtimeState === 'loading' || runtimeState === 'running'
  const needsInput = /\binput\s*\(/.test(code)

  useEffect(() => {
    reset()
    setStandardInput('')
  }, [reset, resetKey])

  const runCode = async () => {
    const result = await run(code, standardInput)
    onRun?.(result)
  }

  return <section className="python-workspace">
    <header className="workspace-toolbar">
      <span><Code2 size={16} />{label}</span>
      <div>
        {runtimeState === 'failed' && <small className="runtime-warning">运行环境不可用</small>}
        <IconTextButton className="run-button" onClick={runCode} disabled={running}>
          {running ? <LoaderCircle className="spin" size={15} /> : <Play size={15} />}{running ? '加载中' : '运行'}
        </IconTextButton>
      </div>
    </header>
    <textarea className="code-editor" value={code} onChange={(event) => setCode?.(event.target.value)} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !running) { event.preventDefault(); runCode() } }} readOnly={readOnly} spellCheck="false" aria-label={label} style={{ minHeight: `${minRows * 23}px` }} />
    {needsInput && <label className="program-input"><span>程序输入 <small>每行对应一次 <code>input()</code></small></span><textarea value={standardInput} onChange={(event) => setStandardInput(event.target.value)} placeholder={'例如：\n3\n120.5'} aria-label="程序输入" /></label>}
    <div className="terminal-output" aria-live="polite"><span>输出</span><pre>{output || '运行代码后，输出将显示在这里。'}</pre></div>
    {plotUrl && <figure className="python-plot"><img src={plotUrl} alt="Python 程序生成的图表" /><figcaption>本次运行生成的图表</figcaption></figure>}
    <footer className="workspace-note">{footer || '代码仅在当前浏览器的 Python 运行环境中执行；可用 Ctrl/Command + Enter 运行。不要粘贴账号、密钥或真实个人数据。'}</footer>
  </section>
}

export function CodeDebugPanel({ code, result, lessonTitle, onApplyRepair, compact = false }) {
  const review = useMemo(() => buildCodeDebugReport({ code, result, lessonTitle }), [code, result, lessonTitle])
  const hasError = Boolean(result?.diagnosis)
  return <aside className={`code-debug-panel ${hasError ? 'has-error' : ''} ${compact ? 'compact' : ''}`}>
    <header><span><Code2 size={17} />代码运行与调试</span><small>代码仅在当前浏览器中运行</small></header>
    <h3>{review.heading}</h3>
    <p className="debug-summary">{review.summary}</p>
    <div className="debug-observations">
      {review.observations.slice(0, 3).map((item) => <p key={item}><Lightbulb size={14} />{item}</p>)}
    </div>
    {review.repair && <div className="debug-repair">
      <b>建议的最小修复</b><p>{review.repair.reason}</p>
      <IconTextButton className="secondary-button" onClick={() => onApplyRepair?.(review.repair.code)}>应用这一个修复</IconTextButton>
    </div>}
    <div className="debug-tests"><b><CheckCircle2 size={14} />修复后验证</b><ol>{review.tests.map((item) => <li key={item}>{item}</li>)}</ol></div>
  </aside>
}

export function LessonSidebar({ lessons, selectedId, onSelect, heading = '16 次课', subheading = '8 周 · 32 学时' }) {
  return <aside className="lesson-sidebar">
    <div className="side-heading"><span>{heading}</span><small>{subheading}</small></div>
    <nav aria-label="课程目录">
      {lessons.map((lesson) => <button type="button" key={lesson.id} className={lesson.id === selectedId ? 'lesson-link active' : 'lesson-link'} onClick={() => onSelect(lesson.id)}>
        <b>{String(lesson.id).padStart(2, '0')}</b><span>{lesson.title}<small>第 {lesson.week} 周 · {lesson.tag}</small></span>
      </button>)}
    </nav>
  </aside>
}
