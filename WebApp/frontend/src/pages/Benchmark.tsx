 import ResultsTable from "@/components/ResultTable";
   import { Card } from "@/components/Card";

   export default function Benchmark() {
     return (
       <main className="p-6">
         <Card size="large" mainText="Benchmark Results" secondaryText="Same time budget, mean over seeds">
           <ResultsTable />
         </Card>
       </main>
     );
   }
   