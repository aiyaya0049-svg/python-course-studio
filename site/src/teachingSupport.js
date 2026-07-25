// One curriculum source for the teacher plan, student practice, and DOCX.
// Keeping these objects together prevents a case, a test, and a stated objective
// from drifting apart during later course maintenance.

const textbookMap = {
  1: {
    primary: '《Python程序设计（第4版）》第1章 1.1-1.4、1.10-1.11：版本与运行环境、Python 基础用法、运行方式和 Python 文化。',
    references: ['《Python程序设计（原书第3版）》第1章：程序、解释器与首次程序。', '《Python语言程序设计基础（第3版）》第1章 1.2-1.7及第2章2.1-2.3：Python 概述、开发环境、IPO、算法、温度转换和基本输入输出。'],
  },
  2: {
    primary: '《Python程序设计（第4版）》第1章1.4.2-1.4.7及第2章2.1：内置对象、常量与变量、运算符、表达式、关键字和数字。',
    references: ['《Python程序设计（原书第3版）》第2章：变量、表达式、类型转换与用户输入。', '《Python语言程序设计基础（第3版）》第2章2.2-2.3及第3章3.1-3.5：基本语法、输入输出、数字、字符串、类型转换与格式化。'],
  },
  3: {
    primary: '《Python程序设计（第4版）》第3章 3.1-3.2：关系与逻辑表达式、单分支、双分支和多分支结构。',
    references: ['《Python程序设计（原书第3版）》第3章：条件执行。', '《Python语言程序设计基础（第3版）》第4章 4.1、4.5：分支结构、逻辑运算与比较运算。'],
  },
  4: {
    primary: '《Python程序设计（第4版）》第3章3.3-3.4：for循环、while循环、break、continue与循环结构。',
    references: ['《Python程序设计（原书第3版）》第5章：迭代与循环。', '《Python语言程序设计基础（第3版）》第4章 4.4：遍历循环、条件循环和循环控制。'],
  },
  5: {
    primary: '《Python程序设计（第4版）》第2章2.2、2.5：列表、元组、生成器推导式、索引、切片与常用操作。',
    references: ['《Python程序设计（原书第3版）》第8章、第10章：列表与元组。', '《Python语言程序设计基础（第3版）》第6章 6.2、6.4：列表与元组。'],
  },
  6: {
    primary: '《Python程序设计（第4版）》第2章 2.3-2.4：字典、集合及其基本操作与应用。',
    references: ['《Python程序设计（原书第3版）》第9章：字典。', '《Python语言程序设计基础（第3版）》第6章 6.1、6.5：集合与字典。'],
  },
  7: {
    primary: '《Python程序设计（第4版）》第4章 4.1-4.2：字符串、字符串方法、格式化与正则表达式基础。',
    references: ['《Python程序设计（原书第3版）》第6章、第11章：字符串与正则表达式。', '《Python语言程序设计基础（第3版）》第3章 3.4-3.5：字符串类型、操作和格式化。'],
  },
  8: {
    primary: '《Python程序设计（第4版）》第5章5.1-5.8：函数定义、形参与实参、参数传递、return、作用域、lambda、递归和函数式编程基础。',
    references: ['《Python程序设计（原书第3版）》第4章：函数。', '《Python语言程序设计基础（第3版）》第5章：函数和代码复用。'],
  },
  9: {
    primary: '《Python程序设计（第4版）》第1章1.4.8、1.6-1.8及第5章相关内容：模块导入、扩展库安装、对象导入和工程组织。',
    references: ['《Python程序设计（原书第3版）》中模块与程序组织相关内容。', '《Python语言程序设计基础（第3版）》第5章5.5、第8章8.3-8.5与第9章9.7：模块化设计、计算生态、模块和程序包。'],
  },
  10: {
    primary: '《Python程序设计（第4版）》第7章：文件、文本编码、CSV、JSON 与结构化数据读写。',
    references: ['《Python程序设计（原书第3版）》第7章：文件处理。', '《Python语言程序设计基础（第3版）》第7章：文件和数据格式化。'],
  },
  11: {
    primary: '《Python程序设计（第4版）》第8章：异常处理、断言、测试与调试。',
    references: ['《Python语言程序设计基础（第3版）》第4章4.2：异常结构。', 'Python 官方文档：异常处理与 unittest。'],
  },
  12: {
    primary: '《Python程序设计（第4版）》第6章：类、对象、成员、属性、方法、继承与面向对象建模。',
    references: ['《Python程序设计（原书第3版）》第14章：对象。', '《Python语言程序设计基础（第3版）》第9章：对象式编程。'],
  },
  13: {
    primary: '《Python程序设计（第4版）》第17章17.1-17.4中NumPy、SciPy、pandas与Matplotlib相关内容选讲：用已有容器、函数和文件知识完成分析与图表表达。',
    references: ['pandas User Guide：表格数据选择、分组和汇总。', 'Matplotlib 官方教程：图表标题、坐标轴和可解释展示。', '《Python语言程序设计基础（第3版）》第6-7章：组合数据、文件与数据格式化。'],
  },
  14: {
    primary: '《Python程序设计（第4版）》第10章 10.1-10.3：网络数据、Requests 库和信息提取的基本流程。',
    references: ['《Python语言程序设计基础（第3版）》第7章：结构化数据。', 'Python 官方文档：json、urllib.parse；Requests 官方文档：超时、响应状态与 JSON。'],
  },
  15: {
    primary: '《Python程序设计（第4版）》第8章程序组织与代码质量相关内容，以及第1-7章和第17章核心知识的综合应用。',
    references: ['《Python程序设计（原书第3版）》的软件质量与程序设计思想相关内容。', 'PEP 8：命名、缩进、可读性和代码审查的共同标准。'],
  },
  16: {
    primary: '《Python程序设计（第4版）》基础知识、程序组织和数据应用内容的综合迁移：以可运行、可测试、可解释的证据完成项目展示。',
    references: ['《Python程序设计（原书第3版）》的程序设计、测试与对象组织相关内容。', '三本教材的综合练习：从问题、规则、数据到程序验证。'],
  },
}

