import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  method: string,
  type: string,
  meanGap: number,
  bestGap: number,
  Runtime: number,
) {
  return { method, type, meanGap, bestGap, Runtime };
}

const rows = [
  createData('Nearest Neighbour','Heuristic', 5.1, 5.0, 24),
  createData('Ant Colony','Metaheuristic', 4.8, 4.8, 37),
  createData('Nearest Neighbour + Tabu Search','Hybrid', 3.5, 3.5, 24),
];

export default function ResultsTable() {
  return (
    <div className="max-w-3xl rounded overflow-hidden shadow-lg">
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
          {rows.map((row) => (
            <TableRow
              key={row.method}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.method}
              </TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">{row.meanGap}%</TableCell>
              <TableCell align="center">{row.bestGap}%</TableCell>
              <TableCell align="center">{row.Runtime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
