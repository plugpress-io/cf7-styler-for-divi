# CF7 Mate Cloud AI — Implementation Plan

> Proxy service so users can generate CF7 forms with AI without needing their own API key.

## Overview

```
CF7 Mate Plugin  ──►  cf7mate.com relay  ──►  OpenAI (GPT-4o Mini)
  (user site)          (your server)           (shared API key)
```

- Users select "CF7 Mate Cloud" as their AI provider (no API key needed)
- Requests go to cf7mate.com which proxies to OpenAI
- Usage is tracked per Freemius license, limited per month per plan
- Existing "Bring Your Own Key" providers (OpenAI, Claude, Grok, Kimi) remain unchanged

---

## Cost Analysis

| Item | Cost |
|------|------|
| GPT-4o Mini input | ~$0.15 / 1M tokens |
| GPT-4o Mini output | ~$0.60 / 1M tokens |
| Avg tokens per form generation | ~2,000 |
| **Cost per generation** | **~$0.001** |
| 1,000 users x 10 forms/month | ~$10/month |
| 5,000 users x 10 forms/month | ~$50/month |

---

## Quota Limits (per Freemius plan)

| Plan | Forms/month | Vision (image upload) |
|------|-------------|-----------------------|
| Free (lite) | 5 | No |
| Personal | 10 | Yes |
| Professional | 25 | Yes |
| Agency | 50 | Yes |

Quota resets on the 1st of each month (UTC).

---

## Part 1: Relay Plugin (cf7mate.com)

A small WordPress plugin installed on cf7mate.com.

### Plugin structure

```
cf7m-ai-relay/
├── cf7m-ai-relay.php        # Main plugin file
├── includes/
│   ├── class-relay-api.php   # REST endpoint handler
│   ├── class-usage-tracker.php # Quota tracking
│   └── class-license-validator.php # Freemius license check
└── readme.txt
```

### Database table: `wp_cf7m_ai_usage`

```sql
CREATE TABLE wp_cf7m_ai_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    license_key VARCHAR(64) NOT NULL,
    site_url VARCHAR(255) NOT NULL,
    month_year CHAR(7) NOT NULL,        -- "2026-02"
    usage_count INT UNSIGNED DEFAULT 0,
    plan_slug VARCHAR(32) DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_license_month (license_key, month_year),
    KEY idx_site_month (site_url, month_year)
);
```

### REST Endpoint: `POST /wp-json/cf7m-relay/v1/generate`

**Request:**
```json
{
    "license_key": "sk_abc123...",
    "site_url": "https://example.com",
    "plugin_version": "3.0.0",
    "prompt": "Create a contact form with name, email, phone, message",
    "image": "data:image/png;base64,..." // optional, for vision
}
```

**Response (success):**
```json
{
    "success": true,
    "form": "[contact-form-7 shortcode markup...]",
    "usage": {
        "used": 3,
        "limit": 10,
        "resets": "2026-03-01"
    }
}
```

**Response (quota exceeded):**
```json
{
    "success": false,
    "code": "quota_exceeded",
    "message": "Monthly limit reached (10/10). Resets March 1.",
    "usage": { "used": 10, "limit": 10, "resets": "2026-03-01" }
}
```

**Response (invalid license):**
```json
{
    "success": false,
    "code": "invalid_license",
    "message": "Invalid or expired license."
}
```

### License Validation Flow

```
1. Receive license_key + site_url
2. Call Freemius API: GET /v1/plugins/23451/installs.json?search={license_key}
   OR validate via stored cache (cache for 24h to avoid hammering Freemius)
3. Determine plan_slug from Freemius response → map to quota limit
4. Check wp_cf7m_ai_usage for current month count
5. If under limit → proxy to OpenAI → increment count → return result
6. If over limit → return quota_exceeded error
```

### Security

- Rate limit: max 3 requests/minute per license_key (wp_transient based)
- Validate site_url matches Freemius install record
- Sanitize prompt (strip HTML, limit to 2000 chars)
- Image uploads: validate base64, limit to 1MB, only allow png/jpg/webp
- Store OpenAI API key in wp-config.php constant, never in DB
- Log all requests for abuse monitoring (license_key, site_url, timestamp, tokens_used)

### OpenAI Proxy Logic (class-relay-api.php)

```php
// Pseudocode
$response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
    'timeout' => 60,
    'headers' => [
        'Authorization' => 'Bearer ' . CF7M_RELAY_OPENAI_KEY,
        'Content-Type'  => 'application/json',
    ],
    'body' => json_encode([
        'model'       => 'gpt-4o-mini',
        'max_tokens'  => 4000,
        'temperature' => 0.7,
        'messages'    => [
            ['role' => 'system', 'content' => $system_prompt],
            ['role' => 'user', 'content' => $user_prompt],
        ],
    ]),
]);
```

The system prompt is the same one used in the existing `AI_API_Handler` class — reuse it.

---

## Part 2: Client Side (CF7 Mate Plugin Changes)

### New provider: "cf7mate" in settings.php