const conceptCases = {
  1: ['温度转换：变量保存摄氏温度，表达式计算华氏温度，格式化输出结果。', 'celsius = 25\nfahrenheit = celsius * 1.8 + 32\nprint(f"{celsius} C = {fahrenheit:.1f} F")', '25 C = 77.0 F'],
  2: ['课程费用：先将文本转换为数值，再计算金额并格式化显示。', 'credits = int("3")\nprice = float("120.5")\nprint(f"应缴：{credits * price:.2f} 元")', '应缴：361.50 元'],
  3: ['成绩等级：先拒绝范围外输入，再按从高到低的阈值判断。', 'score = 86\nif score < 0 or score > 100:\n    level = "无效"\nelif score >= 90:\n    level = "A"\nelif score >= 80:\n    level = "B"\nelse:\n    level = "C"\nprint(level)', 'B'],
  4: ['报名费用统计：遍历数据，只累加符合规则的正数费用。', 'fees = [20, 0, 30, -5, 20]\ntotal = 0\nfor fee in fees:\n    if fee > 0:\n        total += fee\nprint(total)', '70'],
  5: ['候补名单：用 sorted 生成新列表，保留原始报名顺序。', 'names = ["Zhou", "Lin", "Wang", "Chen"]\nsorted_names = sorted(names)\nprint(names)\nprint(sorted_names)', "['Zhou', 'Lin', 'Wang', 'Chen']\n['Chen', 'Lin', 'Wang', 'Zhou']"],
  6: ['成绩查询与去重：字典负责按学号查找，集合负责统计不重复邮箱。', 'scores = {"2026001": 92, "2026002": 86}\nemails = ["a@x.edu", "b@x.edu", "a@x.edu"]\nprint(scores.get("2026003", "未找到"))\nprint(len(set(emails)))', '未找到\n2'],
  7: ['报名文本清洗：拆分字段、去除两端空白、规范邮箱大小写。', 'raw = "  Ada@School.edu ; 计算机学院 "\nemail, department = [item.strip() for item in raw.split(";")]\nemail = email.lower()\nprint(f"{email} | {department}")', 'ada@school.edu | 计算机学院'],
  8: ['邮箱规范化函数：函数接收文本并返回结果，显示由调用方负责。', 'def normalize_email(text):\n    return text.strip().lower()\n\nprint(normalize_email(" Ada@School.edu "))', 'ada@school.edu'],
  9: ['可复用校验函数：函数只承担判断职责，主程序决定如何显示。', 'def is_valid_score(score):\n    return 0 <= score <= 100\n\nprint(is_valid_score(101))\nprint(is_valid_score(86))', 'False\nTrue'],
  10: ['CSV 到 JSON：读取结构化行，按学院累计，再输出 JSON 文本。', 'import csv, io, json\ntext = "student_id,department\\n1,CS\\n2,Math\\n3,CS\\n"\ncounts = {}\nfor row in csv.DictReader(io.StringIO(text)):\n    dept = row["department"]\n    counts[dept] = counts.get(dept, 0) + 1\nprint(json.dumps(counts, ensure_ascii=False))', '{"CS": 2, "Math": 1}'],
  11: ['年龄解析：转换、范围校验和异常语义由同一函数明确表达。', 'def parse_age(text):\n    age = int(text)\n    if not 0 <= age <= 120:\n        raise ValueError("年龄应在 0 到 120 之间")\n    return age\n\nprint(parse_age("20"))', '20'],
  12: ['报名对象：把天然属于同一实体的数据和行为放入一个类。', 'from dataclasses import dataclass\n\n@dataclass\nclass Participant:\n    student_id: str\n    department: str\n\n    def is_valid(self):\n        return bool(self.student_id.strip())\n\np = Participant("2026001", "CS")\nprint(p.is_valid())', 'True'],
  13: ['基础统计：先用字典写清计数逻辑，再迁移到表格工具。', 'departments = ["CS", "Math", "CS", "Physics", "CS"]\ncounts = {}\nfor department in departments:\n    counts[department] = counts.get(department, 0) + 1\nprint(counts)', "{'CS': 3, 'Math': 1, 'Physics': 1}"],
  14: ['可信 JSON：先解析文本，再验证字段存在与类型合理。', 'import json\ntext = \'{"temperature": 26, "city": "Campus"}\'\ndata = json.loads(text)\nif "temperature" not in data:\n    raise ValueError("响应缺少 temperature 字段")\nprint(f"{data[\'city\']}：{data[\'temperature\']} C")', 'Campus：26 C'],
  15: ['代码走查：把空字段处理为显式规则，并用断言固定修复结果。', 'def count_departments(rows):\n    counts = {}\n    for row in rows:\n        dept = row.get("department", "").strip()\n        if dept:\n            counts[dept] = counts.get(dept, 0) + 1\n    return counts\n\nassert count_departments([{ "department": "CS" }, { "department": "" }]) == {"CS": 1}\nprint("tests passed")', 'tests passed'],
  16: ['项目答辩：函数既要给出正常结果，也要明确空数据的行为。', 'def summary(scores):\n    if not scores:\n        return None\n    return sum(scores) / len(scores)\n\nassert summary([80, 100]) == 90\nassert summary([]) is None\nprint("tests passed")', 'tests passed'],
}

