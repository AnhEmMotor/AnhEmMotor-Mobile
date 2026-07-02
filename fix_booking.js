const fs = require('fs');

let content = fs.readFileSync('src/screens/Customer/BookingScreen.js', 'utf8');

// Insert styles definition
content = content.replace(/const activeColors = useActiveColors\(\);\n[ \t]*const theme = useTheme\(\);[^\n]*\n/,
  `const activeColors = useActiveColors();\n  const theme = useTheme();\n  const styles = getStyles(theme, activeColors);\n`);

// Replace getStyles() with styles
content = content.replace(/getStyles\(\)/g, 'styles');

// Fix the getStyles signature at the bottom
content = content.replace(/const getStyles = \(\) => StyleSheet\.create\(\{/g, 'const getStyles = (theme, activeColors) => StyleSheet.create({');

fs.writeFileSync('src/screens/Customer/BookingScreen.js', content);
console.log('Fixed BookingScreen.js completely');
