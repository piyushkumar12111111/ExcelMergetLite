import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExcelViewerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  analysis: string;
  onDownload: () => void;
}

export function ExcelViewer({ data, analysis, onDownload }: ExcelViewerProps) {
  if (!data.length) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Merged Data</h2>
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Excel
        </Button>
      </div>

      <ScrollArea className="h-[400px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={header}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {analysis && (
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Analysis</h2>
          <div className="prose prose-sm max-w-none p-4 bg-muted rounded-md">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}
