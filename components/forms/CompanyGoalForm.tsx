'use client';
import { CompanyGoalData, KpiNumRow } from '@/lib/types';

interface Props {
  data: CompanyGoalData;
  onChange: (data: CompanyGoalData) => void;
}

const toNumeric = (v: string) =>
  v.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
   .replace(/[^0-9.\-,]/g, '');

function calcGrowth(prev: string, actual: string): string {
  const p = parseFloat(prev.replace(/,/g, ''));
  const a = parseFloat(actual.replace(/,/g, ''));
  if (!prev || !actual || isNaN(p) || isNaN(a) || p === 0) return '—';
  return `${Math.round((a / p - 1) * 100)}%`;
}

function TI({ value, onChange, placeholder, numeric }: { value: string; onChange: (v: string) => void; placeholder?: string; numeric?: boolean }) {
  return (
    <input
      className="input"
      style={{ padding: '6px 8px', fontSize: '.8125rem' }}
      value={value}
      inputMode={numeric ? 'decimal' : undefined}
      onChange={e => onChange(numeric ? toNumeric(e.target.value) : e.target.value)}
      placeholder={placeholder ?? '—'}
    />
  );
}

const NUM_COLS: { key: keyof KpiNumRow; label: string; sub: string; numeric?: boolean }[] = [
  { key: 'prev', label: '前期実績', sub: '2025.10〜2026.3', numeric: true },
  { key: 'target', label: '今期目標', sub: '2026.4〜9', numeric: true },
  { key: 'actual', label: '今期実績', sub: '2026.4〜9', numeric: true },
  { key: 'nextTarget', label: '来期目標', sub: '' },
];

function KpiNumTable({
  rows,
  onUpdate,
}: {
  rows: { label: string; data: KpiNumRow }[];
  onUpdate: (rowIdx: number, field: keyof KpiNumRow, value: string) => void;
}) {
  return (
    <div className="table-wrap" style={{ marginBottom: 24 }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>指標</th>
            {NUM_COLS.map(c => (
              <th key={c.key}>
                {c.label}
                {c.sub && <span style={{ display: 'block', fontWeight: 400, fontSize: '.7rem', opacity: 0.7 }}>{c.sub}</span>}
              </th>
            ))}
            <th>成長率<span style={{ display: 'block', fontWeight: 400, fontSize: '.7rem', opacity: 0.7 }}>自動計算（%）</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500, whiteSpace: 'nowrap', fontSize: '.8125rem' }}>{row.label}</td>
              {NUM_COLS.map(c => (
                <td key={c.key}>
                  <TI value={row.data[c.key]} onChange={v => onUpdate(i, c.key, v)} placeholder={c.numeric ? '0' : '自由記入'} numeric={c.numeric} />
                </td>
              ))}
              <td style={{ textAlign: 'center', fontWeight: 600, fontSize: '.875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                {calcGrowth(row.data.prev, row.data.actual)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompanyGoalForm({ data, onChange }: Props) {
  const set = <K extends keyof CompanyGoalData>(key: K, value: CompanyGoalData[K]) =>
    onChange({ ...data, [key]: value });

  const updateRevenue = (field: keyof KpiNumRow, value: string) =>
    set('revenue', { ...data.revenue, [field]: value });

  const updateProfitRow = (rowKey: 'operatingProfit' | 'operatingMargin' | 'grossProfit', field: keyof KpiNumRow, value: string) =>
    set(rowKey, { ...data[rowKey], [field]: value });

  const profitRows = [
    { label: 'グループ営業利益', rowKey: 'operatingProfit' as const },
    { label: 'グループ営業利益率', rowKey: 'operatingMargin' as const },
    { label: 'グループ粗利益', rowKey: 'grossProfit' as const },
  ];

  return (
    <div>
      <p className="section-title">スライド 2 — 01｜会社目標 記入シート</p>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>① 売上</p>
      <KpiNumTable
        rows={[{ label: 'グループ売上合計', data: data.revenue }]}
        onUpdate={(_i, field, value) => updateRevenue(field, value)}
      />

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>② 利益</p>
      <KpiNumTable
        rows={profitRows.map(r => ({ label: r.label, data: data[r.rowKey] }))}
        onUpdate={(i, field, value) => updateProfitRow(profitRows[i].rowKey, field, value)}
      />

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>③ 今期テーマ（戦略的フォーカス）</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {([0, 1] as const).map(i => (
          <div key={i}>
            <label className="form-label">テーマ {i + 1}</label>
            <input
              className="input"
              type="text"
              placeholder="今期の戦略的フォーカスを記入"
              value={data.strategicFocus[i]}
              onChange={e => {
                const updated: [string, string] = [...data.strategicFocus] as [string, string];
                updated[i] = e.target.value;
                set('strategicFocus', updated);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
