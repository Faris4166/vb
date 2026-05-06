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
  X,
  Search
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
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
              <LayoutGrid className="h-10 w-10 text-yellow-400" /> จัดการหมวดหมู่
            </h1>
          </div>
          
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาหมวดหมู่..."
              className="pl-10 bg-white/5 border-white/10 h-11 rounded-xl focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Form Section */}
          <div className="md:col-span-1">
            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden">
              <div className="h-1 bg-yellow-400 w-full" />
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase italic text-white">เพิ่มหมวดหมู่</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">ใส่ชื่อหมวดหมู่ใหม่ที่ต้องการเพิ่มเข้าสู่ระบบ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <Input 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="เช่น สยองขวัญ, แฟนตาซี"
                    className="bg-black/40 border-white/10 h-12 font-bold focus:border-yellow-400/50"
                  />
                  <Button 
                    disabled={saving}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase h-12 rounded-xl shadow-lg shadow-yellow-400/10 transition-all hover:scale-[1.02]"
                  >
                    {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Plus className="mr-2 h-5 w-5" /> เพิ่มหมวดหมู่</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* List Section */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 text-gray-500 italic uppercase font-black text-xs gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
                กำลังโหลดข้อมูล...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                    <div className="flex-1">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2">
                           <Input 
                             value={editName}
                             onChange={(e) => setEditName(e.target.value)}
                             className="bg-black border-yellow-400/50 h-11 font-bold focus:ring-1 focus:ring-yellow-400"
                             autoFocus
                             onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(cat.id)}
                           />
                           <div className="flex gap-1">
                             <Button size="icon" onClick={() => handleUpdateCategory(cat.id)} className="bg-green-500 hover:bg-green-600 h-11 w-11 shrink-0 rounded-xl shadow-lg shadow-green-500/20">
                                <Save className="h-5 w-5 text-white" />
                             </Button>
                             <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-11 w-11 shrink-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10">
                                <X className="h-5 w-5" />
                             </Button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xs uppercase tracking-tighter">
                            {cat.name.charAt(0)}
                          </div>
                          <span className="text-lg font-black uppercase italic tracking-tight">{cat.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {editingId !== cat.id && (
                      <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(cat)} className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 h-11 w-11 rounded-xl transition-all">
                          <Edit2 className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 h-11 w-11 rounded-xl transition-all">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                )) : (
                   <div className="flex flex-col items-center justify-center p-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 text-center space-y-4">
                      <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-gray-400 font-black uppercase italic tracking-widest">ไม่พบหมวดหมู่ที่ค้นหา</p>
                        <p className="text-[10px] text-gray-600 uppercase font-bold mt-1">ลองใช้คำค้นหาอื่น หรือเพิ่มหมวดหมู่ใหม่ที่ด้านข้าง</p>
                      </div>
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
