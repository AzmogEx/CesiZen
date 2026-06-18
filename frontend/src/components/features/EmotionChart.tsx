'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { RapportData } from '@/types';

interface EmotionChartProps {
  data: RapportData;
  type?: 'repartition' | 'evolution' | 'intensite';
}

export default function EmotionChart({ data, type = 'repartition' }: EmotionChartProps) {
  if (type === 'repartition') {
    const pieData = data.repartition.map((item) => ({
      name: item.nom,
      value: item.count,
      color: item.couleur,
      pourcentage: item.pourcentage,
    }));

    if (pieData.length === 0) {
      return <EmptyChart message="Aucune donnée pour cette période" />;
    }

    return (
      <div style={{ width: '100%', height: '20rem' }}>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              label={({ name, pourcentage }: { name?: string; pourcentage?: number }) =>
                `${name} (${pourcentage}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: ValueType | undefined, name: NameType | undefined) =>
                [`${value} saisies`, name]
              }
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'evolution') {
    const lineData = data.evolution.labels.map((label, index) => {
      const point: Record<string, string | number> = { date: label };
      data.evolution.emotions.forEach((emotion) => {
        point[emotion.nom] = emotion.data[index] || 0;
      });
      return point;
    });

    if (lineData.length === 0) {
      return <EmptyChart message="Aucune donnée d'évolution" />;
    }

    return (
      <div style={{ width: '100%', height: '20rem' }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.3 }} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            {data.evolution.emotions.map((emotion) => (
              <Bar
                key={emotion.nom}
                dataKey={emotion.nom}
                stackId="emotions"
                fill={emotion.couleur}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'intensite') {
    const barData = data.evolution.labels.map((label, index) => ({
      date: label,
      intensite: data.evolution.intensite_moyenne[index] || 0,
    }));

    if (barData.length === 0) {
      return <EmptyChart message="Aucune donnée d'intensité" />;
    }

    return (
      <div style={{ width: '100%', height: '20rem' }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" style={{ opacity: 0.3 }} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: ValueType | undefined) => [`${Number(value).toFixed(1)}`, 'Intensité moyenne']}
            />
            <Bar dataKey="intensite" fill="#000091" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div
      className="fr-text-mention--grey"
      style={{
        width: '100%',
        height: '20rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p className="fr-text--lead fr-mb-0">{message}</p>
    </div>
  );
}
