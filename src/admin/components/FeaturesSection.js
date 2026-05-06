/**
 * Features – grouped Notion-style: highlighted hero cards, page builder
 * modules (conditional on detected builders), core features, and an
 * "Advanced fields" disclosure that reveals micro-cards for individual
 * field types.
 *
 * @package CF7_Mate
 */

import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import {
	BoltIcon,
	SparklesIcon,
	Squares2X2Icon,
	ChevronDownIcon,
	StarIcon,
	AdjustmentsHorizontalIcon,
	MinusIcon,
	PhotoIcon,
	HeartIcon,
	PhoneIcon,
	HashtagIcon,
} from '@heroicons/react/24/outline';
import { Toggle } from './Toggle';

// Builder modules — keyed by feature id, only shown when their builder is detected.
const BUILDER_MAP = {
	cf7_module: { builder: 'divi', label: 'Divi', desc: __('Style CF7 forms in the Divi Builder.', 'cf7-styler-for-divi') },
	bricks_module: { builder: 'bricks', label: 'Bricks', desc: __('Style CF7 forms in Bricks.', 'cf7-styler-for-divi') },
	elementor_module: { builder: 'elementor', label: 'Elementor', desc: __('Style CF7 forms in Elementor.', 'cf7-styler-for-divi') },
	gutenberg_module: { builder: 'gutenberg', label: 'Gutenberg', desc: __('Style CF7 forms in the Block Editor.', 'cf7-styler-for-divi') },
};

