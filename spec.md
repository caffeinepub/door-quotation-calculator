# Specification

## Summary
**Goal:** Support fractional dimension input in the door entry form and clear all door entries after sharing via WhatsApp.

**Planned changes:**
- Refactor `DoorEntryForm.tsx` and `DimensionInput.tsx` to accept free-text dimension input supporting both decimal (e.g., `79.25`) and fraction format (e.g., `79 1/4`, `79 3/8`)
- Stack inputs vertically (Height first, then Width), each full-width, with labels "Door Height (inches)" and "Door Width (inches)"
- Set placeholder text to `79 1/4 or 79.25` for height and `30 1/4 or 30.25` for width
- Add helper text below each input: "Enter as decimal (79.25) or fraction (79 1/4, 79 3/8)"
- Add a fraction-to-decimal parser that converts inputs like `79 1/4` or `79 3/8` into decimal values before passing to `findCatalogueSize`
- Show an error state for invalid or unparseable input
- Rename submit button to `+ Add Door Size` (full-width)
- Apply dark warm brown background to the form card (as shown in the reference image)
- After WhatsApp share is triggered, clear all door entries from the list in addition to resetting Customer Name and Mobile Number fields

**User-visible outcome:** Users can type door dimensions as fractions (e.g., `79 1/4`) or decimals in the add door form, and after sharing a quotation via WhatsApp, the entire form — including all door entries and customer fields — is reset for fresh input.