Add to `get_providers()`:

```php
'cf7mate' => [
    'name'   => 'CF7 Mate Cloud',
    'models' => [
        'auto' => 'Auto (GPT-4o Mini)',
    ],
    'key_placeholder' => '', // No key needed
    'key_url'         => '',
    'no_key_required' => true,
    'description'     => 'Generate forms without an API key. Uses your CF7 Mate license.',
],
```

### New handler in api-handler.php

When provider is `cf7mate`, instead of calling OpenAI directly:

```php
case 'cf7mate':
    $response = wp_remote_post('https://cf7mate.com/wp-json/cf7m-relay/v1/generate', [
        'timeout' => 60,
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => json_encode([
            'license_key'    => cf7m_get_license_key(),
            'site_url'       => home_url(),
            'plugin_version' => CF7M_VERSION,
            'prompt'         => $prompt,
            'image'          => $image_data ?? null,
        ]),
    ]);
    break;
```

### Helper: `cf7m_get_license_key()`

```php
function cf7m_get_license_key() {
    if (!function_exists('cf7m_fs')) return '';
    $license = cf7m_fs()->_get_license();
    return $license ? $license->secret_key : '';
}
```

### Quota UI in admin

Show remaining quota when "CF7 Mate Cloud" is selected:

```
┌─────────────────────────────────────┐
│  AI Provider: CF7 Mate Cloud   ▼   │
│                                     │
│  ✓ No API key needed                │
│  Usage: 3 / 10 this month          │
│  ████████░░░░░░░░ 30%              │
│  Resets: March 1, 2026             │
│                                     │
│  Need more? Upgrade your plan →    │
└─────────────────────────────────────┘
```

### Quota check endpoint (optional)

Add a GET endpoint on the relay:

```
GET /wp-json/cf7m-relay/v1/usage?license_key=xxx&site_url=xxx
```

Returns current usage without generating a form. Called when the AI settings page loads to show the quota bar.

---

## Part 3: Admin UI Changes

### AI Settings Page

1. Add "CF7 Mate Cloud" as the first/default provider option
2. When selected, hide the API key field
3. Show quota usage bar + reset date
4. Show "Need more? Upgrade your plan" link to cf7mate.com/pricing
5. For free users without Freemius license, allow 5 generations with site_url-based tracking

### AI Form Generator Modal

1. When using Cloud provider, show "X forms remaining" badge
2. After generation, update the remaining count
3. When quota exceeded, show upgrade prompt instead of error

---

## Part 4: Free Users (No License)

For users on the free/lite plan who haven't purchased:

- Track by `site_url` instead of `license_key`
- Allow 5 forms/month
- Show "Upgrade for more generations" prompt
- Validate site_url has CF7 Mate installed (check via a simple ping-back or trust on first use)

---

## Implementation Order

### Phase 1: Relay plugin (server side)
1. Create `cf7m-ai-relay` WordPress plugin
2. Implement REST endpoint with OpenAI proxy
3. Implement usage tracking table
4. Implement Freemius license validation (with 24h cache)
5. Add rate limiting
6. Deploy to cf7mate.com

### Phase 2: Client integration
1. Add "cf7mate" provider to `settings.php` → `get_providers()`
2. Add relay handler to `api-handler.php`
3. Add `cf7m_get_license_key()` helper
4. Add quota display UI in AI settings page
5. Add quota check on page load (GET /usage)
6. Update AI generator modal to show remaining count

### Phase 3: Free tier
1. Add site_url-based tracking for unlicensed users
2. Add upgrade prompts when quota is low/exceeded
3. Make "CF7 Mate Cloud" the default provider for new installs

### Phase 4: Monitoring
1. Add usage logging table for analytics
2. Build simple admin dashboard on cf7mate.com to monitor:
   - Total requests/day
   - OpenAI cost/day
   - Top users by usage
   - Error rates
3. Set up cost alerts (e.g. notify if daily cost > $5)

---

## Files to Create/Modify

### New files (relay plugin — separate repo)
- `cf7m-ai-relay/cf7m-ai-relay.php`
- `cf7m-ai-relay/includes/class-relay-api.php`
- `cf7m-ai-relay/includes/class-usage-tracker.php`
- `cf7m-ai-relay/includes/class-license-validator.php`

### Modified files (CF7 Mate plugin)
- `includes/pro/features/ai-form-generator/settings.php` — add cf7mate provider
- `includes/pro/features/ai-form-generator/api-handler.php` — add relay handler
- `includes/pro/features/ai-form-generator/module.php` — add quota endpoint
- `freemius.php` — add `cf7m_get_license_key()` helper
- `src/admin/` — update AI settings UI with quota display

---

## Fallback Strategy

If cf7mate.com relay is down:
1. Show "Cloud AI is temporarily unavailable" message
2. Suggest switching to "Bring Your Own Key" providers
3. Implement 3-retry with 2s backoff before showing error
4. Health check endpoint: `GET /wp-json/cf7m-relay/v1/health` (cached 5 min)
