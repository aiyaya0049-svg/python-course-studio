import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, BrainCircuit, CheckCircle2, ChevronDown, FlaskConical, GraduationCap, Lightbulb, RotateCcw } from 'lucide-react'
import { labCatalog, lessons } from './courseData'
import { detailedLessons } from './detailedCourseData'
import { CodeDebugPanel, IconTextButton, PythonWorkspace } from './portalComponents'
import { coursePackFor } from './teachingSupport'

export default function StudentLab() {
  const [selectedId, setSelectedId] = useState(1)
  const lesson = lessons.find((item) => item.id === selectedId) ?? lessons[0]
  const detail = detailedLessons[lesson.id]
  const lab = labCatalog[lesson.id]
  const pack = useMemo(() => coursePackFor(lesson, detail, lab), [lesson, detail, lab])
  const { cases, knowledge, questions, practices } = pack
  const [activeCase, setActiveCase] = useState(0)
  const [code, setCode] = useState(cases[0].code)
  const [answers, setAnswers] = useState({})
  const [runResult, setRunResult] = useState(null)

  useEffect(() => {
    setActiveCase(0)
    setCode(cases[0].code)
    setAnswers({})
    setRunResult(null)
  }, [lesson.id, cases])

  const selectCase = (index) => {
    setActiveCase(index)
    setCode(cases[index].code)
    setRunResult(null)
  }
  const current = cases[activeCase]

  return <div className="student-app">
    <header className="portal-header student-header">
      <div className="portal-brand"><span className="brand-mark"><GraduationCap size={19} /></span><div><strong>Python 学习实验室</strong><small>课堂测试、同步案例练习与本地代码调试</small></div></div>
    </header>
    <main className="student-main">
      <section className="student-lesson-head">
        <div><span>第 {lesson.week} 周 · 第 {String(lesson.id).padStart(2, '0')} 次课</span><h1>{lesson.title}</h1><p>本节案例：{lesson.case}</p></div>
        <label className="lesson-select">选择课程<ChevronDown size={15} /><select value={selectedId} onChange={(event) => setSelectedId(Number(event.target.value))} aria-label="选择课程">{lessons.map((item) => <option key={item.id} value={item.id}>第 {String(item.id).padStart(2, '0')} 次 · {item.title}</option>)}</select></label>
      </section>

      <section className="must-know">
        <div><span><BookOpenCheck size={15} />本节必须掌握</span><h2>本节知识与学习要求</h2></div>
        <div className="student-knowledge">{knowledge.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.content}</p><small>{item.learnerOutcome}</small></article>)}</div>
      </section>

      <section className="diagnosis-section">
        <div className="section-topline"><div><span><BrainCircuit size={14} />课堂测试</span><h2>本节课堂测试（6题）</h2></div><p>作答后查看规则依据；错题回到对应知识或案例复做。</p></div>
        <div className="diagnosis-grid">{questions.map((item, questionIndex) => <DiagnosisQuestion key={`${item.label}-${item.question}`} item={item} index={questionIndex} selected={answers[questionIndex]} onSelect={(answer) => setAnswers((currentAnswers) => ({ ...currentAnswers, [questionIndex]: answer }))} />)}</div>
      </section>

      <section className="student-experiment">
        <div className="experiment-heading"><div><span><FlaskConical size={15} />同步案例练习</span><h2>{current.title}</h2><p>{current.emphasis}</p></div><div className="expected-output"><b>预期行为</b><code>{current.expected}</code></div></div>
        <div className="case-switcher student-case-switcher" role="tablist" aria-label="案例类型">
          {cases.map((item, index) => <button type="button" key={item.kind} className={activeCase === index ? 'active' : ''} onClick={() => selectCase(index)}>{item.kind}</button>)}
        </div>
        <div className="experiment-grid">
          <div className="experiment-guide">
            <h3>练习目标</h3><p>{current.title}</p>
            <h3>完成顺序</h3><ol><li>先读案例规则和预期行为，写下自己的运行预测。</li><li>运行当前代码；若报错，先根据行号和错误类型定位第一个原因。</li><li>只修改与该原因直接相关的部分，再运行验证。</li><li>按下方验证清单改变一个边界或失败输入。</li></ol>
            <h3>验证清单</h3><ul>{current.tests.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="hint-card"><Lightbulb size={16} /><p>{lab.hint}</p></div><IconTextButton className="secondary-button" onClick={() => setCode(current.code)}><RotateCcw size={14} />恢复本案例代码</IconTextButton>
          </div>
          <div><PythonWorkspace code={code} setCode={setCode} onRun={setRunResult} resetKey={`${lesson.id}-${activeCase}`} label="学生 Python 实验编辑器" minRows={18} footer="代码只在当前浏览器中执行。请使用示例数据；完成运行后，依据错误位置或验证清单进行修改与复测。" /><CodeDebugPanel code={code} result={runResult} lessonTitle={lesson.title} onApplyRepair={setCode} /></div>
        </div>
      </section>

      <section className="challenge-section">
        <div className="section-topline"><div><span><BookOpenCheck size={14} />巩固与应用</span><h2>本节巩固练习</h2></div><p>依次完成基础、调试、应用和解释练习。</p></div>
        <div className="challenge-list">{practices.map((item, index) => <article key={item.title}><b>{String(index + 1).padStart(2, '0')}</b><div><h3>{item.title}</h3><p>{item.task}</p><small>{item.check}</small></div></article>)}</div>
      </section>
    </main>
  </div>
}

function DiagnosisQuestion({ item, index, selected, onSelect }) {
  const answered = Number.isInteger(selected)
  const correct = selected === item.answer
  return <article className="diagnosis-card"><span>{item.label}</span><h3>{item.question}</h3><div className="quiz-options">{item.options.map((option, optionIndex) => <label className={selected === optionIndex ? 'selected' : ''} key={option}><input type="radio" name={`question-${index}`} checked={selected === optionIndex} onChange={() => onSelect(optionIndex)} /><b>{String.fromCharCode(65 + optionIndex)}</b><i>{option}</i></label>)}</div>{answered && <div className={`quiz-feedback ${correct ? 'correct' : ''}`}>{correct ? <CheckCircle2 size={17} /> : <Lightbulb size={17} />}<div><b>{correct ? '判断正确' : '回到规则再看一次'}</b><p>{item.explain}</p></div></div>}</article>
}
