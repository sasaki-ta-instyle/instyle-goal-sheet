import pptxgen from 'pptxgenjs';
import type { FormData } from './types';
import { GRADE_TABLE } from './types';

const C = {
  bg: 'EDE9E0',
  text: '35362D',
  muted: '82837A',
  light: 'C4C1B0',
  inv: 'F3F1EE',
  surface: 'F3F1EE',
  surface2: 'E6E2D7',
  header: 'E6E2D7',
};

const FONT = '游ゴシック';
const W = 13.33;
const H = 7.5;

function addSlideHeader(sl: pptxgen.Slide, title: string, sub: string) {
  sl.addShape('rect', { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.text }, line: { width: 0, color: C.text } });
  sl.addText(title, {
    x: 0.4, y: 0.15, w: W - 1.2, h: 0.45,
    fontFace: FONT, fontSize: 14, color: C.inv, bold: true,
  });
  sl.addText(sub, {
    x: 0.4, y: 0.6, w: W - 1.2, h: 0.25,
    fontFace: FONT, fontSize: 7, color: 'A0A098', align: 'right',
  });
}

function addSectionLabel(sl: pptxgen.Slide, y: number, label: string) {
  sl.addText(label, {
    x: 0.4, y, w: W - 0.8, h: 0.24,
    fontFace: FONT, fontSize: 8, color: C.muted, bold: true,
  });
}

function addTable(sl: pptxgen.Slide, y: number, headers: string[], rows: string[][], colWidths: number[]) {
  const tableData: pptxgen.TableRow[] = [];

  tableData.push(headers.map(h => ({
    text: h,
    options: {
      bold: true, fontSize: 7, fontFace: FONT,
      color: C.muted,
      fill: { color: C.header },
      align: 'left' as const,
    },
  })));

  rows.forEach((row, ri) => {
    const fillColor = ri % 2 === 0 ? C.surface : C.surface2;
    tableData.push(row.map(cell => ({
      text: cell,
      options: {
        fontSize: 8, fontFace: FONT,
        color: C.text,
        fill: { color: fillColor },
        align: 'left' as const,
      },
    })));
  });

  const totalW = colWidths.reduce((a, b) => a + b, 0);
  const actualWidths = colWidths.map(w => (w / totalW) * (W - 0.8));

  sl.addTable(tableData, {
    x: 0.4, y,
    w: W - 0.8,
    colW: actualWidths,
    rowH: 0.28,
    border: { pt: 0, color: 'FFFFFF' },
    autoPage: false,
  });
}

function textBox(sl: pptxgen.Slide, x: number, y: number, w: number, h: number, text: string, opts?: Partial<pptxgen.TextPropsOptions>) {
  sl.addText(text || '—', {
    x, y, w, h,
    fontFace: FONT, fontSize: 8, color: C.text,
    fill: { color: C.surface }, align: 'left',
    inset: 0.06,
    wrap: true,
    ...opts,
  });
}

// スライド1: カバー
function slide1(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  sl.addShape('rect', { x: 0, y: 0, w: W, h: H * 0.55, fill: { color: C.text }, line: { width: 0, color: C.text } });

  sl.addText('INSTYLE GROUP', {
    x: 0.5, y: 0.4, w: W - 1, h: 0.4,
    fontFace: FONT, fontSize: 9, color: 'C4C1B0', bold: false,
    align: 'left', charSpacing: 6,
  });

  sl.addText('目標設定シート', {
    x: 0.5, y: 0.9, w: W - 1, h: 1.2,
    fontFace: FONT, fontSize: 42, color: C.inv, bold: true,
    align: 'left',
  });

  sl.addText('会社目標 ／ 部署目標 ／ 個人目標 ／ Grade表 ／ 昇格・昇給 ／ ボーナス評価', {
    x: 0.5, y: 2.2, w: W - 1, h: 0.4,
    fontFace: FONT, fontSize: 9, color: 'A0A098', bold: false,
    align: 'left',
  });

  const infoY = H * 0.62;
  const rows = [
    { label: '所属法人', value: d.cover.company || '—' },
    { label: '氏名', value: d.cover.name || '—' },
    { label: 'Grade', value: d.cover.grade || '—' },
    { label: '期', value: d.cover.period || '—' },
  ];
  rows.forEach((r, i) => {
    sl.addText(r.label + '：', {
      x: 0.8, y: infoY + i * 0.5, w: 1.5, h: 0.4,
      fontFace: FONT, fontSize: 10, color: C.muted, bold: false,
    });
    sl.addText(r.value, {
      x: 2.4, y: infoY + i * 0.5, w: 6, h: 0.4,
      fontFace: FONT, fontSize: 12, color: C.text, bold: false,
    });
  });

  sl.addText('2026年4月　INSTYLE GROUP', {
    x: 0, y: H - 0.35, w: W, h: 0.3,
    fontFace: FONT, fontSize: 8, color: C.muted, align: 'center',
  });
}

