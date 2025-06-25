'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiEdit, FiShield } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const cards = [
  {
    icon: <FiBookOpen className="text-blue-500 text-3xl" />,
    title: 'Learn',
    desc: 'Access a wide range of subjects and topics created by verified contributors and approved by administrators.',
    bg: 'bg-gradient-to-r from-blue-100 to-blue-300',
  },
  {
    icon: <FiEdit className="text-green-500 text-3xl" />,
    title: 'Share',
    desc: 'Contribute as a volunteer by creating educational topics that will be reviewed by our administrators.',
    bg: 'bg-gradient-to-r from-green-100 to-green-300',
  },
  {
    icon: <FiShield className="text-purple-500 text-3xl" />,
    title: 'Verify',
    desc: "Administrators ensure all content meets quality standards before it's published for learners.",
    bg: 'bg-gradient-to-r from-purple-100 to-purple-300',
  },
];

const Card = ({ icon, title, desc, bg, i }: any) => (
  <motion.div
    custom={i}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={cardVariants}
    className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
  >
    <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${bg}`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </motion.div>
);

const Testimonial = ({ quote, name, role }: any) => (
  <div className="bg-gradient-to-r from-yellow-100 to-orange-200 p-8 rounded-xl shadow-lg w-72 transform hover:scale-105 transition-all">
    <p className="text-gray-600 mb-4">{quote}</p>
    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
    <p className="text-sm text-gray-500">{role}</p>
  </div>
);

export default function HeroSection() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center bg-black px-4 sm:px-6 lg:px-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white pt-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Learn, Share, and Verify <span className="text-yellow-300">Knowledge</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-white max-w-2xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          An open educational platform where verified volunteers share knowledge, administrators ensure quality, and learners access trusted resources.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Link href="/study">
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105">
              Start Learning → 
            </button>
          </Link>
          <Link href="/volunteer">
            <button className="bg-amber-50 text-black border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Become a Contributor
            </button>
          </Link>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 mb-12">Our unique approach ensures high-quality educational content</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, i) => (
              <Card key={i} {...card} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white w-full mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-gray-600 mb-12">Hear from learners and contributors who have benefited from our platform</p>

          <div className="flex flex-wrap justify-center gap-8">
            <Testimonial
              quote="This platform helped me learn new topics quickly, and I love the verified content. It's reliable and well-organized!"
              name="John Doe"
              role="Learner"
            />
            <Testimonial
              quote="I enjoy sharing my knowledge and contributing to the educational community. The platform's process is simple and effective."
              name="Jane Smith"
              role="Contributor"
            />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-gray-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-12">
            Find answers to common questions about how to get started and use our platform.
          </p>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold text-gray-900">How do I become a contributor?</h4>
              <p className="text-gray-600">Simply sign up and follow the process to submit your content for review. Administrators will approve your content if it meets quality standards.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold text-gray-900">Is the content really verified?</h4>
              <p className="text-gray-600">Yes! All content is verified by our administrators to ensure it meets educational standards and is accurate.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold text-gray-900">Can I access the content for free?</h4>
              <p className="text-gray-600">Yes! All educational content is free to access for learners.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
