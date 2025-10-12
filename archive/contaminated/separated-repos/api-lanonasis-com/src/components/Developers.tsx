import { motion } from 'framer-motion';
import { Code, Terminal, Rocket, Zap, Globe, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Developers = () => {
  const { t } = useTranslation();
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t('developers_page.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('developers_page.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Code,
              title: t('developers_page.ai_sdk.title'),
              description: t('developers_page.ai_sdk.description'),
              link: 'https://api.lanonasis.com/ai-sdk'
            },
            {
              icon: Terminal,
              title: t('developers_page.memory_service.title'),
              description: t('developers_page.memory_service.description'),
              link: 'https://api.lanonasis.com/memory'
            },
            {
              icon: Rocket,
              title: t('developers_page.vortexcore.title'),
              description: t('developers_page.vortexcore.description'),
              link: 'https://api.lanonasis.com/vortexcore'
            },
            {
              icon: Zap,
              title: t('developers_page.realtime_apis.title'),
              description: t('developers_page.realtime_apis.description'),
              link: 'https://api.lanonasis.com/docs'
            },
            {
              icon: Globe,
              title: t('developers_page.global_scale.title'),
              description: t('developers_page.global_scale.description'),
              link: 'https://api.lanonasis.com/regions'
            },
            {
              icon: Users,
              title: t('developers_page.community.title'),
              description: t('developers_page.community.description'),
              link: 'https://api.lanonasis.com/community'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => window.open(feature.link, '_blank')}
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">{t('developers_page.get_started_title')}</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.open('https://api.lanonasis.com/docs', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              {t('developers_page.view_documentation')}
            </button>
            <button
              onClick={() => window.open('https://api.lanonasis.com/signup', '_blank')}
              className="bg-transparent border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg transition-colors"
            >
              {t('developers_page.sign_up_free')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Developers;