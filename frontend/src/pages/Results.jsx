import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Results() {
  const [list, setList] = useState([]);
  const [year, setYear] = useState("All");

  useEffect(() => { api.get("/results").then(r => setList(r.data)); }, []);

  const years = ["All", ...Array.from(new Set(list.map(r => r.year))).sort((a,b)=>b-a)];
  const filtered = year === "All" ? list : list.filter(r => r.year === Number(year));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16" data-testid="results-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Results & Selections</div>
      <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter">Numbers we earned, students we shaped.</h1>

      <div className="mt-8 flex flex-wrap gap-2">
        {years.map(y => (
          <button key={y} onClick={()=>setYear(y)} data-testid={`year-${y}`}
            className={`px-4 py-2 text-sm rounded-md border ${String(year)===String(y) ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
            {y}
          </button>
        ))}
      </div>

      <div className="mt-10 border border-border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary text-xs uppercase tracking-[0.18em]">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Exam</th>
              <th className="text-left p-4">Rank</th>
              <th className="text-left p-4 hidden md:table-cell">Year</th>
              <th className="text-left p-4 hidden lg:table-cell">Course</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={`${i%2 ? "bg-secondary/30" : ""} border-t border-border`} data-testid={`result-row-${r.id}`}>
                <td className="p-4 font-bold">{r.student_name}</td>
                <td className="p-4 text-sm">{r.exam}</td>
                <td className="p-4 font-display font-black text-primary">{r.rank}</td>
                <td className="p-4 hidden md:table-cell font-mono text-sm">{r.year}</td>
                <td className="p-4 hidden lg:table-cell text-sm">{r.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
