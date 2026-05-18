import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Bookmark, Settings } from 'lucide-react-native';
import { Theme } from '../../theme/Theme';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScalePress from '../../components/ScalePress';

export default function SavedNewsScreen({ navigation }) {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    loadSavedNews();
  }, []);

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

  const removeNews = async (id) => {
    try {
      const newList = savedItems.filter(item => item.id !== id);
      setSavedItems(newList);
      await AsyncStorage.setItem('saved_news', JSON.stringify(newList));
    } catch (e) {
      console.log('Failed to remove news', e);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin đã lưu</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}>
          <Settings color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {savedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Bookmark color={Theme.colors.subtext} size={64} opacity={0.3} />
            <Text style={styles.emptyText}>Bạn chưa lưu tin tức nào</Text>
            <TouchableOpacity 
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('CustomerHome')}
            >
                <Text style={styles.exploreBtnText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          savedItems.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.delay(index * 100)}
            >
              <GlassCard style={styles.newsCard} intensity={10}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <View style={styles.newsFooter}>
                    <TouchableOpacity onPress={() => removeNews(item.id)} style={styles.removeBtn}>
                      <Trash2 color={Theme.colors.secondary} size={18} />
                      <Text style={styles.removeText}>Gỡ bỏ</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, height: 60 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  scrollContent: { padding: 20, flexGrow: 1 },
  
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: Theme.colors.subtext, fontSize: 16, marginTop: 20 },
  exploreBtn: { marginTop: 20, backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 20 },
  exploreBtnText: { color: Theme.colors.primary, fontWeight: 'bold' },

  newsCard: { marginBottom: 20, overflow: 'hidden', padding: 0 },
  newsImage: { width: '100%', height: 150 },
  newsContent: { padding: 15 },
  newsTitle: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  newsFooter: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
  removeBtn: { flexDirection: 'row', alignItems: 'center' },
  removeText: { color: Theme.colors.secondary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 }
});
