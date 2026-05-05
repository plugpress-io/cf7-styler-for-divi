/**
 * Features/Modules page with tabs and search
 * Uses Tailwind CSS for styling
 *
 * @package CF7_Mate
 */

import { useState, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FEATURES } from '../data/features';
import { FeatureCard } from './FeatureCard';
import { HowToSection } from './HowToSection';

export function FeaturesSection({ features, isPro, onToggle, saving }) {
	const [activeTab, setActiveTab] = useState(isPro ? 'all' : 'free');
	const [searchQuery, setSearchQuery] = useState('');

	const freeFeatures = FEATURES.filter((f) => !f.isPro);
	const proFeatures = FEATURES.filter((f) => f.isPro);

	// Filter features based on active tab and search query
	const filteredFeatures = useMemo(() => {
		const query = searchQuery.toLowerCase();
		let featuresToShow = FEATURES;

		// Filter by tab
		if (activeTab === 'free') {
			featuresToShow = freeFeatures;
		} else if (activeTab === 'pro') {
			featuresToShow = proFeatures;
		}
		// 'all' shows all features (pro users only)

		// Filter by search query
		if (query) {
			featuresToShow = featuresToShow.filter(
				(f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
			);
		}

		return featuresToShow;
	}, [activeTab, searchQuery]);

	const tabs = [
		{
			id: 'free',
			label: __('Free Features', 'cf7-styler-for-divi'),
			count: freeFeatures.length,
			visible: true,
		},
		{
			id: 'pro',
			label: __('Pro Features', 'cf7-styler-for-divi'),
			count: proFeatures.length,
			visible: !isPro, // Show for free users to see what they can upgrade to
		},
		{
			id: 'all',
			label: __('All Modules', 'cf7-styler-for-divi'),
			count: FEATURES.length,
			visible: isPro, // Show for pro users
		},
	];

	const visibleTabs = tabs.filter((t) => t.visible);
	const hasSearchResults = filteredFeatures.length > 0;

	return (
		<div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
			{/* Header */}
			<div className="border-b border-gray-200 px-6 py-4">
				<h2 className="text-xl font-bold text-gray-900">
					{__('Modules', 'cf7-styler-for-divi')}
				</h2>
				<p className="text-sm text-gray-600 mt-1">
					{__('Turn modules on or off. Changes apply immediately.', 'cf7-styler-for-divi')}
				</p>
			</div>

			{/* Body */}
			<div className="px-6 py-6 space-y-6">
				{/* Tabs */}
				{visibleTabs.length > 1 && (
					<div className="flex gap-1 border-b border-gray-200">
						{visibleTabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => {
									setActiveTab(tab.id);
									setSearchQuery('');
								}}
								aria-selected={activeTab === tab.id}
								role="tab"
								className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
									activeTab === tab.id
										? 'border-blue-600 text-blue-600'
										: 'border-transparent text-gray-700 hover:text-gray-900'
								}`}
							>
								{tab.label}
								<span className="ml-2 inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
									{tab.count}
								</span>
							</button>
						))}
					</div>
				)}

				{/* Search */}
				<div className="relative">
					<input
						type="text"
						placeholder={__('Search modules...', 'cf7-styler-for-divi')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						aria-label={__('Search modules', 'cf7-styler-for-divi')}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery('')}
							aria-label={__('Clear search', 'cf7-styler-for-divi')}
							className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
						>
							<XMarkIcon className="w-5 h-5" />
						</button>
					)}
				</div>

				{/* Features List */}
				{hasSearchResults ? (
					<div className="space-y-3">
						{filteredFeatures.map((feature) => (
							<div key={feature.id}>
								<FeatureCard
									feature={feature}
									enabled={features[feature.id]}
									isPro={isPro}
									onToggle={onToggle}
									saving={saving}
								/>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8">
						<p className="text-gray-500 text-sm">
							{__('No modules found matching your search.', 'cf7-styler-for-divi')}
						</p>
					</div>
				)}

				{/* Pro Upsell for Free Users */}
				{!isPro && activeTab === 'pro' && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-sm text-gray-700 mb-3">
							{__('Unlock ', 'cf7-styler-for-divi')}
							<strong>{proFeatures.length}</strong>
							{__(' pro modules and advanced features with CF7 Mate Pro.', 'cf7-styler-for-divi')}
						</p>
						<a
							href="#/free-vs-pro"
							className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
						>
							{__('See What\'s Pro →', 'cf7-styler-for-divi')}
						</a>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
				<HowToSection />
			</div>
		</div>
	);
}
