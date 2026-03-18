import { getProducts } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Keyboards",
  description: "Keyboard-only feed. Images first, everything else second.",
};

export default async function KeyboardsPage() {
  const products = await getProducts({
    sortKey: "CREATED_AT",
    reverse: true,
  });

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-16">
      <header className="mt-6">
        <p className="kob-card__label">KEYBOARD FEED</p>
        <h1 className="kob-title mt-2 text-2xl md:text-3xl">
          画像だけのタイムライン
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-400">
          テキストより写真、機能より質感。キーボードの表情だけを並べる。
        </p>
      </header>

      {products.length ? (
        <section className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {products.map((product) => (
            <Link
              key={product.handle}
              href={`/keyboards/${product.handle}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-black/40"
            >
              <Image
                src={product.featuredImage?.url}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                priority={false}
              />
            </Link>
          ))}
        </section>
      ) : (
        <div className="kob-card kob-dots mt-10 p-8 text-center">
          <p className="text-sm text-neutral-400">まだ投稿がありません。</p>
        </div>
      )}
    </div>
  );
}
