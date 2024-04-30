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

export default async function Articles() {
  const data: any = await fetchNewsArticles();
  const result = await data.json();
  // console.log(result);

  return (
    <>
      <h2 className="my-2 text-2xl font-bold">News</h2>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
        {result.map((result: any) => (
          <Link href={result.url} key={result.url}>
            <Card className="border-none bg-secondary hover:bg-secondary/10 hover:ease-in-out">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {result.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Button className="font-semibold uppercase">
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
