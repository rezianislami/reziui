import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";

type PageProps = { params: Promise<{ slug?: string[] }> };

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <article className="prose">
      <h1 className="text-3xl font-semibold">{page.data.title}</h1>
      {page.data.description && (
        <p className="mt-2 text-muted-foreground">{page.data.description}</p>
      )}
      <div className="mt-8">
        <MDX />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
