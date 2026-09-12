with open('frontend/src/pages/admin/tabs/SchoolStudentsTab.jsx', 'r') as f:
    text = f.read()

# find the literal newline inside .join(" and ")
text = text.replace('.join("\n");', '.join("\\n");')
with open('frontend/src/pages/admin/tabs/SchoolStudentsTab.jsx', 'w') as f:
    f.write(text)