const debugCases = {
  1: ['名称错误：第 3 行使用了未定义的 fahrenheit。', 'celsius = 25\nfahrenheit_value = celsius * 1.8 + 32\nprint(fahrenheit)'],
  2: ['类型错误：字符串不能直接与整数相加。', 'score_text = "90"\nprint(score_text + 5)'],
  3: ['分支顺序错误：90 分会被第一个条件提前截获。', 'score = 90\nif score >= 60:\n    level = "及格"\nelif score >= 90:\n    level = "优秀"\nprint(level)'],
  4: ['索引越界：range 的上界不能多取一个位置。', 'fees = [20, 30]\nfor index in range(len(fees) + 1):\n    print(fees[index])'],
  5: ['别名错误：b = a 不是复制，修改 b 会改变 a。', 'names = ["Lin", "Wang"]\nbackup = names\nbackup.append("Chen")\nprint(names)'],
  6: ['键不存在：方括号访问外部或可选数据时会触发 KeyError。', 'scores = {"2026001": 92}\nprint(scores["2026999"])'],
  7: ['方法没有调用：少了括号时保存的是方法对象，不是清洗结果。', 'email = " Ada@School.edu "\nprint(email.strip)'],
  8: ['返回值错误：print 只显示，调用表达式仍然得到 None。', 'def normalize_email(text):\n    print(text.strip().lower())\n\nresult = normalize_email(" Ada@School.edu ")\nprint(result)'],
  9: ['模块错误：浏览器练习环境中不存在本地 utils.py，应先定位运行环境与导入路径。', 'from utils import is_valid_score\nprint(is_valid_score(86))'],
  10: ['字段错误：CSV 表头不一致时，直接按不存在的键读取会失败。', 'import csv, io\ntext = "student_id,dept\\n1,CS\\n"\nrow = next(csv.DictReader(io.StringIO(text)))\nprint(row["department"])'],
  11: ['异常范围过宽：裸 except 会掩盖意外错误，不利于定位。', 'def parse_age(text):\n    try:\n        return int(text)\n    except:\n        return 0\n\nprint(parse_age("abc"))'],
  12: ['属性错误：类实例没有未声明的 student_name 属性。', 'from dataclasses import dataclass\n\n@dataclass\nclass Participant:\n    student_id: str\n\np = Participant("2026001")\nprint(p.student_name)'],
  13: ['除零错误：空数据没有平均值，必须先决定空数据的业务行为。', 'values = []\nprint(sum(values) / len(values))'],
  14: ['字段错误：HTTP 成功或 JSON 可解析都不等于所需字段一定存在。', 'import json\ndata = json.loads(\'{"city": "Campus"}\')\nprint(data["temperature"])'],
  15: ['逻辑缺陷：空学院被统计成一个类别，运行不报错也不代表规则正确。', 'rows = [{"department": "CS"}, {"department": ""}]\ncounts = {}\nfor row in rows:\n    dept = row.get("department", "")\n    counts[dept] = counts.get(dept, 0) + 1\nprint(counts)'],
  16: ['边界错误：空列表作为分母会触发 ZeroDivisionError。', 'def summary(scores):\n    return sum(scores) / len(scores)\n\nprint(summary([]))'],
}

