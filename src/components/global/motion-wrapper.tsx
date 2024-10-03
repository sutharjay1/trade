import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  initial?: any;
  animate?: any;
  exit?: any;
  className?: string;
  duration?: number;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  isVisible = true,
  initial = { opacity: 0.4 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  className = "",
  duration = 0.5,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{ duration: duration }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MotionWrapper;
