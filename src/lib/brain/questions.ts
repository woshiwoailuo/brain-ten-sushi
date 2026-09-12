/** 脑力十题 · 106 道题库（含答案，仅服务端评分使用） */
import { CATEGORIES, type Category } from "./meta";

export type { Category };
export { CATEGORIES };
export type QuestionType = "choice" | "boolean" | "fill";
export type FillKind = "number" | "poetry";

export type Question = {
  id: number;
  category: Category;
  title: string;
  visual: string;
  options: string[];
  type: QuestionType;
  difficulty: 1 | 2 | 3;
  answer: string;
  explanation: string;
  aliases: string[];
  fillKind?: FillKind;
  inputMode?: "decimal" | "text";
};

export const QUESTIONS: Question[] = 
[
  {
    "id": 0,
    "category": "数字规律",
    "title": "按照相邻项的变化规律，下一个数是？",
    "visual": "2，5，8，11，？",
    "options": [
      "15",
      "13",
      "16",
      "14"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "14",
    "explanation": "每次增加 3，因此 11 + 3 = 14。",
    "aliases": []
  },
  {
    "id": 1,
    "category": "数字规律",
    "title": "按照相邻项的变化规律，下一个数是？",
    "visual": "3，6，12，24，？",
    "options": [
      "42",
      "36",
      "48",
      "54"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "48",
    "explanation": "每一项是前一项的 2 倍。",
    "aliases": []
  },
  {
    "id": 2,
    "category": "数字规律",
    "title": "相邻两项的差依次增加 2，下一个数是？",
    "visual": "1，4，9，16，？",
    "options": [
      "26",
      "32",
      "24",
      "25"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "25",
    "explanation": "相邻差为 3、5、7，接下来是 9，16 + 9 = 25。",
    "aliases": []
  },
  {
    "id": 3,
    "category": "数字规律",
    "title": "每项是前两项之和，下一个数是？",
    "visual": "2，3，5，8，13，？",
    "options": [
      "21",
      "20",
      "23",
      "18"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "21",
    "explanation": "8 + 13 = 21。",
    "aliases": []
  },
  {
    "id": 4,
    "category": "数字规律",
    "title": "按交替运算的规律，下一个数是？",
    "visual": "2，4，5，10，11，？",
    "options": [
      "22",
      "12",
      "21",
      "24"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "22",
    "explanation": "运算交替为乘 2、加 1，接下来 11 × 2 = 22。",
    "aliases": []
  },
  {
    "id": 5,
    "category": "数字规律",
    "title": "相邻两项的差依次翻倍，下一个数是？",
    "visual": "1，3，7，15，？",
    "options": [
      "31",
      "32",
      "30",
      "29"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "31",
    "explanation": "差为 2、4、8，接下来是 16，15 + 16 = 31。",
    "aliases": []
  },
  {
    "id": 6,
    "category": "数字规律",
    "title": "奇数位置和偶数位置分别成规律，下一个数是？",
    "visual": "1，10，2，20，3，？",
    "options": [
      "30",
      "40",
      "4",
      "25"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "30",
    "explanation": "奇数位置为 1、2、3，偶数位置为 10、20、30。",
    "aliases": []
  },
  {
    "id": 7,
    "category": "数字规律",
    "title": "每次减去的数增加 1，下一个数是？",
    "visual": "30，28，25，21，？",
    "options": [
      "16",
      "15",
      "18",
      "17"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "16",
    "explanation": "依次减 2、3、4，接下来减 5，得到 16。",
    "aliases": []
  },
  {
    "id": 8,
    "category": "图形推理",
    "title": "按相同顺序循环，问号处是什么？",
    "visual": "● ▲ ■ ● ▲ ？",
    "options": [
      "◆",
      "●",
      "■",
      "▲"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "■",
    "explanation": "三个图形按圆、三角、方块循环。",
    "aliases": []
  },
  {
    "id": 9,
    "category": "图形推理",
    "title": "每组增加一个圆，下一组是什么？",
    "visual": "●  /  ●●  /  ●●●  /  ？",
    "options": [
      "●●",
      "●",
      "●●●●",
      "●●●●●"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "●●●●",
    "explanation": "每组圆的数量依次是 1、2、3、4。",
    "aliases": []
  },
  {
    "id": 10,
    "category": "图形推理",
    "title": "每次顺时针转 90°，下一个方向是？",
    "visual": "↑ → ↓ ？",
    "options": [
      "→",
      "↓",
      "←",
      "↑"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "←",
    "explanation": "从向下顺时针转 90°，指向左。",
    "aliases": []
  },
  {
    "id": 11,
    "category": "图形推理",
    "title": "每行按同样规律向左循环一格，缺少什么？",
    "visual": "● ▲ ■\n▲ ■ ●\n■ ● ？",
    "options": [
      "◆",
      "●",
      "▲",
      "■"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "▲",
    "explanation": "每行都由圆、三角、方块循环组成，最后缺三角。",
    "aliases": []
  },
  {
    "id": 12,
    "category": "图形推理",
    "title": "两种状态交替出现，下一项是？",
    "visual": "○ ● ○ ● ○ ？",
    "options": [
      "■",
      "○",
      "□",
      "●"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "●",
    "explanation": "空心圆与实心圆交替，下一项为实心圆。",
    "aliases": []
  },
  {
    "id": 13,
    "category": "图形推理",
    "title": "每行右侧数量等于前两格之和，缺多少个点？",
    "visual": "1 · 2 · 3\n2 · 3 · 5\n3 · 4 · ？",
    "options": [
      "6",
      "8",
      "7",
      "9"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "7",
    "explanation": "前两行分别是 1 + 2 = 3、2 + 3 = 5，最后为 3 + 4 = 7。",
    "aliases": []
  },
  {
    "id": 14,
    "category": "图形推理",
    "title": "图形按边数逐个增加，接下来应是什么？",
    "visual": "三角形 → 四边形 → 五边形 → ？",
    "options": [
      "圆形",
      "六边形",
      "三角形",
      "七边形"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "六边形",
    "explanation": "边数依次为 3、4、5、6。",
    "aliases": []
  },
  {
    "id": 15,
    "category": "图形推理",
    "title": "两种图形按“两个一组”重复，下一项是？",
    "visual": "▲ ▲ ● ● ▲ ▲ ？",
    "options": [
      "●",
      "◆",
      "■",
      "▲"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "●",
    "explanation": "重复单元是两个三角形、两个圆，因此下一项为圆。",
    "aliases": []
  },
  {
    "id": 16,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "鸟 : 羽毛 ＝ 鱼 : ？",
    "options": [
      "水",
      "鱼卵",
      "鳞片",
      "鱼鳍"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "鳞片",
    "explanation": "羽毛和鳞片分别覆盖鸟与鱼的身体表面。",
    "aliases": []
  },
  {
    "id": 17,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "医生 : 医院 ＝ 教师 : ？",
    "options": [
      "讲台",
      "课本",
      "学校",
      "学生"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "学校",
    "explanation": "前者是职业，后者是典型工作机构。",
    "aliases": []
  },
  {
    "id": 18,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "温度计 : 温度 ＝ 天平 : ？",
    "options": [
      "速度",
      "长度",
      "时间",
      "质量"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "质量",
    "explanation": "温度计测量温度，天平测量质量。",
    "aliases": []
  },
  {
    "id": 19,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "种子 : 植物 ＝ 鸟卵 : ？",
    "options": [
      "巢",
      "树",
      "羽毛",
      "鸟"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "鸟",
    "explanation": "种子可以发育成植物，鸟卵可以孵化出鸟。",
    "aliases": []
  },
  {
    "id": 20,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "手套 : 手 ＝ 袜子 : ？",
    "options": [
      "帽子",
      "鞋",
      "脚",
      "腿"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "脚",
    "explanation": "手套穿戴在手上，袜子穿戴在脚上。",
    "aliases": []
  },
  {
    "id": 21,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "作家 : 小说 ＝ 作曲家 : ？",
    "options": [
      "乐曲",
      "乐器",
      "画作",
      "舞台"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "乐曲",
    "explanation": "前者是创作者，后者是其创作的作品。",
    "aliases": []
  },
  {
    "id": 22,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "目录 : 书籍 ＝ 菜单 : ？",
    "options": [
      "厨师",
      "餐具",
      "菜品",
      "餐桌"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "菜品",
    "explanation": "目录列出书籍内容，菜单列出可选菜品。",
    "aliases": []
  },
  {
    "id": 23,
    "category": "语言类比",
    "title": "选择与前一组关系最一致的一项。",
    "visual": "小时 : 分钟 ＝ 分钟 : ？",
    "options": [
      "日",
      "周",
      "秒",
      "年"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "秒",
    "explanation": "前后两种时间单位都相差 60 倍。",
    "aliases": []
  },
  {
    "id": 24,
    "category": "逻辑判断",
    "title": "所有蓝卡都是圆形。某张卡是蓝卡。哪项一定正确？",
    "visual": "",
    "options": [
      "这张卡是圆形",
      "所有圆形卡都是蓝卡",
      "这张卡是方形",
      "这张卡不是圆形"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "这张卡是圆形",
    "explanation": "蓝卡属于圆形卡，所以这张蓝卡一定是圆形。",
    "aliases": []
  },
  {
    "id": 25,
    "category": "逻辑判断",
    "title": "小安比小白高，小白比小陈高。谁最高？",
    "visual": "",
    "options": [
      "无法判断",
      "小白",
      "小陈",
      "小安"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "小安",
    "explanation": "高度顺序为小安 > 小白 > 小陈。",
    "aliases": []
  },
  {
    "id": 26,
    "category": "逻辑判断",
    "title": "如果开灯，指示器就会亮。现在指示器没亮，能推出什么？",
    "visual": "",
    "options": [
      "有人刚刚关灯",
      "灯没有打开",
      "灯已经打开",
      "指示器一定坏了"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "灯没有打开",
    "explanation": "按题设“开灯必亮”，不亮可以推出没有开灯；不能推出其他细节。",
    "aliases": []
  },
  {
    "id": 27,
    "category": "逻辑判断",
    "title": "有些读者是画家，所有画家都会画画。哪项一定正确？",
    "visual": "",
    "options": [
      "没有读者会画画",
      "所有画家是读者",
      "有些读者会画画",
      "所有读者会画画"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "有些读者会画画",
    "explanation": "那些同时是画家的读者一定会画画。",
    "aliases": []
  },
  {
    "id": 28,
    "category": "逻辑判断",
    "title": "甲、乙、丙排队。甲不在第一，丙不在第三，乙在第三。谁在第一？",
    "visual": "",
    "options": [
      "乙",
      "丙",
      "甲",
      "无法判断"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "丙",
    "explanation": "乙在第三，甲不能第一，只能第二，丙在第一。",
    "aliases": []
  },
  {
    "id": 29,
    "category": "逻辑判断",
    "title": "盒里只有红球和蓝球。闭眼至少拿出几个球，才能保证有两个同色？",
    "visual": "",
    "options": [
      "5 个",
      "2 个",
      "4 个",
      "3 个"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "3 个",
    "explanation": "前两个可能一红一蓝，第三个必然与其中一个同色。",
    "aliases": []
  },
  {
    "id": 30,
    "category": "逻辑判断",
    "title": "所有 A 都是 B，所有 B 都是 C。哪项一定正确？",
    "visual": "",
    "options": [
      "所有 B 都是 A",
      "所有 A 都是 C",
      "所有 C 都是 A",
      "没有 A 是 C"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "所有 A 都是 C",
    "explanation": "A 包含在 B 中，B 包含在 C 中，因此 A 包含在 C 中。",
    "aliases": []
  },
  {
    "id": 31,
    "category": "逻辑判断",
    "title": "三个人各握一次手，每两人之间只握一次，一共握几次？",
    "visual": "",
    "options": [
      "3 次",
      "9 次",
      "2 次",
      "6 次"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "3 次",
    "explanation": "三对分别为甲乙、甲丙、乙丙，共 3 次。",
    "aliases": []
  },
  {
    "id": 32,
    "category": "空间方向",
    "title": "面向北，先向右转 90°，再向左转 180°。现在面向哪里？",
    "visual": "",
    "options": [
      "南",
      "西",
      "北",
      "东"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "西",
    "explanation": "北向右转到东，东向左转 180° 到西。",
    "aliases": []
  },
  {
    "id": 33,
    "category": "空间方向",
    "title": "向东走 3 米，再向北走 4 米，终点在起点哪个方向？",
    "visual": "",
    "options": [
      "西北",
      "东南",
      "东北",
      "西南"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "东北",
    "explanation": "终点同时位于起点东侧和北侧，即东北。",
    "aliases": []
  },
  {
    "id": 34,
    "category": "空间方向",
    "title": "钟表上，从 12 点方向顺时针转 90°，指向几？",
    "visual": "",
    "options": [
      "6",
      "3",
      "9",
      "12"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "3",
    "explanation": "一周 360°，90° 是四分之一圈，从 12 指向 3。",
    "aliases": []
  },
  {
    "id": 35,
    "category": "空间方向",
    "title": "一个正方形旋转 90° 后，与原来的轮廓是什么关系？",
    "visual": "",
    "options": [
      "面积变为一半",
      "完全重合",
      "变成长方形",
      "变成三角形"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "完全重合",
    "explanation": "正方形绕中心转 90° 后轮廓完全重合。",
    "aliases": []
  },
  {
    "id": 36,
    "category": "空间方向",
    "title": "面向南，连续向左转两次，每次 90°，现在面向哪里？",
    "visual": "",
    "options": [
      "南",
      "北",
      "东",
      "西"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "北",
    "explanation": "南向左转到东，再向左转到北。",
    "aliases": []
  },
  {
    "id": 37,
    "category": "空间方向",
    "title": "向北走 2 米，向东走 2 米，再向南走 2 米。现在在起点哪里？",
    "visual": "",
    "options": [
      "原点",
      "正西 2 米",
      "正北 2 米",
      "正东 2 米"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "正东 2 米",
    "explanation": "南北移动抵消，剩下向东的 2 米。",
    "aliases": []
  },
  {
    "id": 38,
    "category": "空间方向",
    "title": "一个大立方体由 2×2×2 个相同小立方体组成，共有几个小立方体？",
    "visual": "",
    "options": [
      "12",
      "8",
      "4",
      "6"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "8",
    "explanation": "长、宽、高各 2 个，总数为 2 × 2 × 2 = 8。",
    "aliases": []
  },
  {
    "id": 39,
    "category": "空间方向",
    "title": "将向右的箭头关于竖直镜面左右翻转，它指向哪里？",
    "visual": "→",
    "options": [
      "左",
      "下",
      "右",
      "上"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "左",
    "explanation": "左右镜像使向右变成向左。",
    "aliases": []
  },
  {
    "id": 40,
    "category": "数字规律",
    "title": "连续三个整数的和一定能被 3 整除。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "正确",
    "explanation": "三个连续整数可写为 n−1、n、n+1，总和为 3n。",
    "aliases": []
  },
  {
    "id": 41,
    "category": "数字规律",
    "title": "一个数先增加一倍，再减少一半，一定回到原数。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "正确",
    "explanation": "增加一倍变成 2n，再减少其一半，得到 n。",
    "aliases": []
  },
  {
    "id": 42,
    "category": "数字规律",
    "title": "一个价格先涨 20%，再降 20%，最终价格不变。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "错误",
    "explanation": "最终为原价的 1.2 × 0.8 = 0.96，即减少了 4%。",
    "aliases": []
  },
  {
    "id": 43,
    "category": "数字规律",
    "title": "任意两个奇数的乘积都是偶数。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "错误",
    "explanation": "奇数乘奇数仍是奇数，例如 3 × 5 = 15。",
    "aliases": []
  },
  {
    "id": 44,
    "category": "数字规律",
    "title": "在 1 到 20 的整数中，5 的倍数有 4 个。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "分别是 5、10、15、20。",
    "aliases": []
  },
  {
    "id": 45,
    "category": "数字规律",
    "title": "若 a 大于 b，那么 a 的平方一定大于 b 的平方。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "错误",
    "explanation": "反例：1 > −2，但 1² < (−2)²。",
    "aliases": []
  },
  {
    "id": 46,
    "category": "图形推理",
    "title": "按“○、○、●”循环排列，第 8 个图形是 ○。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "正确",
    "explanation": "8 除以 3 余 2，所以对应循环单元的第 2 个图形。",
    "aliases": []
  },
  {
    "id": 47,
    "category": "图形推理",
    "title": "正方形和长方形都一定有四条对称轴。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "错误",
    "explanation": "非正方形的长方形只有两条对称轴。",
    "aliases": []
  },
  {
    "id": 48,
    "category": "图形推理",
    "title": "平面三角形的三个内角都可能大于 90°。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "错误",
    "explanation": "平面三角形的内角和为 180°，不可能三个都大于 90°。",
    "aliases": []
  },
  {
    "id": 49,
    "category": "图形推理",
    "title": "把箭头顺时针旋转四次，每次 90°，它会恢复原方向。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "总共旋转 360°，回到原方向。",
    "aliases": []
  },
  {
    "id": 50,
    "category": "图形推理",
    "title": "按“▲、■、●、◆”循环，第 19 个图形是 ●。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "正确",
    "explanation": "19 除以 4 余 3，对应第三个图形 ●。",
    "aliases": []
  },
  {
    "id": 51,
    "category": "图形推理",
    "title": "正六边形绕中心旋转 120°，轮廓可以与原图重合。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "正确",
    "explanation": "正六边形每转 60° 就重合，120° 是 60° 的两倍。",
    "aliases": []
  },
  {
    "id": 52,
    "category": "语言类比",
    "title": "“钥匙：开锁”与“剪刀：剪裁”的关系一致。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "两组均为工具与其典型用途。",
    "aliases": []
  },
  {
    "id": 53,
    "category": "语言类比",
    "title": "“苹果：水果”与“汽车：车轮”的关系一致。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "错误",
    "explanation": "苹果属于水果，车轮是汽车的组成部分，关系不同。",
    "aliases": []
  },
  {
    "id": 54,
    "category": "语言类比",
    "title": "“炎热：寒冷”与“宽阔：狭窄”都是反义关系。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "前一组描述温度相反，后一组描述宽窄相反。",
    "aliases": []
  },
  {
    "id": 55,
    "category": "语言类比",
    "title": "“书页：书籍”与“树叶：树木”都是部分与整体的关系。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "书页是书籍的一部分，树叶是树木的一部分。",
    "aliases": []
  },
  {
    "id": 56,
    "category": "语言类比",
    "title": "“必要”与“充分”可以在逻辑判断中随意互换。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "错误",
    "explanation": "必要条件是不可缺少的条件，充分条件是足以推出结论的条件。",
    "aliases": []
  },
  {
    "id": 57,
    "category": "语言类比",
    "title": "“因为下雨，所以路湿”与“路湿，所以一定下过雨”意思完全相同。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "错误",
    "explanation": "路湿还可能来自洒水等原因，后一句把因果倒置了。",
    "aliases": []
  },
  {
    "id": 58,
    "category": "逻辑判断",
    "title": "所有猫都是动物，因此所有动物都是猫。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "错误",
    "explanation": "猫只是动物的一类，不能反推所有动物都是猫。",
    "aliases": []
  },
  {
    "id": 59,
    "category": "逻辑判断",
    "title": "只要有票就能入场。小林有票，所以按题设他能入场。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "有票是能入场的充分条件，可直接推出结论。",
    "aliases": []
  },
  {
    "id": 60,
    "category": "逻辑判断",
    "title": "甲比乙早到，乙比丙早到，所以丙比甲晚到。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "顺序是甲、乙、丙，丙晚于甲。",
    "aliases": []
  },
  {
    "id": 61,
    "category": "逻辑判断",
    "title": "有些 A 是 B，有些 B 是 C，因此必有一些 A 是 C。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "错误",
    "explanation": "两组“有些 B”可能完全不同，A 与 C 可以不相交。",
    "aliases": []
  },
  {
    "id": 62,
    "category": "逻辑判断",
    "title": "独立抛出两枚公平硬币，两枚都正面与一正一反的可能性相同。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "错误",
    "explanation": "等可能结果有正正、正反、反正、反反，一正一反有两种。",
    "aliases": []
  },
  {
    "id": 63,
    "category": "逻辑判断",
    "title": "三人比赛无并列，小周不是第一也不是第三，他一定第二。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "只有第一、第二、第三三个名次，排除两者后只剩第二。",
    "aliases": []
  },
  {
    "id": 64,
    "category": "空间方向",
    "title": "面向东时，右手指向南。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "正确",
    "explanation": "从东向右旋转 90° 就是南。",
    "aliases": []
  },
  {
    "id": 65,
    "category": "空间方向",
    "title": "先向北走 3 米，再向南走 5 米，终点在起点北侧。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "错误",
    "explanation": "南北抵消后，终点在起点南侧 2 米处。",
    "aliases": []
  },
  {
    "id": 66,
    "category": "空间方向",
    "title": "不透明立方体从外部任意角度看，最多能同时看到 4 个完整的外表面。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "错误",
    "explanation": "对不透明立方体从外部观察，最多同时看到 3 个面。",
    "aliases": []
  },
  {
    "id": 67,
    "category": "空间方向",
    "title": "向左转 90° 和向右转 270°，最终朝向相同。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 2,
    "answer": "正确",
    "explanation": "两种转法相差一整圈，朝向相同。",
    "aliases": []
  },
  {
    "id": 68,
    "category": "空间方向",
    "title": "一个大立方体切成 3×3×3 个小立方体后，共有 9 个。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 1,
    "answer": "错误",
    "explanation": "总数为 3 × 3 × 3 = 27。",
    "aliases": []
  },
  {
    "id": 69,
    "category": "空间方向",
    "title": "向东走 4 米、向北走 3 米，与起点的直线距离是 5 米。",
    "visual": "",
    "options": [
      "正确",
      "错误"
    ],
    "type": "boolean",
    "difficulty": 3,
    "answer": "正确",
    "explanation": "由勾股定理，距离为 √(4²+3²)=5 米。",
    "aliases": []
  },
  {
    "id": 70,
    "category": "数字规律",
    "title": "每项是前一项的 3 倍：2，6，18，54，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "162",
    "explanation": "54 × 3 = 162。",
    "aliases": [],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 71,
    "category": "数字规律",
    "title": "相邻差依次增加 2：2，6，12，20，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "30",
    "explanation": "相邻差为 4、6、8，下一差为 10，得到 30。",
    "aliases": [],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 72,
    "category": "数字规律",
    "title": "相邻差依次增加 1：4，7，11，16，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "22",
    "explanation": "差为 3、4、5，下一差为 6，16 + 6 = 22。",
    "aliases": [],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 73,
    "category": "数字规律",
    "title": "每次除以 2：160，80，40，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "20",
    "explanation": "40 ÷ 2 = 20。",
    "aliases": [
      "二十"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 74,
    "category": "数字规律",
    "title": "一件商品 80 元，打八折后的价格是 ____ 元。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "64",
    "explanation": "80 × 0.8 = 64 元。",
    "aliases": [
      "六十四"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 75,
    "category": "数字规律",
    "title": "先乘 2 再加 1：1，3，7，15，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "31",
    "explanation": "15 × 2 + 1 = 31。",
    "aliases": [
      "三十一"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 76,
    "category": "图形推理",
    "title": "按“○、▲、■”循环，第 14 个图形是 ____。请选择正确图形。",
    "visual": "",
    "options": [
      "圆",
      "三角",
      "菱形",
      "方形"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "三角",
    "explanation": "14 除以 3 余 2，对应第二个图形。",
    "aliases": []
  },
  {
    "id": 77,
    "category": "图形推理",
    "title": "一排 5 个正方形首尾相连，相邻正方形共用一条边，共需要 ____ 根等长火柴。",
    "visual": "",
    "options": [
      "12",
      "16",
      "20",
      "15"
    ],
    "type": "choice",
    "difficulty": 3,
    "answer": "16",
    "explanation": "首个需 4 根，之后每个新增 3 根：4 + 4 × 3 = 16。",
    "aliases": [
      "十六"
    ]
  },
  {
    "id": 78,
    "category": "图形推理",
    "title": "五边形有 ____ 条对角线。",
    "visual": "",
    "options": [
      "4",
      "5",
      "6",
      "10"
    ],
    "type": "choice",
    "difficulty": 3,
    "answer": "5",
    "explanation": "每个顶点连向两个不相邻顶点，去掉重复得到 5 × 2 ÷ 2 = 5。",
    "aliases": [
      "五"
    ]
  },
  {
    "id": 79,
    "category": "图形推理",
    "title": "每组圆点数是前一组的 2 倍：3、6、12、____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "24",
    "explanation": "12 × 2 = 24。",
    "aliases": [
      "二十四"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 80,
    "category": "图形推理",
    "title": "正方形有 ____ 条对称轴。",
    "visual": "",
    "options": [
      "2",
      "4",
      "3",
      "8"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "4",
    "explanation": "两条对角线和两条对边中点连线，共四条。",
    "aliases": [
      "四"
    ]
  },
  {
    "id": 81,
    "category": "图形推理",
    "title": "按“●、●、○、○”循环，前 12 个图形中有 ____ 个实心圆。",
    "visual": "",
    "options": [
      "4",
      "6",
      "8",
      "12"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "6",
    "explanation": "每四个含两个实心圆，12 个有三组，共 6 个。",
    "aliases": [
      "六"
    ]
  },
  {
    "id": 82,
    "category": "语言类比",
    "title": "“听觉：耳朵”对应“视觉：____”。",
    "visual": "",
    "options": [
      "舌头",
      "耳朵",
      "鼻子",
      "眼睛"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "眼睛",
    "explanation": "耳朵是听觉器官，眼睛是视觉器官。",
    "aliases": []
  },
  {
    "id": 83,
    "category": "语言类比",
    "title": "“飞行员：飞机”对应“船长：____”。",
    "visual": "",
    "options": [
      "汽车",
      "船",
      "飞机",
      "火车"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "船",
    "explanation": "两组均为操控者与交通工具。",
    "aliases": []
  },
  {
    "id": 84,
    "category": "语言类比",
    "title": "“白天：黑夜”对应“前进：____”。",
    "visual": "",
    "options": [
      "加速",
      "后退",
      "停止",
      "转弯"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "后退",
    "explanation": "两组均为含义相反的词。",
    "aliases": []
  },
  {
    "id": 85,
    "category": "语言类比",
    "title": "“鱼：水”对应“人：____”，两组后项都是呼吸所需气体所在的主要环境。",
    "visual": "",
    "options": [
      "食物",
      "土壤",
      "空气",
      "阳光"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "空气",
    "explanation": "鱼通过鳃从水中获取氧，人通过肺从空气中获取氧。",
    "aliases": []
  },
  {
    "id": 86,
    "category": "语言类比",
    "title": "“蜂蜜：蜜蜂”对应“蚕丝：____”。",
    "visual": "",
    "options": [
      "蜘蛛",
      "蝴蝶",
      "蚕",
      "蜜蜂"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "蚕",
    "explanation": "两组均为产物与产生该产物的动物。",
    "aliases": []
  },
  {
    "id": 87,
    "category": "语言类比",
    "title": "“厘米：长度”对应“千克：____”。",
    "visual": "",
    "options": [
      "质量",
      "温度",
      "时间",
      "长度"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "质量",
    "explanation": "厘米是长度单位，千克是质量单位。",
    "aliases": []
  },
  {
    "id": 88,
    "category": "逻辑判断",
    "title": "四个人互相握手，每两人只握一次，一共握 ____ 次。",
    "visual": "",
    "options": [
      "4",
      "6",
      "8",
      "12"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "6",
    "explanation": "四人可组成 4 × 3 ÷ 2 = 6 对。",
    "aliases": [
      "六"
    ]
  },
  {
    "id": 89,
    "category": "逻辑判断",
    "title": "盒中有红、蓝、黄三种球，各有足够多。至少取出 ____ 个，才能保证其中两个同色。",
    "visual": "",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "4",
    "explanation": "最坏情况先取到三种不同颜色，第四个必与已有某色相同。",
    "aliases": [
      "四"
    ]
  },
  {
    "id": 90,
    "category": "逻辑判断",
    "title": "甲乙丙丁排队，甲第一，丁最后，乙在丙前面。丙排第 ____。",
    "visual": "",
    "options": [
      "2",
      "3",
      "4",
      "1"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "3",
    "explanation": "顺序只能是甲、乙、丙、丁，所以丙第三。",
    "aliases": [
      "三"
    ]
  },
  {
    "id": 91,
    "category": "逻辑判断",
    "title": "父亲现在是儿子年龄的 3 倍，10 年后是儿子的 2 倍。儿子现在 ____ 岁。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 3,
    "answer": "10",
    "explanation": "设儿子 x 岁：3x+10=2(x+10)，解得 x=10。",
    "aliases": [
      "十"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 92,
    "category": "逻辑判断",
    "title": "5 台同速机器 5 分钟生产 5 个零件，100 台机器生产 100 个零件要 ____ 分钟。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 3,
    "answer": "5",
    "explanation": "每台机器 5 分钟生产一个零件，100 台同时工作仍需 5 分钟。",
    "aliases": [
      "五"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 93,
    "category": "逻辑判断",
    "title": "盒里有 3 个苹果，你从中拿走 2 个。你手里有 ____ 个苹果。",
    "visual": "",
    "options": [
      "1",
      "2",
      "3",
      "0"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "2",
    "explanation": "问的是你拿到的数量，不是盒里剩下的数量。",
    "aliases": [
      "二",
      "两"
    ]
  },
  {
    "id": 94,
    "category": "空间方向",
    "title": "面向西，向右转 90° 后面向 ____。请选择正确方向。",
    "visual": "",
    "options": [
      "东",
      "北",
      "南",
      "西"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "北",
    "explanation": "西向右转 90° 是北。",
    "aliases": []
  },
  {
    "id": 95,
    "category": "空间方向",
    "title": "向南走 5 米，再向北走 2 米，现在距起点 ____ 米。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "3",
    "explanation": "相反方向相抵消，净移动为向南 3 米。",
    "aliases": [
      "三"
    ],
    "fillKind": "number",
    "inputMode": "decimal"
  },
  {
    "id": 96,
    "category": "空间方向",
    "title": "一个立方体共有 ____ 条棱。",
    "visual": "",
    "options": [
      "8",
      "6",
      "12",
      "24"
    ],
    "type": "choice",
    "difficulty": 1,
    "answer": "12",
    "explanation": "上下面各 4 条，加 4 条竖直棱，共 12 条。",
    "aliases": [
      "十二"
    ]
  },
  {
    "id": 97,
    "category": "空间方向",
    "title": "一个立方体所有外表面涂色，再切成 3×3×3 个小立方体。恰有三面涂色的小立方体有 ____ 个。",
    "visual": "",
    "options": [
      "6",
      "8",
      "9",
      "1"
    ],
    "type": "choice",
    "difficulty": 3,
    "answer": "8",
    "explanation": "只有大立方体八个顶角处的小立方体三面涂色。",
    "aliases": [
      "八"
    ]
  },
  {
    "id": 98,
    "category": "空间方向",
    "title": "一个立方体所有外表面涂色，再切成 3×3×3 个小立方体。完全没有涂色的小立方体有 ____ 个。",
    "visual": "",
    "options": [
      "0",
      "1",
      "8",
      "9"
    ],
    "type": "choice",
    "difficulty": 3,
    "answer": "1",
    "explanation": "只有正中心的一个小立方体没有接触外表面。",
    "aliases": [
      "一"
    ]
  },
  {
    "id": 99,
    "category": "空间方向",
    "title": "面向北，连续向右转 3 次，每次 90°，现在面向 ____。",
    "visual": "",
    "options": [
      "西",
      "南",
      "北",
      "东"
    ],
    "type": "choice",
    "difficulty": 2,
    "answer": "西",
    "explanation": "依次转向东、南、西。",
    "aliases": []
  },
  {
    "id": 100,
    "category": "语言类比",
    "title": "李白《静夜思》：床前明月光，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "疑是地上霜",
    "explanation": "原句：床前明月光，疑是地上霜。",
    "aliases": [],
    "fillKind": "poetry",
    "inputMode": "text"
  },
  {
    "id": 101,
    "category": "语言类比",
    "title": "王之涣《登鹳雀楼》：欲穷千里目，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "更上一层楼",
    "explanation": "原句：欲穷千里目，更上一层楼。",
    "aliases": [],
    "fillKind": "poetry",
    "inputMode": "text"
  },
  {
    "id": 102,
    "category": "语言类比",
    "title": "孟浩然《春晓》：春眠不觉晓，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 1,
    "answer": "处处闻啼鸟",
    "explanation": "原句：春眠不觉晓，处处闻啼鸟。",
    "aliases": [],
    "fillKind": "poetry",
    "inputMode": "text"
  },
  {
    "id": 103,
    "category": "语言类比",
    "title": "杜甫《春夜喜雨》：随风潜入夜，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "润物细无声",
    "explanation": "原句：随风潜入夜，润物细无声。",
    "aliases": [],
    "fillKind": "poetry",
    "inputMode": "text"
  },
  {
    "id": 104,
    "category": "语言类比",
    "title": "王维《相思》：愿君多采撷，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "此物最相思",
    "explanation": "原句：愿君多采撷，此物最相思。",
    "aliases": [],
    "fillKind": "poetry",
    "inputMode": "text"
  },
  {
    "id": 105,
    "category": "语言类比",
    "title": "苏轼《水调歌头》：但愿人长久，____。",
    "visual": "",
    "options": [],
    "type": "fill",
    "difficulty": 2,
    "answer": "千里共婵娟",
    "explanation": "原句：但愿人长久，千里共婵娟。",
    "aliases": [],
    "fillKind": "poetry",
    "inputMode": "text"
  }
];
