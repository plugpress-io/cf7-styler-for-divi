/**
 * Overview – cleaner Notion-style: stat tiles, quick actions, resources.
 *
 * @package CF7_Mate
 */

import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	DocumentTextIcon,
	InboxIcon,
	SparklesIcon,
	CheckCircleIcon,
	ArrowUpRightIcon,
	BookOpenIcon,
	LifebuoyIcon,
	UserGroupIcon,
	BellAlertIcon,
	ExclamationTriangleIcon,
	EnvelopeIcon,
	BoltIcon,
	ChartBarIcon,
	FunnelIcon,
	QueueListIcon,
} from '@heroicons/react/24/outline';

const cfg = (key, fallback = '') => {
	if (typeof dcsCF7Styler === 'undefined') return fallback;
	return dcsCF7Styler[key] || fallback;
};

export function DashboardView({
	stats,
	loading,
	showResponses,
	isPro,
	responsesUrl,
}) {
	if (loading) {
		return (
			<div className="cf7m-overview__loading">
				<Spinner />
			</div>
		);
	}

	if (!isPro) {
		return (
			<div className="cf7m-overview">
				<div className="cf7m-overview__welcome">
					<h2 className="cf7m-overview__welcome-title">
						{__('Style and extend Contact Form 7.', 'cf7-styler-for-divi')}
					</h2>
				</div>

				<ProPerksCard />

				<ResourcesSection />
			</div>
		);
	}

	const tiles = [
		{
			icon: DocumentTextIcon,
			value: stats.total_forms || 0,
			label: __('Forms', 'cf7-styler-for-divi'),
			href: 'admin.php?page=wpcf7',
		},
		showResponses && {
			icon: InboxIcon,
			value: stats.total_entries || 0,
			label: __('Total submissions', 'cf7-styler-for-divi'),
			href: responsesUrl,
		},
		showResponses && {
			icon: CheckCircleIcon,
			value: stats.new_today || 0,
			label: __('New today', 'cf7-styler-for-divi'),
			href: responsesUrl,
		},
	].filter(Boolean);

	const quickActions = [
		{
			label: __('Manage features', 'cf7-styler-for-divi'),
			hint: __('Turn modules on or off', 'cf7-styler-for-divi'),
			onClick: () => { window.location.hash = '#/features'; },
		},
		showResponses && {
			label: __('View responses', 'cf7-styler-for-divi'),
			hint: __('Browse form submissions', 'cf7-styler-for-divi'),
			href: responsesUrl,
		},
		{
			label: __('Configure webhook', 'cf7-styler-for-divi'),
			hint: __('Send data to Zapier, Make, or any URL', 'cf7-styler-for-divi'),
			onClick: () => { window.location.hash = '#/webhook'; },
		},
		{
			label: __('AI form generator', 'cf7-styler-for-divi'),
			hint: __('Generate forms from a prompt', 'cf7-styler-for-divi'),
			onClick: () => { window.location.hash = '#/ai-settings'; },
		},
	].filter(Boolean);

	return (
		<div className="cf7m-overview">
			<NoticesBlock
				stats={stats}
				showResponses={showResponses}
				responsesUrl={responsesUrl}
			/>

			{/* Stats */}
			<div className="cf7m-card">
				<div className="cf7m-overview__stats">
					{tiles.map((tile, i) => (
						<StatTile key={i} {...tile} />
					))}
				</div>
			</div>

			{/* Quick actions */}
			<div className="cf7m-card cf7m-card--flush">
				<div className="cf7m-card__header">
					<h2 className="cf7m-card__title">{__('Quick actions', 'cf7-styler-for-divi')}</h2>
				</div>
				<div className="cf7m-overview__list">
					{quickActions.map((a, i) => (
						<QuickRow key={i} {...a} />
					))}
				</div>
			</div>

			<ResourcesSection />
		</div>
	);
}

