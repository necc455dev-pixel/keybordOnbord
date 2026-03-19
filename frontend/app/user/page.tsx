import LogoSquare from "components/logo-square";
import { getProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "User",
  description: "Keyboard-only profile and recent posts.",
};

const userProfile = {
  name: "Keyboard Seeker",
  handle: "@keeb.onboard",
  location: "Tokyo, Japan",
  bio: "写真は主役。キーボードだけを静かに集める。",
};

function PostGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="kob-card kob-dots mt-8 p-8 text-center">
        <p className="text-sm text-neutral-400">まだ投稿がありません。</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
      {products.map((product) => (
        <Link
          key={product.handle}
          href={`/keyboards/${product.handle}`}
          className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-black/40"
        >
          <Image
            src={product.featuredImage!.url}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        </Link>
      ))}
    </div>
  );
}

export default async function UserPage() {
  const products = await getProducts({
    sortKey: "CREATED_AT",
    reverse: true,
  });
  const latestPosts = products
    .filter((product) => product.featuredImage)
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-16">
      <section className="kob-card kob-dots mt-6 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex items-center gap-4">
            <div className="kob-border-neon flex h-16 w-16 items-center justify-center rounded-full bg-black/40">
              <LogoSquare />
            </div>
            <div>
              <p className="text-xl font-semibold">{userProfile.name}</p>
              <p className="text-sm text-neutral-400">
                {userProfile.handle} · {userProfile.location}
              </p>
            </div>
          </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
          <div>
            <span className="text-white">{products.length}</span> 投稿
          </div>
        </div>
          <div className="ml-auto hidden text-sm text-neutral-400 md:block">
            {userProfile.bio}
          </div>
        </div>
        <p className="mt-4 text-sm text-neutral-400 md:hidden">
          {userProfile.bio}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/keyboards" className="kob-btn">
            すべてのキーボード
          </Link>
          <Link href="/search" className="kob-btn kob-btn--cyan">
            探す
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="kob-title text-lg">Latest Posts</h2>
          <Link href="/keyboards" className="text-sm text-neutral-400">
            もっと見る →
          </Link>
        </div>
        <PostGrid products={latestPosts} />
      </section>
    </div>
  );
}