const applicationCases = {
  1: ['BMI 应用：增加身高为 0 的输入保护，使计算公式具有明确边界。', 'height_m = 1.70\nweight_kg = 60\nif height_m <= 0:\n    print("身高必须大于 0")\nelse:\n    bmi = weight_kg / height_m ** 2\n    print(f"BMI = {bmi:.1f}")', 'BMI = 20.8'],
  2: ['报名金额应用：把原始文本转为数值；金额显示始终保留两位小数。', 'credits_text = "4"\nprice_text = "120.5"\namount = int(credits_text) * float(price_text)\nprint(f"应缴：{amount:.2f} 元")', '应缴：482.00 元'],
  3: ['阶梯电价应用：明确每个区间并检验临界值 0、180、181。', 'kwh = 181\nif kwh < 0:\n    print("用电量无效")\nelif kwh <= 180:\n    print(f"费用：{kwh * 0.5:.1f}")\nelse:\n    cost = 180 * 0.5 + (kwh - 180) * 0.8\n    print(f"费用：{cost:.1f}")', '费用：90.8'],
  4: ['持续录入应用：while 循环在收到 q 时结束，并统计有效人数。', 'entries = ["Ada", "", "Lin", "q"]\ncount = 0\nindex = 0\nwhile index < len(entries) and entries[index] != "q":\n    if entries[index].strip():\n        count += 1\n    index += 1\nprint(count)', '2'],
  5: ['消费记录应用：用切片取最近三条，并计算一份不改变原列表的新排序。', 'records = [56, 32, 80, 18, 65]\nrecent = records[-3:]\nprint(recent)\nprint(sorted(records, reverse=True))', '[80, 18, 65]\n[80, 65, 56, 32, 18]'],
  6: ['报名汇总应用：字典累计学院人数，集合统计不重复报名者。', 'rows = [("CS", "2026001"), ("Math", "2026002"), ("CS", "2026001")]\ncounts, ids = {}, set()\nfor dept, student_id in rows:\n    counts[dept] = counts.get(dept, 0) + 1\n    ids.add(student_id)\nprint(counts)\nprint(len(ids))', "{'CS': 2, 'Math': 1}\n2"],
  7: ['邮箱校验应用：先清洗文本，再用简单规则过滤明显无效的邮箱。', 'email = "  Ada@School.edu "\nnormalized = email.strip().lower()\nif "@" in normalized and normalized.split("@")[-1]:\n    print(normalized)\nelse:\n    print("邮箱格式错误")', 'ada@school.edu'],
  8: ['报名校验应用：用多个职责单一的函数组合出可读规则。', 'def normalize_email(text):\n    return text.strip().lower()\n\ndef is_school_email(email):\n    return email.endswith("@school.edu")\n\nemail = normalize_email(" Ada@School.edu ")\nprint(is_school_email(email))', 'True'],
  9: ['模块化应用：把纯函数和演示代码分开，方便在项目中复用与测试。', 'def is_valid_score(score):\n    return isinstance(score, (int, float)) and 0 <= score <= 100\n\ndef show_score_status(score):\n    return "有效" if is_valid_score(score) else "无效"\n\nprint(show_score_status(86))', '有效'],
  10: ['数据持久化应用：生成 JSON 文本时使用 ensure_ascii=False 保留中文。', 'import json\nsummary = {"学院": "计算机学院", "人数": 32}\ntext = json.dumps(summary, ensure_ascii=False)\nprint(text)\nprint(json.loads(text)["人数"])', '{"学院": "计算机学院", "人数": 32}\n32'],
  11: ['可靠输入应用：分别验证正常值、格式错误和值域错误。', 'def parse_age(text):\n    age = int(text)\n    if not 0 <= age <= 120:\n        raise ValueError("年龄应在 0 到 120 之间")\n    return age\n\nfor text in ["20", "-1", "abc"]:\n    try:\n        print(parse_age(text))\n    except (ValueError, TypeError) as error:\n        print(f"输入 {text!r} 无效：{error}")', '20\n输入 \'-1\' 无效：年龄应在 0 到 120 之间\n输入 \'abc\' 无效：invalid literal for int() with base 10: \'abc\''],
  12: ['对象应用：对象用方法表达自身的有效性，而非把规则散落在外部。', 'from dataclasses import dataclass\n\n@dataclass\nclass Participant:\n    student_id: str\n    department: str\n\n    def is_valid(self):\n        return bool(self.student_id.strip()) and bool(self.department.strip())\n\nprint(Participant("2026001", "CS").is_valid())\nprint(Participant("", "CS").is_valid())', 'True\nFalse'],
  13: ['可视化应用：图表必须携带问题、类别和数量，避免只展示图形。', 'import matplotlib.pyplot as plt\ncounts = {"CS": 3, "Math": 1, "Physics": 1}\nplt.bar(counts.keys(), counts.values())\nplt.title("Campus activity registrations by department")\nplt.xlabel("Department")\nplt.ylabel("Registrations")\nprint("图表已生成；结论仅适用于这 5 条示例记录。")', '图表已生成；结论仅适用于这 5 条示例记录。'],
  14: ['网络数据应用：离线课堂用模拟响应练习“状态、结构、字段”三层验证。', 'response_status = 200\ndata = {"city": "Campus", "temperature": 26}\nif response_status != 200:\n    print("请求未成功")\nelif not isinstance(data, dict) or "temperature" not in data:\n    print("响应结构不符合预期")\nelse:\n    print(f"{data[\'city\']}：{data[\'temperature\']} C")', 'Campus：26 C'],
  15: ['项目质量应用：用测试数据同时覆盖正常记录、空字段和缺少字段。', 'def count_departments(rows):\n    counts = {}\n    for row in rows:\n        dept = row.get("department", "").strip()\n        if dept:\n            counts[dept] = counts.get(dept, 0) + 1\n    return counts\n\nassert count_departments([{ "department": "CS" }]) == {"CS": 1}\nassert count_departments([{ "department": "" }]) == {}\nassert count_departments([{}]) == {}\nprint("3 tests passed")', '3 tests passed'],
  16: ['可解释交付：用测试说明函数对正常数据和空数据的明确承诺。', 'def summary(scores):\n    if not scores:\n        return None\n    return sum(scores) / len(scores)\n\nfor sample in ([80, 100], [], [90]):\n    print(sample, "=>", summary(sample))', '[80, 100] => 90.0\n[] => None\n[90] => 90.0'],
}

