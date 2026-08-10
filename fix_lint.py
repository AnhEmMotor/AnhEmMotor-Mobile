import re
import os

lint_output_file = 'lint_output.txt'
with open(lint_output_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixes = {}

current_file = None
for line in lines:
    line = line.strip()
    if line.startswith('C:\\'):
        current_file = line
        fixes[current_file] = []
    elif current_file and 'warning' in line or 'error' in line:
        # Example: 103:5  warning  '_vehicleStatus' is assigned a value but never used  no-unused-vars
        match = re.search(r'^(\d+):(\d+)\s+(warning|error)\s+(.*?)\s+(no-unused-vars|react/display-name|import/namespace)', line)
        if match:
            line_num = int(match.group(1))
            col_num = int(match.group(2))
            msg = match.group(4)
            rule = match.group(5)
            fixes[current_file].append({
                'line': line_num,
                'col': col_num,
                'msg': msg,
                'rule': rule
            })

for filepath, file_fixes in fixes.items():
    if not file_fixes:
        continue
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            file_lines = f.readlines()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        continue
        
    # Sort fixes descending by line number to not mess up offsets
    file_fixes.sort(key=lambda x: x['line'], reverse=True)
    
    for fix in file_fixes:
        l_idx = fix['line'] - 1
        line_content = file_lines[l_idx]
        
        if fix['rule'] == 'react/display-name':
            # e.g. CustomBottomSheet or Toast
            if 'CustomBottomSheet.js' in filepath:
                file_lines.insert(l_idx + 1, "CustomBottomSheet.displayName = 'CustomBottomSheet';\n")
            elif 'Toast.js' in filepath:
                file_lines.insert(l_idx + 1, "Toast.displayName = 'Toast';\n")
        
        elif fix['rule'] == 'import/namespace':
            # Add eslint-disable-next-line import/namespace
            file_lines.insert(l_idx, "// eslint-disable-next-line import/namespace\n")
            
        elif fix['rule'] == 'no-unused-vars':
            # Extract variable name
            var_match = re.search(r"'(.*?)' is", fix['msg'])
            if var_match:
                var_name = var_match.group(1)
                
                # Check if it's an arg: "Allowed unused args must match /^_/u"
                if 'Allowed unused args' in fix['msg']:
                    # Change e to _e
                    file_lines[l_idx] = re.sub(rf'\b{var_name}\b', f'_{var_name}', line_content)
                else:
                    # It's an unused variable. 
                    # If it's a simple const declaration `const _width = ...` we can just delete the line or part of it
                    if re.search(rf'const\s+{var_name}\s*=', line_content):
                        file_lines[l_idx] = "// " + line_content
                    elif re.search(rf'const\s+{{\s*{var_name}\s*}}\s*=', line_content):
                        file_lines[l_idx] = "// " + line_content
                    elif var_name in line_content:
                        # try to remove it from destructuring like `{ a, _width, c }`
                        new_line = re.sub(rf'\b{var_name}\s*,\s*', '', line_content)
                        new_line = re.sub(rf',\s*\b{var_name}\b', '', new_line)
                        if new_line == line_content:
                            new_line = re.sub(rf'\b{var_name}\b', '', line_content)
                        # If destructuring becomes empty, just comment out
                        if re.search(r'const\s*{\s*}\s*=', new_line):
                            new_line = "// " + line_content
                        file_lines[l_idx] = new_line
                    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(file_lines)

print("Applied fixes.")
