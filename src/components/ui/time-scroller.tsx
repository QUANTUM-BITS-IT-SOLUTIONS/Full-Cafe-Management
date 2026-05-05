import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TimeScrollerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TimeScroller({ value, onChange, disabled = false }: TimeScrollerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate time slots from 7:00 AM to 9:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        const m = minute.toString().padStart(2, "0");
        slots.push(`${h}:${m} ${ampm}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const currentIndex = timeSlots.indexOf(value);

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "up" && currentIndex > 0) {
      onChange(timeSlots[currentIndex - 1]);
    } else if (direction === "down" && currentIndex < timeSlots.length - 1) {
      onChange(timeSlots[currentIndex + 1]);
    }
  };

  const handleSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Input Display */}
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
          disabled 
            ? "bg-muted/50 border-muted cursor-not-allowed opacity-50" 
            : "bg-secondary border-border hover:border-vibe-purple/50"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Clock className="h-4 w-4 text-vibe-purple" />
        <span className={`font-mono ${value ? "text-foreground" : "text-muted-foreground"}`}>
          {value || "Select pickup time"}
        </span>
        <div className="ml-auto">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="max-h-64 overflow-y-auto">
            {timeSlots.map((time, index) => (
              <button
                key={time}
                onClick={() => handleSelect(time)}
                className={`w-full px-4 py-2 text-left font-mono text-sm transition-colors hover:bg-vibe-purple/10 ${
                  time === value ? "bg-vibe-purple/20 text-vibe-purple font-semibold" : "text-foreground"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
