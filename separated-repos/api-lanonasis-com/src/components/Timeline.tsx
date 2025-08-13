import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Rocket,
  Brain,
  Globe2,
  Award,
  Users2,
  Sparkles,
} from 'lucide-react';

interface TimelineMilestoneProps {
  milestone: {
    year: string;
    title: string;
    description: string;
    icon: React.ElementType;
  };
  index: number;
}

const timelineMilestones = [
  {
    year: '2020',
    title: 'The Genesis',
    description: 'Founded with a vision to transform African tech landscape through innovative solutions.',
    icon: Rocket,
  },
  {
    year: '2021',
    title: 'VortexCore AI Launch',
    description: 'Introduced our flagship AI platform, revolutionizing business intelligence and compliance.',
    icon: Brain,
  },
  {
    year: '2022',
    title: 'Regional Expansion',
    description: 'Expanded operations to 5 African countries, serving over 100 enterprise clients.',
    icon: Globe2,
  },
  {
    year: '2023',
    title: 'Innovation Award',
    description: 'Recognized as "Most Innovative FinTech Solution" at Africa Tech Summit.',
    icon: Award,
  },
  {
    year: '2024',
    title: 'Strategic Partnerships',
    description: 'Formed key partnerships with major financial institutions across the continent.',
    icon: Users2,
  },
  {
    year: '2025',
    title: 'Global Recognition',
    description: 'Achieved unicorn status and expanded services to international markets.',
    icon: Sparkles,
  },
];

const TimelineMilestone: React.FC<TimelineMilestoneProps> = ({ milestone, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
        <milestone.icon className="w-6 h-6 text-secondary" />
      </div>
      <div className="flex-1">
        <div className="text-xl font-bold text-secondary mb-1">{milestone.year}</div>
        <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
        <p className="text-gray-400">{milestone.description}</p>
      </div>
    </motion.div>
  );
};

const Timeline: React.FC = () => {
  return (
    <div className="relative mt-20">
      <div className="absolute left-0 right-0 h-px bg-secondary/20 top-6 md:top-24" />
      <div className="grid gap-12 md:gap-0 md:grid-cols-6">
        {timelineMilestones.map((milestone, index) => (
          <div key={index} className="relative px-4">
            <TimelineMilestone milestone={milestone} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;