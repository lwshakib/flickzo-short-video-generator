import { Video } from "lucide-react";
import { SignUpForm } from "@/components/signup-form";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        <Image
          src="/signup-bg.png"
          alt="Future of Content Creation"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          fill
          sizes="50vw"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Join the future of content creation.
          </h2>
          <p className="text-lg text-white/80">
            Harness the power of AI to tell your story.
          </p>
        </div>
      </div>
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
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
