import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useTheme } from '../theme/Theme'; // Import useTheme
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PredictiveHealth = ({ data, title, color = '#22d3ee' }) => {
  const theme = useTheme();
  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => color,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: color,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: 'rgba(255,255,255,0.05)',
    }
  };

  return (
    <View style={getStyles(theme).container}>
      <View style={getStyles(theme).header}>
        {/* Use getStyles for titleRow and title */}
        <View style={getStyles(theme).titleRow}>
          <Activity color={color} size={18} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
          <Text style={[styles.statusText, { color }]}>Tốt</Text>
        </View>
      </View>

      <LineChart
        data={{
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
          datasets: [
            {
              data: data || [95, 92, 88, 85, 82, 80],
              color: (opacity = 1) => color, // Neon color
              strokeWidth: 3
            },
          ],
        }}
        width={width - 40}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
      />

      <View style={getStyles(theme).footer}>
        <Zap color={theme.colors.subtext} size={12} />
        <Text style={[getStyles(theme).predictionText, { color: theme.colors.subtext }]}>Dự báo cần thay thế sau 2,500km nữa</Text>
      </View>
    </View>
  );
};
const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text, // Use theme.colors.text
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -15, // Align with container padding
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  predictionText: {
    // color: Theme.colors.subtext, // Set inline
    fontSize: 11,
    marginLeft: 6,
  },
});

export default PredictiveHealth;

