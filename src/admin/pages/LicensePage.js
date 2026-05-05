import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

export default function LicensePage() {
  const [licenseData, setLicenseData] = useState(dcsCF7Styler?.license || {});
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (notice && notice.type === 'success') {
      const timer = setTimeout(() => setNotice(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const handleActivate = async (e) => {
    e.preventDefault();

    if (!keyInput.trim()) {
      setNotice({ type: 'error', message: 'Please enter a license key' });
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch({
        path: '/cf7-styler/v1/license/activate',
        method: 'POST',
        data: { license_key: keyInput },
      });

      if (response.success) {
        setLicenseData(response.license);
        setKeyInput('');
        setNotice({ type: 'success', message: 'License activated successfully!' });
      }
    } catch (error) {
      const message = error?.message || 'Failed to activate license';
      setNotice({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate this license?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch({
        path: '/cf7-styler/v1/license/deactivate',
        method: 'POST',
      });

      if (response.success) {
        setLicenseData({});
        setNotice({ type: 'success', message: 'License deactivated' });
      }
    } catch (error) {
      const message = error?.message || 'Failed to deactivate license';
      setNotice({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const isValid = licenseData?.is_valid;
  const status = licenseData?.status || 'inactive';
  const expiresAt = licenseData?.expires_at;
  const maskedKey = licenseData?.masked_key;

  const getStatusBadge = () => {
    if (isValid) {
      return <span className="cf7m-badge cf7m-badge-active">Active</span>;
    }
    if (status === 'expired') {
      return <span className="cf7m-badge cf7m-badge-expired">Expired</span>;
    }
    return <span className="cf7m-badge cf7m-badge-inactive">Inactive</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="cf7m-license-page">
      <div className="cf7m-card">
        <h2>License Management</h2>

        {notice && (
          <div className={`cf7m-notice cf7m-notice-${notice.type}`}>
            {notice.message}
          </div>
        )}

        <div className="cf7m-license-status">
          <div className="cf7m-status-badge">{getStatusBadge()}</div>

          {isValid && (
            <div className="cf7m-status-details">
              {maskedKey && (
                <div className="cf7m-detail-row">
                  <strong>License Key:</strong> {maskedKey}
                </div>
              )}
              {expiresAt && (
                <div className="cf7m-detail-row">
                  <strong>Expires:</strong> {formatDate(expiresAt)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="cf7m-license-actions">
          {!isValid ? (
            <form onSubmit={handleActivate}>
              <div className="cf7m-form-group">
                <label htmlFor="license-key">License Key</label>
                <input
                  id="license-key"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="cf7m-button cf7m-button-primary"
                disabled={loading}
              >
                {loading ? 'Activating...' : 'Activate License'}
              </button>
            </form>
          ) : (
            <button
              onClick={handleDeactivate}
              className="cf7m-button cf7m-button-secondary"
              disabled={loading}
            >
              {loading ? 'Deactivating...' : 'Deactivate License'}
            </button>
          )}
        </div>

        <div className="cf7m-license-help">
          <p>
            Don't have a license key? Find it in your account at{' '}
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
            >
              app.lemonsqueezy.com/my-orders
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
