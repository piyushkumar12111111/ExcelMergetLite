import { ExcelMerger } from "@/components/excel-merger";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Excel Sheet Merger</h1>
      <ExcelMerger />
    </div>
  );
}
