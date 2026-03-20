/*
 * Tarot Card Definitions and Utilities
 *
 * This module draws inspiration from "The Pictorial Key to the Tarot" (1911) by A.E. Waite,
 * illustrated by Pamela Colman Smith. The Tarot, as presented here, is not merely a tool for fortune-telling,
 * but a vessel of profound symbolism and spiritual tradition, reflecting the "higher mystic schools" and
 * the veiled mysteries of divination. Each card is described with an emphasis on its symbolic imagery and
 * deeper meaning, in the spirit of Waite's original text, which sought to rescue the Tarot from mere
 * cartomancy and restore its place as a key to inner wisdom and the "Sanctuary" of the soul.
 *
 * Card images are sourced from local assets for performance and offline support. The descriptions and keywords aim to honor the poetic and esoteric qualities
 * emphasized by Waite, inviting users to contemplate the Tarot as a journey of the spirit, not just a game of chance.
 *
 * Source: The Pictorial Key to the Tarot, by A.E. Waite, ill. by Pamela Colman Smith [1911], public domain (US).
 */

import { TarotCard, CardPoolType } from "../types";

const LOCAL_CDN = `${import.meta.env.BASE_URL}images/cards/`;

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    nameEn: "The Fool",
    nameCn: "愚人",
    keywords: ["无限潜力", "新的开始", "赤子之心", "纯真", "自由", "冒险"],
    image: "maj00.jpg",
    descriptionCn:
      "他是追寻经验的灵魂，一位身着华服的流浪者 。他背对过去，无忧无虑地停驻在悬崖边缘，凝视着远方未知的虚空 。他手中的白玫瑰象征着尚未被欲望沾染的纯洁，肩上的行囊则装满了未经开发的无限潜能 。他是另一世界的王子，象征着向外旅程、第一次发出的状态，以及精神的优雅与被动 。",
    descriptionEn:
      "The Fool, Mate, or Unwise Man. Court de Gebelin places it at the head of the whole series as the zero or negative which is presupposed by numeration. The Fool carries a wallet; he is looking over his shoulder and does not know that he is on the brink of a precipice ; but a dog or other animal is attacking him from behind. He signifies the journey outward, the state of the first emanation, the graces and passivity of the spirit.",
    positive:
      "从零开始; 好赌运; 不墨守成规; 追求新奇的梦想; 冒险; 放浪形骸; 艺术家的气质; 异于常人; 直攻要害、盲点; 爱情狩猎者; 精神上的超然之爱; 不拘形式的自由恋爱",
    negative:
      "不安定; 孤注一掷会失败; 缺乏责任感; 损失; 脚跟站不稳; 堕落; 走错路; 行为乖张; 轻浮的恋情; 感情忽冷忽热; 不安定的爱情之旅; 疏忽; 虚无; 虚荣 ",
  },
  {
    id: 1,
    nameEn: "The Magician",
    nameCn: "魔术师",
    keywords: ["显化", "意志力", "创造", "资源", "专注"],
    image: "maj01.jpg",
    descriptionCn:
      "他身着象征行动的红袍，一手高举权杖指天，一手指地，以此昭示赫尔墨斯学派“如在其上，如在其下”的奥义 。他不仅是技艺精湛的术士，更是意志的化身，也是连结神性与物质世界的通道 。头顶上方悬浮着代表永恒的双纽线符号（∞），腰间缠绕着象征智慧的吞尾蛇 。在他面前的祭坛上，陈列着圣杯、宝剑、权杖与星币，代表构成物质世界的四要素 。他以此告诫世人：通过专注的意志与神圣的知识，人类拥有将精神能量显化为现实奇迹的能力。",
    descriptionEn:
      "The Magus, Magician, or juggler. The figure represents the divine motive in man, reflecting God, the will in the liberation of the union with that which is above. He is the channel of the grace from on high, implying that the powers of the elements are subject to the initiated will. He is also the unity of individual being on all planes.",
    positive:
      "好的开始; 具独创性; 有发展的; 新计划成功; 想像力丰富或有好点子; 有恋情发生; 拥有默契良好的伴侣; 有新恋人出现; 值得效仿的对象出现; 技能; 外交; 地址; 微妙; 自信; 意志 ",
    negative:
      "优柔寡断; 才能平庸; 有被欺诈的危险; 技术不足; 过于消极; 没有判断力; 缺乏创造力; 医师; 术士; 精神疾病; 耻辱; 不安 ",
  },
  {
    id: 2,
    nameEn: "The High Priestess",
    nameCn: "女祭司",
    keywords: ["直觉", "潜意识", "神秘", "内在智慧", "静默"],
    image: "maj02.jpg",
    descriptionCn:
      "她端坐于黑白双柱（J和B）之间，象征着二元对立中的完美平衡 。她身后的帷幕上绣着棕榈与石榴，遮蔽着凡人不可直视的深层真理 。她头戴有角的月冠，脚踏新月，胸前有太阳十字 ，手中紧握神秘卷轴“Tora”，那是神圣律法的象征 。她是通往隐秘智慧的守门人 ，代表着直觉、潜意识以及那寂静之中流淌的灵性之光。她的最高阶名字是 Shekinah，象征内住的荣耀 。",
    descriptionEn:
      "The High Priestess, the Pope Joan, or Female Pontiff. She is the Secret Tradition and the higher sense of the instituted Mysteries. She represents the spiritual Bride and Mother, the Queen of the Borrowed Light, but this is the light of all. She is seated between the white and black pillars—J. and B.—of the mystic Temple.",
    positive:
      "知性、优秀的判断力; 具洞察力及先见之明; 强大的战斗意志; 冷静的统率力; 学问、研究等精神方面幸运; 独立自主的女性; 柏拉图式的爱情; 有心灵上交往至深的友人; 冷淡的恋情; 秘密; 奥秘; 智慧; 科学; 沉默; 坚韧 ",
    negative:
      "无知、缺乏理解力; 研究不足; 不理性的态度; 自我封闭; 神经质; 洁癖; 与女性朋友起争执; 对人冷淡; 晚婚或独身主义; 没有结果的单相思; 不孕; 激情; 道德或肉体上的热情; 自负; 表面知识 ",
  },
  {
    id: 3,
    nameEn: "The Empress",
    nameCn: "皇后",
    keywords: ["丰饶", "自然", "母性", "感官享受", "孕育"],
    image: "maj03.jpg",
    descriptionCn:
      "她是众生之母，是大自然丰饶力量的崇高化身 。在她面前，谷物正在成熟，远处瀑布奔流，象征着物质世界的繁荣与生机 。她手中的权杖高举地球仪，头戴由十二颗星辰组成的冠冕 ，脚下的盾牌刻有维纳斯的符号 。她是通往尘世天堂的大门 ，代表着普遍的丰饶、感官之美以及滋养万物之母 。",
    descriptionEn:
      "The Empress, the inferior Garden of Eden, the Earthly Paradise. Her diadem is of twelve stars. The symbol of Venus is on the shield. She is above all things universal fecundity and the outer sense of the Word.",
    positive:
      "母性本能强; 富创造力; 事业有成; 生活富足; 感情充实; 美好的恋情; 受人爱戴的对象; 有结婚的机会; 温柔体贴的伴侣; 多产; 行动; 主动性; 长久 ",
    negative:
      "缺乏母性本能; 创造力不足; 生活贫困; 事业不顺; 感情不满; 难以取悦的对象; 难以结婚; 冷淡的伴侣; 光; 真理; 复杂事物的解开; 公开欢庆; 动摇 ",
  },
  {
    id: 4,
    nameEn: "The Emperor",
    nameCn: "皇帝",
    keywords: ["权威", "结构", "控制", "父亲原型", "秩序"],
    image: "maj04.jpg",
    descriptionCn:
      "他是世俗权力的顶峰，端坐于饰有公羊头骨的石座之上 。他手持安卡十字权杖与金球，在此展现绝对的统治与秩序 。他是雄性的力量，是行政与实现，代表了人类最高的自然属性 。在这个充满变数的世界中，他是坚定的建立者与守护者，以理性和威严确立疆界 。",
    descriptionEn:
      "The Emperor. He is the executive and realization, the power of this world, here clothed with the highest of its natural attributes. He has a form of the Crux ansata for his sceptre and a globe in his left hand. He is the virile power, and in this sense is he who seeks to remove the Veil of Isis.",
    positive:
      "以坚强的意志力及手腕获致成功; 富裕和力量; 有责任感; 良好的处理能力; 具领导能力; 男性的思考; 坚持到底; 虽有点专制却值得信赖; 条件诱人的提亲; 与年长者恋爱; 稳定; 力量; 保护; 实现; 援助; 理性; 信念; 权威和意志 ",
    negative:
      "不成熟; 意志薄弱; 虚有其表; 看不清现实; 欠缺实务能力; 因傲慢而招人反感; 工作过度; 固执; 没有经济基础; 没有好对象; 苦恋结束; 勉强的感情; 仁慈; 同情; 信任; 对敌人来说是混乱; 阻碍; 不成熟 ",
  },
  {
    id: 5,
    nameEn: "The Hierophant",
    nameCn: "教皇",
    keywords: ["传统", "信仰", "教导", "社会规范", "精神指引"],
    image: "maj05.jpg",
    descriptionCn:
      "他头戴三重冠冕，手持三重十字权杖 ，象征着他在身、心、灵三个层面的至高权威。他做出手势，区分了显性与隐秘的教义 。两把交叉的钥匙置于脚下 。教皇代表着显性的教义、社会规范与外部宗教的统治力量 。他是传统的守护者，指引人们通过既定的仪式与信仰体系，在群体中寻求精神上的归属与救赎 。",
    descriptionEn:
      "The Hierophant, or Pope. He wears the triple crown and is seated between two pillars. In his left hand he holds a sceptre terminating in the triple cross. He is the ruling power of external religion, as the High Priestess is the prevailing genius of the esoteric, withdrawn power. He is the channel of grace belonging to the world of institution.",
    positive:
      "受人信赖; 有贵人相助; 贡献; 受上司重视; 能胜任工作; 拥有一颗温柔的心; 受惠于有益的建言; 接触宗教的事物大吉; 与年长的异性有缘; 良缘; 深情宽大的爱; 有结良缘的机会; 婚姻; 联盟; 仁慈和善良; 灵感 ",
    negative:
      "没信用; 没有贵人相助; 孤立无援; 不受欢迎的好意; 依赖心是最大的敌人; 太罗嗦而讨人厌; 碍于私情而无法成功; 心胸狭窄; 得不到亲人的谅解的恋情; 彼此过于关心; 缘分浅薄的恋情; 社会; 良好理解; 和谐; 过度仁慈; 软弱 ",
  },
  {
    id: 6,
    nameEn: "The Lovers",
    nameCn: "恋人",
    keywords: ["爱", "和谐", "价值观", "选择", "结合"],
    image: "maj06.jpg",
    descriptionCn:
      "骄阳高悬于天顶，天使拉斐尔张开双臂，以超然的姿态庇护着下方的亚当与夏娃 。男人身后是燃烧着十二团火焰的生命之树，女人身后则是缠绕着蛇的智慧之树 。这不仅是人类之爱的象征 ，更是纯真与诱惑并存的伊甸园景象。它象征着意识与潜意识的统一，以及在道德的路口上，人类出于自由意志所做出的神圣抉择——那是关于爱、美、以及自我整合的试炼 。",
    descriptionEn:
      "The Lovers or Marriage. The sun shines in the zenith, and beneath is a great winged figure with hands extended, pouring down influences. The figures suggest youth, virginity, innocence and love before it is contaminated by gross material desire. This is the card of human love, here exhibited as part of the way, the truth and the life.",
    positive:
      "幸运的结合; 有希望的将来; 有共同做事的伙伴; 与人合作或社团活动; 敏感决定前进之路的好时机; 有意气相投的朋友; 爱情机会将到来; 罗曼蒂克的恋情; 爱的预感; 吸引; 爱; 美丽; 克服的考验 ",
    negative:
      "分离; 消解; 不合作的态度; 眼花缭乱; 没有满意的成果; 无法持续; 退休; 妨碍; 血气方刚; 多情的人; 分手; 冷漠的爱; 背信; 逃避爱情; 短暂的恋情; 失败; 愚蠢的设计; 受挫的婚姻和各种矛盾 ",
  },
  {
    id: 7,
    nameEn: "The Chariot",
    nameCn: "战车",
    keywords: ["意志力", "胜利", "决心", "自我掌控", "进取"],
    image: "maj07.jpg",
    descriptionCn:
      "威严的王子驾驭着战车，背对繁华的城池，踏上征途 。他无需缰绳，仅凭强大的意志力便能驾驭黑白两头斯芬克斯 。这是心灵层面的征服，象征着以自律、决心与勇气，战胜内在的矛盾与外在的障碍 。他是胜利中的国王，代表创造王权的胜利 。",
    descriptionEn:
      "The Chariot. An erect and princely figure carrying a drawn sword. Two sphinxes thus draw his chariot. He is conquest on all planes—in the mind, in science, in progress. He is above all things triumph in the mind.",
    positive:
      "前进必胜; 先下手为强; 独立; 起程; 在颠簸中仍有好成绩; 活泼; 有野心; 以速度取胜; 有开拓精神; 握有指挥权; 战胜敌手; 富行动力的恋情; 恋爱的胜利者; 援助; 天意; 战争; 胜利 ",
    negative:
      "失败; 丧失战斗意志; 状态不佳; 挫折; 性子过急为失败之因; 不感兴趣; 效率不佳; 资金运转困难; 无奋斗精神; 有强劲敌手进入; 被拒绝; 因怯懦而使恋情不顺; 暴动; 争吵; 争议; 诉讼; 失败 ",
  },
  {
    id: 8,
    nameEn: "Strength",
    nameCn: "力量",
    keywords: ["勇气", "耐心", "同情", "内在力量", "驯服"],
    image: "maj08.jpg",
    descriptionCn:
      "一位女子温柔地抚摸着狮子的头颅，甚至轻合它的利齿 。她头顶悬浮着代表无限的符号（双纽线），腰间缠绕着鲜花 。这并非暴力的征服，而是以柔克刚的最高典范，象征着内在力量与仁慈的坚韧 。它代表着更高本性的解放，与神圣原则相通 。",
    descriptionEn:
      "Strength or Fortitude. A woman is closing the jaws of a lion. Over her head there hovers the same symbol of life as we see in the card of the Magician. The card connects with the Divine Mystery of Union. The figure signifies strength in its conventional understanding, and conveys the idea of mastery.",
    positive:
      "不屈不挠的精神; 将不可能化为可能的意志力; 全力以赴; 突破难关; 坚强的信念和努力; 挑战已知危险的勇气; 神秘的力量; 旺盛的斗志; 轰轰烈烈的恋情; 克服困难的真实爱情; 力量; 精力; 行动; 勇气; 宽宏大量; 完全的成功和荣誉 ",
    negative:
      "疑心病; 犹豫不决; 实力不足; 无忍耐力; 危险的赌注; 勉强为之而适得其反; 丧失自信; 喜欢故弄玄虚; 体力不足; 自大自负; 误用力气; 专制; 滥用权力; 软弱; 不和; 耻辱 ",
  },
  {
    id: 9,
    nameEn: "The Hermit",
    nameCn: "隐士",
    keywords: ["内省", "孤独", "寻求真理", "指引", "撤退"],
    image: "maj09.jpg",
    descriptionCn:
      "他独自立于冰雪覆盖的山巅，身披斗篷 。他右手高举一盏明灯，内藏熠熠生辉的六芒星，象征真理与灵性的光芒 。隐士是向内探索的先行者，是“成就之牌”而非“追寻之牌” 。他所持的灯塔暗示着：“我所在之处，亦有你可至” 。其形象象征神圣奥秘会自我保护，不受未经准备的人侵犯 。",
    descriptionEn:
      "The Hermit. The figure is seen holding up his beacon on an eminence. His lamp contains the Light of Occult Science. It is a card of attainment rather than a card of quest. It signifies the truth that the Divine Mysteries secure their own protection from those who are unprepared.",
    positive:
      "智能与卓越见解; 不断地追求更高层次的东西; 思虑周密; 冷静沉着; 不多言; 接触知性事物吉; 正中核心的建言; 活动慢慢进行较有成果; 追求柏拉图式的爱情; 暗中的爱情; 谨慎; 小心; 背叛; 伪装; 欺诈; 腐败 ",
    negative:
      "一视同仁; 不够通融; 不专心易生错误; 过分警戒,无法顺利进行; 秘密泄漏; 过于固执不听别人的意见; 孤独; 动机不单纯; 因怨言及偏见招人嫌; 轻浮的爱情; 怀疑爱情; 隐藏; 伪装; 策略; 恐惧; 不合理的谨慎 ",
  },
  {
    id: 10,
    nameEn: "Wheel of Fortune",
    nameCn: "命运之轮",
    keywords: ["宿命", "转折点", "周期", "运气", "改变"],
    image: "maj10.jpg",
    descriptionCn:
      "巨大的轮盘悬于苍穹，轮辐上刻有神名（TARO/ROTA）与炼金术符号 。斯芬克斯端坐顶端，手持利剑，象征着即使在变动中也要保持平衡 。赫尔墨斯-阿努比斯随轮上升，泰风巨蛇随轮下降 。这象征着流体宇宙的永恒运动与人类生命的无常 ，但也否认了其中所暗示的偶然性 。",
    descriptionEn:
      "The Wheel of Fortune. The wheel has seven radii. The symbolism stands for the perpetual motion of a fluidic universe and for the flux of human life. The Sphinx is the equilibrium therein. The transliteration of Taro as Rota is inscribed on the wheel, counterchanged with the letters of the Divine Name.",
    positive:
      "机会到来; 随机应变能力佳; 好运; 转换期; 意想不到的幸运; 升迁有望; 变化丰富; 好时机; 宿命的相逢; 一见钟情; 幸运的婚姻; 富贵的身份; 命运; 运气; 成功; 提升; 幸福 ",
    negative:
      "低潮期; 时机未到; 评估易出错; 时机不好; 没有头绪; 处于劣势; 生活艰苦; 情况恶化; 计划停滞需要再等待; 失恋; 短暂的恋情; 易错失良机; 不敌诱惑; 爱情无法持久; 增加; 丰富; 多余 ",
  },
  {
    id: 11,
    nameEn: "Justice",
    nameCn: "正义",
    keywords: ["公平", "真理", "因果", "法律", "平衡"],
    image: "maj11.jpg",
    descriptionCn:
      "她端坐于石柱之间，右手高举利剑，左手持天平 。这象征着道德原则，根据每个人的行为给予报偿 。她代表绝对的公平与精神的真理。正义之柱通向一个世界，而女祭司之柱则通向另一个世界 。",
    descriptionEn:
      "Justice. The figure is seated between pillars, like the High Priestess. It is the moral principle which deals unto every man according to his works. Its presentation is supposed to be one of the four cardinal virtues. The figure holds a sword and a pair of scales.",
    positive:
      "公正; 严正的意见; 良好的均衡关系; 严守中立立场; 凡事合理化; 身兼两种工作; 协调者; 与裁判、法律相关者; 表里一致的公正人物; 以诚实之心光明正大地交往; 彼此能获得协调; 公平; 正直; 法律中应得一方的胜利 ",
    negative:
      "不公正; 不平衡; 不利的条件; 偏颇; 先入为主的观念; 偏见与独断; 纷争、诉讼; 问心有愧; 无法两全; 天平两边无法平衡; 性格不一致; 无视于社会道德观的恋情; 偏爱; 法律纠纷; 偏执; 偏见; 过度严厉 ",
  },
  {
    id: 12,
    nameEn: "The Hanged Man",
    nameCn: "倒吊人",
    keywords: ["牺牲", "等待", "新视角", "放下", "暂停"],
    image: "maj12.jpg",
    descriptionCn:
      "他以倒吊的姿态悬挂于T形树枝之上，这树是活着的木头，长着新叶 。他的双腿交织成十字，双臂背于身后 。他的面容宁静安详，头周闪耀着代表灵性的光环 。这象征着生命处于暂停状态，但不是死亡 。它表达了神性与宇宙的关系 ，预示着在神圣的静止中孕育出的伟大觉醒 。",
    descriptionEn:
      "The Hanged Man. The gallows from which he is suspended forms a Tau cross, while the figure--from the position of the legs--forms a fylfot cross. The face expresses deep entrancement, not suffering. He expresses the relation, in one of its aspects, between the Divine and the Universe.",
    positive:
      "接受考验; 无法动弹; 被牺牲; 有失必有得; 从痛苦的体验中获得教训; 过度期; 不贪图眼前利益; 浴火重生; 奉献的爱; 明知辛苦但全力以赴; 智慧; 小心; 洞察力; 考验; 牺牲; 直觉; 预言 ",
    negative:
      "无谓的牺牲; 折断骨头; 有噩运、居于劣势; 任性妄为; 不努力; 变得没有耐性; 利己主义者; 受到惩罚; 无偿的爱; 缺乏共同奋斗的伙伴; 自私; 人群; 政治团体 ",
  },
  {
    id: 13,
    nameEn: "Death",
    nameCn: "死神",
    keywords: ["结束", "重生", "转变", "必然性", "过渡"],
    image: "maj13.jpg",
    descriptionCn:
      "神秘的骑士骑着马，举着一面印有象征生命的神秘玫瑰的黑旗，象征着生命 。在他面前，世俗的国王、孩子和少女都倒下了 。这不是普通死亡，而是从低阶向高阶的转化 。在远方的双塔之间，一轮不朽的太阳正在升起 。",
    descriptionEn:
      "Death. The veil or mask of life is perpetuated in change, transformation and passage from lower to higher. The horseman bears a black banner emblazoned with the Mystic Rose, which signifies life. King and child and maiden fall before him. It is not the path to the next stage of being, but a mysterious entrance into the state of mystical death.",
    positive:
      "失败; 毁灭之日将近; 损害继续延续; 失业; 进展停滞; 交易停止; 为时已晚; 停滞状态; 生病或意外的暗示; 味如嚼蜡的生活; 不幸的恋情; 恋情终止; 彼此间有很深的鸿沟; 别离; 终结; 死亡率; 破坏; 腐败 ",
    negative:
      "起死回生的机会; 脱离低迷期; 改变印象; 回心转意再出发; 挽回名誉; 奇迹似地康复; 突然改变方针; 已经死心 的事有了转机; 斩断情丝,重新出发; 惯性; 睡眠; 嗜睡; 希望破灭 ",
  },
  {
    id: 14,
    nameEn: "Temperance",
    nameCn: "节制",
    keywords: ["平衡", "温和", "调和", "耐心", "炼金术"],
    image: "maj14.jpg",
    descriptionCn:
      "一位长有双翼的天使（无性别区分），额头闪耀着太阳的印记 。他一只脚踏入水中，一只脚立于大地，双手稳健地将生命之精粹在两只圣杯间倾倒与调和 。这象征着心理和物质本性的调和 ，其规则一旦在意识中建立，便能通晓源头与归宿 。这并非字面意义上的节制，而是深层的平衡之道 。",
    descriptionEn:
      "Temperance. A winged angel (neither male nor female)  with the sign of the sun upon his forehead. It is held to be pouring the essences of life from chalice to chalice. The figure has one foot upon the earth and one upon waters. It is called Temperance fantastically, because, when the rule of it obtains in our consciousness, it tempers, combines and harmonises the psychic and material natures.",
    positive:
      "单纯化; 顺畅; 交往平顺; 两者相融顺畅; 调整; 彼此交换有利条件; 平凡中也有重要的契机; 平顺的心境; 纯爱; 从好感转为爱意; 深爱; 节约; 适度; 节俭; 管理 ",
    negative:
      "消耗; 疲劳; 不定性的工作; 缺乏调整能力; 下降; 浪费; 不要与人合作; 不融洽; 爱情的配合度不佳; 与教会、宗教、祭司相关的事物; 分离; 相互竞争的利益 ",
  },
  {
    id: 15,
    nameEn: "The Devil",
    nameCn: "恶魔",
    keywords: ["束缚", "物质主义", "诱惑", "阴影", "成瘾"],
    image: "maj15.jpg",
    descriptionCn:
      "巨大的巴风特（有山羊头和蝙蝠翼）蹲伏于祭坛之上，头顶倒五芒星 。他左手持燃烧的火炬倒向地面，右手做出虚假的手势 。被铁链束缚的一男一女立于其下，象征着物质生命的枷锁与宿命 。它代表着“门槛上的居住者”——在神秘花园外，诱惑并奴役着那些吃下禁果的人 。",
    descriptionEn:
      "The Devil. The Horned Goat of Mendes, with wings like those of a bat, is standing on an altar. A reversed pentagram is on the forehead. The male and female figures are analogous with those of the fifth card (Hierophant), as if Adam and Eve after the Fall. Hereof is the chain and fatality of the material life.",
    positive:
      "被束缚; 堕落; 恶魔的私语; 卑躬屈膝; 欲望的俘虏; 荒废的生活; 举债度日; 病魔入侵; 夜游过多; 不可告人的事; 恶意; 不可抗拒的诱惑; 私密恋情; 沉溺于感官刺激之下; 蹂躏; 暴力; 激烈; 力量; 宿命 ",
    negative:
      "逃离拘束; 长期的苦恼获得解放; 斩断前缘; 越过难关; 暂时停止; 拒绝诱惑; 舍弃私欲; 治愈长期病痛; 别离时刻; 如深陷泥沼爱恨交加的恋情; 邪恶的宿命; 软弱; 琐碎; 盲目 ",
  },
  {
    id: 16,
    nameEn: "The Tower",
    nameCn: "高塔",
    keywords: ["剧变", "启示", "破坏", "觉醒", "混乱"],
    image: "maj16.jpg",
    descriptionCn:
      "一道闪电击中了高耸的石塔，两名人物从塔顶坠落 。这被称为“上帝之屋”或“巴别塔” 。它象征着建立在错误基础上的结构崩塌 。它是一张混乱之牌，代表着对骄傲的惩罚 ，以及知识层面上的毁灭 。",
    descriptionEn:
      "The Tower struck by Lightning. Its alternative titles are: Castle of Plutus, God's House and the Tower of Babel. It is assuredly a card of confusion. The tower has been spoken of as the chastisement of pride and the intellect overwhelmed in the attempt to penetrate the Mystery of God. It is a card in particular of unforeseen catastrophe.",
    positive:
      "致命的打击; 纷争; 纠纷不断; 与周遭事物对立,情况恶化; 意想不到的事情; 急病; 受牵连; 急剧的大变动; 信念奔溃; 逆境; 破产; 没有预警,突然分离; 破灭的爱; 玩火自焚; 痛苦; 困苦; 贫困; 逆境; 灾难; 耻辱; 欺骗; 毁灭 ",
    negative:
      "紧迫的状态; 险恶的气氛; 内讧; 即将破灭; 急需解决的问题; 承受震撼; 背水一战; 注意刑事问题; 因骄傲自大将付出惨痛的代价; 状况不佳; 困境; 爱情危机; 分离的预感; 压迫; 监禁; 暴政 ",
  },
  {
    id: 17,
    nameEn: "The Star",
    nameCn: "星星",
    keywords: ["希望", "灵感", "宁静", "疗愈", "更新"],
    image: "maj17.jpg",
    descriptionCn:
      "一位赤裸的女子，单膝跪在水边，将两壶生命之水倾倒，滋润着水和大地 。天空中，一颗巨大的八芒星被七颗小星环绕 。她是“被揭开的真理”，其座右铭是“自由的生命之水”和“精神的恩赐” 。她象征着希望、永恒的青春与不朽的美丽 。",
    descriptionEn:
      "The Star. A great, radiant star of eight rays, surrounded by seven lesser stars. The female figure is entirely naked. She pours Water of Life from two great ewers, irrigating sea and land. It is the card of hope, of immortality and interior light.",
    positive:
      "愿望达成; 前途光明; 充满希望的未来; 美好的生活; 曙光出现; 大胆的幻想; 水准提高; 新的创造力; 想像力; 理想的对象; 美好的恋情; 爱苗滋生; 希望和光明的前景 ",
    negative:
      "挫折、失败; 理想过高; 缺乏想像力; 异想天开; 事与愿违; 失望; 从事不喜的工作; 失去; 盗窃; 剥夺; 遗弃; 傲慢; 高傲; 无能 ",
  },
];
// Specific definitions for the 56 Minor Arcana cards
export const MINOR_ARCANA: TarotCard[] = [
  // --- WANDS (Fire / Action) ---
  {
    id: 22,
    nameEn: "Ace of Wands",
    nameCn: "权杖首牌",
    keywords: ["创造力", "发明", "事业起点", "阳刚之力", "财富", "继承"],
    image: "wands01.jpg",
    descriptionEn:
      "A hand issuing from a cloud grasps a stout wand or club. It signifies the source of creation, invention, and enterprise, representing the virility behind all beginnings. ",
    descriptionCn:
      "云中伸出一只手，紧握着巨大的权杖。这是创造、发明与事业的源头，象征着阳刚的原始力量与起点的契机。它不仅是企业的起点，更预示着家族、血统的起源以及随之而来的财富与继承。",
    positive: "创造; 发明; 事业心; 原则; 起点; 家族起源; 财富; 继承; 阳刚之力 ",
    negative: "衰退; 毁灭; 失败; 灭亡; 阴云笼罩的喜悦; 某种注定的厄运 ",
  },
  {
    id: 23,
    nameEn: "Two of Wands",
    nameCn: "权杖二",
    keywords: ["财富", "宏伟", "统治权", "成熟的规划", "意外的麻烦"],
    image: "wands02.jpg",
    descriptionEn:
      "A tall man looks from a battlemented roof over sea and shore; he holds a globe in his right hand. It suggests the magnificence of worldly wealth, yet hints at the sadness of Alexander amidst the grandeur of dominion. ",
    descriptionCn:
      "一位领主站在城墙顶端，手持地球仪，俯瞰着他的领地与海洋。左侧的玫瑰、十字与百合徽记暗示着灵性与物质的结合。这是亚历山大式的忧郁——坐拥世间财富与宏伟，却在权力的顶峰感到一丝孤独与悲伤，彷佛那是面对世界壮丽时的无力感。",
    positive: "财富; 宏伟; 统治权; 辉煌; 琐碎的失望; 身体的痛苦与悲伤; 羞辱 ",
    negative: "惊奇; 困惑; 着迷; 情感波动; 恐惧; 麻烦 ",
  },
  {
    id: 24,
    nameEn: "Three of Wands",
    nameCn: "权杖三",
    keywords: ["稳固的力量", "商业贸易", "远见", "发现", "务实的合作"],
    image: "wands03.jpg",
    descriptionEn:
      "A calm, stately personage, with his back turned, looking from a cliff's edge at ships passing over the sea. He symbolizes established strength and enterprise, viewing his merchandise sailing over the sea. ",
    descriptionCn:
      "一位庄严的人物背对我们，立于悬崖边缘，凝视着满载货物的船只驶向远方。这象征着稳固的力量与商业的远见，仿佛一位成功的商业巨子正在此岸展望彼岸的合作与援助，预示着探索与发现的成果即将到来。",
    positive:
      "稳固的力量; 进取心; 努力; 贸易; 商业; 发现; 能够提供帮助的商业合作 ",
    negative: "逆境结束; 麻烦中止; 失望停止; 辛苦后的喘息 ",
  },
  {
    id: 25,
    nameEn: "Four of Wands",
    nameCn: "权杖四",
    keywords: ["乡村生活", "避难所", "和谐", "繁荣", "和平", "完美的成果"],
    image: "wands04.jpg",
    descriptionEn:
      "Garlands hang between four wands; two female figures uplift nosegays near a bridge leading to an old manorial house. It represents a haven of refuge, repose, and concord. ",
    descriptionCn:
      "四根巨大的权杖间悬挂着丰收的花环，两位女子高举花束，背景是通往古老庄园的桥梁。这是乡村生活的田园牧歌，象征着避风港、家庭的丰收庆典、和谐与完美的安息。这是和平与繁荣的定格。",
    positive:
      "乡村生活; 避难所; 家庭庆典; 休息; 和谐; 繁荣; 和平; 完美的工作成果 ",
    negative: "繁荣持续; 美丽; 幸福; 装饰; 快乐的聚会; 已婚妇女生下漂亮的孩子 ",
  },
  {
    id: 26,
    nameEn: "Five of Wands",
    nameCn: "权杖五",
    keywords: ["模拟战争", "激烈的竞争", "奋斗", "追求财富", "模仿"],
    image: "wands05.jpg",
    descriptionEn:
      "A posse of youths are brandishing staves, as if in sport or strife. It is mimic warfare, symbolizing the strenuous competition and struggle of the search after riches and fortune. ",
    descriptionCn:
      "一群少年正挥舞手杖，似是游戏又似争斗。这是一场模拟的战争，象征着为了财富与命运而进行的剧烈竞争，以及人生战场上的奋斗与角逐。在这里，只有通过激烈的对抗才能获得金子与利益。",
    positive:
      "模拟; 模拟战斗; 激烈的竞争; 追求财富的奋斗; 生活的战斗; 金钱与收益 ",
    negative: "诉讼; 纠纷; 欺诈; 矛盾; 争吵可能转化为优势 ",
  },
  {
    id: 27,
    nameEn: "Six of Wands",
    nameCn: "权杖六",
    keywords: ["凯旋", "胜利", "好消息", "期望达成", "荣誉"],
    image: "wands06.jpg",
    descriptionEn:
      "A laurelled horseman bears one staff adorned with a laurel crown. It is a victor triumphing, representing great news and expectation crowned with its own desire. ",
    descriptionCn:
      "戴着桂冠的骑士骑马前行，手持饰有花环的权杖，随从簇拥。这是凯旋的胜利者，象征着期望在欲望中加冕，是带来重大喜讯的国王信使。这是希望的桂冠，是成功的确据。",
    positive: "胜利者凯旋; 重大消息; 期望达成; 希望的加冕; 仆人失去信任(额外) ",
    negative: "恐惧; 忧虑; 胜利的敌人在门口; 背叛; 不忠; 无限期的延迟 ",
  },
  {
    id: 28,
    nameEn: "Seven of Wands",
    nameCn: "权杖七",
    keywords: ["英勇", "优势地位", "商业谈判", "辩论", "竞争中的胜利"],
    image: "wands07.jpg",
    descriptionEn:
      "A young man on a craggy eminence brandishing a staff; six other staves are raised towards him from below. It signifies valour and the vantage position, indicating success where the combatant is on top. ",
    descriptionCn:
      "年轻人站在崎岖的高处，挥舞手杖抵御下方伸出的六根权杖。这象征着英勇与优势地位，在智力层面上代表争论与商业谈判中的博弈。即便孤身一人，由于占据高地，敌人也无法触及，胜利终将属于占据上风者。",
    positive: "英勇; 优势地位; 讨论; 言语冲突; 商业谈判; 交易竞争; 成功 ",
    negative: "困惑; 尴尬; 焦虑; 犹豫不决; 犹豫导致的警告 ",
  },
  {
    id: 29,
    nameEn: "Eight of Wands",
    nameCn: "权杖八",
    keywords: ["迅速的行动", "疾行", "伟大的希望", "爱的利箭", "奔向目标"],
    image: "wands08.jpg",
    descriptionEn:
      "A flight of wands through an open country; they draw to the term of their course. It signifies motion through the immovable, swiftness, and great haste towards an assured end. ",
    descriptionCn:
      "八根权杖如飞箭般划过开阔的田野，似乎在穿越静止的空间。这象征着极速的行动、即将到来的结局，以及那是爱的利箭，正飞向许诺幸福的终点。一切都在运动中，目标触手可及。",
    positive:
      "行动; 活动路径; 极速; 特使; 巨大的希望; 奔向幸福的终点; 爱的利箭 ",
    negative: "嫉妒之箭; 内心的争斗; 良心谴责; 争吵; 家庭纷争 ",
  },
  {
    id: 30,
    nameEn: "Nine of Wands",
    nameCn: "权杖九",
    keywords: ["防御中的力量", "强大的对手", "延期", "暂停", "严阵以待"],
    image: "wands09.jpg",
    descriptionEn:
      "The figure leans upon his staff and has an expectant look, as if awaiting an enemy. It signifies strength in opposition and the formidable antagonist. ",
    descriptionCn:
      "他依靠着手杖，神情警惕，身后排列着八根如同栅栏般的权杖。这象征着对抗中的力量与防御，即便遭遇攻击，他那强健的体魄也足以成为令人生畏的对手。这是在风暴来临前的等待与坚持。",
    positive: "对抗中的力量; 大胆迎击; 强大的对手; 延期; 暂停; 休会 ",
    negative: "障碍; 逆境; 灾难; 坏牌(普遍意义) ",
  },
  {
    id: 31,
    nameEn: "Ten of Wands",
    nameCn: "权杖十",
    keywords: ["压迫", "沉重的负担", "成功的代价", "虚假的表象", "辛苦的收获"],
    image: "wands10.jpg",
    descriptionEn:
      "A man oppressed by the weight of the ten staves which he is carrying. It signifies oppression, but also fortune, gain, and any kind of success that is burdensome. ",
    descriptionCn:
      "一个男人被他所背负的十根权杖压得直不起腰。这象征着财富与成功带来的沉重压迫。虽然也是收获与获利，但更是一种伪装的荣耀，那是通往目的地的苦行。如果随后出现宝剑九，则意味着彻底的失败。",
    positive: "压迫; 财富; 获利; 成功; 虚假的外表; 伪装; 背信弃义 ",
    negative: "矛盾; 困难; 阴谋; ",
  },
  {
    id: 32,
    nameEn: "Page of Wands",
    nameCn: "权杖侍从",
    keywords: ["忠诚的信使", "恋人", "消息灵通", "家族智慧", "正直的年轻人"],
    image: "wands11.jpg",
    descriptionEn:
      "A young man stands in the act of proclamation. He is unknown but faithful, and his tidings are strange. He is a faithful lover, an envoy, or a postman. ",
    descriptionCn:
      "一位年轻人在类似旷野的场景中宣告，他虽然陌生但忠诚。他象征着一位带来奇异消息的信使，一位忠实的恋人，或是家族中聪慧的后辈。若他身旁伴随着代表男性的牌，他将为其提供有利的证词。",
    positive:
      "忠诚; 恋人; 特使; 邮差; 有利证词; 家族智慧; 寻找年轻女士的贵族青年 ",
    negative: "轶事; 公告; 坏消息; 优柔寡断; 不稳定 ",
  },
  {
    id: 33,
    nameEn: "Knight of Wands",
    nameCn: "权杖骑士",
    keywords: ["启程", "离去", "移居", "改变住所", "友好的青年"],
    image: "wands12.jpg",
    descriptionEn:
      "He is shewn as if upon a journey, armed with a short wand, and although mailed is not on a warlike errand. He is passing mounds or pyramids, suggesting departure, flight, or emigration. ",
    descriptionCn:
      "他全副武装骑在马上，正如行进在旅途中，越过金字塔般的土丘。但他并非为了战争而来，马匹的动态暗示了急躁的情绪。这象征着离去、缺席，或是为了寻求改变而进行的迁徙。",
    positive: "启程; 缺席; 逃离; 移居; 友善; 改变住所 ",
    negative: "决裂; 分裂; 中断; 不和; 疏远; 婚姻受挫 ",
  },
  {
    id: 34,
    nameEn: "Queen of Wands",
    nameCn: "权杖王后",
    keywords: [
      "具有磁性的魅力",
      "商业成功",
      "荣誉",
      "贞洁",
      "友善的女性",
      "独立的爱",
    ],
    image: "wands13.jpg",
    descriptionEn:
      "The Queen of flowering wands, her personality corresponds to that of the King, but is more magnetic. She represents a dark, friendly, chaste, and loving woman. ",
    descriptionCn:
      "她手持发芽的权杖，展现出比国王更具磁性的魅力。她代表着一位友善、贞洁且充满爱意的女性，拥有独立的经济能力与务实的智慧。她不仅不仅能给予爱，也象征着在商业上的某种成功。",
    positive: "友善; 贞洁; 充满爱意; 荣誉; 爱财; 商业成功; 丰收 ",
    negative:
      "善良; 节俭; 乐于助人; 但也可能意味着反对; 嫉妒; 欺骗; 不忠; 有心无力 ",
  },
  {
    id: 35,
    nameEn: "King of Wands",
    nameCn: "权杖国王",
    keywords: ["热烈", "生动", "诚实", "良知", "意外的遗产", "友善的男性"],
    image: "wands14.jpg",
    descriptionEn:
      "The King uplifts a flowering wand, and wears a cap of maintenance beneath his crown. His nature is dark, ardent, lithe, animated, and impassioned. ",
    descriptionCn:
      "他举起开花的权杖，王座背饰以狮子徽记。他的天性黑暗而热烈，敏捷而生动。他象征着诚实、良知以及可能到来的意外遗产，是一位值得信赖的朋友，通常代表一位已婚且正直的男性。",
    positive: "友善; 乡下人; 已婚; 诚实; 良知; 意外的遗产; 美满的婚姻 ",
    negative: "善良但严厉; 苛刻但宽容; 建议值得遵循 ",
  },
  // --- CUPS (Water / Emotion) ---
  {
    id: 36,
    nameEn: "Ace of Cups",
    nameCn: "圣杯首牌",
    keywords: ["真心之屋", "喜悦", "丰盛", "多产", "神圣的滋养", "坚定意志"],
    image: "cups01.jpg",
    descriptionEn:
      "The waters are beneath, and thereon are water-lilies; the hand issues from the cloud, holding in its palm the cup, from which four streams are pouring; a dove, bearing in its bill a cross-marked Host, descends to place the Wafer in the Cup. It is an intimation of that which may lie behind the Lesser Arcana.",
    descriptionCn:
      "云中伸出的手掌托举着圣杯，四道源流从中倾泻而下，滋润着下方平静水面上的睡莲。象征圣灵的鸽子衔着刻有十字的圣体，正将其降入杯中。这是一张深藏奥秘的牌，它不仅是小阿尔克那背后的灵性暗示，更是“真心之屋”（House of the True Heart），象征着神圣的滋养、喜悦的源头以及不仅限于物质的丰盛与多产。",
    positive:
      "真心之屋; 喜悦; 满足; 住所; 滋养; 丰盛; 多产; 神圣的餐桌; 幸福; 坚定的意志; 不变的法则",
    negative: "虚假之心; 突变; 不稳定; 革命; 意想不到的地位改变",
  },
  {
    id: 37,
    nameEn: "Two of Cups",
    nameCn: "圣杯二",
    keywords: ["爱", "热情", "友谊", "亲和力", "神圣化的自然", "结合"],
    image: "cups02.jpg",
    descriptionEn:
      "A youth and maiden are pledging one another, and above their cups rises the Caduceus of Hermes, between the great wings of which there appears a lion's head. It represents that desire which is not in Nature, but by which Nature is sanctified.",
    descriptionCn:
      "一位青年与少女正举杯互誓，而在他们那交融的杯影之上，赫尔墨斯的双蛇杖（Caduceus）正缓缓升起，巨大的双翼间显现出狮首。这不仅是两性的交融，更象征着一种超越原始自然的渴望——通过这种渴望，自然本身得以被神圣化。这是爱、热情与亲和力的完美象征，是二元对立中的和谐统一。",
    positive: "爱; 热情; 友谊; 亲和力; 结合; 和谐; 同情; 两性关系; 财富与荣誉",
    negative: "虚假的爱; 愚蠢; 误解; 激情(Reversed: Passion)",
  },
  {
    id: 38,
    nameEn: "Three of Cups",
    nameCn: "圣杯三",
    keywords: ["圆满", "快乐", "胜利", "治愈", "感官享受", "意想不到的晋升"],
    image: "cups03.jpg",
    descriptionEn:
      "Maidens in a garden-ground with cups uplifted, as if pledging one another. It signifies the conclusion of any matter in plenty, perfection and merriment.",
    descriptionCn:
      "三位少女在丰茂的庭园中高举圣杯，彼此祝祷。这象征着事情在圆满、完美与欢乐中落幕。这是胜利的喜悦，是身心的慰藉与治愈。它描绘了生命中那些幸福的结局，以及在物质层面上的充实与欢庆。",
    positive:
      "圆满结束; 完美; 欢乐; 幸福的结果; 胜利; 慰藉; 治愈; 意想不到的晋升(军人)",
    negative: "过度; 急躁; 终结; 成就; 过度的感官享受; 身体的快感; 治愈",
  },
  {
    id: 39,
    nameEn: "Four of Cups",
    nameCn: "圣杯四",
    keywords: ["厌倦", "反感", "想象的烦恼", "混合的快乐", "新知"],
    image: "cups04.jpg",
    descriptionEn:
      "A young man is seated under a tree and contemplates three cups set on the grass before him; an arm issuing from a cloud offers him another cup. His expression is one of discontent with his environment.",
    descriptionCn:
      "年轻人坐在树下，凝视着草地上的三个杯子，神情中流露出对周遭环境的不满与厌倦。尽管云中伸出的手向他递来第四个杯子——那或许是仙境的礼物——但他却视而不见。这象征着世俗欢愉后的饱足与厌恶，一种源自想象的烦恼，仿佛世间的美酒只能带来空虚。",
    positive: "厌倦; 反感; 厌恶; 想象的烦恼; 饱足感; 混合的快乐",
    negative: "新奇; 预兆; 新的指示; 新的关系; 预感",
  },
  {
    id: 40,
    nameEn: "Five of Cups",
    nameCn: "圣杯五",
    keywords: ["损失", "部分残留", "遗产", "苦涩的婚姻", "归来"],
    image: "cups05.jpg",
    descriptionEn:
      "A dark, cloaked figure, looking sideways at three prone cups two others stand upright behind him; a bridge is in the background. It is a card of loss, but something remains over.",
    descriptionCn:
      "一个身披深色斗篷的身影侧身伫立，注视着地上倾倒的三个杯子，却未察觉身后仍有两杯立着。远处的桥梁通向一座城堡。这是一张关于损失的牌，但也暗示着并非一无所有。它可能象征着某种苦涩的遗产传递，或是一段伴随着挫败与遗憾的婚姻/结合。",
    positive:
      "损失; 残留之物; 遗产; 祖产; 传递(不如预期); 苦涩的婚姻; 幸福的婚姻(Section 4备选); 礼物; 成功",
    negative: "消息; 联盟; 亲和力; 血亲; 祖先; 归来; 虚假的计划; 亲人久别归来",
  },
  {
    id: 41,
    nameEn: "Six of Cups",
    nameCn: "圣杯六",
    keywords: ["回忆", "过去", "童年", "快乐", "未来", "遗产"],
    image: "cups06.jpg",
    descriptionEn:
      "Children in an old garden, their cups filled with flowers. It is a card of the past and of memories, looking back on childhood.",
    descriptionCn:
      "古老的庭园中，孩子们正将鲜花装满圣杯。这是一张关于过去与回忆的牌，象征着回望童年时的纯真与快乐，那是已经逝去的美好时光。然而，它也暗示着新的环境与知识，如同孩子们在陌生的庭院中嬉戏。",
    positive: "过去; 回忆; 童年; 快乐; 享受; 逝去的事物; 愉快的回忆",
    negative: "未来; 更新; 即将发生之事; 快速到来的遗产",
  },
  {
    id: 42,
    nameEn: "Seven of Cups",
    nameCn: "圣杯七",
    keywords: ["幻想", "想象", "白日梦", "无实质的成就", "决心"],
    image: "cups07.jpg",
    descriptionEn:
      "Strange chalices of vision, but the images are more especially those of the fantastic spirit. It signifies fairy favours, images of reflection, sentiment, imagination.",
    descriptionCn:
      "七只奇异的圣杯中浮现出各种幻象，那是奇幻精神的产物。这象征着“仙女的恩赐”，是沉思之镜中的影像，是情感与想象的投射。虽然在这些领域可能有所造诣，但正如这些幻影一般，其中并无永恒或实质的事物。",
    positive:
      "仙女的恩赐; 映像; 情感; 想象; 沉思中的景象; 某种成就(但不持久); 金发小孩; 想法; 设计",
    negative: "欲望; 意志; 决心; 计划; 成功(若伴随圣杯三)",
  },
  {
    id: 43,
    nameEn: "Eight of Cups",
    nameCn: "圣杯八",
    keywords: ["放弃", "衰退", "温和", "害羞", "巨大的喜悦"],
    image: "cups08.jpg",
    descriptionEn:
      "A man of dejected aspect is deserting the cups of his felicity, enterprise, undertaking or previous concern. It speaks for itself on the surface, but other readings are entirely antithetical.",
    descriptionCn:
      "一个神情沮丧的人正转身离去，抛下他曾经的快乐、事业或关注之事——那八只排列整齐的圣杯。这通常象征着一件事情的衰退，或者原本看似重要之事其实无足轻重。它描绘了放弃与远离的时刻。",
    positive:
      "给予喜悦; 温和; 害羞; 荣誉; 谦虚; 事情的衰退; 并不重要; 与金发女子结婚",
    negative: "巨大的喜悦; 幸福; 盛宴; 完美的满足",
  },
  {
    id: 44,
    nameEn: "Nine of Cups",
    nameCn: "圣杯九",
    keywords: ["满足", "物质福利", "成功", "胜利", "真理"],
    image: "cups09.jpg",
    descriptionEn:
      "A goodly personage has feasted to his heart's content, and abundant refreshment of wine is on the arched counter behind him. The picture offers the material side only.",
    descriptionCn:
      "一位面容和善的人物心满意足地端坐着，身后半圆形的桌上排列着九只满溢的圣杯，仿佛未来已有了保障。这张牌展现了物质层面的极致——和谐、满足与身体的安适。这是胜利与成功的象征，预示着询问者将获得他所寻求的优势。",
    positive: "和谐; 满足; 身体的舒适; 胜利; 成功; 优势; 军事人员的好兆头",
    negative: "真理; 忠诚; 自由; 错误; 不完美; 好生意",
  },
  {
    id: 45,
    nameEn: "Ten of Cups",
    nameCn: "圣杯十",
    keywords: ["完美的爱", "知足", "家庭幸福", "安息", "争吵"],
    image: "cups10.jpg",
    descriptionEn:
      "Appearance of Cups in a rainbow; it is contemplated in wonder and ecstacy by a man and woman below, evidently husband and wife. It signifies contentment, repose of the entire heart.",
    descriptionCn:
      "一道彩虹横跨天际，十只圣杯镶嵌其中。下方的一对夫妇与其子女正充满惊奇与狂喜地仰望这一奇景。这象征着内心的彻底安息与满足，是人间之爱与友谊的完美境界。这是幸福的家庭，是宁静的港湾。",
    positive:
      "知足; 内心的安息; 完美状态; 人类之爱; 友谊; 照顾询问者利益的人; 居住地; 美满的婚姻",
    negative: "虚假之心的安息; 愤怒; 暴力; 悲伤; 严重的争吵",
  },
  {
    id: 46,
    nameEn: "Page of Cups",
    nameCn: "圣杯侍从",
    keywords: ["勤奋", "冥想", "消息", "依恋", "诱惑"],
    image: "cups11.jpg",
    descriptionEn:
      "A fair, pleasing, somewhat effeminate page, of studious and intent aspect, contemplates a fish rising from a cup to look at him. It is the pictures of the mind taking form.",
    descriptionCn:
      "一位面容姣好、略显阴柔的侍从，正专注地凝视着手中杯里浮出的一条鱼。这是思维图像化的过程，象征着想象力正在成形。他代表着一位勤奋好学的青年，带来消息或致力于服务；也暗示着冥想与反思。",
    positive:
      "金发青年; 乐于服务; 勤奋; 消息; 讯息; 申请; 反思; 冥想; 商业思考; 爱情不顺的青年",
    negative: "品味; 倾向; 依恋; 诱惑; 欺骗; 诡计; 各种障碍",
  },
  {
    id: 47,
    nameEn: "Knight of Cups",
    nameCn: "圣杯骑士",
    keywords: ["到来", "邀请", "梦想家", "提议", "欺诈"],
    image: "cups12.jpg",
    descriptionEn:
      "Graceful, but not warlike; riding quietly, wearing a winged helmet, referring to those higher graces of the imagination. He too is a dreamer, but the images of the side of sense haunt him in his vision.",
    descriptionCn:
      "他优雅地骑行，头戴饰有双翼的头盔，但这并非为了战争，而是象征想象力的崇高恩赐。他是一位梦想家，然而感官世界的影像却萦绕在他的幻视之中。他代表着某种到来或接近——也许是一位使者，带来邀约、提议或某种诱导。",
    positive: "到来; 接近; 使者; 提议; 态度; 邀请; 煽动; 带来意外之财的朋友",
    negative: "诡计; 技俩; 狡猾; 诈骗;两面派; 欺诈; 不规则",
  },
  {
    id: 48,
    nameEn: "Queen of Cups",
    nameCn: "圣杯王后",
    keywords: ["远见", "充满爱意的智慧", "幸福", "贤妻良母", "不诚实的女人"],
    image: "cups13.jpg",
    descriptionEn:
      "Beautiful, fair, dreamy--as one who sees visions in a cup. She sees, but she also acts, and her activity feeds her dream. She represents loving intelligence, and hence the gift of vision.",
    descriptionCn:
      "她美丽、白皙而梦幻，仿佛正在圣杯中凝视着某种幻象。然而她不仅是旁观者，更是一位行动者，她的行动滋养着她的梦。她象征着充满爱意的智慧，因此拥有着预见的天赋。她是完美的妻子与母亲，是美德与幸福的化身。",
    positive:
      "善良的女性; 诚实; 忠诚; 充满爱意的智慧; 远见的天赋; 成功; 幸福; 快乐; 智慧; 美德; 完美的配偶",
    negative:
      "杰出但不被信任的女性; 乖僻的女性; 罪恶; 耻辱; 堕落; 富有或显赫的婚姻",
  },
  {
    id: 49,
    nameEn: "King of Cups",
    nameCn: "圣杯国王",
    keywords: ["公平", "创造性智慧", "负责任", "商业", "双重交易"],
    image: "cups14.jpg",
    descriptionEn:
      "He holds a short sceptre in his left hand and a great cup in his right; his throne is set upon the sea. He represents equity, art and science, including those who profess science, law and art; creative intelligence.",
    descriptionCn:
      "他手持短权杖与巨大的圣杯，王座安设于大海之上，波涛中有船只与海豚。他象征着公平、艺术与科学，以及那些富有创造性的智慧。作为一位从商者、法律人或神职人员，他是负责任的，并乐于助人。",
    positive:
      "金发男性; 商人; 法律或神学人士; 负责任; 乐于助人; 公平; 艺术; 科学; 创造性智慧; 谨防伪善",
    negative:
      "不诚实; 双重交易的男性; 欺诈; 勒索; 不公正; 罪恶; 丑闻; 掠夺; 重大损失",
  },

  // --- SWORDS (Air / Intellect) ---
  {
    id: 50,
    nameEn: "Ace of Swords",
    nameCn: "宝剑首牌",
    keywords: ["突破", "清晰", "真理", "决断"],
    image: "swords01.jpg",
    descriptionEn:
      "A hand issues from a cloud, grasping a sword, the point of which is encircled by a crown. It is a card of great force, triumph, and the excessive degree in everything.",
    descriptionCn:
      "云间之手紧握着被皇冠环绕剑尖的宝剑。它代表巨大的力量、胜利以及事物发展到极致的程度。",
    positive: "胜利; 征服; 力量的极致; 爱恨中的力量; 冠冕暗示更高的意义",
    negative: "结果是灾难性的; 概念; 生育; 增加; 倍增",
  },
  {
    id: 51,
    nameEn: "Two of Swords",
    nameCn: "宝剑二",
    keywords: ["僵局", "艰难决定", "回避", "权衡"],
    image: "swords02.jpg",
    descriptionEn:
      "A hoodwinked female figure balances two swords upon her shoulders. It suggests conformity, equipoise, courage, friendship, and concord in a state of arms.",
    descriptionCn:
      "一位蒙眼的女性平衡地将两把剑置于双肩之上。这象征着顺从与平衡，以及在武装对峙状态下的勇气、友谊与和谐。",
    positive: "顺从; 平衡; 勇气; 友谊; 和谐; 亲密关系; 礼物; 贵人相助",
    negative: "冒名顶替; 虚假; 欺骗; 不忠; 与流氓打交道",
  },
  {
    id: 52,
    nameEn: "Three of Swords",
    nameCn: "宝剑三",
    keywords: ["心碎", "悲伤", "痛苦", "分离"],
    image: "swords03.jpg",
    descriptionEn:
      "Three swords pierce a heart, set against a backdrop of cloud and rain. It signifies removal, absence, delay, division, rupture, and dispersion.",
    descriptionCn:
      "三把剑穿透一颗心脏，背景是阴云和雨。象征着移开、缺席、延误、分裂、破裂和分散，以及设计自然暗示的一切。",
    positive: "移除障碍; 必要的分别; 延期或中止 (中性); 面对现实的痛苦",
    negative:
      "精神错乱; 错误; 损失; 分心; 混乱; 女士感情的逝去; 再次遇到已断交者; 修女",
  },
  {
    id: 53,
    nameEn: "Four of Swords",
    nameCn: "宝剑四",
    keywords: ["休息", "恢复", "沉思", "被动"],
    image: "swords04.jpg",
    descriptionEn:
      "The effigy of a knight is shown in the attitude of prayer, at full length upon his tomb. It denotes vigilance, retreat, solitude, hermit's repose, exile, tomb, and coffin.",
    descriptionCn:
      "一位骑士的肖像以祈祷的姿势，完全躺在他的墓碑上。象征着警觉、退隐、孤独、隐士的休养、流放、墓地与棺材。",
    positive: "明智的管理; 谨慎; 节约; 预防; 遗嘱; 借由明智管理可获得有限成功",
    negative: "一个坏兆头; （逆位本身含义较正位柔和）",
  },
  {
    id: 54,
    nameEn: "Five of Swords",
    nameCn: "宝剑五",
    keywords: ["失败", "背叛", "冲突", "空虚的胜利"],
    image: "swords05.jpg",
    descriptionEn:
      "A disdainful man looks after two retreating and dejected figures. He is the master in possession of the field. It signifies degradation, destruction, infamy, dishonour, and loss.",
    descriptionCn:
      "一个傲慢的男人看着两个沮丧退去的人。他是战场的主宰。它象征着堕落、毁灭、恶名、耻辱和损失。",
    positive: "避免冲突; 认识到损失; 学习经验; 接受屈辱 (中性/警示)",
    negative: "与正位含义相同; 埋葬与丧事; 攻击求问者的财富; 悲伤与哀悼",
  },
  {
    id: 55,
    nameEn: "Six of Swords",
    nameCn: "宝剑六",
    keywords: ["过渡", "离开", "治愈", "前进"],
    image: "swords06.jpg",
    descriptionEn:
      "A ferryman carries passengers in his punt to the further shore. It means passage, route, way, envoy, commissionary, expedient, and travel by water.",
    descriptionCn:
      "一个船夫载着乘客乘船前往远处的岸边。它意味着水上旅行、路线、方式、使者、受托人、权宜之计。",
    positive: "声明; 坦白; 公开; 求爱; 旅程将是愉快的",
    negative: "诉讼结果不利",
  },
  {
    id: 56,
    nameEn: "Seven of Swords",
    nameCn: "宝剑七",
    keywords: ["欺骗", "策略", "隐秘", "逃避"],
    image: "swords07.jpg",
    descriptionEn:
      "A man in the act of carrying away five swords rapidly, leaving two stuck in the ground near a camp. It indicates design, attempt, wish, confidence, and quarrelling; uncertain import.",
    descriptionCn:
      "一个人急匆匆地带走五把剑，剩下两把插在营地附近的地面。这预示着设计、尝试、愿望、信心和争吵；其含义不确定。",
    positive: "好的建议; 劝告; 指导; 乡村生活",
    negative: "诽谤; 饶舌; 好的建议可能被忽略",
  },
  {
    id: 57,
    nameEn: "Eight of Swords",
    nameCn: "宝剑八",
    keywords: ["束缚", "受害者心态", "无助", "限制"],
    image: "swords08.jpg",
    descriptionEn:
      "A woman, bound and hoodwinked, with the swords about her. It is a card of temporary durance, bad news, crisis, censure, and sickness.",
    descriptionCn:
      "一个被束缚和蒙眼的女人，周围环绕着剑。这是一张代表短暂束缚、坏消息、危机、谴责和疾病的牌。",
    positive: "暂时的束缚; 有意识地忍耐",
    negative:
      "不安; 困难; 反对; 事故; 背叛; 不可预见的事情; 宿命; 针对女性的诽谤",
  },
  {
    id: 58,
    nameEn: "Nine of Swords",
    nameCn: "宝剑九",
    keywords: ["焦虑", "噩梦", "担忧", "恐惧"],
    image: "swords09.jpg",
    descriptionEn:
      "One seated on her couch in lamentation, with the swords over her. It is a card of utter desolation, death, failure, miscarriage, deception, and despair.",
    descriptionCn:
      "一个人坐在床上悲叹，九把剑悬于她上方。这是一张代表彻底荒凉、死亡、失败、流产、欺骗和绝望的牌。",
    positive: "神职人员; 牧师; 对可疑之人有充分的怀疑理由",
    negative: "监禁; 怀疑; 合理的恐惧; 羞耻; 普遍的坏兆头",
  },
  {
    id: 59,
    nameEn: "Ten of Swords",
    nameCn: "宝剑十",
    keywords: ["毁灭", "痛苦结局", "背叛", "最低点"],
    image: "swords10.jpg",
    descriptionEn:
      "A prostrate figure, pierced by all the swords. It signifies pain, affliction, tears, sadness, and desolation.",
    descriptionCn:
      "一个倒地的人，被十把剑刺穿。它象征着痛苦、苦难、眼泪、悲伤和荒凉。",
    positive: "优势; 利润; 成功; 好感 (但非永久); 权力与权威; 军事胜利",
    negative: "损失; 痛苦; 悲伤; 荒凉; 监禁; 朋友的背叛",
  },
  {
    id: 60,
    nameEn: "Page of Swords",
    nameCn: "宝剑侍从",
    keywords: ["好奇", "警惕", "新想法", "沟通"],
    image: "swords11.jpg",
    descriptionEn:
      "A lithe, active figure holds a sword upright in both hands. He signifies authority, overseeing, secret service, vigilance, spying, and examination.",
    descriptionCn:
      "一个轻盈、敏捷的人双手竖立着剑。他象征着权威、监督、秘密服务、警惕、侦查和审查。",
    positive: "权威;监督;秘密;警惕;侦查;审查; 敏捷的思维",
    negative:
      "品质的邪恶面; 意想不到的事; 未准备的状态; 疾病; 窥探求问者秘密的轻率之人",
  },
  {
    id: 61,
    nameEn: "Knight of Swords",
    nameCn: "宝剑骑士",
    keywords: ["急躁", "直接", "行动", "野心"],
    image: "swords12.jpg",
    descriptionEn:
      "He is riding in full course, as if scattering his enemies. He signifies skill, bravery, capacity, enmity, wrath, war, destruction, and resistance.",
    descriptionCn:
      "他全力策马奔跑，仿佛要驱散他的敌人。他象征着技能、勇敢、能力、仇恨、愤怒、战争、毁灭和抵抗。",
    positive: "技能; 勇敢; 能力; 防御; 智慧; 军人; 卫星; 佣兵; 预言英勇行动",
    negative: "轻率; 无能; 浪费; 与愚蠢之人争吵; 女性与对手斗争 (对手将被征服)",
  },
  {
    id: 62,
    nameEn: "Queen of Swords",
    nameCn: "宝剑王后",
    keywords: ["敏锐", "独立", "清晰", "界限"],
    image: "swords13.jpg",
    descriptionEn:
      "Her countenance is severe but chastened; it suggests familiarity with sorrow. She signifies widowhood, female sadness and embarrassment, absence, sterility, mourning, and separation.",
    descriptionCn:
      "她的面容严厉而内敛，暗示着对忧伤的熟悉。她象征着寡居、女性的悲伤和尴尬、缺席、不育、哀悼和分离。",
    positive: "寡妇 (中性/身份); 历经忧伤的清醒; 辨识力强的女性",
    negative: "恶意; 偏执; 诡计; 过度的贞洁; 不幸; 欺骗; 怀有恶意的坏女人",
  },
  {
    id: 63,
    nameEn: "King of Swords",
    nameCn: "宝剑国王",
    keywords: ["理智", "权威", "真理", "公正"],
    image: "swords14.jpg",
    descriptionEn:
      "He sits in judgment, holding the unsheathed sign of his suit. He signifies power, command, authority, militant intelligence, law, and offices of the crown.",
    descriptionCn:
      "他手持未出鞘的剑，端坐审判。他象征着权力、指挥、权威、战斗性智慧、法律和王室职务。",
    positive: "权力; 指挥; 权威; 战斗性智慧; 法律; 律师; 参议员; 医生",
    negative:
      "残忍; 堕落; 野蛮; 背信弃义; 邪恶意图; 坏人; 停止一场徒劳的诉讼的警告",
  },
  // --- PENTACLES (Earth / Material) ---
  {
    id: 64,
    nameEn: "Ace of Pentacles",
    nameCn: "星币首牌",
    keywords: ["新机会", "繁荣", "丰富", "表现"],
    image: "pents01.jpg",
    descriptionEn:
      "A hand issues from a cloud, holding up a pentacle. It signifies perfect contentment, felicity, ecstasy; also speedy intelligence, and gold.",
    descriptionCn:
      "一只手从云中伸出，举着一个星币。它象征着完美的满足、幸福、狂喜；也代表快速的情报和黄金。",
    positive:
      "完美的满足; 幸福; 狂喜; 快速的情报; 黄金; 最有利的牌; 舒适的物质条件",
    negative: "财富的邪恶面; 坏情报; 巨大的财富; 寻宝中的份额 (中性/意外)",
  },
  {
    id: 65,
    nameEn: "Two of Pentacles",
    nameCn: "星币二",
    keywords: ["平衡", "适应", "优先顺位", "灵活"],
    image: "pents02.jpg",
    descriptionEn:
      "A young man, in the act of dancing, has a pentacle in either hand, joined by an endless cord. It is a card of gaiety, recreation, news, messages in writing, obstacles, agitation, trouble, and embroilment.",
    descriptionCn:
      "一个跳舞的年轻人，两只手各有一个星币，由一条无限的绳索连接。它代表着欢快、娱乐、书面消息、障碍、激动、麻烦和卷入纠纷。",
    positive: "欢快; 娱乐; 新闻; 书面消息; 烦恼更多是想象而非真实",
    negative:
      "被迫的欢快; 假装的享受; 字面意义; 笔迹; 组成; 汇票; 坏兆头; 无知; 不公正",
  },
  {
    id: 66,
    nameEn: "Three of Pentacles",
    nameCn: "星币三",
    keywords: ["团队", "合作", "技能", "计划"],
    image: "pents03.jpg",
    descriptionEn:
      "A sculptor at his work in a monastery, often regarded as a card of metier, trade, skilled labour, nobility, aristocracy, renown, and glory.",
    descriptionCn:
      "一位雕塑家在修道院里工作。通常被视为代表行业、贸易、熟练劳动，以及高贵、贵族、声望和荣耀的牌。",
    positive: "行业; 贸易; 熟练劳动; 高贵; 贵族; 荣耀; 长子将获得名望",
    negative: "工作上的平庸; 孩子气; 琐碎; 弱点; 依赖周围的牌",
  },
  {
    id: 67,
    nameEn: "Four of Pentacles",
    nameCn: "星币四",
    keywords: ["控制", "占有", "保守", "安全"],
    image: "pents04.jpg",
    descriptionEn:
      "A crowned figure clasps a pentacle, two others are under his feet. He holds to that which he has. It denotes the surety of possessions, cleaving to what one has, gift, legacy, and inheritance.",
    descriptionCn:
      "一位戴着皇冠的人物紧紧抱着一个星币，另外两个在他的脚下。他紧抓着他所拥有的。它象征着财产的确定性、坚守、礼物、遗产和继承。",
    positive: "财产的确定性; 坚守; 礼物; 遗产; 继承; 单身汉收到女士的愉快消息",
    negative: "悬念; 延迟; 反对; 观察; 阻碍",
  },
  {
    id: 68,
    nameEn: "Five of Pentacles",
    nameCn: "星币五",
    keywords: ["贫穷", "孤立", "不安全", "困难"],
    image: "pents05.jpg",
    descriptionEn:
      "Two mendicants in a snow-storm pass a lighted casement. It foretells material trouble, destitution, or sometimes love and lovers.",
    descriptionCn:
      "两个乞丐在暴风雪中经过一扇亮着的窗户。它预示着物质上的麻烦、贫困，或者有时也代表爱和恋人。",
    positive: "爱情和恋人; 和谐; 亲和力; 通过理性征服财富",
    negative: "混乱; 无序; 毁灭; 争吵; 放荡; 爱情中的麻烦",
  },
  {
    id: 69,
    nameEn: "Six of Pentacles",
    nameCn: "星币六",
    keywords: ["慈善", "慷慨", "分享", "平衡"],
    image: "pents06.jpg",
    descriptionEn:
      "A merchant weighs money in scales and distributes it to the needy. It signifies presents, gifts, gratification, vigilance, and present prosperity.",
    descriptionCn:
      "一位商人用秤称量金钱并分发给有需要的人。它象征着礼物、馈赠、满足、警惕，以及当前的繁荣。",
    positive: "礼物; 馈赠; 满足; 警惕; 当前的繁荣; 不要依赖当下",
    negative: "欲望; 贪婪; 嫉妒; 幻想; 对求问者抱负的阻碍",
  },
  {
    id: 70,
    nameEn: "Seven of Pentacles",
    nameCn: "星币七",
    keywords: ["耐心", "投资", "等待", "长期规划"],
    image: "pents07.jpg",
    descriptionEn:
      "A young man leaning on his staff looks intently at seven pentacles attached to greenery. It is mainly a card of money, business, barter, but readings also include altercation, innocence, and purgation.",
    descriptionCn:
      "一个年轻人倚着他的手杖，专注地看着附着在绿色植物上的七个星币。它主要是一张关于金钱、商业、贸易的牌，但解读也包括争吵、天真和净化。",
    positive: "天真; 独创性; 净化; 对女士未来丈夫地位的改善",
    negative: "对可能借出的钱财的焦虑; 不耐烦; 担忧; 怀疑",
  },
  {
    id: 71,
    nameEn: "Eight of Pentacles",
    nameCn: "星币八",
    keywords: ["勤奋", "技能", "工艺", "细节"],
    image: "pents08.jpg",
    descriptionEn:
      "An artist in stone at his work, exhibiting his craft. It denotes work, employment, commission, craftsmanship, and skill in craft and business.",
    descriptionCn:
      "一个石雕艺术家在工作，展示他的工艺。它象征着工作、雇佣、委托、手艺和商业技能。",
    positive: "工作; 雇佣; 手艺; 技能; 年轻的生意人",
    negative:
      "徒劳的野心; 虚荣; 贪婪; 苛求; 高利贷; 狡猾与阴谋; 求问者将牵涉到借贷问题中",
  },
  {
    id: 72,
    nameEn: "Nine of Pentacles",
    nameCn: "星币九",
    keywords: ["富足", "奢华", "自给自足", "成就"],
    image: "pents09.jpg",
    descriptionEn:
      "A woman, with a bird upon her wrist, stands amidst a great abundance of grapevines. It signifies prudence, safety, success, accomplishment, and discernment.",
    descriptionCn:
      "一位手腕上停着一只鸟的女性，站在葡萄园的丰饶之中。它象征着谨慎、安全、成功、成就和洞察力。",
    positive: "谨慎; 安全; 成功; 成就; 洞察力; 预示的事情将迅速实现",
    negative: "欺诈; 欺骗; 被作废的计划; 背信弃义; 虚妄的希望",
  },
  {
    id: 73,
    nameEn: "Ten of Pentacles",
    nameCn: "星币十",
    keywords: ["财富", "遗产", "家庭", "长期成功"],
    image: "pents10.jpg",
    descriptionEn:
      "A man and woman beneath an archway, accompanied by a child, meeting an ancient personage with dogs. It signifies gain, riches, family matters, archives, and the abode of a family.",
    descriptionCn:
      "一对男女在一个拱门下，带着一个孩子，遇到一位带着狗的老者。它象征着收获、财富、家庭事务、档案和家族的住所。",
    positive: "收获; 财富; 家庭事务; 档案; 家族住所; 一桩可能幸运或不幸的场合",
    negative: "偶然; 宿命; 损失; 抢劫; 赌博; 赠予; 嫁妆; 养老金",
  },
  {
    id: 74,
    nameEn: "Page of Pentacles",
    nameCn: "星币侍从",
    keywords: ["好学", "务实", "新机会", "显化"],
    image: "pents11.jpg",
    descriptionEn:
      "A youthful figure, looking intently at the pentacle. He signifies application, study, scholarship, reflection, news, messages, rule, and management.",
    descriptionCn:
      "一个年轻人专注地看着他举起的星币。他象征着勤奋、学习、学术、沉思、新闻、消息、统治和管理。",
    positive:
      "勤奋; 学习; 学术; 沉思; 新闻; 消息; 管理; 青年; 军官或士兵; 孩子",
    negative: "挥霍; 浪费; 自由; 奢侈; 不利的消息; 有时指堕落和掠夺",
  },
  {
    id: 75,
    nameEn: "Knight of Pentacles",
    nameCn: "星币骑士",
    keywords: ["勤奋", "效率", "例行公事", "保守"],
    image: "pents12.jpg",
    descriptionEn:
      "He rides a slow, enduring horse, and exhibits his symbol. He signifies utility, serviceableness, interest, responsibility, and rectitude on the external plane.",
    descriptionCn:
      "他骑着一匹缓慢而坚韧的马，展示着他的星币。他在外在层面象征着实用性、可用性、兴趣、责任感和正直。",
    positive: "实用性; 可用性; 兴趣; 责任感; 正直; 有用的发现",
    negative: "惰性; 懒惰; 停滞; 气馁; 粗心; 一位失业的勇士",
  },
  {
    id: 76,
    nameEn: "Queen of Pentacles",
    nameCn: "星币王后",
    keywords: ["养育", "务实", "安全", "居家"],
    image: "pents13.jpg",
    descriptionEn:
      "The face suggests greatness of soul and serious intelligence. She signifies opulence, generosity, magnificence, security, and liberty.",
    descriptionCn:
      "面容暗示着灵魂的伟大和严肃的智慧。她象征着富裕、慷慨、壮丽、安全和自由。",
    positive:
      "富裕; 慷慨; 壮丽; 安全; 自由; 礼物; 对年轻人来说富裕且幸福的婚姻",
    negative: "邪恶; 猜疑; 悬念; 恐惧; 不信任; 疾病",
  },
  {
    id: 77,
    nameEn: "King of Pentacles",
    nameCn: "星币国王",
    keywords: ["富裕", "商业", "领导", "安全感"],
    image: "pents14.jpg",
    descriptionEn:
      "The figure suggests courage but somewhat lethargic in tendency. He signifies valour, realizing intelligence in business, and success.",
    descriptionCn:
      "人物暗示勇气，但倾向于有些迟钝。他象征着勇猛、在商业中实现智慧，以及成功。",
    positive: "勇猛; 商业上实现智慧; 成功; 算术天赋; 商人; 主人; 教授",
    negative: "罪恶; 弱点; 丑陋; 堕落; 腐败; 危险; 一位年老且邪恶的男性",
  },
];

