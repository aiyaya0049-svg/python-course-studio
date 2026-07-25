import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen, Brain, CheckCircle2, Code2, FileText, GraduationCap, Lightbulb,
  Printer, RotateCcw, Target, Waypoints,
} from 'lucide-react'
import { labCatalog, lessons } from './courseData'
import { detailedLessons, lessonTeachingDesign, teachingDesignFramework } from './detailedCourseData'
import { CodeDebugPanel, IconTextButton, LessonSidebar, PythonWorkspace } from './portalComponents'
import { coursePackFor } from './teachingSupport'

const tabs = [
  ['plan', '教学设计', FileText],
  ['coding', '案例与现场 Python 编辑讲授', Code2],
]

export default function TeacherStudio() {
  const [selectedId, setSelectedId] = useState(1)
  const [activeTab, setActiveTab] = useState('plan')
  const lesson = lessons.find((item) => item.id === selectedId) ?? lessons[0]
  const detail = detailedLessons[lesson.id]
  const lab = labCatalog[lesson.id]
  const pack = useMemo(() => coursePackFor(lesson, detail, lab), [lesson, detail, lab])
  const design = useMemo(() => lessonTeachingDesign(lesson, detail), [lesson, detail])
  const cases = pack.cases
  const [activeCase, setActiveCase] = useState(0)
  const [code, setCode] = useState(cases[0].code)

  useEffect(() => {
    setActiveCase(0)
    setCode(cases[0].code)
  }, [lesson.id, cases])

  const selectLesson = (id) => {
    setSelectedId(id)
    setActiveTab('plan')
  }

  const selectCase = (index) => {
    setActiveCase(index)
    setCode(cases[index].code)
  }

  return <div className="portal-shell teacher-shell">
    <header className="portal-header">
      <div className="portal-brand">
        <span className="brand-mark"><GraduationCap size={19} /></span>
        <div><strong>Python 授课工作台</strong><small>Python程序设计基础与应用 · 16 次课 · 32 学时</small></div>
      </div>
      <IconTextButton className="secondary-button" onClick={() => window.print()}><Printer size={15} />打印本节教学设计</IconTextButton>
    </header>

    <div className="teacher-layout">
      <LessonSidebar lessons={lessons} selectedId={selectedId} onSelect={selectLesson} />
      <main className="teacher-main">
        <section className="lesson-banner">
          <div><span>第 {lesson.week} 周 · 第 {String(lesson.id).padStart(2, '0')} 次课</span><h1>{lesson.title}</h1><p>贯穿案例：{lesson.case}</p></div>
          <div className="lesson-counter"><b>{String(lesson.id).padStart(2, '0')}</b><small>/ 16</small></div>
        </section>
        <nav className="teacher-tabs" aria-label="教师功能">
          {tabs.map(([key, label, Icon]) => <button type="button" key={key} className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}><Icon size={16} />{label}</button>)}
        </nav>
        {activeTab === 'plan'
          ? <TeachingPlan lesson={lesson} detail={detail} lab={lab} design={design} cases={cases} onOpenCoding={() => setActiveTab('coding')} />
          : <LiveCoding lesson={lesson} detail={detail} cases={cases} activeCase={activeCase} code={code} setCode={setCode} onSelectCase={selectCase} />}
      </main>
    </div>
  </div>
}

function SectionHeading({ icon: Icon, label, title, children }) {
  return <div className="section-topline">
    <div><span>{Icon && <Icon size={14} />}{label}</span><h2>{title}</h2></div>
    {children && <p>{children}</p>}
  </div>
}

