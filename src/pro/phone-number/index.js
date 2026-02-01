import './style.scss';
import { COUNTRIES, flagEmoji } from './countries';

const DEFAULT_ISO2 = 'US';

function findCountry(iso2) {
	return (
		COUNTRIES.find((c) => c.iso2 === iso2) ||
		COUNTRIES.find((c) => c.iso2 === DEFAULT_ISO2)
	);
}

function initOne(root) {
	if (root.dataset.cf7mPhoneInit) return;
	root.dataset.cf7mPhoneInit = '1';

	const wrap = root.querySelector('.cf7m-phone-wrap');
	const trigger = root.querySelector('.cf7m-phone-trigger');
	const visibleInput = root.querySelector('.cf7m-phone-input');
	const hiddenInput = root.querySelector('.cf7m-phone-hidden');
	if (!wrap || !trigger || !visibleInput || !hiddenInput) return;

	let currentIso2 = (
		hiddenInput.dataset.defaultCountry || DEFAULT_ISO2
	).toUpperCase();
	let dropdown = null;
	let searchInput = null;
	let listEl = null;

	function getCurrent() {
		return findCountry(currentIso2);
	}

	function setCountry(iso2) {
		const c = findCountry(iso2);
		if (!c) return;
		currentIso2 = c.iso2;
		trigger.querySelector('.cf7m-phone-flag').textContent = flagEmoji(
			c.iso2
		);
		trigger.querySelector('.cf7m-phone-dial').textContent = c.dial;
		syncHidden();
		closeDropdown();
	}

	function syncHidden() {
		const local = (visibleInput.value || '').trim().replace(/\s/g, '');
		const prefix = getCurrent().dial;
		hiddenInput.value = local ? prefix + ' ' + local : prefix;
	}

	function openDropdown() {
		trigger.setAttribute('aria-expanded', 'true');
		if (dropdown) {
			dropdown.classList.remove('cf7m-phone-dropdown--hidden');
			if (searchInput) {
				searchInput.value = '';
				searchInput.focus();
			}
			renderList('');
			return;
		}
		dropdown = document.createElement('div');
		dropdown.className = 'cf7m-phone-dropdown';
		dropdown.setAttribute('role', 'listbox');

		const searchWrap = document.createElement('div');
		searchWrap.className = 'cf7m-phone-search-wrap';
		searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.className = 'cf7m-phone-search';
		searchInput.placeholder = 'Search';
		searchInput.setAttribute('aria-label', 'Search country');
		searchWrap.appendChild(searchInput);

		listEl = document.createElement('div');
		listEl.className = 'cf7m-phone-list';
		listEl.setAttribute('role', 'list');

		dropdown.appendChild(searchWrap);
		dropdown.appendChild(listEl);

		const combo = root.querySelector('.cf7m-phone-combo');
		if (combo) combo.appendChild(dropdown);

		function renderList(q) {
			const qn = (q || '').toLowerCase().trim();
			const filtered = qn
				? COUNTRIES.filter(
						(c) =>
							c.name.toLowerCase().includes(qn) ||
							c.dial.includes(qn) ||
							c.iso2.toLowerCase().includes(qn)
					)
				: [...COUNTRIES];
			listEl.innerHTML = '';
			filtered.forEach((c) => {
				const opt = document.createElement('button');
				opt.type = 'button';
				opt.className =
					'cf7m-phone-option' +
					(c.iso2 === currentIso2
						? ' cf7m-phone-option--selected'
						: '');
				opt.setAttribute('role', 'option');
				opt.dataset.iso2 = c.iso2;
				opt.innerHTML =
					'<span class="cf7m-phone-option-flag">' +
					flagEmoji(c.iso2) +
					'</span><span class="cf7m-phone-option-label">' +
					escapeHtml(c.name) +
					'</span><span class="cf7m-phone-option-dial">' +
					escapeHtml(c.dial) +
					'</span>';
				opt.addEventListener('click', () => setCountry(c.iso2));
				listEl.appendChild(opt);
			});
		}

		searchInput.addEventListener('input', () =>
			renderList(searchInput.value)
		);
		searchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeDropdown();
		});

		renderList('');
		dropdown.classList.remove('cf7m-phone-dropdown--hidden');
		searchInput.focus();
	}

	function closeDropdown() {
		trigger.setAttribute('aria-expanded', 'false');
		if (dropdown) dropdown.classList.add('cf7m-phone-dropdown--hidden');
	}

	function toggleDropdown() {
		const isHidden =
			!dropdown ||
			dropdown.classList.contains('cf7m-phone-dropdown--hidden');
		if (isHidden) openDropdown();
		else closeDropdown();
	}

	function escapeHtml(s) {
		const div = document.createElement('div');
		div.textContent = s;
		return div.innerHTML;
	}

	trigger.addEventListener('click', (e) => {
		e.preventDefault();
		toggleDropdown();
	});

	visibleInput.addEventListener('input', syncHidden);
	visibleInput.addEventListener('blur', syncHidden);

	document.addEventListener('click', (e) => {
		if (root.contains(e.target)) return;
		closeDropdown();
	});

	// Initial display
	const cur = getCurrent();
	trigger.querySelector('.cf7m-phone-flag').textContent = flagEmoji(cur.iso2);
	trigger.querySelector('.cf7m-phone-dial').textContent = cur.dial;
	syncHidden();
}

function init() {
	document.querySelectorAll('.cf7m-phone-number').forEach(initOne);
}

function onReady() {
	init();
	if (typeof window.jQuery !== 'undefined') {
		window
			.jQuery(document)
			.on(
				'wpcf7mailsent wpcf7invalid wpcf7spam wpcf7mailfailed wpcf7submit',
				() => setTimeout(init, 100)
			);
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', onReady);
} else {
	onReady();
}