const HIGHLIGHTED = [
	{
		id: 'conditional',
		icon: BoltIcon,
		name: __('Conditional Logic', 'cf7-styler-for-divi'),
		desc: __('Show or hide fields based on what the user picks.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'multi_step',
		icon: Squares2X2Icon,
		name: __('Multi-step Forms', 'cf7-styler-for-divi'),
		desc: __('Break long forms into clean, focused steps.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'ai_form_generator',
		icon: SparklesIcon,
		name: __('AI Form Generator', 'cf7-styler-for-divi'),
		desc: __('Describe a form in plain English and get the shortcode.', 'cf7-styler-for-divi'),
		isPro: true,
	},
];

const CORE = [
	{
		id: 'database_entries',
		name: __('Form Responses', 'cf7-styler-for-divi'),
		desc: __('Save every submission to the database; view, search, and export them.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'webhook',
		name: __('Webhooks', 'cf7-styler-for-divi'),
		desc: __('POST submissions to Zapier, Make, or any URL.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'calculator',
		name: __('Calculator', 'cf7-styler-for-divi'),
		desc: __('Live price / quote calculations from form inputs.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'multi_column',
		name: __('Multi-column Layout', 'cf7-styler-for-divi'),
		desc: __('Place fields side-by-side with custom breakpoints.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'grid_layout',
		name: __('Grid Layout', 'cf7-styler-for-divi'),
		desc: __('Arrange fields in a responsive grid.', 'cf7-styler-for-divi'),
		isPro: false,
	},
	{
		id: 'presets',
		name: __('Style Presets', 'cf7-styler-for-divi'),
		desc: __('Save and reuse styling across forms.', 'cf7-styler-for-divi'),
		isPro: true,
	},
];

const ADVANCED_FIELDS = [
	{ id: 'star_rating', icon: StarIcon, label: __('Star Rating', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'range_slider', icon: AdjustmentsHorizontalIcon, label: __('Range Slider', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'separator', icon: MinusIcon, label: __('Separator', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'image', icon: PhotoIcon, label: __('Image', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'icon', icon: HeartIcon, label: __('Icon', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'phone_number', icon: PhoneIcon, label: __('Phone Number', 'cf7-styler-for-divi'), isPro: true },
	{ id: 'heading', icon: HashtagIcon, label: __('Heading', 'cf7-styler-for-divi'), isPro: true },
];

export function FeaturesSection({ features, isPro, onToggle, onBulkToggle, saving }) {
	const builders = useMemo(() => {
		const fromCfg =
			typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.builders
				? dcsCF7Styler.builders
				: {};
		return {
			divi: !!fromCfg.divi,
			bricks: !!fromCfg.bricks,
			elementor: !!fromCfg.elementor,
			gutenberg: fromCfg.gutenberg !== false,
		};
	}, []);

	// Filter builder modules to only those whose builder is active.
	const visibleBuilders = useMemo(() => {
		return Object.entries(BUILDER_MAP)
			.filter(([, meta]) => builders[meta.builder])
			.map(([id, meta]) => ({ id, ...meta }));
	}, [builders]);

	// Compute umbrella state for advanced fields.
	const advancedAnyOn = ADVANCED_FIELDS.some((f) => !!features[f.id]);
	const [advancedOpen, setAdvancedOpen] = useState(advancedAnyOn);

	const toggleAdvancedUmbrella = (next) => {
		setAdvancedOpen(next);
		if (!next) {
			// Disable all advanced fields when umbrella turns off.
			const updates = Object.fromEntries(
				ADVANCED_FIELDS.map((f) => [f.id, false])
			);
			onBulkToggle && onBulkToggle(updates);
		}
	};

	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: '';

	return (
		<div className="cf7m-dash__panel">
			{/* ===== Highlighted ===== */}
			<section className="cf7m-dash-section">
				<h3 className="cf7m-dash-section__title">
					{__('Highlighted', 'cf7-styler-for-divi')}
				</h3>
				<p className="cf7m-dash-section__desc">
					{__('The features people use most.', 'cf7-styler-for-divi')}
				</p>
				<div className="cf7m-feat-hero">
					{HIGHLIGHTED.map((f) => (
						<HeroCard
							key={f.id}
							feature={f}
							enabled={!!features[f.id]}
							isPro={isPro}
							saving={saving}
							onToggle={onToggle}
							pricingUrl={pricingUrl}
						/>
					))}
				</div>
			</section>

			{/* ===== Page builder modules ===== */}
			{visibleBuilders.length > 0 && (
				<section className="cf7m-dash-section">
					<h3 className="cf7m-dash-section__title">
						{__('Page builders', 'cf7-styler-for-divi')}
					</h3>
					<p className="cf7m-dash-section__desc">
						{__('Detected builders on this site. Modules for builders not installed are hidden.', 'cf7-styler-for-divi')}
					</p>
					<div className="cf7m-feat-builders">
						{visibleBuilders.map((b) => (
							<BuilderTile
								key={b.id}
								builder={b}
								enabled={!!features[b.id]}
								saving={saving}
								onToggle={onToggle}
							/>
						))}
					</div>
				</section>
			)}

			{/* ===== Core features ===== */}
			<section className="cf7m-dash-section">
				<h3 className="cf7m-dash-section__title">
					{__('Core features', 'cf7-styler-for-divi')}
				</h3>
				<p className="cf7m-dash-section__desc">
					{__('Everyday tools you can mix and match.', 'cf7-styler-for-divi')}
				</p>
				<div>
					{CORE.map((f) => (
						<FeatureRow
							key={f.id}
							feature={f}
							enabled={!!features[f.id]}
							isPro={isPro}
							saving={saving}
							onToggle={onToggle}
							pricingUrl={pricingUrl}
						/>
					))}
				</div>
			</section>

			{/* ===== Advanced fields disclosure ===== */}
			<section className="cf7m-dash-section">
				<div className="cf7m-dash-row">
					<div className="cf7m-dash-row__label">
						<h4 className="cf7m-dash-row__title">
							{__('Advanced fields', 'cf7-styler-for-divi')}
						</h4>
						<p className="cf7m-dash-row__desc">
							{__('Extra field types to enrich your forms — star ratings, sliders, phone, images, icons, separators.', 'cf7-styler-for-divi')}
						</p>
					</div>
					<div className="cf7m-dash-row__control">
						<Toggle
							checked={advancedOpen}
							onChange={toggleAdvancedUmbrella}
							disabled={saving}
						/>
					</div>
				</div>

				{advancedOpen && (
					<div className="cf7m-feat-fields">
						{ADVANCED_FIELDS.map((f) => (
							<FieldChip
								key={f.id}
								field={f}
								enabled={!!features[f.id]}
								isPro={isPro}
								saving={saving}
								onToggle={onToggle}
								pricingUrl={pricingUrl}
							/>
						))}
					</div>
				)}
			</section>

			{!isPro && pricingUrl && (
				<div className="cf7m-dash-footer cf7m-dash-footer--split">
					<span className="cf7m-dash-row__desc">
						{__('Pro unlocks Conditional Logic, Multi-step, Calculator, Webhooks, AI generator and more.', 'cf7-styler-for-divi')}
					</span>
					<Button
						variant="primary"
						onClick={() => window.open(pricingUrl, '_blank', 'noopener')}
					>
						{__('Upgrade to Pro', 'cf7-styler-for-divi')}
					</Button>
				</div>
			)}
		</div>
	);
}

// ===== Hero card (highlighted features) =====
function HeroCard({ feature, enabled, isPro, saving, onToggle, pricingUrl }) {
	const Icon = feature.icon;
	const locked = feature.isPro && !isPro;
	return (
		<div className={`cf7m-feat-hero__card${locked ? ' is-locked' : ''}`}>
			<div className="cf7m-feat-hero__icon">
				<Icon aria-hidden="true" />
			</div>
			<div className="cf7m-feat-hero__body">
				<h4 className="cf7m-feat-hero__title">
					{feature.name}
					{feature.isPro && !isPro && (
						<span className="cf7m-feature__badge">Pro</span>
					)}
				</h4>
				<p className="cf7m-feat-hero__desc">{feature.desc}</p>
			</div>
			<div className="cf7m-feat-hero__action">
				{locked ? (
					<a
						href={pricingUrl || '#'}
						target={pricingUrl ? '_blank' : undefined}
						rel={pricingUrl ? 'noopener noreferrer' : undefined}
						className="cf7m-feature__upgrade"
					>
						{__('Upgrade', 'cf7-styler-for-divi')}
					</a>
				) : (
					<Toggle
						checked={!!enabled}
						onChange={(v) => onToggle(feature.id, v)}
						disabled={saving}
					/>
				)}
			</div>
		</div>
	);
}

// ===== Builder tile =====
function BuilderTile({ builder, enabled, saving, onToggle }) {
	return (
		<div className="cf7m-feat-builder">
			<div className="cf7m-feat-builder__head">
				<span className={`cf7m-feat-builder__logo cf7m-feat-builder__logo--${builder.builder}`}>
					{builder.label.charAt(0)}
				</span>
				<div className="cf7m-feat-builder__text">
					<span className="cf7m-feat-builder__name">{builder.label}</span>
					<span className="cf7m-feat-builder__desc">{builder.desc}</span>
				</div>
			</div>
			<Toggle
				checked={!!enabled}
				onChange={(v) => onToggle(builder.id, v)}
				disabled={saving}
			/>
		</div>
	);
}

// ===== Standard feature row =====
function FeatureRow({ feature, enabled, isPro, saving, onToggle, pricingUrl }) {
	const locked = feature.isPro && !isPro;
	return (
		<div className="cf7m-dash-row">
			<div className="cf7m-dash-row__label">
				<h4 className="cf7m-dash-row__title">
					{feature.name}
					{feature.isPro && !isPro && (
						<span className="cf7m-feature__badge">Pro</span>
					)}
				</h4>
				<p className="cf7m-dash-row__desc">{feature.desc}</p>
			</div>
			<div className="cf7m-dash-row__control">
				{locked ? (
					<a
						href={pricingUrl || '#'}
						target={pricingUrl ? '_blank' : undefined}
						rel={pricingUrl ? 'noopener noreferrer' : undefined}
						className="cf7m-feature__upgrade"
					>
						{__('Upgrade', 'cf7-styler-for-divi')}
					</a>
				) : (
					<Toggle
						checked={!!enabled}
						onChange={(v) => onToggle(feature.id, v)}
						disabled={saving}
					/>
				)}
			</div>
		</div>
	);
}

// ===== Micro field chip =====
function FieldChip({ field, enabled, isPro, saving, onToggle, pricingUrl }) {
	const Icon = field.icon;
	const locked = field.isPro && !isPro;
	return (
		<div className={`cf7m-feat-chip${locked ? ' is-locked' : ''}${enabled ? ' is-on' : ''}`}>
			<div className="cf7m-feat-chip__icon">
				<Icon aria-hidden="true" />
			</div>
			<div className="cf7m-feat-chip__label">
				{field.label}
				{field.isPro && !isPro && (
					<span className="cf7m-feature__badge">Pro</span>
				)}
			</div>
			<div className="cf7m-feat-chip__action">
				{locked ? (
					<a
						href={pricingUrl || '#'}
						target={pricingUrl ? '_blank' : undefined}
						rel={pricingUrl ? 'noopener noreferrer' : undefined}
						className="cf7m-feature__upgrade"
					>
						{__('Pro', 'cf7-styler-for-divi')}
					</a>
				) : (
					<Toggle
						checked={!!enabled}
						onChange={(v) => onToggle(field.id, v)}
						disabled={saving}
					/>
				)}
			</div>
		</div>
	);
}
