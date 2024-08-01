import AuroraBackground from "../atoms/aurora-background";
import { Toaster } from "../atoms/sonner";
import ChatHeader from "../organisms/chat-header";

const ChatWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    // <html lang="en">
    <div>
      <main className="flex w-screen">
        <AuroraBackground className="flex flex-col gap-2 w-full">
          <ChatHeader />
          {children}
        </AuroraBackground>
      </main>
      <Toaster />
    </div>
    // </html>
  );
};

export default ChatWrapper;
