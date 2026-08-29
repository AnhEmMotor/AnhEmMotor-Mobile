import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useActiveColors } from '../theme/Theme';

const CustomBottomSheet = forwardRef(({ children, title, onClose, autoOpen = false }, ref) => {
  const bottomSheetRef = useRef(null);
  const activeColors = useActiveColors();

  const activeBg = activeColors.card;
  const activeTitle = activeColors.text;
  const activeIndicator = activeColors.isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
  const activeBorder = activeColors.border;

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const show = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={autoOpen ? snapPoints.length - 1 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.background,
        { backgroundColor: activeBg, borderColor: activeBorder },
      ]}
      handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: activeIndicator }]}
      enableContentPanningGesture={false}
      enableOverdrag={false}
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
        <View style={styles.content}>{children}</View>
        {}
        <View style={{ height: 60 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
});

CustomBottomSheet.displayName = 'CustomBottomSheet';
export default CustomBottomSheet;