// スライド2: 会社目標
function slide2(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '01｜会社目標 記入シート', 'INSTYLE GROUP｜人事制度　2 / 7');

  const c = d.company;
  let y = 1.05;

  const NUM_COLS = ['前期実績\n2025.10〜2026.3', '今期目標\n2026.4〜9', '成長率(%)', '来期目標', '今期実績\n2026.4〜9'];

  // ① 売上
  addSectionLabel(sl, y, '① 売上');
  y += 0.3;
  addTable(sl, y, ['指標', ...NUM_COLS], [
    ['グループ売上合計', c.revenue.prev || '—', c.revenue.target || '—', c.revenue.growth || '—', c.revenue.nextTarget || '—', c.revenue.actual || '—'],
  ], [2.2, 1.5, 1.5, 1.0, 1.2, 1.5]);
  y += 0.3 + 0.28;

  // ② 利益
  addSectionLabel(sl, y, '② 利益');
  y += 0.3;
  addTable(sl, y, ['指標', ...NUM_COLS], [
    ['グループ営業利益', c.operatingProfit.prev || '—', c.operatingProfit.target || '—', c.operatingProfit.growth || '—', c.operatingProfit.nextTarget || '—', c.operatingProfit.actual || '—'],
    ['グループ営業利益率', c.operatingMargin.prev || '—', c.operatingMargin.target || '—', c.operatingMargin.growth || '—', c.operatingMargin.nextTarget || '—', c.operatingMargin.actual || '—'],
    ['グループ粗利益', c.grossProfit.prev || '—', c.grossProfit.target || '—', c.grossProfit.growth || '—', c.grossProfit.nextTarget || '—', c.grossProfit.actual || '—'],
  ], [2.2, 1.5, 1.5, 1.0, 1.2, 1.5]);
  y += 0.3 + 0.28 * 3;

  // ③ 今期テーマ（戦略的フォーカス）
  addSectionLabel(sl, y, '③ 今期テーマ（戦略的フォーカス）');
  y += 0.3;
  const halfW = (W - 0.8 - 0.16) / 2;
  textBox(sl, 0.4, y, halfW, 0.6, c.strategicFocus[0] || '—');
  textBox(sl, 0.4 + halfW + 0.16, y, halfW, 0.6, c.strategicFocus[1] || '—');
}

// スライド3: 部署目標
function slide3(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '02｜部署目標 記入シート', 'INSTYLE GROUP｜人事制度　3 / 7');

  const c = d.dept;
  let y = 1.05;

  // ① 上位目標との接続
  addSectionLabel(sl, y, '① 上位目標との接続（会社目標から転記）');
  y += 0.3;
  const halfW = (W - 0.8 - 0.16) / 2;
  textBox(sl, 0.4, y, halfW, 0.55, '戦略的フォーカス：\n' + (c.strategicFocusRef || '—'));
  textBox(sl, 0.4 + halfW + 0.16, y, halfW, 0.55, '部署のミッション：\n' + (c.mission || '—'));
  y += 0.65;

  // ② 部署KPI目標
  addSectionLabel(sl, y, '② 部署KPI目標');
  y += 0.3;
  const KPI_COLS = ['前期実績\n2025.10〜2026.3', '今期目標\n2026.4〜9', '成長率(%)', '来期目標', '今期実績\n2026.4〜9'];
  const kpiData = [
    { label: `主要KPI①（${c.kpi1.label || '　　　'}）`, r: c.kpi1 },
    { label: `主要KPI②（${c.kpi2.label || '　　　'}）`, r: c.kpi2 },
    { label: `主要KPI③（${c.kpi3.label || '　　　'}）`, r: c.kpi3 },
  ];
  addTable(sl, y, ['KPI', ...KPI_COLS],
    kpiData.map(k => [k.label, k.r.prev || '—', k.r.target || '—', k.r.growth || '—', k.r.nextTarget || '—', k.r.actual || '—']),
    [2.8, 1.4, 1.4, 1.0, 1.2, 1.4]);
  y += 0.3 + 0.28 * 3;

  // ③ 今期の重点施策
  addSectionLabel(sl, y, '③ 今期の重点施策（KPIを達成するための行動）');
  y += 0.3;
  const actionRows = c.actions.map((r, i) => [
    `${i + 1}`, r.content || '—', r.expectedEffect || '—', r.deadline || '—',
  ]);
  addTable(sl, y, ['#', '施策内容', '期待効果', '期限'], actionRows, [0.4, 4.5, 4.5, 1.5]);
}

