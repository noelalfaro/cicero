import { fetchNewsArticles } from "@/app/lib/data";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/app/lib/definitions";

export default async function Articles() {
  const data: NewsArticle[] = await fetchNewsArticles();

  return (
    <>
      <h2 className="my-2 text-2xl font-bold">News</h2>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
        {data.map((result: NewsArticle) => (
          <Link href={result.url} key={result.url}>
            <Card className="bg-muted transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {result.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Button className="font-semibold capitalize">
                  {result.source}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
