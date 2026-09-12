import re

file_path = '/Users/mudasirmushtaq/Documents/app/northend/frontend/src/pages/erp/ErpLeads.jsx'
with open(file_path, 'r') as f:
    content = f.read()

import_pattern = r'import { useEffect, useState, useCallback } from "react";'
new_imports = 'import { useState, useCallback } from "react";\nimport { useQuery, useQueryClient } from "@tanstack/react-query";'
if import_pattern in content:
    content = content.replace(import_pattern, new_imports)
else:
    content = content.replace('import { useEffect, useState } from "react";', 'import { useState, useCallback } from "react";\nimport { useQuery, useQueryClient } from "@tanstack/react-query";')

old_body_regex = r'export default function ErpLeads\(\) \{[\s\S]*?return \('
new_body = """export default function ErpLeads() {
  const { erpUser } = useOutletContext();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 25;
  const queryClient = useQueryClient();

  const { data: branches = [] } = useQuery({
    queryKey: ['erp-branches'],
    queryFn: () => erp.listBranches()
  });

  const { data: leadsData = { items: [], total: 0, pages: 1 }, isLoading } = useQuery({
    queryKey: ['erp-leads', branchId, search, statusFilter, page],
    queryFn: async () => {
      const params = { skip: (page - 1) * limit, limit };
      if (search) params.search = search;
      if (branchId) params.branch_id = branchId;
      if (statusFilter) params.status = statusFilter;
      return erp.listLeads(params);
    },
    keepPreviousData: true
  });
  
  const items = leadsData.items;

  const handleSearch = (e) => {
    setQ(e.target.value);
    if (window.searchTimeout) clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 500);
  };

  const reload = () => queryClient.invalidateQueries(['erp-leads']);

  return ("""

content = re.sub(old_body_regex, new_body, content)

content = re.sub(r'const leadsPage = usePaged\(items, 25\);', '', content)
content = re.sub(r'const page = usePaged\(items, 25\);', '', content)

old_paginator = r'<Paginator p=\{leadsPage\} />'
new_paginator = """<div className="p-4 border-t border-border flex justify-between items-center bg-background/50">
        <div className="text-xs text-muted-foreground">Showing {items.length} of {leadsData.total} entries</div>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold disabled:opacity-50">Prev</button>
          <span className="text-xs font-bold px-2">Page {page} of {leadsData.pages || 1}</span>
          <button disabled={page === (leadsData.pages || 1) || leadsData.pages === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold disabled:opacity-50">Next</button>
        </div>
      </div>"""
content = re.sub(old_paginator, new_paginator, content)
content = re.sub(r'<Paginator p=\{page\} />', new_paginator, content)

content = content.replace('leadsPage.pageItems.map', 'items.map')
content = content.replace('page.pageItems.map', 'items.map')
content = content.replace('onChange={e => setQ(e.target.value)}', 'onChange={handleSearch}')

with open(file_path, 'w') as f:
    f.write(content)

