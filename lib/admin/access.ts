import type { User } from "@supabase/supabase-js";

import { accountEmailLabel } from "@/lib/auth/session-kind";
import { getAdminOperatorEmails } from "@/lib/admin/config";

export function isOperatorUser(user: User | null | undefined): boolean {
  const email = accountEmailLabel(user)?.toLowerCase();
  if (!email) {
    return false;
  }

  const allowlist = getAdminOperatorEmails();
  return allowlist.includes(email);
}
