'use client';
import { PersonalGoalData, SmartGoalRow, KpiContribRow } from '@/lib/types';

interface Props {
  data: PersonalGoalData;
  onChange: (data: PersonalGoalData) => void;
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

export default function PersonalGoalForm({ data, onChange }: Props) {
  const set = <K extends keyof PersonalGoalData>(key: K, value: PersonalGoalData[K]) =>
    onChange({ ...data, [key]: value });

  const updateStatus = (i: number, value: string) => {
    const arr = data.currentStatus.map((r, idx) => idx === i ? { ...r, value } : r);
    set('currentStatus', arr);
  };
  const updateSmart = (i: number, field: keyof SmartGoalRow, value: string) => {
    const arr = data.smartGoals.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    set('smartGoals', arr);
  };
  const updateKpi = (i: number, field: keyof KpiContribRow, value: string) => {
    const arr = data.kpiContribs.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    set('kpiContribs', arr);
  };

  return (
    <div>
      <p className="section-title">03｜個人目標 記入シート</p>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>① 現在地の確認</p>
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>項目</th>
              <th>内容・記入欄</th>
            </tr>
          </thead>
          <tbody>
            {data.currentStatus.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, fontSize: '.8125rem' }}>{row.label}</td>
                <td>
                  <textarea
                    className="input"
                    style={{ padding: '6px 10px', fontSize: '.8125rem', minHeight: 60 }}
                    value={row.value}
                    onChange={e => updateStatus(i, e.target.value)}
                    placeholder="記入してください"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>② SMART個人目標</p>
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>具体的目標（Specific）</th>
              <th style={{ width: 110 }}>目標値</th>
              <th style={{ width: 110 }}>期限</th>
              <th>備考・関連目標</th>
            </tr>
          </thead>
          <tbody>
            {data.smartGoals.map((row, i) => (
              <tr key={i}>
                <td><TI value={row.goal} onChange={v => updateSmart(i, 'goal', v)} placeholder="具体的な目標" /></td>
                <td><TI value={row.targetValue} onChange={v => updateSmart(i, 'targetValue', v)} placeholder="数値" /></td>
                <td><TI value={row.deadline} onChange={v => updateSmart(i, 'deadline', v)} placeholder="〇月末" /></td>
                <td><TI value={row.note} onChange={v => updateSmart(i, 'note', v)} placeholder="関連目標など" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 12 }}>③ 部署KPIへの貢献（自分が担う数字）</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>部署KPI</th>
              <th>自分の担当分</th>
            </tr>
          </thead>
          <tbody>
            {data.kpiContribs.map((row, i) => (
              <tr key={i}>
                <td><TI value={row.deptKpi} onChange={v => updateKpi(i, 'deptKpi', v)} placeholder="部署KPI名" /></td>
                <td><TI value={row.myPart} onChange={v => updateKpi(i, 'myPart', v)} placeholder="自分の担当分" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
