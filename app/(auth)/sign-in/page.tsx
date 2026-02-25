import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import Image from "next/image";

/**
 * SignInPage component.
 * Provides the user interface for existing users to log in.
 */
export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left section: Login form and branding */}
      <div className="bg-background flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            {/* Modular LoginForm component handling state and authentication */}
            <LoginForm />
          </div>
        </div>
      </div>
      {/* Right section: Visual creative background for desktop visitors */}
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
