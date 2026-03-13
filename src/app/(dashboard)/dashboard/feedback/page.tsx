import { getCurrentUser } from "@/lib/auth";
import FeedbackBoard from "@/components/feedback/feedback-board";

export default async function FeedbackPage() {
  const user = await getCurrentUser();
  return <FeedbackBoard companyId={user?.companyId!} />;
}