const ruleQuestions = {
  1: ['程序规格中，哪一项最能说明“正确”的含义？', ['漂亮的输出颜色', '输入、处理规则、输出和至少一个测试样例', '尽可能多的代码行', '先得到一次运行结果'], 1, '规格把自然语言问题转为可检查的输入、规则、输出和测试依据。'],
  2: ['用户输入“90”后，直接做 “90” + 5 为什么会失败？', ['变量名不合法', 'input 得到的是 str，需先转换为数值', '90 不能参与加法', 'print 不支持数字'], 1, 'input() 返回字符串；数值计算前应使用 int() 或 float() 明确转换。'],
  3: ['多分支成绩判断为什么通常从最高阈值向下写？', ['能减少缩进', '避免较宽的低阈值条件提前截获高分', 'Python 只允许这样写', '可以省略 else'], 1, 'if/elif 自上而下只执行第一个为真的分支。'],
  4: ['已知要处理一个列表中每一项时，优先选择 for 的理由是？', ['for 一定更快', 'for 直接表达对可迭代对象逐项处理', 'while 不能使用列表', 'for 不需要变量'], 1, 'for 的语义是遍历序列或其他可迭代对象；while 适合终止条件驱动的问题。'],
  5: ['要排序但不改变原始名单，应使用哪种方式？', ['names.sort()', 'sorted(names)', 'names = names.sort()', 'del names'], 1, 'sorted 返回新列表；list.sort 原地修改原列表并返回 None。'],
  6: ['读取可能不存在的外部字典字段时，哪种写法更适合给出默认值？', ['scores["id"]', 'scores.get("id", "未找到")', 'set(scores)', 'list(scores)[0]'], 1, 'dict.get 可以在键不存在时返回指定默认值，避免不必要的 KeyError。'],
  7: ['为什么 name.strip() 常需要重新赋值给变量？', ['strip 只能执行一次', '字符串不可变，strip 返回新字符串', 'strip 会删除中间字符', '字符串没有方法'], 1, '字符串方法通常返回新字符串；原字符串不会被原地改变。'],
  8: ['一个用于计算或清洗的函数通常应通过什么交出结果？', ['print', 'return', 'input', 'import'], 1, 'return 让调用方继续使用结果；print 只负责显示。'],
  9: ['脚本被导入时，如何避免演示代码自动执行？', ['使用 if __name__ == "__main__"', '删除所有函数', '每行都加 print', '使用 while True'], 0, '该条件只在文件被直接执行时为真，适合放演示或命令行入口。'],
  10: ['读取文本文件时使用 with open(...) as f 的主要价值是？', ['自动排序数据', '代码块结束时可靠关闭文件', '自动转为 JSON', '自动联网'], 1, '上下文管理器在正常或异常路径下都会释放文件资源。'],
  11: ['为什么不建议使用 except: pass？', ['Python 不支持 except', '会隐藏意外错误，使问题难以定位', '会自动删除文件', '只能在循环内使用'], 1, '异常处理应尽量窄，只处理预期异常，并保留有行动意义的信息。'],
  12: ['实例方法中的 self 指向什么？', ['Python 解释器', '当前调用方法的对象实例', '所有对象的公共类', '一个全局变量'], 1, 'self 让实例方法访问当前对象的属性和其他方法。'],
  13: ['比较多个学院的报名人数，图表至少需要清楚标明什么？', ['随机配色', '所回答的问题、类别和数量单位', '动画效果', '代码行数'], 1, '读者必须知道图表的对象、数量含义和可得出的结论边界。'],
  14: ['HTTP 状态码为 200 后，仍必须验证什么？', ['无需验证', 'JSON 能否解析及所需字段是否存在', '只验证网速', '只修改 URL'], 1, '200 只说明请求被成功处理；业务所需字段仍可能缺失或类型不符。'],
  15: ['一条高质量代码走查意见应包含什么？', ['只说“写得不错”', '可复现的问题、风险与验证方式', '只纠正空格', '要求全部重写'], 1, '可验证反馈让作者能复现、修复，并证明缺陷已经被解决。'],
  16: ['最能说明项目可靠性的证据是？', ['界面截图', '一次正常输出', '核心流程、边界或失败场景和测试证据', '代码行数'], 2, '可靠性来自可运行、可解释、可复现的证据链，而不是一次展示。'],
}

