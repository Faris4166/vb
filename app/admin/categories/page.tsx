"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  Loader2,
  Save,
  Edit2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) console.error("Error fetching categories:", error);
    else setCategories(data || []);
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setSaving(true);
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCategory.trim() })
      .select()
      .single();

    if (error) {
      alert("Error adding category: " + error.message);
    } else {
      setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory("");
    }
    setSaving(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?")) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting category: " + error.message);
    } else {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) return;

    setSaving(true);
    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim() })
      .eq('id', id);

    if (error) {
      alert("Error updating category: " + error.message);
    } else {
      setCategories(categories.map(c => c.id === id ? { ...c, name: editName.trim() } : c));
      setEditingId(null);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
            <LayoutGrid className="h-10 w-10 text-yellow-400" /> จัดการหมวดหมู่
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="md:col-span-1">
            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase italic text-white">เพิ่มหมวดหมู่ใหม่</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-gray-500">ใส่ชื่อหมวดหมู่ที่ต้องการเพิ่ม</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <Input 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="เช่น สยองขวัญ, ตลก"
                    className="bg-black/40 border-white/10 h-12 font-bold"
                  />
                  <Button 
                    disabled={saving}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase h-12 rounded-xl"
                  >
                    {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Plus className="mr-2 h-5 w-5" /> เพิ่มเลย</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 text-gray-500 italic uppercase font-black text-xs gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
                กำลังโหลดหมวดหมู่...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex-1">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2">
                           <Input 
                             value={editName}
                             onChange={(e) => setEditName(e.target.value)}
                             className="bg-black border-yellow-400/50 h-10 font-bold"
                             autoFocus
                           />
                           <Button size="icon" onClick={() => handleUpdateCategory(cat.id)} className="bg-green-500 hover:bg-green-600 h-10 w-10 shrink-0">
                              <Save className="h-4 w-4" />
                           </Button>
                           <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-10 w-10 shrink-0">
                              <X className="h-4 w-4" />
                           </Button>
                        </div>
                      ) : (
                        <span className="text-lg font-black uppercase italic tracking-tight">{cat.name}</span>
                      )}
                    </div>
                    
                    {editingId !== cat.id && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(cat)} className="text-gray-500 hover:text-white hover:bg-white/10 h-10 w-10">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(cat.id)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-10 w-10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {categories.length === 0 && (
                   <div className="text-center p-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                      <p className="text-gray-500 font-black uppercase italic">ยังไม่มีหมวดหมู่ในระบบ</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
