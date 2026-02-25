# Specification

## Summary
**Goal:** Update the QuotationView to display a unified pricing table with all four coating types side by side per door, a totals row, a Coating Type Summary section, and PDF export support.

**Planned changes:**
- Redesign the QuotationView table with columns: SR, DOOR SIZE, SQ.FT, SINGLE COATING, DOUBLE COATING, DOUBLE + SAGWAN, LAMINATE — each row showing all four coating prices for that door
- Add a Total row at the bottom summing sq.ft and each coating column, styled with a warm beige/amber background
- Style column headers with a dark brown background and white text
- Add a "Coating Type Summary" section below the table listing each coating type with its per-sq.ft rate and grand total
- Add print/PDF export functionality with print CSS that hides buttons and navigation, and includes customer name, mobile number, the full table, and the summary section
