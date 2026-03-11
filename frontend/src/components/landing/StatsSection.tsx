import { motion } from "framer-motion";

const stats = [
  { value: "10M+", label: "Emails Scanned" },
  { value: "99.7%", label: "Detection Rate" },
  { value: "50K+", label: "Active Users" },
  { value: "<2s", label: "Avg. Scan Time" },
];

export const StatsSection = () => (
  <div className="py-24">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">{s.value}</div>
            <div className="text-muted-foreground text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
