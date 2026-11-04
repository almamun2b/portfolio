import { getProfile } from "@/server/modules/content/profile.service";
import { ChatbotLauncher } from "./chatbot/chatbot-launcher";
import { FloatingDock } from "./floating-dock";
import { WhatsAppButton } from "./whatsapp-button";

/** Bottom-right stack: assistant above, WhatsApp below. Sits under dialogs. */
export async function FloatingActions() {
  const profile = await getProfile();
  const whatsappHref = `https://wa.me/${profile.whatsapp}`;
  return (
    <FloatingDock>
      <ChatbotLauncher contact={{ email: profile.email, whatsappHref }} />
      <WhatsAppButton number={profile.whatsapp} />
    </FloatingDock>
  );
}
