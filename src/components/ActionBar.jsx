import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Phone, MessageSquare, Calendar, User } from 'lucide-react-native';
import { useActiveColors } from '../theme/Theme';

export const ActionBar = ({ phone, onCall, onChat, onAppointment, onAssign }) => {
  const colors = useActiveColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onCall}>
        <Phone color={colors.text} size={18} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onChat}>
        <MessageSquare color={colors.text} size={18} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onAppointment}>
        <Calendar color={colors.text} size={18} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onAssign}>
        <User color={colors.text} size={18} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flexDirection: 'row' },
    btn: {
      width: 36,
      height: 36,
      borderRadius: 0,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: colors.primary + '38',
    },
  });

export default ActionBar;
