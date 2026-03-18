import Prose from "components/prose";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct } from "lib/shopify";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function KeyboardDetailPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-16">
      <Link
        href="/keyboards"
        className="mt-6 inline-flex text-sm text-neutral-400 hover:text-white"
      >
        ← 一覧に戻る
      </Link>

      <article className="kob-card kob-dots mt-4 overflow-hidden p-0">
        <header className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3">
          <div className="kob-border-neon flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-xs">
            KB
          </div>
          <div>
            <p className="text-sm font-semibold">{product.title}</p>
            <p className="text-xs text-neutral-400">Keyboard Onboard</p>
          </div>
          <span className="ml-auto text-xs text-neutral-500">
            {new Date(product.updatedAt).toLocaleDateString("ja-JP")}
          </span>
        </header>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="relative aspect-square bg-black">
            <Image
              src={product.featuredImage?.url}
              alt={product.featuredImage?.altText || product.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
              priority={true}
            />
          </div>

          <div className="flex flex-col gap-5 p-5">
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <span className="kob-badge">NEW</span>
              <span>{product.availableForSale ? "In Stock" : "Sold Out"}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              {product.descriptionHtml ? (
                <Prose
                  className="text-sm leading-relaxed text-neutral-300"
                  html={product.descriptionHtml}
                />
              ) : (
                <p className="text-sm text-neutral-300">
                  {product.description}
                </p>
              )}
            </div>

            {product.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-auto flex flex-wrap gap-3">
              <Link href="/keyboards" className="kob-btn kob-btn--cyan">
                他の投稿を見る
              </Link>
              <Link href={`/product/${product.handle}`} className="kob-btn">
                このキーボードを買う
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
