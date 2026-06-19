import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/lib/colors';

export interface EmotionPieSlice {
  nom: string;
  couleur: string;
  count: number;
  pourcentage: number;
}

interface EmotionPieChartProps {
  data: EmotionPieSlice[];
  /** Diamètre total du graphique en pixels. */
  size?: number;
  /** Épaisseur de l'anneau (donut) en pixels. */
  strokeWidth?: number;
}

/**
 * Camembert (donut) de répartition des émotions, équivalent mobile du
 * graphique Recharts du web. Construit avec react-native-svg : chaque part
 * est un arc de cercle tracé via le stroke-dasharray d'un <Circle>.
 */
export default function EmotionPieChart({
  data,
  size = 200,
  strokeWidth = 38,
}: EmotionPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return null;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Décalage cumulé pour positionner chaque arc à la suite du précédent.
  let offsetAcc = 0;
  const segments = data.map((item) => {
    const fraction = item.count / total;
    const dash = fraction * circumference;
    const segment = {
      ...item,
      dash,
      gap: circumference - dash,
      rotation: (offsetAcc / circumference) * 360,
    };
    offsetAcc += dash;
    return segment;
  });

  const topPct = Math.round((data[0]?.count / total) * 100);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Anneau de fond pour les arrondis */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.gray[100]}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <G rotation={-90} origin={`${center}, ${center}`}>
          {segments.map((seg) => (
            <Circle
              key={seg.nom}
              cx={center}
              cy={center}
              r={radius}
              stroke={seg.couleur}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={-((seg.rotation / 360) * circumference)}
              fill="none"
            />
          ))}
        </G>
        {/* Centre du donut : part dominante */}
        <SvgText
          x={center}
          y={center - 6}
          fontSize={30}
          fontWeight="800"
          fill={Colors.black}
          textAnchor="middle"
        >
          {`${topPct}%`}
        </SvgText>
        <SvgText
          x={center}
          y={center + 16}
          fontSize={12}
          fill={Colors.gray[500]}
          textAnchor="middle"
        >
          {data[0]?.nom ?? ''}
        </SvgText>
      </Svg>

      {/* Légende */}
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.nom} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.couleur }]} />
            <Text style={styles.legendName} numberOfLines={1}>
              {item.nom}
            </Text>
            <Text style={styles.legendPct}>{item.pourcentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 20 },
  legend: { alignSelf: 'stretch', marginTop: 20, gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendName: { flex: 1, fontSize: 14, color: Colors.black },
  legendPct: { fontSize: 14, fontWeight: '700', color: Colors.gray[600] },
});
