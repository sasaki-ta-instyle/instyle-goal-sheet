'use client';

import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import CoverForm from '@/components/forms/CoverForm';
import CompanyGoalForm from '@/components/forms/CompanyGoalForm';
import DeptGoalForm from '@/components/forms/DeptGoalForm';
import PersonalGoalForm from '@/components/forms/PersonalGoalForm';
import GradeForm from '@/components/forms/GradeForm';
import PromotionForm from '@/components/forms/PromotionForm';
import BonusForm from '@/components/forms/BonusForm';
import { createDefaultFormData, FormData } from '@/lib/types';

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(createDefaultFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const navigate = (s: number) => {
    if (s >= 1 && s <= 8) setStep(s);
  };

  const updateCover = (d: FormData['cover']) => setFormData(prev => ({ ...prev, cover: d }));
  const updateCompany = (d: FormData['company']) => setFormData(prev => ({ ...prev, company: d }));
  const updateDept = (d: FormData['dept']) => setFormData(prev => ({ ...prev, dept: d }));
  const updatePersonal = (d: FormData['personal']) => setFormData(prev => ({ ...prev, personal: d }));
  const updatePromotion = (d: FormData['promotion']) => setFormData(prev => ({ ...prev, promotion: d }));
  const updateBonus = (d: FormData['bonus']) => setFormData(prev => ({ ...prev, bonus: d }));
  const updateGradeExpectations = (d: FormData['gradeExpectations']) => setFormData(prev => ({ ...prev, gradeExpectations: d }));

  const handleDownload = async () => {
    const { cover } = formData;
    if (!cover.name || !cover.company || !cover.grade || !cover.period) {
      alert('カバー情報（所属法人・氏名・Grade・期）をすべて入力してください。');
      setStep(1);
      return;
    }
    setIsGenerating(true);
    try {
      const { generatePptx } = await import('@/lib/pptx-generator');
      await generatePptx(formData);
      setGenerated(true);
    } catch (e) {
      console.error(e);
      alert('PPTXの生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="scene-bg" />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* Header */}
        <header style={{
          padding: '40px 48px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'var(--glass-dark)',
            backdropFilter: 'var(--glass-blur-lg)',
            WebkitBackdropFilter: 'var(--glass-blur-lg)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg,rgba(255,90,100,.04) 0%,rgba(255,210,80,.04) 25%,rgba(60,220,160,.05) 50%,rgba(80,160,255,.05) 75%,transparent 100%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '.6875rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(243,241,238,.45)', marginBottom: 10 }}>
              INSTYLE GROUP
            </p>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-inv)', letterSpacing: '-.02em', marginBottom: 6 }}>
              目標設定シート
            </h1>
            <p style={{ fontSize: '.8125rem', color: 'rgba(243,241,238,.45)' }}>
              入力内容はPPTXスライドとして書き出されます
            </p>
          </div>
        </header>

        {/* Step nav */}
        <StepIndicator current={step} onNavigate={navigate} />

        {/* Main content */}
        <main style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 80px' }}>

          {/* Form card */}
          <div className="glass-panel" style={{ marginBottom: 24 }}>
            {step === 1 && <CoverForm data={formData.cover} onChange={updateCover} />}
            {step === 2 && <CompanyGoalForm data={formData.company} onChange={updateCompany} />}
            {step === 3 && <DeptGoalForm data={formData.dept} onChange={updateDept} />}
            {step === 4 && <PersonalGoalForm data={formData.personal} onChange={updatePersonal} />}
            {step === 5 && <GradeForm selectedGrade={formData.cover.grade} expectations={formData.gradeExpectations} onChange={updateGradeExpectations} />}
            {step === 6 && <PromotionForm data={formData.promotion} onChange={updatePromotion} />}
            {step === 7 && <BonusForm data={formData.bonus} onChange={updateBonus} />}
            {step === 8 && <ConfirmView data={formData} />}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(step - 1)}
              disabled={step === 1}
            >
              ← 前へ
            </button>

            {step < 8 ? (
              <button
                className="btn btn-primary"
                onClick={() => navigate(step + 1)}
              >
                次へ →
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleDownload}
                disabled={isGenerating}
              >
                {isGenerating ? '生成中...' : generated ? '✓ 再ダウンロード' : 'PPTXをダウンロード'}
              </button>
            )}
          </div>

          {generated && step === 8 && (
            <div style={{
              marginTop: 20,
              padding: '14px 20px',
              background: 'rgba(123,183,133,.14)',
              border: '1px solid rgba(123,183,133,.30)',
              borderRadius: 'var(--r)',
              fontSize: '.875rem',
              color: 'var(--color-text)',
              textAlign: 'center',
            }}>
              ✓ PPTXが生成されました。ダウンロードされたファイルを上長に送付してください。
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function ConfirmView({ data }: { data: FormData }) {
  const phase1Total = data.bonus.canAfford + data.bonus.hasProfit + data.bonus.futureProfit;
  const supervisorPoints = data.bonus.supervisorEval * (data.bonus.noSupervisor ? 2 : 1);
  const phase2Total =
    data.bonus.deptKpiAchieved + data.bonus.personalKpiAchieved + supervisorPoints +
    data.bonus.valueEval + data.bonus.reproducibility + data.bonus.roleAchievement +
    data.bonus.difficulty + data.bonus.mgmtEval;
  const promotionTotal =
    data.promotion.tenurePoint + data.promotion.deptGrowthPoint + data.promotion.personalKpiPoint +
    data.promotion.supervisorPoint + data.promotion.mgmtPoint + data.promotion.nurturingPoint;

  const valueNum = parseFloat(data.promotion.valueScore);
  const promotionGatePass = !isNaN(valueNum) && data.promotion.valueScore !== '' && valueNum >= 3.5;
  const isPromotionEligible = promotionGatePass && promotionTotal >= 11;

  const promotionLabel = data.promotion.valueScore === ''
    ? `${promotionTotal}pt`
    : isPromotionEligible
      ? `${promotionTotal}pt（昇格対象）`
      : !promotionGatePass
        ? `${promotionTotal}pt（VALUEゲート未通過）`
        : `${promotionTotal}pt（あと${11 - promotionTotal}pt）`;

  const rows = [
    { label: '所属法人', value: data.cover.company || '（未入力）' },
    { label: '氏名', value: data.cover.name || '（未入力）' },
    { label: 'Grade', value: data.cover.grade || '（未入力）' },
    { label: '期', value: data.cover.period || '（未入力）' },
    { label: '個人目標数', value: `${data.personal.smartGoals.filter(r => r.goal).length} 件` },
    { label: '昇格評価合計', value: promotionLabel },
    { label: 'ボーナス支給額', value: phase1Total >= 3 ? `${(phase2Total * 110000).toLocaleString('ja-JP')}円` : '0円（財務ゲート未通過）' },
  ];

  return (
    <div>
      <p className="section-title">確認・出力</p>
      <p style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
        入力内容を確認して「PPTXをダウンロード」ボタンを押してください。
      </p>

      <div className="table-wrap" style={{ marginBottom: 28 }}>
        <table className="data-table">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td style={{ width: '30%', color: 'var(--color-text-muted)', fontSize: '.8125rem', fontWeight: 500 }}>
                  {row.label}
                </td>
                <td style={{ fontWeight: row.value.includes('（未入力）') ? 400 : 500 }}>
                  <span style={{ color: row.value.includes('（未入力）') ? 'var(--color-text-light)' : 'var(--color-text)' }}>
                    {row.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '16px 20px',
        background: 'rgba(230,226,215,.40)',
        borderRadius: 'var(--r)',
        fontSize: '.8125rem',
        color: 'var(--color-text-muted)',
        lineHeight: 1.8,
      }}>
        <strong style={{ color: 'var(--color-text)' }}>出力されるスライド：</strong>
        <br />
        1. カバー &nbsp; 2. 会社目標 &nbsp; 3. 部署目標 &nbsp; 4. 個人目標 &nbsp; 5. Grade表 &nbsp; 6. 昇格・昇給採点 &nbsp; 7. ボーナス評価採点
      </div>
    </div>
  );
}
