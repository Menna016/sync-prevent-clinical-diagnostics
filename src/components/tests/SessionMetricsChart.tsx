import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TestResult } from '../../types';
import { ShieldAlert, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';

interface MetricData {
  id: string; // 'heart', 'diabetes', 'kidney', 'bp'
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unavailable';
  probability: number; // 0 to 100
  color: string;
  features: Record<string, any>;
}

interface SessionMetricsChartProps {
  recentTests: Record<string, TestResult>;
}

export default function SessionMetricsChart({ recentTests }: SessionMetricsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 280 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 1. Prepare data
  const testMetas = [
    { id: 'heart', name: 'Heart Disease', color: '#e11d48' }, // rose-600
    { id: 'diabetes', name: 'Diabetes Risk', color: '#059669' }, // emerald-600
    { id: 'kidney', name: 'Kidney Screen', color: '#0d9488' }, // teal-600
    { id: 'bp', name: 'Hypertension', color: '#4f46e5' }, // indigo-600
  ];

  const chartData: MetricData[] = testMetas
    .filter((meta) => recentTests[meta.id] !== undefined)
    .map((meta) => {
      const result = recentTests[meta.id];
      // Probability estimation
      let prob = 0;
      if (result._mlDetails && typeof result._mlDetails.probability === 'number') {
        prob = result._mlDetails.probability * 100;
      } else {
        // Fallback probability mapped from riskLevel
        if (result.riskLevel === 'High') prob = 85;
        else if (result.riskLevel === 'Medium') prob = 50;
        else if (result.riskLevel === 'Low') prob = 20;
      }

      // Features mapping
      const features = result._mlDetails?.features || {};

      return {
        id: meta.id,
        name: meta.name,
        riskLevel: result.riskLevel,
        probability: Math.round(prob),
        color: meta.color,
        features,
      };
    });

  // Track the first item if none is selected
  useEffect(() => {
    if (chartData.length > 0 && !selectedCategory) {
      setSelectedCategory(chartData[0].id);
    }
  }, [chartData, selectedCategory]);

  // 2. Resize observer for fluid responsive width/height
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Maintain standard height 280px, but clamp width between 200px and 800px
      const calculatedWidth = Math.max(280, width);
      setDimensions({ width: calculatedWidth, height: 260 });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 3. Render D3 Chart inside SVG
  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove(); // Clear previous render

    const margin = { top: 35, right: 25, bottom: 40, left: 55 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create central chart group
    const g = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([0, width])
      .padding(0.35);

    // Y scale (0 to 100% Risk Probability)
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid-lines')
      .style('stroke', '#e2e8f0')
      .style('stroke-dasharray', '3,3')
      .style('stroke-width', '0.7')
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => '')
      );

    // Customize domain & axis styles
    // X Axis
    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    xAxisG.select('.domain').style('stroke', '#cbd5e1').style('stroke-width', '1');
    xAxisG
      .selectAll('text')
      .style('fill', '#475569')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '10px')
      .style('font-weight', '600');
    xAxisG.selectAll('.tick line').style('stroke', '#cbd5e1');

    // Y Axis
    const yAxisG = g
      .append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`));

    yAxisG.select('.domain').style('stroke', '#cbd5e1').style('stroke-width', '1');
    yAxisG
      .selectAll('text')
      .style('fill', '#475569')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '10px')
      .style('font-weight', '600');
    yAxisG.selectAll('.tick line').style('stroke', '#cbd5e1');

    // Axis Header Title
    g.append('text')
      .attr('x', -10)
      .attr('y', -15)
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '9px')
      .style('font-weight', '800')
      .style('fill', '#64748b')
      .text('PREDICTED RISK PROBABILITY (%)');

    // Draw Bars with custom gradients or clean solid colors
    const bars = g
      .selectAll('.bar-group')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedCategory(d.id);
      });

    // Drawing actual bars on coordinates
    bars
      .append('rect')
      .attr('x', (d) => x(d.name) || 0)
      .attr('y', height) // starting point for intro animation
      .attr('width', x.bandwidth())
      .attr('height', 0) // starting height for animation
      .attr('rx', 5) // Rounded top corners
      .attr('ry', 5)
      .style('fill', (d) => d.color)
      .style('opacity', (d) => (selectedCategory === d.id ? 1 : 0.65))
      .transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d.probability))
      .attr('height', (d) => height - y(d.probability));

    // Optional: Draw values on top of bars
    bars
      .append('text')
      .attr('x', (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr('y', height - 5) // Initial position
      .attr('text-anchor', 'middle')
      .style('font-family', 'JetBrains Mono, monospace')
      .style('font-size', '10px')
      .style('font-weight', '800')
      .style('fill', '#1e293b')
      .style('opacity', 0)
      .text((d) => `${d.probability}%`)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .attr('y', (d) => y(d.probability) - 8);

    // Indicator highlight line for selected category
    bars.each(function (d) {
      if (selectedCategory === d.id) {
        g.append('rect')
          .attr('x', (x(d.name) || 0) - 3)
          .attr('y', y(d.probability) - 3)
          .attr('width', x.bandwidth() + 6)
          .attr('height', height - y(d.probability) + 6)
          .attr('rx', 7)
          .attr('ry', 7)
          .style('fill', 'none')
          .style('stroke', '#6366f1')
          .style('stroke-width', '1.5')
          .style('stroke-dasharray', '3,3')
          .style('pointer-events', 'none');
      }
    });

  }, [dimensions, chartData, selectedCategory]);

  const activeCategoryData = chartData.find((c) => c.id === selectedCategory);

  const getMetricLevelText = (prob: number) => {
    if (prob < 35) return { text: 'Optimal Thresholds', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    if (prob < 65) return { text: 'Elevated Risk Level', color: 'text-amber-800 bg-amber-50 border-amber-100' };
    return { text: 'Critical Risk Advisory', color: 'text-rose-800 bg-rose-50 border-rose-100' };
  };

  const getRiskExplanation = (id: string, risk: string) => {
    const defaultMsg = "Click standard bars inside the D3 analytical chart frame above to drill down into captured parameters.";
    if (!id) return defaultMsg;
    if (id === 'heart') {
      return `Cardiovascular evaluation places you in standard ${risk} risk limits. Key arterial parameters are synchronized.`;
    }
    if (id === 'diabetes') {
      return `Metabolic BRFSS indicators evaluated. Overall score maps to a ${risk} lifestyle risk score.`;
    }
    if (id === 'kidney') {
      return `Renal functional filtration clearance scored. Continuous clearance outputs a ${risk} diagnostic rating.`;
    }
    if (id === 'bp') {
      return `Chronical hypertension strain levels are parsed. Autonomical stress calculations reflect ${risk} indicators.`;
    }
    return defaultMsg;
  };

  return (
    <div id="session-metrics-viz" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fade-in font-sans text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 border border-indigo-100">
            <Activity className="h-5.5 w-5.5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">
              Active Session Testing Metrics
            </h2>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5">
              Live interactive D3 risk scoring timeline spanning completed diagnostics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-emerald-850">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>{chartData.length} Tests Completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive SVG Chart wrapper */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div ref={containerRef} className="w-full bg-slate-50 border border-slate-150 rounded-xl p-2 min-h-[270px] relative overflow-hidden flex items-center justify-center">
            {chartData.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold">No diagnostic results available to chart yet.</p>
            ) : (
              <svg ref={svgRef} className="w-full h-full max-h-[260px] cursor-pointer" />
            )}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 block text-center mt-1 uppercase tracking-wider">
            👆 Click bar nodes above to inspect target clinical parameters
          </span>
        </div>

        {/* Right Side: Tabular Biomarker drilldown logic */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-slate-150 bg-slate-50/50 rounded-xl p-5 gap-4">
          {activeCategoryData ? (
            <div className="flex flex-col gap-3.5 font-sans justify-between h-full">
              
              {/* Target Header */}
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-3 mt-0.5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-[#6366f1] uppercase">
                    Drilldown Database
                  </span>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    {activeCategoryData.name} Risk
                  </h3>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-md shadow-2xs ${getMetricLevelText(activeCategoryData.probability).color}`}>
                  {getMetricLevelText(activeCategoryData.probability).text}
                </span>
              </div>

              {/* Status Explanation card */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed font-sans text-slate-700">
                <span className="font-bold text-slate-905 block mb-1">📋 Bio-Risk Evaluation:</span>
                <p className="font-medium text-slate-600 leading-normal text-[11px]">
                  {getRiskExplanation(activeCategoryData.id, activeCategoryData.riskLevel)}
                </p>
              </div>

              {/* Captured Features List details */}
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5 block">
                  Synchronized Biometrical Log
                </span>

                {Object.keys(activeCategoryData.features).length === 0 ? (
                  <div className="py-4 text-center rounded-lg border border-dashed border-slate-200 text-[10.5px] font-semibold text-slate-400 bg-white">
                    No individual metrics synchronized. Standardized references used.
                  </div>
                ) : (
                  <div className="max-h-32 overflow-y-auto grid grid-cols-1 gap-1.5 pr-0.5">
                    {Object.entries(activeCategoryData.features).map(([key, val]) => {
                      // format keys elegantly
                      const readableKey = key
                        .replace(/_/g, ' ')
                        .replace('ldlCholesterol', 'LDL Cholesterol')
                        .replace('bloodGlucose', 'Blood Sugar')
                        .replace('systolic', 'Systolic Pressure')
                        .replace('diastolic', 'Diastolic Pressure')
                        .replace('genHlth', 'General Health')
                        .replace('mentHlth', 'Mental Health')
                        .replace('physHlth', 'Physical Symptoms');

                      let formattedVal = String(val);
                      if (typeof val === 'number') {
                        formattedVal = val % 1 !== 0 ? val.toFixed(2) : String(val);
                      }

                      return (
                        <div key={key} className="flex justify-between items-center text-[11px] bg-white border border-slate-200/60 px-3 py-2 rounded-lg font-mono">
                          <span className="capitalize text-slate-500 font-sans font-bold">{readableKey}</span>
                          <span className="font-extrabold text-[#312e81]">{formattedVal}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Real-time Indicator block */}
              <div className="mt-1 pt-3.5 border-t border-slate-200/80 flex items-center gap-2 text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Active Probability Standard: {activeCategoryData.probability}%</span>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full text-slate-400 gap-2 py-8">
              <ShieldAlert className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold">Select a category bar in the D3 chart to trigger clinical details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
