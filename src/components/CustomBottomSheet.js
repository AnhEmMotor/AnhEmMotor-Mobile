import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Theme } from '../theme/Theme';

const CustomBottomSheet = forwardRef(({ children, title, onClose, themeMode = 'dark' }, ref) => {
  const bottomSheetRef = useRef(null);

  // Dynamic Theme Evaluation
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const activeBg = isDark ? '#111827' : '#FFFFFF';
  const activeTitle = isDark ? '#F8FAFC' : '#0F172A';
  const activeIndicator = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
  const activeBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

  // Cấu hình Snap Points cố định để tránh giật lag (Priority 1 & 3)
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const show = useCallback(() => {
    bottomSheetRef.current?.expand(); // Mở rộng bảng
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({
    show,
    hide
  }));

  // Render backdrop (nền mờ khi mở bảng)
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Mặc định đóng
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.background, { backgroundColor: activeBg, borderColor: activeBorder }]}
      handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: activeIndicator }]}
      enableContentPanningGesture={true}
      enableOverdrag={false} // Tránh lỗi kéo quá đà trên Web
      onChange={(index) => {
        if (index === -1 && onClose) {
          onClose();
        }
      }}
    >
      <BottomSheetScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: activeTitle }]}>{title}</Text>
        </View>
        <View style={styles.content}>
          {children}
        </View>
        {/* Padding Bottom 40px as suggested (Mẹo kiểm tra) */}
        <View style={{ height: 60 }} /> 
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  }
});

export default CustomBottomSheet;
