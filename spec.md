# Specification

## Summary
**Goal:** Move customer name and mobile number collection to a dedicated start screen, and remove those columns from the door entries table.

**Planned changes:**
- Add a new customer info screen as the first screen of the app, with fields for customer name and mobile number and a "Continue"/"Start" button
- User must complete and submit the customer info screen before accessing the door entry form and door list view
- Store the submitted customer name and mobile in app state and pass them through to the quotation and WhatsApp share output
- Remove the Customer and Mobile columns from the DoorList table so it only shows Sr, Size, and pricing columns

**User-visible outcome:** When the app loads, users first see a screen to enter their name and mobile number. After submitting, they proceed to the door entry and list view, which no longer shows customer/mobile columns per row. The customer info is still included in the generated quotation and WhatsApp output.
