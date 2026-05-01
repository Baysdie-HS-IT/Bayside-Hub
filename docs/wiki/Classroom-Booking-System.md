# Classroom Booking System

## Overview

The classroom booking system is a visual scheduling tool in **Internal Tools** (`/hub/tools`).

It presents a floor-by-floor classroom map and clearly shows room state using color:

- **Booked** rooms: rose styling
- **Available** rooms: emerald styling

## What users can do

1. Switch between floors (Floor 1, Floor 2, Floor 3).
2. View rooms grouped by wing.
3. Toggle a room between booked and available states.
4. See booked vs available room counts for the selected floor.

## Current implementation notes

- UI component: `components/hub/classroom-booking-floor-plan.tsx`
- Embedded surface: `app/hub/tools/page.tsx`
- Coverage: `components/hub/classroom-booking-floor-plan.test.tsx`

## Next evolution

- Persist room bookings to Supabase
- Add time-window and date-based booking records
- Add conflict prevention and role-based booking permissions
- Add filters (capacity, room type, accessibility features)
