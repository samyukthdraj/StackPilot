import { ResetPasswordContainer } from "@/components/auth/reset-password-container";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContainer />
    </Suspense>
  );
}