// スライド4: 個人目標
function slide4(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '03｜個人目標 記入シート', 'INSTYLE GROUP｜人事制度　4 / 7');

  const c = d.personal;
  let y = 1.05;

  // ① 現在地の確認
  addSectionLabel(sl, y, '① 現在地の確認');
  y += 0.3;
  const statusRows = c.currentStatus.map(r => [r.label, r.value || '—']);
  addTable(sl, y, ['項目', '内容'], statusRows, [3.0, W - 0.8 - 3.0]);
  y += 0.3 + statusRows.length * 0.38;

  // ② SMART個人目標
  addSectionLabel(sl, y, '② SMART個人目標');
  y += 0.3;
  const smartRows = c.smartGoals.map((r, i) => [
    `目標${i + 1}`, r.goal || '—', r.targetValue || '—', r.deadline || '—', r.note || '—',
  ]);
  addTable(sl, y, ['#', '目標（Specific）', '目標値', '期限', '備考・関連目標'], smartRows,
    [0.8, 4.5, 1.5, 1.3, 2.5]);
  y += 0.3 + smartRows.length * 0.3;

  // ③ 部署KPIへの貢献
  addSectionLabel(sl, y, '③ 部署KPIへの貢献（自分が担う数字）');
  y += 0.3;
  const kpiRows = c.kpiContribs.map(r => [r.deptKpi || '—', r.myPart || '—']);
  addTable(sl, y, ['部署KPI', '自分の担当分'], kpiRows, [6.0, W - 0.8 - 6.0]);
}

// スライド5: Grade表
function slide5(prs: InstanceType<typeof pptxgen>, selectedGrade: string, expectations: Record<string, string>) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '04｜Grade表', 'INSTYLE GROUP｜人事制度　5 / 7');

  const x0 = 0.4;
  const y = 1.1;
  const rowH = 0.38;
  const colWidths = [0.8, 2.8, 1.2, 1.8, 6.45];

  sl.addText('現在値に○をつけてください', {
    x: x0, y: y - 0.3, w: 10, h: 0.25,
    fontFace: FONT, fontSize: 8, color: C.muted,
  });

  const headers = ['ティア', '名称', 'Grade', '基本給与（円）', '各人が各クラスに求める目安'];
  const tableData: pptxgen.TableRow[] = [
    headers.map((h, i) => ({
      text: h,
      options: {
        bold: true, fontSize: 7, fontFace: FONT,
        color: C.muted,
        fill: { color: C.header },
        align: 'left' as const,
        colW: colWidths[i],
      },
    })),
  ];

  GRADE_TABLE.forEach(tier => {
    tier.grades.forEach((entry, gIdx) => {
      const isSelected = entry.key === selectedGrade;
      const fillColor = isSelected ? 'D8D4CA' : gIdx % 2 === 0 ? C.surface : C.surface2;

      tableData.push([
        {
          text: gIdx === 0 ? tier.tier : '',
          options: {
            bold: true, fontSize: 13, fontFace: FONT,
            color: C.text,
            fill: { color: 'E0DDD4' },
            align: 'center' as const,
            rowspan: gIdx === 0 ? tier.grades.length : undefined,
          },
        },
        {
          text: gIdx === 0 ? tier.tierName : '',
          options: {
            fontSize: 7, fontFace: FONT, color: C.muted,
            fill: { color: fillColor },
            align: 'left' as const,
          },
        },
        {
          text: isSelected ? `○ ${entry.key}` : entry.key,
          options: {
            bold: isSelected, fontSize: 9, fontFace: FONT,
            color: C.text,
            fill: { color: fillColor },
            align: 'left' as const,
          },
        },
        {
          text: entry.salary,
          options: {
            bold: isSelected, fontSize: 9, fontFace: FONT,
            color: C.text,
            fill: { color: fillColor },
            align: 'right' as const,
          },
        },
        {
          text: expectations[entry.key] || '',
          options: {
            fontSize: 8, fontFace: FONT, color: C.text,
            fill: { color: fillColor },
            align: 'left' as const,
          },
        },
      ]);
    });
  });

  const totalW = colWidths.reduce((a, b) => a + b, 0);
  sl.addTable(tableData, {
    x: x0, y, w: totalW,
    rowH,
    border: { pt: 0, color: 'FFFFFF' },
    autoPage: false,
  });

  sl.addText('※ 2026年4月時点', {
    x: x0, y: y + tableData.length * rowH + 0.1, w: 10, h: 0.2,
    fontFace: FONT, fontSize: 7, color: C.muted,
  });
}

