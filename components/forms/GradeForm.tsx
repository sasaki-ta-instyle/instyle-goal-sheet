'use client';
import { GRADE_TABLE, Grade } from '@/lib/types';

interface Props {
  selectedGrade: Grade | '';
}

export default function GradeForm({ selectedGrade }: Props) {
  return (
    <div>
      <p className="section-title">スライド 5 — 04｜Grade表</p>
      <p style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
        カバーで入力したGradeをハイライト表示します。変更する場合はStep 1に戻ってください。
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
              <th>基本給与（円）</th>
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
                    <td style={{ fontWeight: isSelected ? 700 : 500 }}>
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
                    <td style={{ fontWeight: isSelected ? 700 : 400 }}>
                      {entry.salary}
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
