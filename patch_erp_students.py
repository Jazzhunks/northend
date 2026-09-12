import re

file_path = '/Users/mudasirmushtaq/Documents/app/northend/frontend/src/pages/erp/ErpStudents.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace local state and useEffect with React Query
import_pattern = r'import { useEffect, useState, useCallback } from "react";'
new_imports = 'import { useState, useCallback } from "react";\nimport { useQuery, useQueryClient } from "@tanstack/react-query";'
content = content.replace(import_pattern, new_imports)

# Replace the component body up to the return statement
old_body_regex = r'export default function ErpStudents\(\) \{[\s\S]*?return \('
new_body = """export default function ErpStudents() {
  const { erpUser } = useOutletContext();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 25;
  const queryClient = useQueryClient();

  const { data: branches = [] } = useQuery({
    queryKey: ['erp-branches'],
    queryFn: () => erp.listBranches()
  });

  const { data: studentsData = { items: [], total: 0, pages: 1 }, isLoading } = useQuery({
    queryKey: ['erp-students', branchId, search, page],
    queryFn: async () => {
      const params = { skip: (page - 1) * limit, limit };
      if (search) params.search = search;
      if (branchId) params.branch_id = branchId;
      return erp.listStudents(params);
    },
    keepPreviousData: true
  });
  
  const items = studentsData.items;

  // Debounce search manually for typing
  const handleSearch = (e) => {
    setQ(e.target.value);
    // basic debounce
    if (window.searchTimeout) clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 500);
  };

  const reload = () => queryClient.invalidateQueries(['erp-students']);

  return ("""

content = re.sub(old_body_regex, new_body, content)

# Remove the old usePaged and Paginator
content = re.sub(r'const studentsPage = usePaged\(items, 25\);', '', content)

# Fix the Paginator component render
old_paginator = r'<Paginator p=\{studentsPage\} />'
new_paginator = """<div className="p-4 border-t border-border flex justify-between items-center bg-background/50">
        <div className="text-xs text-muted-foreground">Showing {items.length} of {studentsData.total} entries</div>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold disabled:opacity-50">Prev</button>
          <span className="text-xs font-bold px-2">Page {page} of {studentsData.pages || 1}</span>
          <button disabled={page === (studentsData.pages || 1) || studentsData.pages === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold disabled:opacity-50">Next</button>
        </div>
      </div>"""
content = re.sub(old_paginator, new_paginator, content)

# Fix studentsPage.pageItems
content = content.replace('studentsPage.pageItems.map', 'items.map')

# Fix search input onChange
content = content.replace('onChange={e => setQ(e.target.value)}', 'onChange={handleSearch}')

with open(file_path, 'w') as f:
    f.write(content)

