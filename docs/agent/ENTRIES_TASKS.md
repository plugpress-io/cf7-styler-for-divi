# Entries & Database Features – Task List

> **Reference:** `references/lean-forms` and `references/lean-forms-pro`  
> **Goal:** Pro dashboard app handles entries, submission handling, CPT, REST API, and Entries UI.

---

## What lean-forms does (reference)

### 1. Submission flow
- **`includes/submission.php`** – Single handler on `wpcf7_before_send_mail`.
- Prepares **submission_data**: `form_id`, `form_title`, `status` (new/spam), `data`, `files`, `ip`, `user_agent`, `timestamp`.
- Fires `lean_forms_submission_captured` so other modules (e.g. Entries save, Google Sheets) hook in.

### 2. Entries module (`includes/modules/entries/`)
- **`cpt.php`** – Registers post type `lean_forms_entry` (show_ui false), `register_meta` for `_lf_form_id`, `_lf_status`, `_lf_data`, `_lf_created`, `_lf_ip`, `_lf_ua`.
- **`save.php`** – Hooks `lean_forms_submission_captured`, saves to CPT with status, data (JSON), created, ip, user_agent.

### 3. REST API (`includes/api.php`)
- **GET** `/lean-forms/v1/entries` – List (paginated, filters: search, status, form_id, date).
- **GET** `/lean-forms/v1/entries/:id` – Single entry.
- **POST** `/lean-forms/v1/entries/:id` – Update status (new/read/spam).
- **DELETE** `/lean-forms/v1/entries/:id` – Delete one.
- **DELETE** `/lean-forms/v1/entries/bulk-delete` – Bulk delete (ids).
- **DELETE** `/lean-forms/v1/entries/delete-by-form/:form_id` – Delete all for form.
- **GET** `/lean-forms/v1/entries/export` – CSV download (filters same as list).

### 4. Admin / dashboard
- **`includes/admin.php`** – Menu “Lean Forms” with submenus Dashboard, Entries (`#/entries`), Modules, License/Upgrade. Renders `<div id="lean-forms-app">`, enqueues `build/admin.js` + `build/admin.css`, localizes `leanFormsAdmin` (apiUrl, nonce, strings, forms).
- **React app** – Hash routing (`#/entries`, `#/modules`, etc.). **Entries page**: DataTable, filters (status, form), search, view entry (EntryModal), mark read/spam, delete, bulk delete, export. Uses `apiFetch` to REST above.

---

## What CF7 Mate has today (after implementation)

| Area | Status |
|------|--------|
| **Submission** | Entries hooks `wpcf7_before_send_mail`; saves status (new/spam), data (JSON), created, ip, user_agent. |
| **CPT** | `cf7m_entry` (show_ui false); `register_post_meta` for `_cf7m_form_id`, `_cf7m_form_title`, `_cf7m_status`, `_cf7m_data`, `_cf7m_created`, `_cf7m_ip`, `_cf7m_ua` on object type `cf7m_entry`. |
| **REST** | GET list (paginated, status, form_id, search), GET single, POST update status, DELETE one, bulk-delete, delete-by-form, GET export CSV. |
| **Dashboard UI** | Submenu “Entries” under Divi → `admin.php?page=cf7-mate-dashboard#/entries`; React hash routing; Entries page with table, filters, search, view modal, mark read/spam, delete, bulk delete, export CSV. |

---

## Task list (order)

1. **Entries backend (CPT + meta)**  
   - [x] Register meta for `_cf7m_form_id`, `_cf7m_status`, `_cf7m_data`, `_cf7m_created`, `_cf7m_ip`, `_cf7m_ua` (and `_cf7m_form_title`) on post type `cf7m_entry`.  
   - [x] CPT labels; show_ui false, custom REST (no show_in_rest).

2. **Submission payload**  
   - [x] On save: set status = `new` or `spam` (from CF7 submission), store `user_agent`, `timestamp` (current_time('mysql')), IP.  
   - [ ] Optional: central “submission” class and `do_action('cf7m_submission_captured', $payload)` (mirrors lean-forms).

3. **Entries REST API**  
   - [x] GET `/cf7-styler/v1/entries` – Paginated list, query args: per_page, page, status, form_id, search.  
   - [x] GET `/cf7-styler/v1/entries/:id` – Single entry (formatted).  
   - [x] POST `/cf7-styler/v1/entries/:id` – Body: `{ status }` (new/read/spam).  
   - [x] DELETE `/cf7-styler/v1/entries/:id` – Delete one.  
   - [x] DELETE `/cf7-styler/v1/entries/bulk-delete` – Body: `{ ids }`.  
   - [x] DELETE `/cf7-styler/v1/entries/delete-by-form/:form_id` – Delete all for form.  
   - [x] GET `/cf7-styler/v1/entries/export` – CSV (same filters as list), permission_callback.

4. **Pro dashboard – Entries UI**  
   - [x] Submenu “Entries” under Divi → `admin.php?page=cf7-mate-dashboard#/entries` (Pro + database_entries only).  
   - [x] Admin app: hash routing; when `#/entries`, render Entries page.  
   - [x] Entries page: table, filters (status, form), search, view entry (modal), mark read/spam, delete, bulk delete, export CSV.  
   - [x] Reuse existing dashboard styles (cf7m-admin, cf7m-card).

5. **Optional**  
   - [ ] Central submission handler class (like lean-forms) and `do_action('cf7m_submission_captured', $payload, $cf7, $submission)`.  
   - [ ] Extract email from data for table column.  
   - [ ] “Page name” where form was submitted (if stored or derivable).

---

## File layout (after implementation)

- **`includes/pro/features/entries/module.php`** – Loads cpt, save, api; registers hooks.  
- **`includes/pro/features/entries/cpt.php`** – Register post type `cf7m_entry` + meta.  
- **`includes/pro/features/entries/save.php`** – Hook `wpcf7_before_send_mail` (or `cf7m_submission_captured`), save to CPT.  
- **`includes/pro/features/entries/api.php`** – REST routes and callbacks (list, get, update, delete, bulk-delete, delete-by-form, export).  
- **`src/admin/`** – Hash routing + Entries page component; submenu “Entries” in PHP.

---

*Last updated from lean-forms reference and current CF7 Mate codebase.*
