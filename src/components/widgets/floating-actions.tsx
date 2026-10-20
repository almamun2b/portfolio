import { getProfile } from "@/server/dal/profile";
import { ChatbotLauncher } from "./chatbot/chatbot-launcher";
import { WhatsAppButton } from "./whatsapp-button";

/** Bottom-right stack: assistant above, WhatsApp below. Sits under dialogs. */
export async function FloatingActions() {
  const profile = await getProfile();
  const whatsappHref = `https://wa.me/${profile.whatsapp}`;
  return (
    <div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <ChatbotLauncher contact={{ email: profile.email, whatsappHref }} />
      <WhatsAppButton number={profile.whatsapp} />
    </div>
  );
}
