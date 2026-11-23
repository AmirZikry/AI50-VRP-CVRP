import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRunStore } from "@/store/runStore";
import type { RunResult } from "@/types";

const METAHEURISTICS = new Set(["Genetic Algorithm", "Ant Colony"]);

function getMethodType(r: RunResult): string {
	const hasOptimizer = r.optimizer && r.optimizer.toLowerCase() !== "none";
	if (hasOptimizer) return "Hybrid";
	if (METAHEURISTICS.has(r.solver)) return "Metaheuristic";
	return "Heuristic";
}

function formatMethodName(r: RunResult): string {
	const hasOptimizer = r.optimizer && r.optimizer.toLowerCase() !== "none";
	return hasOptimizer ? `${r.solver} + ${r.optimizer}` : r.solver;
}

export default function ResultsTable() {
	// Read the latest "Run all" batch (or switch to s.runs to include single runs)
	const batch = useRunStore((s) => s.batch);
	const status = useRunStore((s) => s.status);

	const rows = batch.map((r) => ({
		key: `${r.solver}-${r.optimizer ?? "none"}`,
		method: formatMethodName(r),
		type: getMethodType(r),
		meanGap: r.gap,
		bestGap: r.gap, // Replace with r.bestGap if your API returns multiple seeds
		runtime: (r as RunResult & { runtime?: number }).runtime ?? 0,
	}));

	return (
		<div className="w-full rounded overflow-hidden shadow-lg">
			<TableContainer
				component={Paper}
				sx={{ width: "100%", maxHeight: "65vh" }}
			>
				<Table
					stickyHeader
					sx={{ width: "100%", tableLayout: "auto" }}
					aria-label="results table"
				>
					<TableHead>
						<TableRow>
							<TableCell>Method</TableCell>
							<TableCell align="center">Type</TableCell>
							<TableCell align="center">Mean Gap</TableCell>
							<TableCell align="center">Best Gap</TableCell>
							<TableCell align="center">Runtime&nbsp;(s)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									align="center"
									sx={{ py: 4, color: "text.secondary" }}
								>
									{status === "running"
										? "Running all 15 solver combinations..."
										: 'No benchmark results yet.'}
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => (
								<TableRow
									key={row.key}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{row.method}
									</TableCell>
									<TableCell align="center">{row.type}</TableCell>
									<TableCell align="center">
										{row.meanGap.toFixed(2)}%
									</TableCell>
									<TableCell align="center">
										{row.bestGap.toFixed(2)}%
									</TableCell>
									<TableCell align="center">{row.runtime.toFixed(2)}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
