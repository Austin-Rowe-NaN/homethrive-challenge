import {type Dispatch, type SetStateAction} from "react";
import { DateTime } from "luxon";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date, setDate }: { date: Date | undefined; setDate: Dispatch<SetStateAction<Date | undefined>> }) {

  return (
    <Popover>
      <div className="flex flex-row gap-1 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            setDate((prev) =>
              prev
                ? DateTime.fromJSDate(prev).minus({ days: 1 }).toJSDate()
                : prev
            )
          }
        >
          <ChevronLeft />
        </Button>
        <PopoverTrigger asChild>
          <Button variant="default" data-empty={!date}>
            <CalendarIcon />
            {date ? (
              DateTime.fromJSDate(date).toFormat("MM/dd/yyyy")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            setDate((prev) =>
              prev
                ? DateTime.fromJSDate(prev).plus({ days: 1 }).toJSDate()
                : prev
            )
          }
        >
          <ChevronRight />
        </Button>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
