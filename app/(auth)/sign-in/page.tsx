import { Video } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-background flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <div className="bg-primary text-primary-foreground shadow-primary/20 flex size-8 items-center justify-center rounded-lg shadow-lg">
              <Video className="size-5" />
            </div>
            <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
              Flickzo
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        <Image
          src="/signin-bg.png"
          alt="Short Video Generation"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          fill
          sizes="50vw"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Create cinematic short videos in seconds.
          </h2>
          <p className="text-lg text-white/80">
            AI-powered generation tailored for your brand.
          </p>
        </div>
      </div>
    </div>
  );
}
