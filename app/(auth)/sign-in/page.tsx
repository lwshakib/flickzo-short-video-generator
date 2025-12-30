import { Video } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-lg shadow-primary/20">
              <Video className="size-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Flickzo
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src="/signin-bg.png"
          alt="Short Video Generation"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2">Create cinematic short videos in seconds.</h2>
          <p className="text-white/80 text-lg">AI-powered generation tailored for your brand.</p>
        </div>
      </div>
    </div>
  );
}
