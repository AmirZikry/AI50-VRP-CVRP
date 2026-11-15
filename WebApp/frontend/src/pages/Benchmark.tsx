import ResultsTable from "@/components/ResultTable";
import { Card } from "@/components/Card";

function handleCSV(){
  return 'CSV'
}

export default function Benchmark() {
	return (
		<main className="p-6">
			<div className="flex flex-col items-center gap-6">
				<Card
					size="large"
					mainText="Benchmark Results"
					secondaryText="Same time budget, mean over seeds"
				>
					<ResultsTable />
				</Card>
				<button 
        onClick={handleCSV}
        className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded cursor-pointer">
					Export to CSV
				</button>
			</div>
		</main>
	);
}
