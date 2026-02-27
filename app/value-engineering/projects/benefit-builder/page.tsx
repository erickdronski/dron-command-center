'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Building2, ChevronDown, ChevronUp, DollarSign, Copy, Check, RotateCcw, Sparkles, Info } from 'lucide-react';
import { benefits } from '../benefit-stories/data';

/* ── Customer Metrics ── */
type CustomerMetrics = {
  companyName: string;
  annualTickets: number;
  fteSalary: number;
  endpointDevices: number;
  employees: number;
  itStaffCount: number;
  avgAhtMinutes: number;
  compliancePenaltyExposure: number;
  annualItBudget: number;
  benefitRamp: number;
};

const defaultMetrics: CustomerMetrics = {
  companyName: '',
  annualTickets: 50000,
  fteSalary: 85000,
  endpointDevices: 5000,
  employees: 3000,
  itStaffCount: 25,
  avgAhtMinutes: 18,
  compliancePenaltyExposure: 500000,
  annualItBudget: 5000000,
  benefitRamp: 100,
};

/* ── Benefit calculation logic ── */
function calculateBenefitValue(benefitId: string, m: CustomerMetrics): { value: number; breakdown: string } {
  const hourlyRate = m.fteSalary / 2080; // annual hours
  const ahtCostPerTicket = (m.avgAhtMinutes / 60) * hourlyRate;

  switch (benefitId) {
    case 'high-priority-ticket-routing':
      return {
        value: m.compliancePenaltyExposure * 0.20 * (m.benefitRamp / 100),
        breakdown: `$${fmt(m.compliancePenaltyExposure)} penalty exposure × 20% improvement × ${m.benefitRamp}% ramp`,
      };
    case 'reduced-incident-aht':
      return {
        value: m.annualTickets * 0.11 * ahtCostPerTicket * (m.benefitRamp / 100),
        breakdown: `${fmt(m.annualTickets)} tickets × 11% AHT reduction × $${ahtCostPerTicket.toFixed(2)}/ticket × ${m.benefitRamp}% ramp`,
      };
    case 'optimized-knowledge':
      return {
        value: m.annualTickets * 0.10 * ahtCostPerTicket * (m.benefitRamp / 100),
        breakdown: `${fmt(m.annualTickets)} tickets × 10% KB optimization × $${ahtCostPerTicket.toFixed(2)}/ticket × ${m.benefitRamp}% ramp`,
      };
    case 'asset-relationship-management':
      return {
        value: m.endpointDevices * 12 * 0.15 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} devices × $12 avg mgmt cost × 15% optimization × ${m.benefitRamp}% ramp`,
      };
    case 'energy-utility-cost-optimization':
      return {
        value: m.annualItBudget * 0.03 * 0.20 * (m.benefitRamp / 100),
        breakdown: `$${fmt(m.annualItBudget)} IT budget × 3% energy portion × 20% savings × ${m.benefitRamp}% ramp`,
      };
    case 'vendor-contract-insights':
      return {
        value: m.annualItBudget * 0.40 * 0.08 * (m.benefitRamp / 100),
        breakdown: `$${fmt(m.annualItBudget)} IT budget × 40% vendor spend × 8% savings × ${m.benefitRamp}% ramp`,
      };
    case 'reduce-exploitation-recovery':
      return {
        value: m.endpointDevices * 2.5 * 0.30 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} endpoints × $2.50 avg recovery cost × 30% reduction × ${m.benefitRamp}% ramp`,
      };
    case 'minimise-incident-response':
      return {
        value: m.annualTickets * 0.05 * ahtCostPerTicket * 2 * 0.25 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.annualTickets)} tickets × 5% security incidents × $${(ahtCostPerTicket * 2).toFixed(2)} escalated cost × 25% improvement × ${m.benefitRamp}% ramp`,
      };
    case 'reduce-zero-day-defense':
      return {
        value: m.endpointDevices * 3.5 * 0.20 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} endpoints × $3.50 defense cost × 20% reduction × ${m.benefitRamp}% ramp`,
      };
    case 'reduced-energy-consumption':
      return {
        value: m.endpointDevices * 150 * 0.12 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} devices × $150 annual energy × 12% savings × ${m.benefitRamp}% ramp`,
      };
    case 'reduced-hardware-maintenance':
      return {
        value: m.endpointDevices * 45 * 0.15 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} devices × $45 avg maintenance × 15% reduction × ${m.benefitRamp}% ramp`,
      };
    case 'smarter-device-insights':
      return {
        value: m.endpointDevices * 8 * 0.18 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} devices × $8 visibility cost × 18% improvement × ${m.benefitRamp}% ramp`,
      };
    case 'optimize-remote-access':
      return {
        value: m.employees * 0.40 * 120 * 0.15 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.employees)} employees × 40% remote × $120 access cost × 15% optimization × ${m.benefitRamp}% ramp`,
      };
    case 'improve-maintenance-efficiency':
      return {
        value: m.endpointDevices * 25 * 0.20 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.endpointDevices)} devices × $25 maintenance cost × 20% improvement × ${m.benefitRamp}% ramp`,
      };
    case 'automated-compliance-management':
      return {
        value: m.itStaffCount * hourlyRate * 80 * 0.35 * (m.benefitRamp / 100),
        breakdown: `${m.itStaffCount} IT staff × $${hourlyRate.toFixed(2)}/hr × 80 compliance hrs/yr × 35% automation × ${m.benefitRamp}% ramp`,
      };
    case 'streamline-onboarding':
      return {
        value: m.employees * 0.15 * hourlyRate * 8 * 0.40 * (m.benefitRamp / 100),
        breakdown: `${fmt(m.employees)} employees × 15% turnover × $${hourlyRate.toFixed(2)}/hr × 8 IT hrs/onboard × 40% reduction × ${m.benefitRamp}% ramp`,
      };
    case 'improve-project-delivery':
      return {
        value: m.annualItBudget * 0.15 * 0.12 * (m.benefitRamp / 100),
        breakdown: `$${fmt(m.annualItBudget)} IT budget × 15% project spend × 12% improvement × ${m.benefitRamp}% ramp`,
      };
    case 'smarter-portfolio-investment':
      return {
        value: m.annualItBudget * 0.10 * 0.08 * (m.benefitRamp / 100),
        breakdown: `$${fmt(m.annualItBudget)} IT budget × 10% portfolio waste × 8% improvement × ${m.benefitRamp}% ramp`,
      };
    case 'automated-security-compliance':
      return {
        value: m.itStaffCount * hourlyRate * 60 * 0.40 * (m.benefitRamp / 100),
        breakdown: `${m.itStaffCount} IT staff × $${hourlyRate.toFixed(2)}/hr × 60 security audit hrs/yr × 40% automation × ${m.benefitRamp}% ramp`,
      };
    case 'reduced-it-support-costs':
      return {
        value: m.annualTickets * 0.15 * ahtCostPerTicket * (m.benefitRamp / 100),
        breakdown: `${fmt(m.annualTickets)} tickets × 15% self-service deflection × $${ahtCostPerTicket.toFixed(2)}/ticket × ${m.benefitRamp}% ramp`,
      };
    case 'elimination-password-resets':
      return {
        value: m.annualTickets * 0.25 * 0.70 * ahtCostPerTicket * (m.benefitRamp / 100),
        breakdown: `${fmt(m.annualTickets)} tickets × 25% password resets × 70% elimination × $${ahtCostPerTicket.toFixed(2)}/ticket × ${m.benefitRamp}% ramp`,
      };
    default:
      return { value: 0, breakdown: 'Calculation not yet mapped' };
  }
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

/* ── Input Field Component ── */
function MetricInput({ label, tooltip, value, onChange, prefix, suffix }: {
  label: string;
  tooltip?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="text-xs text-[#888] mb-1 flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info size={12} className="text-[#555] cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#222] text-[10px] text-[#aaa] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#555]">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`w-full bg-[#0a0a0a] border border-[#222] rounded-lg py-2 text-sm text-white focus:outline-none focus:border-purple-500/30 ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555]">{suffix}</span>}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function BenefitBuilderPage() {
  const [metrics, setMetrics] = useState<CustomerMetrics>(defaultMetrics);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAllBenefits, setShowAllBenefits] = useState(false);

  const updateMetric = (key: keyof CustomerMetrics, value: number | string) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const toggleBenefit = (id: string) => {
    setSelectedBenefits(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedBenefits(benefits.map(b => b.id));
  const clearAll = () => setSelectedBenefits([]);

  const calculations = useMemo(() => {
    return selectedBenefits.map(id => {
      const benefit = benefits.find(b => b.id === id)!;
      const calc = calculateBenefitValue(id, metrics);
      return { benefit, ...calc };
    });
  }, [selectedBenefits, metrics]);

  const totalValue = calculations.reduce((sum, c) => sum + c.value, 0);

  const copyReport = () => {
    const lines = [
      `ROI BENEFIT ANALYSIS — ${metrics.companyName || 'Customer'}`,
      `${'═'.repeat(50)}`,
      '',
      'CUSTOMER METRICS',
      `  Annual Tickets: ${fmt(metrics.annualTickets)}`,
      `  FTE Salary (loaded): $${fmt(metrics.fteSalary)}`,
      `  Endpoint Devices: ${fmt(metrics.endpointDevices)}`,
      `  Employees: ${fmt(metrics.employees)}`,
      `  IT Staff: ${metrics.itStaffCount}`,
      `  Avg AHT: ${metrics.avgAhtMinutes} min`,
      `  Compliance Exposure: $${fmt(metrics.compliancePenaltyExposure)}`,
      `  Annual IT Budget: $${fmt(metrics.annualItBudget)}`,
      `  Benefit Ramp: ${metrics.benefitRamp}%`,
      '',
      'SELECTED BENEFITS',
      `${'─'.repeat(50)}`,
      ...calculations.map(c => [
        `  ${c.benefit.benefitName}`,
        `    Value: ${fmtCurrency(c.value)}`,
        `    ${c.breakdown}`,
        '',
      ]).flat(),
      `${'═'.repeat(50)}`,
      `TOTAL ANNUAL VALUE: ${fmtCurrency(totalValue)}`,
      '',
      `Generated by Dron Command Center — Value Engineering`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedBenefits = showAllBenefits ? benefits : benefits.slice(0, 10);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link href="/value-engineering/projects" className="text-[#555] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xs text-[#555]">Projects /</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Calculator size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Benefit Builder</h1>
            <p className="text-sm text-[#666]">Calculate ROI from customer metrics across all Value Cloud benefits</p>
          </div>
        </div>
        {totalValue > 0 && (
          <div className="text-right">
            <div className="text-xs text-[#555]">Total Annual Value</div>
            <div className="text-2xl font-bold text-emerald-400">{fmtCurrency(totalValue)}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ── LEFT: Customer Inputs ── */}
        <div className="col-span-1 space-y-4">
          <div className="bg-[#111] border border-[#222] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 size={14} className="text-blue-400" />
              Customer Metrics
            </h2>

            <div>
              <label className="text-xs text-[#888] mb-1 block">Company Name</label>
              <input
                type="text"
                value={metrics.companyName}
                onChange={(e) => updateMetric('companyName', e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-purple-500/30"
              />
            </div>

            <MetricInput
              label="Annual Tickets"
              tooltip="Total IT service desk tickets per year"
              value={metrics.annualTickets}
              onChange={(v) => updateMetric('annualTickets', v)}
            />
            <MetricInput
              label="FTE Salary (Loaded)"
              tooltip="Fully loaded annual salary for IT staff"
              value={metrics.fteSalary}
              onChange={(v) => updateMetric('fteSalary', v)}
              prefix="$"
            />
            <MetricInput
              label="Endpoint Devices"
              tooltip="Total managed endpoints (laptops, desktops, mobile)"
              value={metrics.endpointDevices}
              onChange={(v) => updateMetric('endpointDevices', v)}
            />
            <MetricInput
              label="Employees"
              value={metrics.employees}
              onChange={(v) => updateMetric('employees', v)}
            />
            <MetricInput
              label="IT Staff Count"
              value={metrics.itStaffCount}
              onChange={(v) => updateMetric('itStaffCount', v)}
            />
            <MetricInput
              label="Avg Handle Time"
              tooltip="Average minutes per ticket resolution"
              value={metrics.avgAhtMinutes}
              onChange={(v) => updateMetric('avgAhtMinutes', v)}
              suffix="min"
            />
            <MetricInput
              label="Compliance Penalty Exposure"
              tooltip="Annual regulatory/SLA penalty risk"
              value={metrics.compliancePenaltyExposure}
              onChange={(v) => updateMetric('compliancePenaltyExposure', v)}
              prefix="$"
            />
            <MetricInput
              label="Annual IT Budget"
              value={metrics.annualItBudget}
              onChange={(v) => updateMetric('annualItBudget', v)}
              prefix="$"
            />
            <MetricInput
              label="Benefit Ramp"
              tooltip="% of benefit realized (year 1 typically 50-75%)"
              value={metrics.benefitRamp}
              onChange={(v) => updateMetric('benefitRamp', v)}
              suffix="%"
            />
          </div>

          <button
            onClick={() => setMetrics(defaultMetrics)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#666] hover:text-white border border-[#222] rounded-lg hover:border-[#333] transition-colors"
          >
            <RotateCcw size={12} />
            Reset to Defaults
          </button>
        </div>

        {/* ── RIGHT: Benefit Selector + Results ── */}
        <div className="col-span-2 space-y-4">
          {/* Benefit Selector */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                Select Benefits ({selectedBenefits.length} of {benefits.length})
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={selectAll} className="text-[10px] text-purple-400 hover:text-purple-300">Select All</button>
                <span className="text-[#333]">|</span>
                <button onClick={clearAll} className="text-[10px] text-[#666] hover:text-[#999]">Clear</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {displayedBenefits.map((b) => {
                const selected = selectedBenefits.includes(b.id);
                const calc = selected ? calculateBenefitValue(b.id, metrics) : null;
                return (
                  <button
                    key={b.id}
                    onClick={() => toggleBenefit(b.id)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selected
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate ${selected ? 'text-emerald-400' : 'text-white'}`}>
                          {b.benefitName}
                        </div>
                        <div className="text-[10px] text-[#666] mt-0.5">{b.subcategory}</div>
                      </div>
                      {calc && (
                        <span className="text-xs font-bold text-emerald-400 ml-2 whitespace-nowrap">
                          {fmtCurrency(calc.value)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {benefits.length > 10 && (
              <button
                onClick={() => setShowAllBenefits(!showAllBenefits)}
                className="mt-3 w-full text-center text-xs text-[#666] hover:text-purple-400 transition-colors flex items-center justify-center gap-1"
              >
                {showAllBenefits ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showAllBenefits ? 'Show Less' : `Show All ${benefits.length} Benefits`}
              </button>
            )}
          </div>

          {/* Results */}
          {calculations.length > 0 && (
            <div className="bg-[#111] border border-emerald-500/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-400" />
                  ROI Breakdown
                  {metrics.companyName && <span className="text-[#666] font-normal">— {metrics.companyName}</span>}
                </h2>
                <button
                  onClick={copyReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Report'}
                </button>
              </div>

              <div className="space-y-2">
                {calculations
                  .sort((a, b) => b.value - a.value)
                  .map((c) => (
                  <div
                    key={c.benefit.id}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 cursor-pointer hover:border-[#333] transition-colors"
                    onClick={() => setExpandedBenefit(expandedBenefit === c.benefit.id ? null : c.benefit.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{c.benefit.benefitName}</div>
                        <div className="text-[10px] text-[#666]">{c.benefit.subcategory}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-400">{fmtCurrency(c.value)}</span>
                        {/* Bar */}
                        <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500/50 rounded-full"
                            style={{ width: `${Math.min(100, (c.value / totalValue) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {expandedBenefit === c.benefit.id && (
                      <div className="mt-3 pt-3 border-t border-[#1a1a1a] space-y-2">
                        <div className="text-[11px] text-[#888] leading-relaxed">{c.benefit.description}</div>
                        <div className="bg-[#111] rounded-lg p-2">
                          <div className="text-[10px] text-[#555] mb-1">Formula</div>
                          <div className="text-[11px] text-purple-400 font-mono">{c.benefit.formula}</div>
                        </div>
                        <div className="bg-[#111] rounded-lg p-2">
                          <div className="text-[10px] text-[#555] mb-1">Your Calculation</div>
                          <div className="text-[11px] text-emerald-300 font-mono">{c.breakdown}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Bar */}
              <div className="mt-4 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#888]">Total Annual Value ({calculations.length} benefits)</div>
                  <div className="text-xs text-[#555] mt-0.5">{metrics.benefitRamp}% benefit ramp applied</div>
                </div>
                <div className="text-2xl font-bold text-emerald-400">{fmtCurrency(totalValue)}</div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {calculations.length === 0 && (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-12 text-center">
              <Calculator size={32} className="mx-auto text-[#333] mb-3" />
              <div className="text-sm text-[#555]">Select benefits above to calculate ROI</div>
              <div className="text-[11px] text-[#444] mt-1">Adjust customer metrics on the left, then pick benefits to model</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