function NoticesBlock({ stats, showResponses, responsesUrl }) {
	const license =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.license
			? dcsCF7Styler.license
			: null;
	const aiProviders =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.aiProviders
			? dcsCF7Styler.aiProviders
			: {};

	const notices = [];

	// Unread / new responses today
	if (showResponses && (stats?.new_today || 0) > 0) {
		notices.push({
			tone: 'info',
			icon: BellAlertIcon,
			title: __('You have new responses', 'cf7-styler-for-divi'),
			body: __('%d submission(s) arrived today.', 'cf7-styler-for-divi').replace(
				'%d',
				stats.new_today
			),
			cta: __('View responses', 'cf7-styler-for-divi'),
			href: responsesUrl,
		});
	}

	// License expiring soon
	if (license && license.is_valid && license.expires_at) {
		const days = Math.ceil(
			(new Date(license.expires_at).getTime() - Date.now()) / 86400000
		);
		if (days >= 0 && days <= 30) {
			notices.push({
				tone: 'warning',
				icon: ExclamationTriangleIcon,
				title: __('License renews soon', 'cf7-styler-for-divi'),
				body: __('Your CF7 Mate Pro license expires in %d day(s).', 'cf7-styler-for-divi').replace(
					'%d',
					days
				),
				cta: __('Manage license', 'cf7-styler-for-divi'),
				onClick: () => { window.location.hash = '#/license'; },
			});
		}
	}

	// AI provider not configured (only mention if at least one provider exists in localize)
	const aiProviderCount = Object.keys(aiProviders).length;
	const aiKeySet = Object.keys(aiProviders).some(
		(p) => typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler[`${p}_key_set`]
	);
	if (aiProviderCount > 0 && !aiKeySet) {
		notices.push({
			tone: 'info',
			icon: SparklesIcon,
			title: __('Connect an AI provider', 'cf7-styler-for-divi'),
			body: __('Add an API key to start generating forms from prompts.', 'cf7-styler-for-divi'),
			cta: __('Open AI settings', 'cf7-styler-for-divi'),
			onClick: () => { window.location.hash = '#/ai-settings'; },
		});
	}

	// CF7 mail config nudge — link out to CF7 docs (we can't reliably detect SMTP)
	const cf7MailKnown =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.smtp_configured;
	if (cf7MailKnown === false) {
		notices.push({
			tone: 'warning',
			icon: EnvelopeIcon,
			title: __('Emails may not be sending', 'cf7-styler-for-divi'),
			body: __('No SMTP plugin detected. Configure one to ensure form notifications reach inboxes.', 'cf7-styler-for-divi'),
			cta: __('Learn more', 'cf7-styler-for-divi'),
			href: 'https://contactform7.com/configuration-errors/',
		});
	}

	if (notices.length === 0) return null;

	return (
		<section className="cf7m-overview__notices">
			{notices.map((n, i) => (
				<NoticeRow key={i} {...n} />
			))}
		</section>
	);
}

function NoticeRow({ tone, icon: Icon, title, cta, href, onClick }) {
	const inner = (
		<>
			<span className={`cf7m-notice__icon cf7m-notice__icon--${tone}`}>
				<Icon aria-hidden="true" />
			</span>
			<span className="cf7m-notice__title">{title}</span>
			{cta && (
				<span className="cf7m-notice__cta">
					{cta}
					<ArrowUpRightIcon aria-hidden="true" />
				</span>
			)}
		</>
	);

	if (href) {
		return (
			<a
				href={href}
				className={`cf7m-notice cf7m-notice--${tone}`}
				target={href.startsWith('http') ? '_blank' : undefined}
				rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
			>
				{inner}
			</a>
		);
	}
	return (
		<button
			type="button"
			onClick={onClick}
			className={`cf7m-notice cf7m-notice--${tone}`}
		>
			{inner}
		</button>
	);
}

function StatTile({ value, label, href, onClick }) {
	const inner = (
		<>
			{(href || onClick) && (
				<div className="cf7m-overview__tile-head">
					<ArrowUpRightIcon
						className="cf7m-overview__tile-arrow"
						aria-hidden="true"
					/>
				</div>
			)}
			<div className="cf7m-overview__tile-value">{value}</div>
			<div className="cf7m-overview__tile-label">{label}</div>
		</>
	);

	if (href) return <a href={href} className="cf7m-overview__tile">{inner}</a>;
	if (onClick) return (
		<button type="button" onClick={onClick} className="cf7m-overview__tile cf7m-overview__tile--button">
			{inner}
		</button>
	);
	return <div className="cf7m-overview__tile">{inner}</div>;
}

