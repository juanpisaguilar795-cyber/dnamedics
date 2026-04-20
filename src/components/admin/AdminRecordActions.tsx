"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminRecordActions({ recordId }: { recordId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await fetch(`/api/historial/${recordId}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  }

  return (
    <div className="flex items-center gap-2">
      <a href={`/admin/pacientes/${recordId}/editar`}
        className="text-xs text-brand-teal hover:text-brand-navy font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-teal/5">
        Editar
      </a>
      <button onClick={handleDelete} disabled={deleting}
        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50">
        {deleting ? "..." : "Eliminar"}
      </button>
    </div>
  );
}