// スライド6: 昇格・昇給採点シート
function slide6(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '05｜昇格・昇給 採点シート', 'INSTYLE GROUP｜人事制度　6 / 7');

  const p = d.promotion;
  let y = 1.05;

  // VALUE評価ゲート
  const valueNum = parseFloat(p.valueScore);
  const gatePass = !isNaN(valueNum) && p.valueScore !== '' && valueNum >= 3.5;
  const gateText = p.valueScore ? `${p.valueScore}（${gatePass ? '✓ ゲート通過' : '✗ 昇格不可'}）` : '—';

  addSectionLabel(sl, y, '① VALUE評価（360度スコア）— ゲート条件: 3.50以上');
  y += 0.28;
  textBox(sl, 0.4, y, W - 0.8, 0.35, gateText, { fontSize: 9, bold: gatePass });
  y += 0.45;

  // ②〜⑦ 採点テーブル
  addSectionLabel(sl, y, '② 〜 ⑦ 評価項目（合計11pt以上で昇格・昇給対象）');
  y += 0.3;

  const totalPoints = p.tenurePoint + p.deptGrowthPoint + p.personalKpiPoint + p.supervisorPoint + p.mgmtPoint + p.nurturingPoint;
  const isPromotionEligible = gatePass && totalPoints >= 11;

  const evalRows = [
    ['②', '在籍期間', '0〜1pt', `${p.tenurePoint}pt`],
    ['③', '所属部署の成長度', '1〜5pt', `${p.deptGrowthPoint}pt`],
    ['④', '個人KPI達成度', '1〜5pt', `${p.personalKpiPoint}pt`],
    ['⑤', '直属上司評価', '1〜5pt', `${p.supervisorPoint}pt`],
    ['⑥', '経営評価（代表）', '1〜5pt', `${p.mgmtPoint}pt`],
    ['⑦', '育成・昇進循環', '1〜5pt', `${p.nurturingPoint}pt`],
  ];

  const tableData: pptxgen.TableRow[] = [
    ['#', '評価項目', '配点', '採点'].map(h => ({
      text: h,
      options: { bold: true, fontSize: 7, fontFace: FONT, color: C.muted, fill: { color: C.header }, align: 'left' as const },
    })),
    ...evalRows.map((row, ri) => {
      const fillColor = ri % 2 === 0 ? C.surface : C.surface2;
      return row.map((cell, ci) => ({
        text: cell,
        options: {
          fontSize: 9, fontFace: FONT, color: C.text, fill: { color: fillColor },
          align: (ci === 3 ? 'right' : 'left') as 'left' | 'right',
          bold: ci === 3,
        },
      }));
    }),
  ];

  const colW = [0.4, 5.5, 1.2, 1.2];
  const totalW = colW.reduce((a, b) => a + b, 0);
  sl.addTable(tableData, {
    x: 0.4, y,
    w: W - 0.8,
    colW: colW.map(w => (w / totalW) * (W - 0.8)),
    rowH: 0.3,
    border: { pt: 0, color: 'FFFFFF' },
    autoPage: false,
  });

  y += 0.3 + evalRows.length * 0.3 + 0.2;

  // 合計
  const resultText = isPromotionEligible
    ? `合計：${totalPoints}pt　→ 昇格・昇給対象`
    : !gatePass
      ? `合計：${totalPoints}pt　→ 昇格・昇給対象外（VALUEゲート未通過）`
      : `合計：${totalPoints}pt　→ 昇格・昇給対象外（あと${11 - totalPoints}pt必要）`;
  sl.addText(resultText, {
    x: 0.4, y, w: W - 0.8, h: 0.4,
    fontFace: FONT, fontSize: 10, color: C.text, bold: true,
    fill: { color: isPromotionEligible ? 'D4EDD7' : C.surface2 },
    inset: 0.08,
  });
}