export const getCardImageUrl = (image: string) => `${LOCAL_CDN}${image}`;

export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// Pre-defined scripts for the static voice parts
export const STATIC_SCRIPTS = {
  WELCOME: "静心凝视深渊。当你的直觉苏醒时,进入命运之门。",
  ASK: "心中的疑惑,是通往真理的钥匙。告诉我,你为何而来？",
  SHUFFLE: "星辰正在归位,混乱中孕育着秩序。专注于你的问题。",
  PICK: "在流动的命运中,选择你的指引。",
  REVEAL: "这就是……命运的回响。",
};

// Helper to get deck for a specific pool type
export const getDeckForPool = (pool: CardPoolType): TarotCard[] => {
  const courtPrefixes = ["Page", "Knight", "Queen", "King"];
  const isCourt = (c: TarotCard) =>
    courtPrefixes.some((p) => c.nameEn.startsWith(p));

  switch (pool) {
    case "MAJOR":
      return MAJOR_ARCANA;
    case "MINOR_PIP":
      return MINOR_ARCANA.filter((c) => !isCourt(c));
    case "COURT":
      return MINOR_ARCANA.filter((c) => isCourt(c));
    case "SUIT_CUPS":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Cups"));
    case "SUIT_PENTACLES":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Pentacles"));
    case "SUIT_SWORDS":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Swords"));
    case "SUIT_WANDS":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Wands"));
    case "FULL":
    default:
      return FULL_DECK;
  }
};