const predictQuestions = {
  1: ['执行 x = 3; x = x + 2 后，x 的值是？', ['3', '5', '32', '报错'], 1, '赋值先计算右侧表达式，再把名称绑定到新值。'],
  2: ['执行 int("3") * float("120.5") 的结果类型是？', ['int', 'float', 'str', 'bool'], 1, '只要参与运算的一方是 float，乘法结果就是 float。'],
  3: ['当 score 为 80，且先判断 score >= 90、再判断 score >= 80 时，结果应为？', ['A', 'B', 'C', '无效'], 1, '第一个条件为假，第二个条件为真，进入 B 分支。'],
  4: ['range(3) 会依次产生哪些值？', ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3'], 0, 'range 的右端不包含在结果中。'],
  5: ['执行 values = [1, 2, 3]; values[-1] 的结果是？', ['1', '2', '3', '报错'], 2, '负索引从序列末尾开始计数，-1 是最后一个元素。'],
  6: ['set(["a", "b", "a"]) 的长度是？', ['1', '2', '3', '报错'], 1, '集合只保留不重复的元素。'],
  7: ['" Ada ".strip().lower() 的结果是？', ['" Ada "', '"ada"', '" ADA "', '报错'], 1, 'strip 去掉两端空白，lower 返回小写的新字符串。'],
  8: ['未显式 return 的 Python 函数调用结果默认是什么？', ['空字符串', '0', 'None', '异常'], 2, 'Python 函数没有执行 return 时默认返回 None。'],
  9: ['import math 后，调用平方根的规范写法是？', ['sqrt(9)', 'math.sqrt(9)', 'math(9)', 'import.sqrt(9)'], 1, '普通 import 导入模块名，模块成员以“模块名.成员名”访问。'],
  10: ['json.loads 的作用是？', ['把 Python 对象写入文件', '把 JSON 文本解析为 Python 对象', '把 CSV 转为图表', '删除文件'], 1, 'loads 处理字符串；load 处理文件对象。'],
  11: ['assert 2 + 2 == 4 成功时会怎样？', ['打印 True', '没有异常，继续执行', '自动保存文件', '返回字符串'], 1, '断言条件为真时静默通过；为假时抛出 AssertionError。'],
  12: ['Participant("2026001", "CS") 得到的是什么？', ['一个类定义', '一个 Participant 实例', '一个模块', '一个列表'], 1, '调用类名会创建该类的实例对象。'],
  13: ['字典 counts 中不存在 "CS" 时，counts.get("CS", 0) 返回什么？', ['None', '0', 'KeyError', '空列表'], 1, 'get 的第二个参数指定键不存在时的默认值。'],
  14: ['json.loads(\'{"x": 1}\')["x"] 的结果是？', ['"1"', '1', 'True', 'KeyError'], 1, 'JSON 数字解析为 Python 数字；x 字段存在且值为整数 1。'],
  15: ['assert count_departments([{}]) == {} 的价值是？', ['让代码更长', '把缺少字段这一边界规则固定为可重复检查', '自动生成界面', '跳过错误'], 1, '断言把对边界输入的约定变成自动检查的证据。'],
  16: ['summary([]) 约定返回 None 时，表达式 summary([]) is None 的结果是？', ['True', 'False', '报错', '0'], 0, 'None 是单例对象，is 适合判断是否为 None。'],
}

function caseFrom(tuple, kind, emphasis, tests) {
  const [title, code, expected] = tuple
  return {
    kind,
    title,
    code,
    expected: expected || '预期暴露一个报错或不符合规则的结果；定位第一个根因后完成最小修复并复测。',
    emphasis,
    tests,
  }
}

export function textbookBreakdown(lesson) {
  const mapped = textbookMap[lesson.id]
  return mapped || { primary: lesson.mapping, references: [] }
}

export function caseSetFor(lesson, detail, lab) {
  const application = applicationCases[lesson.id]
  return [
    caseFrom(conceptCases[lesson.id] || [lab.title, lab.starter, lab.expected], '概念示例', '用最小可运行程序呈现本节规则，先解释每个名称、值和控制关系。', detail.liveCoding.steps),
    caseFrom(debugCases[lesson.id], '预测与纠错', '运行前先写出预期；运行后依据报错行或反例定位第一个根因，再做最小修复。', detail.liveCoding.checks),
    caseFrom(application, 'Python 应用', '把本节规则放入真实而脱敏的小任务，验证正常路径、边界或失败路径，并说明结果的适用范围。', [`先运行应用示例并核对预期结果：${application[2]}`, '改变一个正常输入，先写预期，再运行核对。', `围绕“${detail.difficulties[0]}”补充一个边界或失败输入，并解释程序行为。`]),
  ]
}

export function knowledgeTeachingPlan(lesson, detail, lab) {
  const cases = caseSetFor(lesson, detail, lab)
  return detail.knowledge.map(([title, content], index) => ({
    title,
    content,
    explain: `在“${lesson.case}”中，这一知识用于明确数据怎样进入程序、规则怎样执行或结果怎样验证。准确规则是：${content}`,
    demonstration: `使用“${cases[0].title}”的最小代码。逐行说明输入的数据、执行产生的状态变化以及预期输出；运行前先完成预测，运行后再依据实际结果核对规则。`,
    board: [`规则：${title}`, '最小例子：写出一个能运行的语句及预期结果', `边界或反例：${cases[1].title}`],
    checkpoint: detail.liveCoding.checks[index % detail.liveCoding.checks.length],
    response: `常见错误先回到最小例子：指出输入、当前状态和输出，再核对具体 Python 规则；只修复第一个根因，并用原输入和一个边界输入复测。`,
    learnerOutcome: `能够用自己的话说明“${title}”的含义，并在“${lesson.case}”中指出它控制的规则或数据变化。`,
  }))
}

export function coursePackFor(lesson, detail, lab) {
  return {
    lesson,
    detail,
    lab,
    textbooks: textbookBreakdown(lesson),
    knowledge: knowledgeTeachingPlan(lesson, detail, lab),
    cases: caseSetFor(lesson, detail, lab),
    questions: classroomQuestionsFor(lesson, detail, lab),
    practices: applicationPracticeFor(lesson, detail, lab),
  }
}

export function classroomQuestionsFor(lesson, detail, lab) {
  const [ruleQuestion, ruleOptions, ruleAnswer, ruleExplain] = ruleQuestions[lesson.id]
  const [predictQuestion, predictOptions, predictAnswer, predictExplain] = predictQuestions[lesson.id]
  const debug = debugCases[lesson.id]
  const compactQuestion = (text) => text.replace(/[\s`；;，,。！？!?“”"']/g, '')
  const coreQuestion = compactQuestion(lab.quiz.question) === compactQuestion(predictQuestion)
    ? {
      label: '核心概念',
      question: '关于程序与算法，下列说法正确的是？',
      options: ['程序应把问题表示为精确、有限、可执行的步骤', '只要能输出一次，程序步骤可以不明确', '算法必须永远运行而不能结束', '算法只等于调用很多库函数'],
      answer: 0,
      explain: '程序与算法首先要求规则精确、步骤有限且可以执行；一次偶然得到输出不能证明程序符合任务。',
    }
    : { label: '核心概念', question: lab.quiz.question, options: lab.quiz.options, answer: lab.quiz.answer, explain: lab.quiz.explain }
  return [
    coreQuestion,
    { label: '规则理解', question: ruleQuestion, options: ruleOptions, answer: ruleAnswer, explain: ruleExplain },
    { label: '运行预测', question: predictQuestion, options: predictOptions, answer: predictAnswer, explain: predictExplain },
    { label: '错误定位', question: `“${debug[0]}”中，排查时首先应做什么？`, options: ['忽略报错并重写全部代码', '读取报错类型和行号，核对该行与上一行的规则', '只改变输出文字', '反复运行原代码'], answer: 1, explain: '先定位第一个可验证的根因，再做局部修改，能避免同时引入新的错误。' },
    { label: '边界验证', question: `为了验证“${lesson.case}”而不只证明一次正常输出，至少还应加入哪类测试？`, options: ['与正常规则相邻的临界值或失败输入', '把变量名改短', '增加更多打印语句', '只换一种颜色'], answer: 0, explain: `边界或失败输入能检验本课难点“${detail.difficulties[0]}”是否真的被程序处理。` },
    { label: '应用判断', question: `开始本节“${lesson.case}”应用练习前，最可靠的工作顺序是？`, options: ['明确输入、规则、预期和测试，再编码并运行验证', '直接寻找一段完整代码', '先做界面，再补规则', '只写一个正常输入'], answer: 0, explain: '可解释的程序从规则和验收条件出发；代码运行后还必须用测试验证。' },
  ]
}

export function applicationPracticeFor(lesson, detail, lab) {
  const cases = caseSetFor(lesson, detail, lab)
  return [
    { title: '基础巩固', task: lab.task, check: `达到：输出或行为符合“${lab.expected}”。` },
    { title: '调试修复', task: `载入“${cases[1].title}”，定位第一个根因，完成最小修复后重新运行。`, check: '达到：能指出错误行或错误规则，并用一次复测证明修复有效。' },
    { title: '应用变式', task: cases[2].title, check: `达到：完成“${cases[2].expected}”对应规则，并额外改变一个输入验证边界。` },
    { title: '解释记录', task: `选择本节一行关键代码，写出它接收什么数据、产生什么结果、删去后会影响哪项测试。`, check: '达到：解释引用了本节具体 Python 规则，而非仅复述输出。' },
  ]
}