// スライド7: ボーナス評価採点シート
function slide7(prs: InstanceType<typeof pptxgen>, d: FormData) {
  const sl = prs.addSlide();
  sl.background = { color: C.bg };

  addSlideHeader(sl, '06｜ボーナス評価 採点シート', 'INSTYLE GROUP｜人事制度　7 / 7');

  const b = d.bonus;
  let y = 1.05;

  const phase1Total = b.canAfford + b.hasProfit + b.futureProfit;
  const supervisorPoints = b.supervisorEval * (b.noSupervisor ? 2 : 1);
  const phase2Total =
    b.deptKpiAchieved + b.personalKpiAchieved + supervisorPoints +
    b.valueEval + b.reproducibility + b.roleAchievement +
    b.difficulty + b.mgmtEval;
  const phase1Pass = phase1Total >= 3;
  const bonusAmount = phase1Pass ? phase2Total * 110000 : 0;

  const pt = (v: number, weight = 1) => v === 1 ? String(weight) : '0';

  // Phase 1
  addSectionLabel(sl, y, 'Phase 1：財務ゲート（合計3未満でボーナス0）');
  y += 0.3;
  addTable(sl, y, ['#', '評価項目', '採点(0/1)'], [
    ['①', '今支給できる金がある', pt(b.canAfford)],
    ['②', '今利益が出ている', pt(b.hasProfit)],
    ['③', '将来も利益が出る見込みがある', pt(b.futureProfit)],
  ], [0.4, 7.0, 1.2]);
  y += 0.3 + 3 * 0.28 + 0.15;

  const p1ResultText = `Phase 1合計：${phase1Total}/3　${phase1Pass ? '→ Phase 2へ' : '→ ボーナス0'}`;
  sl.addText(p1ResultText, {
    x: 0.4, y, w: W - 0.8, h: 0.32,
    fontFace: FONT, fontSize: 9, color: C.text, bold: true,
    fill: { color: phase1Pass ? 'D4EDD7' : 'F5D5D5' }, inset: 0.06,
  });
  y += 0.45;

  // Phase 2
  addSectionLabel(sl, y, 'Phase 2：個人評価（各0または1、迷ったら0）');
  y += 0.3;
  addTable(sl, y, ['#', '評価項目', '採点(0/1)'], [
    ['④', '部署KPI達成', pt(b.deptKpiAchieved)],
    ['⑤', '個人KPI達成', pt(b.personalKpiAchieved)],
    ['⑥', b.noSupervisor ? '直属上司評価（上司不在・重み2倍）' : '直属上司評価', pt(b.supervisorEval, b.noSupervisor ? 2 : 1)],
    ['⑦', '360°評価（バリュー）', pt(b.valueEval)],
    ['⑧', '再現性・継続性', pt(b.reproducibility)],
    ['⑨', '役割に対する達成度', pt(b.roleAchievement)],
    ['⑩', '負荷・難易度', pt(b.difficulty)],
    ['⑪', '経営評価', pt(b.mgmtEval)],
  ], [0.4, 7.0, 1.2]);
  y += 0.3 + 8 * 0.28 + 0.15;

  // 支給額
  const bonusText = `支給額：${phase1Pass ? phase2Total : '—'}pt × 11万円 ＝ ${bonusAmount.toLocaleString('ja-JP')}円`;
  sl.addText(bonusText, {
    x: 0.4, y, w: W - 0.8, h: 0.38,
    fontFace: FONT, fontSize: 11, color: C.text, bold: true,
    fill: { color: bonusAmount > 0 ? 'D4EDD7' : C.surface2 }, inset: 0.08,
  });
}

export async function generatePptx(data: FormData) {
  const prs = new pptxgen();
  prs.layout = 'LAYOUT_WIDE';
  prs.author = 'INSTYLE GROUP';
  prs.company = 'INSTYLE GROUP';
  prs.subject = '目標設定シート';

  slide1(prs, data);
  slide2(prs, data);
  slide3(prs, data);
  slide4(prs, data);
  slide5(prs, data.cover.grade, data.gradeExpectations as Record<string, string>);
  slide6(prs, data);
  slide7(prs, data);

  const sanitize = (s: string) => s.replace(/[\\/:*?"<>|]/g, '_');
  const name = sanitize(data.cover.name || '社員');
  const period = sanitize(data.cover.period || '期間');
  await prs.writeFile({ fileName: `目標設定シート_${name}_${period}.pptx` });
}
