
import { supabase } from "@/lib/supabaseClient";
import { AuditLog } from "@/types";

// Fetch audit logs (all users, RLS enforced)
export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((log: any) => ({
    id: log.id,
    userId: log.user_id,
    action: log.action,
    targetId: log.target_id || undefined,
    targetType: log.target_type || undefined,
    details: log.details || undefined,
    timestamp: new Date(log.timestamp),
  }));
}

// Insert audit log (admin only)
export async function addAuditLog(entry: {
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: string;
}): Promise<AuditLog> {
  const { data, error } = await supabase
    .from("audit_logs")
    .insert([entry])
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    userId: data.user_id,
    action: data.action,
    targetId: data.target_id || undefined,
    targetType: data.target_type || undefined,
    details: data.details || undefined,
    timestamp: new Date(data.timestamp),
  };
}
