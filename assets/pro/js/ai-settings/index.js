/**
 * CF7 Mate AI Provider Settings
 * Uses same dashboard header/wrapper as main CF7 Mate dashboard
 *
 * @package CF7_Mate
 * @since   3.0.0
 */
(function() {
  'use strict';

  const { createElement: h, useState, useEffect } = wp.element;
  const { Spinner } = wp.components;
  const { __ } = wp.i18n;
  const apiFetch = wp.apiFetch;

  const config = window.cf7mAISettings || {};
  const providers = config.providers || {};
  const dashboardUrl = config.dashboardUrl || 'admin.php?page=cf7-mate-dashboard';
  const modulesUrl = config.modulesUrl || dashboardUrl + '#/features';
  const docsUrl = config.docsUrl || 'https://divipeople.com/docs/cf7-mate/';
  const pricingUrl = config.pricingUrl || 'admin.php?page=cf7-mate-pricing';
  const version = config.version || '3.0.0';
  const isPro = config.isPro || false;

  // Platform metadata
  const platformInfo = {
    openai: {
      company: 'OpenAI',
      desc: 'Best for general-purpose form generation. Fast, accurate, and cost-effective.',
      color: '#10a37f',
    },
    anthropic: {
      company: 'Anthropic',
      desc: 'Excellent at structured output and following templates precisely.',
      color: '#d97706',
    },
    grok: {
      company: 'xAI',
      desc: 'Real-time knowledge AI by xAI. Good balance of speed and quality.',
      color: '#000000',
    },
    kimi: {
      company: 'Moonshot AI',
      desc: 'Great for multilingual forms. Popular choice for Chinese users.',
      color: '#6366f1',
    },
  };

  // Icons
  const DocsIcon = () => h('svg', {
    className: 'dcs-nav-icon dcs-nav-icon--docs',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
    h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    h('polyline', { points: '14 2 14 8 20 8' }),
    h('line', { x1: 8, y1: 13, x2: 16, y2: 13 }),
    h('line', { x1: 8, y1: 17, x2: 16, y2: 17 }),
    h('line', { x1: 8, y1: 9, x2: 12, y2: 9 })
  );

  const CrownIcon = () => h('svg', {
    className: 'dcs-nav-icon dcs-nav-icon--crown',
    viewBox: '0 0 24 24',
    fill: 'currentColor',
  }, h('path', { d: 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z' }));

  const CheckIcon = () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 },
    h('polyline', { points: '20 6 9 17 4 12' })
  );

  const TrashIcon = () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    h('path', { d: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14' })
  );

  const LinkIcon = () => h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    h('path', { d: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3' })
  );

  // Header Component (same as main dashboard)
  const Header = () => {
    return h('header', { className: 'dcs-admin__header' },
      h('div', { className: 'dcs-admin__header-left' },
        h('div', { className: 'dcs-admin__logo' },
          h('svg', { width: 36, height: 36, viewBox: '0 0 48 48', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
            h('g', { clipPath: 'url(#clip0_cf7m_ai)' },
              h('path', { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M21.9927 15.7109C24.0728 15.711 25.7588 17.3972 25.7589 19.4771C25.7589 21.557 24.0728 23.2433 21.9927 23.2433C19.9127 23.2433 18.2266 21.557 18.2266 19.4771C18.2266 17.3971 19.9127 15.7109 21.9927 15.7109ZM21.9927 17.0919C21.7154 17.0919 21.4906 17.3167 21.4906 17.5941V18.9749H20.1096C19.8323 18.975 19.6075 19.1998 19.6074 19.4771C19.6074 19.7545 19.8323 19.9793 20.1096 19.9793H21.4906V21.3602C21.4906 21.6375 21.7154 21.8624 21.9927 21.8624C22.2701 21.8623 22.4949 21.6375 22.4949 21.3602V19.9793H23.8758C24.1531 19.9793 24.378 19.7545 24.378 19.4771C24.378 19.1998 24.1531 18.9749 23.8758 18.9749H22.4949V17.5941C22.4949 17.3167 22.2701 17.0919 21.9927 17.0919Z', fill: '#5733FF' }),
              h('path', { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M38.4 0C43.7019 0 48 4.29806 48 9.6V38.4C48 43.7019 43.7019 48 38.4 48H9.6C4.29806 48 0 43.7019 0 38.4V9.6C0 4.29806 4.29806 2.35646e-07 9.6 0H38.4ZM12.2481 10.944C8.06128 10.9441 4.66725 14.9909 4.66725 19.9828V28.0172C4.66725 33.0091 8.06128 37.056 12.2481 37.056H23.1983C27.3852 37.056 30.7792 33.0091 30.7792 28.0172V19.9828C30.7792 14.9909 27.3852 10.944 23.1983 10.944H12.2481ZM38.0604 10.944C35.1485 10.944 32.7878 13.8667 32.7878 17.472V30.528C32.7878 34.1333 35.1485 37.056 38.0604 37.056C40.9724 37.056 43.3332 34.1334 43.3332 30.528V17.472C43.3332 13.8667 40.9724 10.944 38.0604 10.944Z', fill: '#5733FF' })
            ),
            h('defs', null,
              h('clipPath', { id: 'clip0_cf7m_ai' },
                h('rect', { width: 48, height: 48, fill: 'white' })
              )
            )
          ),
          h('h1', { className: 'dcs-admin__title', style: { fontWeight: 700 } }, __('CF7 Mate', 'cf7-styler-for-divi'))
        ),
        h('nav', { className: 'dcs-admin__nav' },
          h('a', { href: dashboardUrl, className: 'dcs-admin__nav-link' },
            h('span', { className: 'dcs-admin__nav-text' }, __('Dashboard', 'cf7-styler-for-divi'))
          ),
          h('a', { href: modulesUrl, className: 'dcs-admin__nav-link' },
            h('span', { className: 'dcs-admin__nav-text' }, __('Modules', 'cf7-styler-for-divi'))
          )
        )
      ),
      h('div', { className: 'dcs-admin__header-right' },
        h('span', { className: 'dcs-admin__version-right' }, 'v' + version),
        h('a', {
          href: docsUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'dcs-admin__nav-link dcs-admin__nav-link--docs',
        }, h(DocsIcon)),
        !isPro && h('a', {
          href: pricingUrl,
          className: 'dcs-admin__nav-link dcs-admin__nav-link--pro',
        }, h(CrownIcon))
      )
    );
  };

  // Main App
  const App = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [notice, setNotice] = useState(null);
    const [settings, setSettings] = useState({
      provider: 'openai',
      openai_key: '',
      openai_model: 'gpt-4o-mini',
      anthropic_key: '',
      anthropic_model: 'claude-sonnet-4-20250514',
      grok_key: '',
      grok_model: 'grok-3-mini',
      kimi_key: '',
      kimi_model: 'moonshot-v1-32k',
    });

    useEffect(() => { loadSettings(); }, []);

    const loadSettings = async () => {
      try {
        const data = await apiFetch({ 
          path: '/cf7-styler/v1/ai-settings',
          headers: { 'X-WP-Nonce': config.nonce }
        });
        setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        showNotice('error', err.message);
      }
      setLoading(false);
    };

    const saveSettings = async () => {
      setSaving(true);
      setNotice(null);
      try {
        await apiFetch({
          path: '/cf7-styler/v1/ai-settings',
          method: 'POST',
          headers: { 'X-WP-Nonce': config.nonce },
          data: settings,
        });
        showNotice('success', __('Settings saved!', 'cf7-styler-for-divi'));
        loadSettings();
      } catch (err) {
        showNotice('error', err.message);
      }
      setSaving(false);
    };

    const testConnection = async () => {
      setTesting(true);
      try {
        const result = await apiFetch({
          path: '/cf7-styler/v1/ai-settings/test',
          method: 'POST',
          headers: { 'X-WP-Nonce': config.nonce },
          data: { provider: settings.provider },
        });
        showNotice(result.success ? 'success' : 'error', result.message);
      } catch (err) {
        showNotice('error', err.message);
      }
      setTesting(false);
    };

    const deleteKey = async () => {
      const keyField = `${settings.provider}_key`;
      setSaving(true);
      try {
        await apiFetch({
          path: '/cf7-styler/v1/ai-settings',
          method: 'POST',
          headers: { 'X-WP-Nonce': config.nonce },
          data: { ...settings, [keyField]: '' },
        });
        showNotice('success', __('API key removed.', 'cf7-styler-for-divi'));
        loadSettings();
      } catch (err) {
        showNotice('error', err.message);
      }
      setSaving(false);
    };

    const showNotice = (type, message) => {
      setNotice({ type, message });
      if (type === 'success') setTimeout(() => setNotice(null), 3000);
    };

    const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    const provider = providers[settings.provider] || {};
    const info = platformInfo[settings.provider] || {};
    const keyField = `${settings.provider}_key`;
    const modelField = `${settings.provider}_model`;
    const isKeySet = settings[`${keyField}_set`];

    // Loading state
    if (loading) {
      return h('div', { className: 'dcs-admin-wrapper' },
        h(Header),
        h('div', { className: 'dcs-admin' },
          h('div', { className: 'dcs-admin__content' },
            h('div', { className: 'dcs-loading' }, __('Loading...', 'cf7-styler-for-divi'))
          )
        )
      );
    }

    return h('div', { className: 'dcs-admin-wrapper' },
      h(Header),
      h('div', { className: 'dcs-admin' },
        h('div', { className: 'dcs-admin__content' },

          // Page title
          h('div', { className: 'cf7m-ai__page-header' },
            h('h2', null, __('AI Provider Settings', 'cf7-styler-for-divi')),
            h('p', null, __('Configure AI for form generation in the Contact Form 7 editor.', 'cf7-styler-for-divi'))
          ),

          // Notice
          notice && h('div', { className: `dcs-toast dcs-toast--${notice.type}` },
            h('span', null, notice.message)
          ),

          // Main content grid
          h('div', { className: 'cf7m-ai__grid' },
            
            // Left: Settings Card
            h('div', { className: 'dcs-card' },
              h('div', { className: 'dcs-card__header' },
                h('h2', { className: 'dcs-card__title' }, __('Configuration', 'cf7-styler-for-divi'))
              ),
              h('div', { className: 'cf7m-ai__form' },
                
                // Provider
                h('div', { className: 'cf7m-ai__field' },
                  h('label', null, __('AI Provider', 'cf7-styler-for-divi')),
                  h('select', {
                    value: settings.provider,
                    onChange: (e) => update('provider', e.target.value),
                  },
                    Object.entries(providers).map(([key, cfg]) =>
                      h('option', { key, value: key }, cfg.name)
                    )
                  )
                ),

                // Model
                h('div', { className: 'cf7m-ai__field' },
                  h('label', null, __('Model', 'cf7-styler-for-divi')),
                  h('select', {
                    value: settings[modelField] || '',
                    onChange: (e) => update(modelField, e.target.value),
                  },
                    Object.entries(provider.models || {}).map(([value, label]) =>
                      h('option', { key: value, value }, label)
                    )
                  )
                ),

                // API Key
                h('div', { className: 'cf7m-ai__field' },
                  h('label', null,
                    __('API Key', 'cf7-styler-for-divi'),
                    isKeySet && h('span', { className: 'cf7m-ai__badge' }, 
                      h(CheckIcon), ' ', __('Configured', 'cf7-styler-for-divi')
                    )
                  ),
                  
                  isKeySet ? (
                    h('div', { className: 'cf7m-ai__key-row' },
                      h('code', null, settings[`${keyField}_masked`] || '••••••••'),
                      h('button', {
                        type: 'button',
                        className: 'button cf7m-ai__btn--danger',
                        onClick: deleteKey,
                        disabled: saving,
                      }, h(TrashIcon), ' ', __('Remove', 'cf7-styler-for-divi'))
                    )
                  ) : (
                    h('div', { className: 'cf7m-ai__key-row' },
                      h('input', {
                        type: 'password',
                        value: settings[keyField] || '',
                        onChange: (e) => update(keyField, e.target.value),
                        placeholder: provider.key_placeholder || 'sk-...',
                      }),
                      h('a', {
                        href: provider.key_url,
                        target: '_blank',
                        rel: 'noopener',
                        className: 'button',
                      }, h(LinkIcon), ' ', __('Get Key', 'cf7-styler-for-divi'))
                    )
                  )
                ),

                // Actions
                h('div', { className: 'cf7m-ai__actions' },
                  h('button', {
                    type: 'button',
                    className: 'button button-primary',
                    onClick: saveSettings,
                    disabled: saving || (isKeySet && !settings[keyField]),
                  }, saving ? __('Saving...', 'cf7-styler-for-divi') : __('Save Settings', 'cf7-styler-for-divi')),
                  
                  isKeySet && h('button', {
                    type: 'button',
                    className: 'button',
                    onClick: testConnection,
                    disabled: testing,
                  }, testing ? __('Testing...', 'cf7-styler-for-divi') : __('Test Connection', 'cf7-styler-for-divi'))
                )
              )
            ),

            // Right: Provider Info Card
            h('div', { className: 'dcs-card cf7m-ai__info-card' },
              h('div', { className: 'cf7m-ai__info-header' },
                h('div', { className: 'cf7m-ai__info-icon', style: { background: info.color || '#5733ff' } },
                  provider.name?.charAt(0) || 'A'
                ),
                h('div', null,
                  h('h3', null, provider.name || 'Provider'),
                  h('span', { className: 'cf7m-ai__info-company' }, 
                    __('by', 'cf7-styler-for-divi') + ' ' + (info.company || 'Unknown')
                  )
                )
              ),
              h('p', { className: 'cf7m-ai__info-desc' }, info.desc || ''),
              provider.key_url && h('a', {
                href: provider.key_url,
                target: '_blank',
                rel: 'noopener',
                className: 'cf7m-ai__info-link',
              }, __('Get API Key', 'cf7-styler-for-divi'), ' →')
            )
          )
        )
      )
    );
  };

  // Mount
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('cf7-styler-for-divi-root');
    if (root && wp.element.createRoot) {
      wp.element.createRoot(root).render(h(App));
    } else if (root) {
      wp.element.render(h(App), root);
    }
  });
})();
