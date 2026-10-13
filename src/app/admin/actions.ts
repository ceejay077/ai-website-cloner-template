"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkCredentials, clearFailures, endSession, isLockedOut, noteFailure, requireAdmin, startSession } from "@/lib/server/auth";
import { clientIp } from "@/lib/server/request";
import { deleteEnquiry, ENQUIRY_STATUSES, setEnquiryStatus, type EnquiryStatus } from "@/lib/server/store";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const client = clientIp(await headers());
  if (isLockedOut(client)) return { error: "Too many failed attempts. Try again in 15 minutes." };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  if (!checkCredentials(email, password)) {
    noteFailure(client);
    return { error: "Incorrect email or password." };
  }
  clearFailures(client);
  await startSession(email);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export async function updateEnquiryStatus(id: number, status: EnquiryStatus): Promise<void> {
  await requireAdmin();
  if (!ENQUIRY_STATUSES.includes(status)) return;
  setEnquiryStatus(id, status);
  revalidatePath("/admin", "layout");
}

export async function removeEnquiry(id: number): Promise<void> {
  await requireAdmin();
  deleteEnquiry(id);
  revalidatePath("/admin", "layout");
  redirect("/admin/enquiries");
}
