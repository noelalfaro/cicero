import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function ExploreTableSkeleton() {
  return (
    <>
      <h2 className="my-2 text-2xl font-bold">Top Trenders</h2>
      <Table className="w-full gap-4">
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Is Active?</TableHead>
            <TableHead>Player Id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
            <TableCell>Loading</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
