import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import GlassCard from './GlassCard';
import { Phone, MessageSquare, Calendar, User, Flame } from 'lucide-react-native';
import { useActiveColors } from '../theme/Theme';
import ActionBar from './ActionBar';

export const LeadCard = ({ lead, onPress }) => {
  const colors = useActiveColors();
  const styles = getStyles(colors);

  const handleCall = () => Linking.openURL(`tel:${lead.phone}`);
  const handleChat = () => Linking.openURL('https://zalo.me');

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.cardWrapper}>
      <GlassCard style={styles.leadCard} intensity={15}>
        <View style={styles.header}>
          <View style={styles.nameSection}>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.leadName}>
              {lead.name}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: lead.color + '25', borderColor: lead.color + '66', borderWidth: 1 }]}> 
              <Flame color={lead.color} size={12} strokeWidth={3} />
              <Text style={[styles.priorityText, { color: lead.color }]}>{lead.status.toUpperCase()}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            {/* More options can be added here */}
          </TouchableOpacity>
        </View>

        <View style={styles.interestBox}>
          <View style={styles.interestRow}>
            <User color={colors.primary} size={14} />
            <Text style={styles.interestLabel}>Quan tâm: </Text>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.interestValue}>
              {lead.interest}
            </Text>
          </View>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.timeLabel}>
            {lead.time}
          </Text>
        </View>

        <ActionBar
          phone={lead.phone}
          onCall={handleCall}
          onChat={handleChat}
          onAppointment={() => {}}
          onAssign={() => {}}
        />
      </GlassCard>
    </TouchableOpacity>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    cardWrapper: { marginBottom: 12 },
    leadCard: { padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    nameSection: { flex: 1 },
    leadName: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
    moreBtn: { padding: 4 },
    priorityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 0,
      marginTop: 4,
    },
    priorityText: { fontSize: 10, fontWeight: '900', marginLeft: 4, letterSpacing: 1 },
    interestBox: { backgroundColor: colors.surface, padding: 12, borderRadius: 0, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
    interestRow: { flexDirection: 'row', alignItems: 'center' },
    interestLabel: { color: colors.text, fontSize: 13, marginLeft: 6 },
    interestValue: { color: colors.text, fontSize: 14, fontWeight: 'bold' },
    timeLabel: { color: colors.text, fontSize: 11, marginTop: 6 },
  });

export default LeadCard;
