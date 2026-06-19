import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEmotions } from '@/hooks/useEmotions';
import { Colors } from '@/lib/colors';
import { Spacing, Radius, FontSize, FontWeight, MIN_TOUCH, HIT_SLOP } from '@/lib/theme';
import { Loader } from '@/components/ui';
import type { Emotion } from '@/types';

interface EmotionPickerProps {
  value?: number;
  onChange: (emotionId: number) => void;
}

export default function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  const { data: emotions, isLoading } = useEmotions();
  const [selectedParent, setSelectedParent] = useState<Emotion | null>(null);

  if (isLoading) {
    return <Loader label="Chargement des émotions…" />;
  }

  if (selectedParent?.enfants && selectedParent.enfants.length > 0) {
    return (
      <View>
        <TouchableOpacity style={styles.backBtn} hitSlop={HIT_SLOP} onPress={() => setSelectedParent(null)}>
          <Ionicons name="arrow-back" size={16} color={Colors.primary} />
          <Text style={styles.backText}>Retour aux émotions</Text>
        </TouchableOpacity>
        <Text style={styles.subTitle}>
          Précisez votre émotion de{' '}
          <Text style={[styles.subTitleAccent, { color: selectedParent.couleur }]}>{selectedParent.nom}</Text> :
        </Text>
        <View style={styles.grid}>
          {selectedParent.enfants.map((child) => (
            <EmotionTile
              key={child.id}
              emotion={child}
              selected={value === child.id}
              onPress={() => onChange(child.id)}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {emotions?.map((emotion) => {
        const hasChildren = emotion.enfants && emotion.enfants.length > 0;
        const isSelected = value === emotion.id || emotion.enfants?.some((e) => e.id === value);
        return (
          <EmotionTile
            key={emotion.id}
            emotion={emotion}
            selected={!!isSelected}
            hasChildren={hasChildren}
            onPress={() => {
              if (hasChildren) {
                setSelectedParent(emotion);
              } else {
                onChange(emotion.id);
              }
            }}
          />
        );
      })}
    </View>
  );
}

function EmotionTile({
  emotion,
  selected,
  hasChildren,
  onPress,
}: {
  emotion: Emotion;
  selected: boolean;
  hasChildren?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.tile,
        selected && { borderColor: emotion.couleur, borderWidth: 2.5, backgroundColor: `${emotion.couleur}12` },
      ]}
      onPress={onPress}
      accessibilityLabel={emotion.nom}
    >
      <Text style={styles.tileEmoji}>{emotion.icone || '🔵'}</Text>
      <Text style={styles.tileName} numberOfLines={2}>
        {emotion.nom}
      </Text>
      {hasChildren && <Ionicons name="chevron-down" size={12} color={Colors.gray[400]} style={styles.chevron} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.md, minHeight: MIN_TOUCH },
  backText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  subTitle: { fontSize: FontSize.sm, color: Colors.gray[600], marginBottom: Spacing.md },
  subTitleAccent: { fontWeight: FontWeight.bold },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  tile: {
    width: '30%',
    minHeight: 92,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
  },
  tileEmoji: { fontSize: 30 },
  tileName: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.black, textAlign: 'center' },
  chevron: { marginTop: 2 },
});
