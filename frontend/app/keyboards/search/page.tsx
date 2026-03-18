import { getProducts } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Keyboard Search",
  description: "Search keyboards with a calm, image-first experience.",
};

export default async function KeyboardSearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const searchValue = (searchParams?.q as string) || "";
  const products = await getProducts({
    sortKey: "CREATED_AT",
    reverse: true,
    query: searchValue,
  });

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-16">
      <style jsx>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <header className="mt-6">
        <p className="kob-card__label">SEARCH</p>
        <h1 className="kob-title mt-2 text-2xl md:text-3xl">
          キーボード検索
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-400">
          文字で探すけど、結果は写真だけ。静かな発見体験を。
        </p>
      </header>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          name="q"
          defaultValue={searchValue}
          placeholder="例: 75%, alice, split..."
          className="kob-input flex-1"
        />
        <button type="submit" className="kob-btn kob-btn--cyan">
          探す
        </button>
      </form>

      {searchValue ? (
        <p className="mt-4 text-sm text-neutral-400">
          {products.length ? (
            <>
              「<span className="text-white">{searchValue}</span>」の結果:
              {products.length}件
            </>
          ) : (
            <>
              「<span className="text-white">{searchValue}</span>」に一致する
              投稿はありません
            </>
          )}
        </p>
      ) : null}

      {products.length ? (
        <section className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {products.map((product, index) => (
            <Link
              key={product.handle}
              href={`/keyboards/${product.handle}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-black/40"
              style={{
                animation: "floatIn 0.55s ease-out both",
                animationDelay: `${Math.min(index, 8) * 60}ms`,
              }}
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
          <p className="text-sm text-neutral-400">
            まだ検索結果がありません。
          </p>
        </div>
      )}
    </div>
  );
}