function QuickRow({ label, href, onClick }) {
	const inner = (
		<>
			<span className="cf7m-overview__row-label">{label}</span>
			<ArrowUpRightIcon className="cf7m-overview__row-arrow" aria-hidden="true" />
		</>
	);
	if (href) return <a href={href} className="cf7m-overview__row">{inner}</a>;
	return (
		<button type="button" onClick={onClick} className="cf7m-overview__row">
			{inner}
		</button>
	);
}

function ProPerksCard() {
	const pricingUrl = cfg('pricing_url', 'https://cf7mate.com/pricing');

	const perks = [
		{
			icon: InboxIcon,
			name: __('Form Responses', 'cf7-styler-for-divi'),
			desc: __('Save every submission to your database', 'cf7-styler-for-divi'),
		},
		{
			icon: BoltIcon,
			name: __('Webhooks', 'cf7-styler-for-divi'),
			desc: __('Send data to Zapier, Make, Slack & more', 'cf7-styler-for-divi'),
		},
		{
			icon: SparklesIcon,
			name: __('AI Form Generator', 'cf7-styler-for-divi'),
			desc: __('Build forms from a plain-text prompt', 'cf7-styler-for-divi'),
		},
		{
			icon: ChartBarIcon,
			name: __('Analytics', 'cf7-styler-for-divi'),
			desc: __('Track views, submissions & conversion rate', 'cf7-styler-for-divi'),
		},
		{
			icon: FunnelIcon,
			name: __('Conditional Logic', 'cf7-styler-for-divi'),
			desc: __('Show or hide fields dynamically', 'cf7-styler-for-divi'),
		},
		{
			icon: QueueListIcon,
			name: __('Multi-step Forms', 'cf7-styler-for-divi'),
			desc: __('Break long forms into guided steps', 'cf7-styler-for-divi'),
		},
	];

	return (
		<div className="cf7m-card">
			<div className="cf7m-card__header">
				<h2 className="cf7m-card__title">
					{__('What\'s in Pro', 'cf7-styler-for-divi')}
				</h2>
				{pricingUrl && (
					<a
						href={pricingUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="cf7m-perks__upgrade"
					>
						{__('Get Pro', 'cf7-styler-for-divi')}
						<ArrowUpRightIcon aria-hidden="true" />
					</a>
				)}
			</div>
			<div className="cf7m-perks">
				{perks.map(({ icon: Icon, name, desc }, i) => (
					<div key={i} className="cf7m-perks__item">
						<Icon className="cf7m-perks__icon" aria-hidden="true" />
						<div>
							<div className="cf7m-perks__name">{name}</div>
							<div className="cf7m-perks__desc">{desc}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function ResourcesSection() {
	const docsUrl = cfg('docs_url', 'https://cf7mate.com/docs');
	const supportUrl = cfg('support_url', 'https://cf7mate.com/support');
	const communityUrl = cfg('community_url', 'https://facebook.com/groups/plugpress');

	const cards = [
		{
			icon: BookOpenIcon,
			title: __('Documentation', 'cf7-styler-for-divi'),
			desc: __('Setup guides, module references, and how-tos.', 'cf7-styler-for-divi'),
			cta: __('Read the docs', 'cf7-styler-for-divi'),
			href: docsUrl,
		},
		{
			icon: LifebuoyIcon,
			title: __('Support', 'cf7-styler-for-divi'),
			desc: __('Stuck on something? Open a ticket and we\'ll help.', 'cf7-styler-for-divi'),
			cta: __('Contact support', 'cf7-styler-for-divi'),
			href: supportUrl,
		},
		{
			icon: UserGroupIcon,
			title: __('Community', 'cf7-styler-for-divi'),
			desc: __('Trade tips and feature requests with other users.', 'cf7-styler-for-divi'),
			cta: __('Join the group', 'cf7-styler-for-divi'),
			href: communityUrl,
		},
	].filter((c) => c.href);

	if (cards.length === 0) return null;

	return (
		<div className="cf7m-overview__links">
			{cards.map((c, i) => (
				<a
					key={i}
					href={c.href}
					target="_blank"
					rel="noopener noreferrer"
					className="cf7m-overview__link"
				>
					<c.icon aria-hidden="true" />
					{c.title}
				</a>
			))}
		</div>
	);
}
