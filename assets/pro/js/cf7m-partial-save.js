/**
 * CF7 Mate – Partial Save / Save & Continue
 * Saves form progress to a WP transient keyed by a localStorage token.
 */
( function () {
	'use strict';

	if ( typeof cf7mPartialSave === 'undefined' ) {
		return;
	}

	const { root, nonce, i18n } = cf7mPartialSave;

	function generateToken() {
		const arr = new Uint8Array( 16 );
		window.crypto.getRandomValues( arr );
		return Array.from( arr, ( b ) => b.toString( 16 ).padStart( 2, '0' ) ).join( '' );
	}

	function storageKey( formId ) {
		return 'cf7m_token_' + formId;
	}

	function getToken( formId ) {
		let token = localStorage.getItem( storageKey( formId ) );
		if ( ! token || token.length !== 32 ) {
			token = generateToken();
			localStorage.setItem( storageKey( formId ), token );
		}
		return token;
	}

	function setStatus( bar, msg, type ) {
		const el = bar.querySelector( '.cf7m-partial-save__status' );
		if ( ! el ) return;
		el.textContent = msg;
		el.className = 'cf7m-partial-save__status' + ( type ? ' is-' + type : '' );
		if ( type !== 'saving' ) {
			setTimeout( () => {
				el.textContent = '';
				el.className = 'cf7m-partial-save__status';
			}, 3000 );
		}
	}

	function collectFormData( form ) {
		const data = {};
		const elements = form.querySelectorAll(
			'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([name^="_"]), textarea, select'
		);
		elements.forEach( ( el ) => {
			if ( ! el.name ) return;
			if ( el.type === 'checkbox' ) {
				if ( ! el.checked ) return;
				if ( data[ el.name ] ) {
					data[ el.name ] = [].concat( data[ el.name ], el.value );
				} else {
					data[ el.name ] = el.value;
				}
			} else if ( el.type === 'radio' ) {
				if ( el.checked ) data[ el.name ] = el.value;
			} else {
				data[ el.name ] = el.value;
			}
		} );
		return data;
	}

	function restoreFormData( form, data ) {
		Object.entries( data ).forEach( ( [ name, value ] ) => {
			const els = form.querySelectorAll( '[name="' + CSS.escape( name ) + '"]' );
			els.forEach( ( el ) => {
				if ( el.type === 'checkbox' ) {
					el.checked = [].concat( value ).includes( el.value );
				} else if ( el.type === 'radio' ) {
					el.checked = el.value === value;
				} else {
					el.value = value;
				}
			} );
		} );
	}

	function injectTokenInput( form, formId, token ) {
		let input = form.querySelector( 'input[name="_cf7m_ps_token"]' );
		if ( ! input ) {
			input = document.createElement( 'input' );
			input.type = 'hidden';
			input.name = '_cf7m_ps_token';
			form.appendChild( input );
		}
		input.value = token;
	}

	async function saveProgress( formId, token, data, bar, silent ) {
		if ( ! silent ) setStatus( bar, i18n.saving, 'saving' );
		try {
			const res = await fetch( root + '/partial-save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': nonce,
				},
				body: JSON.stringify( { form_id: parseInt( formId, 10 ), token, data } ),
			} );
			if ( res.ok && ! silent ) {
				setStatus( bar, i18n.saved, 'saved' );
			} else if ( ! res.ok && ! silent ) {
				setStatus( bar, i18n.error, 'error' );
			}
		} catch ( e ) {
			if ( ! silent ) setStatus( bar, i18n.error, 'error' );
		}
	}

	function debounce( fn, ms ) {
		let timer;
		return ( ...args ) => {
			clearTimeout( timer );
			timer = setTimeout( () => fn( ...args ), ms );
		};
	}

	function initBar( bar ) {
		const formId = bar.dataset.formId;
		if ( ! formId ) return;

		const form = bar.closest( 'form.wpcf7-form' ) || bar.closest( '.wpcf7' )?.querySelector( 'form' );
		if ( ! form ) return;

		const token = getToken( formId );
		injectTokenInput( form, formId, token );

		// Restore on load.
		fetch( root + '/partial-save/' + token, {
			headers: { 'X-WP-Nonce': nonce },
		} )
			.then( ( r ) => r.json() )
			.then( ( json ) => {
				if ( json.found && json.data && Object.keys( json.data ).length ) {
					restoreFormData( form, json.data );
					setStatus( bar, i18n.restored, 'saved' );
				}
			} )
			.catch( () => {} );

		// Save button click.
		const btn = bar.querySelector( '.cf7m-partial-save__btn' );
		if ( btn ) {
			btn.addEventListener( 'click', () => {
				saveProgress( formId, token, collectFormData( form ), bar, false );
			} );
		}

		// Auto-save on field change (debounced 3s, silent).
		const debouncedSave = debounce( () => {
			saveProgress( formId, token, collectFormData( form ), bar, true );
		}, 3000 );

		form.addEventListener( 'change', debouncedSave );
		form.addEventListener( 'input', debouncedSave );

		// Clear on successful submission.
		form.closest( '.wpcf7' )?.addEventListener( 'wpcf7mailsent', () => {
			fetch( root + '/partial-save/' + token, {
				method: 'DELETE',
				headers: { 'X-WP-Nonce': nonce },
			} ).catch( () => {} );
			localStorage.removeItem( storageKey( formId ) );
		} );
	}

	document.addEventListener( 'DOMContentLoaded', () => {
		document.querySelectorAll( '.cf7m-partial-save-bar' ).forEach( initBar );
	} );
} )();
