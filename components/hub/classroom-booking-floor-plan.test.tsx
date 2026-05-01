import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClassroomBookingFloorPlan } from "@/components/hub/classroom-booking-floor-plan";

describe("ClassroomBookingFloorPlan", () => {
  it("shows only rooms on the selected floor", () => {
    render(<ClassroomBookingFloorPlan />);

    expect(screen.getByRole("button", { name: /A-101/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /B-201/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Floor 2" }));

    expect(screen.getByRole("button", { name: /B-201/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /A-101/i })).not.toBeInTheDocument();
  });

  it("toggles room status between available and booked", () => {
    render(<ClassroomBookingFloorPlan />);

    const availableRoom = screen.getByRole("button", { name: /A-101 .*available/i });
    expect(availableRoom).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(availableRoom);

    const bookedRoom = screen.getByRole("button", { name: /A-101 .*booked/i });
    expect(bookedRoom).toHaveAttribute("aria-pressed", "true");
  });
});
