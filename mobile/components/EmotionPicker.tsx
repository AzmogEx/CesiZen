import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEmotions } from '@/hooks/useEmotions';
import { Colors } from '@/lib/colors';
import type { Emotion } from '@/types';

interface EmotionPickerProps {
  value?: number;
  onChange: (emotionId: number) => void;
}

export default function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  const { data: emotions, isLoading } = useEmotions();
  const [selectedParent, setSelectedParent] = useState<Emotion | null>(null);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (selectedParent?.enfants && selectedParent.enfants.length > 0) {
    return (
      <View>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedParent(null)}>
          <Text style={styles.backText}>← Retour aux emotions</Text>
        </TouchableOpacity>
        <Text style={styles.subTitle}>
          Precisez votre emotion de{' '}
          <Text style={{ color: selectedParent.couleur, fontWeight: '700' }}>{selectedParent.nom}</Text> :
        </Text>
        <View style={styles.grid}>
          {selectedParent.enfants.map((child) => {
            const isSelected = value === child.id;
            return (
              <TouchableOpacity
                key={child.id}
                style={[
                  styles.emotionCard,
                  isSelected && { borderColor: child.couleur, borderWidth: 2.5 },
                ]}
                onPress={() => onChange(child.id)}
              >
                <Text style={styles.emotionEmoji}>{child.icone || '🔵'}</Text>
                <Text style={styles.emotionName}>{child.nom}</Text>
              </TouchableOpacity>
            );
          })}
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
          <TouchableOpacity
            key={emotion.id}
            style={[
              styles.emotionCard,
              isSelected && { borderColor: emotion.couleur, borderWidth: 2.5 },
            ]}
            onPress={() => {
              if (hasChildren) {
                setSelectedParent(emotion);
              } else {
                onChange(emotion.id);
              }
            }}
          >
            <Text style={styles.emotionEmoji}>{emotion.icone || '🔵'}</Text>
            <Text style={styles.emotionName}>{emotion.nom}</Text>
            {hasChildren && <Text style={styles.arrow}>▼</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { padding: 40, alignItems: 'center' },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 14, color: Colors.primary, textDecorationLine: 'underline' },
  subTitle: { fontSize: 14, color: Colors.gray[600], marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emotionCard: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
  },
  emotionEmoji: { fontSize: 30 },
  emotionName: { fontSize: 12, fontWeight: '600', color: Colors.black, textAlign: 'center' },
  arrow: { fontSize: 10, color: Colors.gray[400] },
});
