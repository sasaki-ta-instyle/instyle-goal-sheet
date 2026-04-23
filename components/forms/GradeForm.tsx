'use client';
import { GRADE_TABLE, Grade, GradeExpectations } from '@/lib/types';

interface Props {
  selectedGrade: Grade | '';
  expectations: GradeExpectations;
  onChange: (expectations: GradeExpectations) => void;
}

export default function GradeForm({ selectedGrade, expectations, onChange }: Props) {
  const update = (key: Grade, value: string) =>
    onChange({ ...expectations, [key]: value });

  return (
    <div>
      <p className="section-title">スライド 5 — 04｜Grade表</p>
      <p style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
        各Gradeに求める目安を入力してください。カバーで選択したGradeをハイライト表示します。
      </p>

      {selectedGrade && (
        <div style={{
          background: 'rgba(32,33,26,.08)',
          border: '1px solid rgba(32,33,26,.16)',
          borderRadius: 'var(--r)',
          padding: '12px 20px',
          marginBottom: 24,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)' }}>選択中のGrade:</span>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedGrade}</span>
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: '.875rem' }}>
          <thead>
            <tr>
              <th>ティア</th>
              <th>名称</th>
              <th>Grade</th>
              <th>基本給与（円/月）</th>
              <th>各人が各クラスに求める目安</th>
            </tr>
          </thead>
          <tbody>
            {GRADE_TABLE.flatMap(tier =>
              tier.grades.map((entry, gIdx) => {
                const isSelected = entry.key === selectedGrade;
                return (
                  <tr
                    key={`${tier.tier}-${entry.key}`}
                    style={isSelected ? { background: 'rgba(32,33,26,.12)' } : {}}
                  >
                    {gIdx === 0 && (
                      <td
                        rowSpan={tier.grades.length}
                        style={{
                          fontWeight: 700,
                          fontSize: '1.125rem',
                          textAlign: 'center',
                          background: 'rgba(32,33,26,.08)',
                          verticalAlign: 'middle',
                        }}
                      >
                        {tier.tier}
                      </td>
                    )}
                    {gIdx === 0 && (
                      <td
                        rowSpan={tier.grades.length}
                        style={{
                          fontSize: '.75rem',
                          color: 'var(--color-text-muted)',
                          verticalAlign: 'middle',
                        }}
                      >
                        {tier.tierName}
                      </td>
                    )}
                    <td style={{ fontWeight: isSelected ? 700 : 500, whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {isSelected && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 18, height: 18,
                            borderRadius: '50%',
                            border: '2px solid var(--color-text)',
                            fontSize: '.55rem',
                            fontWeight: 700,
                          }}>○</span>
                        )}
                        {entry.key}
                      </span>
                    </td>
                    <td style={{ fontWeight: isSelected ? 700 : 400, whiteSpace: 'nowrap' }}>
                      {entry.salary}
                    </td>
                    <td>
                      <textarea
                        className="input"
                        style={{ padding: '6px 10px', fontSize: '.8125rem', minHeight: 52, resize: 'vertical' }}
                        value={expectations[entry.key] ?? ''}
                        onChange={e => update(entry.key, e.target.value)}
                        placeholder={`${entry.key} Gradeに求める目安・行動基準`}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: 12 }}>※ 2026年4月時点</p>
    </div>
  );
}