function TeachingPlan({ lesson, detail, lab, design, cases, onOpenCoding }) {
  const pack = useMemo(() => coursePackFor(lesson, detail, lab), [lesson, detail, lab])
  const books = pack.textbooks
  const knowledge = pack.knowledge
  const applicationCase = cases[2]
  return <div className="lesson-plan-view">
    <section className="teaching-position">
      <div>
        <span>本课定位</span><h2>{lesson.case}</h2>
        <p>{design.applicationPosition}</p>
      </div>
      <div className="position-outcomes">
        <b>预期学习结果</b>
        {lesson.outcomes.map((item, index) => <p key={item}><em>{String(index + 1).padStart(2, '0')}</em>{item}</p>)}
      </div>
    </section>

    <section className="textbook-map">
      <SectionHeading icon={BookOpen} label="教材内容" title="本节对应教材章节" />
      <div className="textbook-map-body">
        <article><b>主教材</b><p>{books.primary}</p></article>
        <article><b>主要参考教材与资料</b>{books.references.map((item) => <p key={item}>{item}</p>)}</article>
      </div>
    </section>

    <section className="design-grid teaching-design-grid">
      <article><h3><Target size={16} />教学目标</h3><p><b>知识：</b>{design.objectives.knowledge}</p><p><b>能力：</b>{design.objectives.ability}</p><p><b>素养：</b>{design.objectives.quality}</p></article>
      <article><h3><Brain size={16} />学习基础与着力点</h3><p>{design.learnerProfile}</p><p><b>本节着力点：</b>{detail.keyPoints.join('；')}</p></article>
      <article><h3><Lightbulb size={16} />AI时代的学习价值</h3><p>{design.valueGoal}</p><p>{teachingDesignFramework.aiBoundary}</p></article>
    </section>

    <section className="knowledge-design">
      <SectionHeading icon={BookOpen} label="系统知识讲授" title="本节基础知识与讲授内容" />
      <div className="focus-columns">
        <article><h3>教学重点与突破</h3>{design.focusStrategy.map((item) => <p key={item}><CheckCircle2 size={14} />{item}</p>)}</article>
        <article><h3>教学难点与处理</h3>{design.difficultyStrategy.map((item) => <p key={item}><Lightbulb size={14} />{item}</p>)}</article>
      </div>
      <div className="knowledge-teaching-list">
        {knowledge.map((item, index) => <article className="knowledge-teaching-card" key={item.title}>
          <header><b>{String(index + 1).padStart(2, '0')}</b><h3>{item.title}</h3></header>
          <p><strong>讲授内容：</strong>{item.content}</p>
          <p><strong>例证与讲解：</strong>{item.explain}</p>
          <p><strong>最小示例：</strong>{item.demonstration}</p>
          <div className="knowledge-board"><b>板书或投屏要点</b>{item.board.map((line) => <span key={line}>{line}</span>)}</div>
          <p><strong>即时检查：</strong>{item.checkpoint}</p>
          <p><strong>易错处理：</strong>{item.response}</p>
          <p><strong>学生应达到：</strong>{item.learnerOutcome}</p>
        </article>)}
      </div>
    </section>

    <section className="case-library">
      <SectionHeading icon={Waypoints} label="案例讲授" title={detail.liveCoding.title} />
      <div className="case-library-grid">
        {cases.map((item, index) => <article key={item.kind}>
          <header><b>{String(index + 1).padStart(2, '0')}</b><h3>{item.kind}</h3></header>
          <h4>{item.title}</h4><p>{item.emphasis}</p>
          <div><strong>讲授与验证清单</strong><ol>{item.tests.map((test) => <li key={test}>{test}</li>)}</ol></div>
        </article>)}
      </div>
      <div className="case-actions"><IconTextButton className="primary-button" onClick={onOpenCoding}><Code2 size={15} />打开案例与现场 Python 编辑讲授</IconTextButton></div>
    </section>

    <section className="application-design">
      <SectionHeading icon={Code2} label="Python 应用案例" title="把基础规则放进有边界、可验证的真实小任务" />
      <div className="application-design-body">
        <div><h3>{applicationCase.title}</h3><p>{applicationCase.emphasis}</p><p><strong>预期行为：</strong>{applicationCase.expected}</p></div>
        <div><h3>应用任务的质量要求</h3><ul><li>使用脱敏、可复现的小数据，不用真实个人信息。</li><li>正常路径和一个边界或失败路径都要有明确预期。</li><li>程序输出只说明样例数据范围内的结果，不夸大结论。</li></ul></div>
      </div>
    </section>

    <section className="learning-support">
      <div><h3>当堂掌握检查</h3>{design.formativeAssessment.map((item) => <p key={item}>{item}</p>)}</div>
      <div><h3>易错点处理</h3>{lesson.misconceptions.map((item) => <p key={item}>{item}</p>)}</div>
      <div><h3>课后巩固与下一课连接</h3><p>{detail.afterClass}</p><p>复盘时只记录未掌握概念、典型错误和边界测试缺口，用于下一课开场诊断。</p></div>
    </section>
  </div>
}

function LiveCoding({ lesson, detail, cases, activeCase, code, setCode, onSelectCase }) {
  const [runResult, setRunResult] = useState(null)
  const current = cases[activeCase]
  useEffect(() => setRunResult(null), [lesson.id, activeCase])

  return <div className="live-coding-workbench">
    <section className="coding-intro">
      <div><span>教师现场 Python 编辑讲授</span><h2>{detail.liveCoding.title}</h2><p>围绕“{lesson.case}”逐步构建、运行、诊断和复测。每个案例均有明确规则、预期结果和边界验证，便于投屏讲解。</p></div>
      <div className="coding-intro-meta"><b>当前案例</b><p>{current.title}</p><small>预期：{current.expected}</small></div>
    </section>
    <div className="case-switcher" role="tablist" aria-label="案例类型">
      {cases.map((item, index) => <button type="button" key={item.kind} className={activeCase === index ? 'active' : ''} onClick={() => onSelectCase(index)}>{item.kind}</button>)}
    </div>
    <div className="teacher-coding-grid">
      <aside className="coding-side">
        <h3>案例任务与知识落点</h3><p>{current.emphasis}</p>
        <h3>本案例验证清单</h3><ol>{current.tests.map((test) => <li key={test}>{test}</li>)}</ol>
        <h3>本节重点</h3><ul>{detail.keyPoints.map((item) => <li key={item}>{item}</li>)}</ul>
      </aside>
      <section className="teacher-editor">
        <div className="editor-actions"><span>可直接编辑、运行并保留本案例的诊断与复测过程</span><IconTextButton className="secondary-button" onClick={() => setCode(current.code)}><RotateCcw size={14} />恢复本案例代码</IconTextButton></div>
        <PythonWorkspace code={code} setCode={setCode} onRun={setRunResult} resetKey={`${lesson.id}-${activeCase}`} label="教师现场 Python 编辑器" minRows={19} footer="代码仅在当前浏览器的本地 Python 环境中运行。运行后先查看结果或报错位置，再用案例验证清单复测。" />
        <CodeDebugPanel code={code} result={runResult} lessonTitle={lesson.title} onApplyRepair={setCode} />
      </section>
      <aside className="coding-side debug-workflow">
        <h3>代码运行与调试</h3>
        <p><b>1. 运行前核查</b>代码是否表达了案例规则；预期结果是什么。</p>
        <p><b>2. 运行后定位</b>优先查看报错类型、报错行和与该行相关的上一条规则。</p>
        <p><b>3. 最小修复</b>一次只改动一个根因，避免用大面积重写掩盖问题。</p>
        <p><b>4. 修复后验证</b>重新运行原案例，并使用一个边界或失败输入确认规则未被改坏。</p>
      </aside>
    </div>
  </div>
}
