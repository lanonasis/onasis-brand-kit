
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from "lucide-react";

export function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            The foundation for creative teams management
          </h2>
          <p>
            Lyra is evolving to be more than just the models. It supports an entire set of APIs and platforms helping developers and businesses innovate.
          </p>
        </div>
        <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <h3 className="text-sm font-medium">Faaast</h3>
            </div>
            <p className="text-sm">It supports an entire helping developers and innovate.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="size-4" />
              <h3 className="text-sm font-medium">Powerful</h3>
            </div>
            <p className="text-sm">It supports an entire helping developers and businesses.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="size-4" />
              <h3 className="text-sm font-medium">Secure</h3>
            </div>
            <p className="text-sm">Security is baked into every layer.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4" />
              <h3 className="text-sm font-medium">Customizable</h3>
            </div>
            <p className="text-sm">Easily adapt features to your needs.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <h3 className="text-sm font-medium">Delightful</h3>
            </div>
            <p className="text-sm">Beautiful UI and smooth interactions.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pencil className="size-4" />
              <h3 className="text-sm font-medium">Creative</h3>
            </div>
            <p className="text-sm">Empower your team's creativity.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
