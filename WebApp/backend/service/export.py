from ..schemas.solutionSchema import ExportRow

from io import BytesIO
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter



def build_excel_bytes(results: list[ExportRow], instance, best_cost: float) -> bytes:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Benchmark Results"
    ws.views.sheetView[0].showGridLines = True

    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    zebra_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Segoe UI", size=10, color="0F172A")
    title_font = Font(name="Segoe UI", size=15, bold=True, color="1E293B")
    subtitle_font = Font(name="Segoe UI", size=10, italic=True, color="64748B")
    thin_border = Border(
        left=Side(style="thin", color="CBD5E1"),
        right=Side(style="thin", color="CBD5E1"),
        top=Side(style="thin", color="CBD5E1"),
        bottom=Side(style="thin", color="CBD5E1"),
    )

    ws.merge_cells("A1:G1")
    ws["A1"] = f"CVRP Benchmark Report: {instance.name}"
    ws["A1"].font = title_font

    ws["A2"] = f"Dimension: {instance.dimension - 1} customers | Vehicle Capacity: {instance.capacity} | Best-Known Cost: {best_cost}"
    ws["A2"].font = subtitle_font

    headers = ["Config Type", "Base Solver", "Optimizer", "Total Cost", "Optimality Gap", "Runtime (s)", "Valid"]
    row_idx = 4
    for col_idx, header in enumerate(headers, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin_border
        cell.alignment = Alignment(horizontal="center" if col_idx > 3 else "left", vertical="center")
    ws.row_dimensions[row_idx].height = 26

    for item in results:
        row_idx += 1
        row_cells = [
            ws.cell(row=row_idx, column=1, value=item.type or ("Hybrid" if item.optimizer else "Standalone")),
            ws.cell(row=row_idx, column=2, value=item.solver),
            ws.cell(row=row_idx, column=3, value=item.optimizer or "None"),
            ws.cell(row=row_idx, column=4, value=item.cost if item.cost is not None else "Error"),
            ws.cell(row=row_idx, column=5, value=(item.gap / 100.0) if item.gap is not None else "Error"),
            ws.cell(row=row_idx, column=6, value=item.runtime),
            ws.cell(row=row_idx, column=7, value="Valid" if item.valid else "Violation"),
        ]
        is_even = row_idx % 2 == 0
        for c_idx, cell in enumerate(row_cells, 1):
            cell.font = data_font
            cell.border = thin_border
            if is_even:
                cell.fill = zebra_fill
            if c_idx in (1, 2, 3):
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif c_idx == 4:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                if isinstance(cell.value, (int, float)):
                    cell.number_format = "#,##0.00"
            elif c_idx == 5:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                if isinstance(cell.value, (int, float)):
                    cell.number_format = "+0.00%;-0.00%;0.00%"
            elif c_idx == 6:
                cell.alignment = Alignment(horizontal="right", vertical="center")
                if isinstance(cell.value, (int, float)):
                    cell.number_format = "0.000"
            else:
                cell.alignment = Alignment(horizontal="center", vertical="center")

    for col in ws.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        ws.column_dimensions[get_column_letter(col[0].column)].width = max(max_len + 4, 15)

    buffer = BytesIO()
    wb.save(buffer)
    return buffer.getvalue()