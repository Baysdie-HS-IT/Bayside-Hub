"use client";

import { useState } from "react";

type Classroom = Readonly<{
  id: string;
  name: string;
  capacity: number;
}>;

type FloorZone = Readonly<{
  name: string;
  rooms: readonly Classroom[];
}>;

type FloorPlan = Readonly<{
  id: string;
  label: string;
  description: string;
  zones: readonly FloorZone[];
}>;

const floorPlans: readonly FloorPlan[] = [
  {
    id: "floor-1",
    label: "Floor 1",
    description: "Main entrance level with foundational classrooms.",
    zones: [
      {
        name: "North Wing",
        rooms: [
          { id: "A-101", name: "Language Arts", capacity: 30 },
          { id: "A-103", name: "World History", capacity: 28 }
        ]
      },
      {
        name: "South Wing",
        rooms: [
          { id: "A-112", name: "Biology Lab", capacity: 24 },
          { id: "A-114", name: "Student Support", capacity: 20 }
        ]
      }
    ]
  },
  {
    id: "floor-2",
    label: "Floor 2",
    description: "STEM and project spaces.",
    zones: [
      {
        name: "East Wing",
        rooms: [
          { id: "B-201", name: "Calculus", capacity: 30 },
          { id: "B-203", name: "Physics Lab", capacity: 26 }
        ]
      },
      {
        name: "West Wing",
        rooms: [
          { id: "B-210", name: "Design Studio", capacity: 22 },
          { id: "B-212", name: "Computer Science", capacity: 28 }
        ]
      }
    ]
  },
  {
    id: "floor-3",
    label: "Floor 3",
    description: "Arts, media, and seminar spaces.",
    zones: [
      {
        name: "North Wing",
        rooms: [
          { id: "C-301", name: "Visual Arts", capacity: 24 },
          { id: "C-303", name: "Media Lab", capacity: 20 }
        ]
      },
      {
        name: "South Wing",
        rooms: [
          { id: "C-312", name: "Music Studio", capacity: 18 },
          { id: "C-314", name: "Seminar Room", capacity: 16 }
        ]
      }
    ]
  }
] as const;

const initialBookings: Record<string, boolean> = {
  "A-103": true,
  "B-203": true,
  "C-301": true
};

export function ClassroomBookingFloorPlan() {
  const [selectedFloorId, setSelectedFloorId] = useState<FloorPlan["id"]>(floorPlans[0].id);
  const [bookings, setBookings] = useState<Record<string, boolean>>(initialBookings);
  const selectedFloor = floorPlans.find((floor) => floor.id === selectedFloorId) ?? floorPlans[0];
  const rooms = selectedFloor.zones.flatMap((zone) => zone.rooms);
  const bookedCount = rooms.filter((room) => Boolean(bookings[room.id])).length;
  const availableCount = rooms.length - bookedCount;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" aria-label="Floor selector">
        {floorPlans.map((floor) => {
          const selected = floor.id === selectedFloor.id;

          return (
            <button
              aria-pressed={selected}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                selected
                  ? "border-bay-teal bg-bay-mist text-bay-teal"
                  : "border-slate-300 bg-white text-slate-700 hover:border-bay-teal hover:text-bay-teal"
              }`}
              key={floor.id}
              onClick={() => setSelectedFloorId(floor.id)}
              type="button"
            >
              {floor.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">Available</span>
        <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-rose-700">Booked</span>
        <span className="text-slate-500">{selectedFloor.description}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {selectedFloor.zones.map((zone) => (
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" key={zone.name}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-bay-navy">{zone.name}</h3>
              <span className="text-xs text-slate-500">{zone.rooms.length} rooms</span>
            </div>
            <div className="space-y-3">
              {zone.rooms.map((room) => {
                const isBooked = Boolean(bookings[room.id]);

                return (
                  <button
                    aria-label={`${room.id} ${room.name} is ${isBooked ? "booked" : "available"}`}
                    aria-pressed={isBooked}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      isBooked
                        ? "border-rose-300 bg-rose-50 hover:border-rose-400"
                        : "border-emerald-300 bg-emerald-50 hover:border-emerald-400"
                    }`}
                    key={room.id}
                    onClick={() =>
                      setBookings((previous) => ({
                        ...previous,
                        [room.id]: !previous[room.id]
                      }))
                    }
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${isBooked ? "text-rose-700" : "text-emerald-700"}`}>{room.id}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                          isBooked
                            ? "border-rose-300 bg-rose-100 text-rose-700"
                            : "border-emerald-300 bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{room.name}</p>
                    <p className="mt-1 text-xs text-slate-500">Capacity {room.capacity}</p>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        {bookedCount} of {rooms.length} rooms are booked on {selectedFloor.label}. {availableCount} rooms remain available.
      </p>
    </div>
  );
}
