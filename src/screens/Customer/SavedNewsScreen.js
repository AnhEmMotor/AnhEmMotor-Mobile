import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Bookmark, Settings } from 'lucide-react-native';
import { useTheme } from '../../theme/Theme';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SavedNewsScreen({ navigation }) {
  const [savedItems, setSavedItems] = useState([]);
  const { theme, getStyles } = useTheme();
  const styles = getStyles(theme);

  const loadSavedNews = async () => {
    try {
      const stored = await AsyncStorage.getItem('saved_news');
      if (stored) {
        setSavedItems(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Failed to load news', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadSavedNews();
    };
    init();
  }, []);

  const removeNews = async (id) => {
    try {
      const newList = savedItems.filter((item) => item.id !== id);
      setSavedItems(newList);
      await AsyncStorage.setItem('saved_news', JSON.stringify(newList));
    } catch (e) {
      console.log('Failed to remove news', e);
    }
  };

  return (
    <SafeAreaView
      style={[getStyles(theme).container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={getStyles(theme).header}>
        <TouchableOpacity
          style={[getStyles(theme).backBtn, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={theme.colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[getStyles(theme).headerTitle, { color: theme.colors.text }]}>Tin đã lưu</Text>
        <TouchableOpacity
          style={[getStyles(theme).backBtn, { backgroundColor: theme.colors.card }]}
          onPress={() =>
            navigation.navigate('CustomerHome', {
              screen: 'Profile',
              params: { openSettings: true },
            })
          }
        >
          <Settings color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {savedItems.length === 0 ? (
          <View style={getStyles(theme).emptyState}>
            <Bookmark color={theme.colors.subtext} size={64} opacity={0.3} />
            <Text style={[getStyles(theme).emptyText, { color: theme.colors.subtext }]}>
              Bạn chưa lưu tin tức nào
            </Text>
            <TouchableOpacity
              style={[
                getStyles(theme).exploreBtn,
                { backgroundColor: theme.colors.primary + '1A' },
              ]}
              onPress={() => navigation.navigate('CustomerHome')}
            >
              <Text style={[getStyles(theme).exploreBtnText, { color: theme.colors.primary }]}>
                Khám phá ngay
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          savedItems.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
              <GlassCard
                style={[
                  getStyles(theme).newsCard,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
                intensity={10}
              >
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={[getStyles(theme).newsTitle, { color: theme.colors.text }]}>
                    {item.title}
                  </Text>
                  <View
                    style={[getStyles(theme).newsFooter, { borderTopColor: theme.colors.border }]}
                  >
                    <TouchableOpacity
                      onPress={() => removeNews(item.id)}
                      style={getStyles(theme).removeBtn}
                    >
                      <Trash2 color={theme.colors.secondary} size={18} />
                      <Text
                        style={[getStyles(theme).removeText, { color: theme.colors.secondary }]}
                      >
                        Gỡ bỏ
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
