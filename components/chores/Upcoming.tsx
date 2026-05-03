import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface UpcomingCardProps {
  title: string;
  description: string;
  timeTag: string;
  icon: LucideIcon;
  colorType?: "primary" | "secondary" | "tertiary";
  assignees?: string[];
} 

export default function UpcomingCard({
  title,
  description,
  timeTag,
  icon: Icon,
  colorType = "secondary",
  assignees = ["ME"],
}: UpcomingCardProps) {
  const themes = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    secondary: "bg-secondary/10 border-secondary/20 text-secondary",
    tertiary: "bg-tertiary/10 border-tertiary/20 text-tertiary",
  };

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className={`min-w-[260px] rounded-3xl p-6 border ${themes[colorType]}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white rounded-2xl shadow-sm">
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full text-text opacity-80">
          {timeTag}
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="text-lg font-extrabold tracking-tight text-text">{title}</h4>
        <p className="text-xs font-medium text-text-muted leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 flex -space-x-3">
        {assignees.map((name, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-background bg-primary-container flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-sm"
          >
            {name === "ME" ? (
              name
            ) : (
              <img src={name} alt="User" className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
