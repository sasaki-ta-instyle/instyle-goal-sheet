'use client';
import { DeptGoalData, DeptKpiNumRow, DeptActionRow } from '@/lib/types';

interface Props {
  data: DeptGoalData;
  onChange: (data: DeptGoalData) => void;
}

const toNumeric = (v: string) =>
  v.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
   .replace(/[^0-9.\-,]/g, '');

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

const KPI_COLS = [
  { key: 'prev' as const, label: '前期実績', sub: '2025.10〜2026.3' },
  { key: 'target' as const, label: '今期目標', sub: '2026.4〜9' },
  { key: 'growth' as const, label: '成長率', sub: '%' },
  { key: 'nextTarget' as const, label: '来期目標', sub: '' },
  { key: 'actual' as const, label: '今期実績', sub: '2026.4〜9' },
];

export default function DeptGoalForm({ data, onChange }: Props) {
  const set = <K extends keyof DeptGoalData>(key: K, value: DeptGoalData[K]) =>
    onChange({ ...data, [key]: value });

  const updateKpi = (kpiKey: 'kpi1' | 'kpi2' | 'kpi3', field: keyof DeptKpiNumRow, value: string) =>
    set(kpiKey, { ...data[kpiKey], [field]: value });

  const updateAction = (i: number, field: keyof DeptActionRow, value: string) => {
    const arr = data.actions.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    set('actions', arr);
  };

  const kpiItems = [
    { key: 'kpi1' as const, label: '主要KPI①' },
    { key: 'kpi2' as const, label: '主要KPI②' },
    { key: 'kpi3' as const, label: '主要KPI③' },
  ];

  return (
    <div>
      <p className="section-title">スライド 3 — 02｜部署目標 記入シート</p>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>① 上位目標との接続</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div>
          <label className="form-label">戦略的フォーカス（会社目標から転記）</label>
          <textarea
            className="input"
            style={{ minHeight: 72 }}
            value={data.strategicFocusRef}
            onChange={e => set('strategicFocusRef', e.target.value)}
            placeholder="会社目標シートの戦略的フォーカスを転記"
          />
        </div>
        <div>
          <label className="form-label">部署のミッション</label>
          <textarea
            className="input"
            style={{ minHeight: 72 }}
            value={data.mission}
            onChange={e => set('mission', e.target.value)}
            placeholder="本部署のミッションを記入"
          />
        </div>
      </div>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>② 部署KPI目標</p>
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>KPI</th>
              <th>指標名</th>
              {KPI_COLS.map(c => (
                <th key={c.key}>
                  {c.label}
                  {c.sub && <span style={{ display: 'block', fontWeight: 400, fontSize: '.7rem', opacity: 0.7 }}>{c.sub}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpiItems.map(item => (
              <tr key={item.key}>
                <td style={{ color: 'var(--color-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</td>
                <td>
                  <TI
                    value={data[item.key].label}
                    onChange={v => updateKpi(item.key, 'label', v)}
                    placeholder="指標名を入力"
                  />
                </td>
                {KPI_COLS.map(c => (
                  <td key={c.key}>
                    <TI
                      value={data[item.key][c.key]}
                      onChange={v => updateKpi(item.key, c.key, v)}
                      placeholder="0"
                      numeric
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>③ 今期の重点施策（KPIを達成するための行動）</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>施策内容</th>
              <th>期待効果</th>
              <th style={{ width: 120 }}>期限</th>
            </tr>
          </thead>
          <tbody>
            {data.actions.map((row, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>{i + 1}</td>
                <td><TI value={row.content} onChange={v => updateAction(i, 'content', v)} placeholder="施策の内容" /></td>
                <td><TI value={row.expectedEffect} onChange={v => updateAction(i, 'expectedEffect', v)} placeholder="期待する効果" /></td>
                <td><TI value={row.deadline} onChange={v => updateAction(i, 'deadline', v)} placeholder="〇〇月末" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
