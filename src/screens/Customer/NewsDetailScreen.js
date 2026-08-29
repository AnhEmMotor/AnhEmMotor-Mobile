import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import RenderHTML from 'react-native-render-html';
import { getNewsBySlug } from '../../api/newsApi';
import { Theme } from '../../theme/Theme';
import { useGlobalState } from '../../context/GlobalState';
import { getFullImageUrl } from '../../utils/imageHelpers';

export default function NewsDetailScreen({ route, navigation }) {
  const params = route.params ?? {};
  const slug = params.slug ?? params.newsSlug;
  const hasSlug = Boolean(slug);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(hasSlug);
  const { width } = useWindowDimensions();

  const { themeMode } = useGlobalState();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const activeColors = {
    background: isDark ? '#0B0F19' : '#F8FAFC',
    card: isDark ? '#111111' : '#FFFFFF',
    cardBg: isDark ? '#111111' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#050505',
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
  };

  useEffect(() => {
    if (!hasSlug) return undefined;
    let mounted = true;
    (async () => {
      const data = await getNewsBySlug(slug);
      if (mounted) {
        setNews(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hasSlug, slug]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: activeColors.cardBg, borderColor: activeColors.border },
            ]}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Theme.staticColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!news) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: activeColors.cardBg, borderColor: activeColors.border },
            ]}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: activeColors.text }}>Không tìm thấy bài viết.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tagsStyles = {
    body: { color: activeColors.text, fontSize: 15, lineHeight: 24 },
    p: { marginVertical: 8, color: activeColors.text },
    h1: { color: activeColors.text, fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
    h2: { color: activeColors.text, fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
    h3: { color: activeColors.text, fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
    img: { borderRadius: 8, marginVertical: 10 },
    a: { color: Theme.staticColors.primary, textDecorationLine: 'underline' },
  };

  const coverImage = getFullImageUrl(news.coverImageUrl, { basePath: 'uploads/' });

  const getProcessedHtml = () => {
    if (!news || !news.content) return '';
    let html = news.content;
    // Fix absolute URLs that are missing uploads/
    html = html.replace(
      /src="(http:\/\/[^"]+?\/)articles\/covers\/([^"]+)"/g,
      'src="$1uploads/articles/covers/$2"'
    );
    // Fix relative URLs
    html = html.replace(/src="(?!\w+:\/\/)([^"]+)"/g, (match, url) => {
      return `src="${getFullImageUrl(url, { basePath: 'uploads/' })}"`;
    });
    return html;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: activeColors.cardBg, borderColor: activeColors.border },
          ]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Chi tiết bài viết</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {coverImage && (
          <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
        )}
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{news.categoryName || 'Tin tức'}</Text>
          <Text style={[styles.date, { color: activeColors.subtext }]}>
            {news.publishedDate ? new Date(news.publishedDate).toLocaleDateString('vi-VN') : ''}
          </Text>
        </View>
        <Text style={[styles.title, { color: activeColors.text }]}>{news.title}</Text>
        {news.excerpt && (
          <Text style={[styles.excerpt, { color: activeColors.subtext }]}>{news.excerpt}</Text>
        )}
        <View style={styles.htmlContainer}>
          <RenderHTML
            contentWidth={width - 32}
            source={{ html: getProcessedHtml() }}
            tagsStyles={tagsStyles}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  content: { padding: 16, paddingBottom: 40 },
  coverImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  metaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  category: { color: Theme.staticColors.primary, fontWeight: 'bold', fontSize: 13, marginRight: 8 },
  date: { fontSize: 13 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, lineHeight: 30 },
  excerpt: { fontSize: 15, fontStyle: 'italic', marginBottom: 16, lineHeight: 22 },
  htmlContainer: { marginTop: 10 },
});
