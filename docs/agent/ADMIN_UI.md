# Admin app – shadcn + Tailwind

The CF7 Mate admin dashboard uses **Tailwind CSS** and a **shadcn-style** design system.

## Stack

- **Tailwind CSS** – `tailwind.config.js`, `@tailwind` in `src/admin/style.scss`. Theme extended with shadcn design tokens (CSS variables).
- **shadcn-style** – Design tokens (background, foreground, primary, muted, border, etc.) and reusable UI components. No Radix/shadcn CLI; components are built with Tailwind + `cn()` in-repo.
- **cn()** – `src/admin/lib/utils.js` merges class names with `classnames` + `tailwind-merge` for conflict-free Tailwind classes.

## Design tokens (CSS variables)

Defined in `src/admin/style.scss` under `:root`:

- `--background`, `--foreground`, `--card`, `--primary`, `--primary-foreground`
- `--secondary`, `--muted`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`

Tailwind theme in `tailwind.config.js` maps these so you can use: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `rounded-lg`, etc.

## UI components

Location: `src/admin/components/ui/`

| Component | File | Usage |
|-----------|------|--------|
| Button | `Button.js` | `variant`: default, destructive, outline, secondary, ghost, link. `size`: default, sm, lg, icon. |
| Card | `Card.js` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Table | `Table.js` | Table, TableInner, TableHeader, TableBody, TableRow, TableHead, TableCell |
| Input | `Input.js` | Text inputs with border/ring from design tokens |
| Badge | `Badge.js` | variant: default, secondary, destructive, outline, muted |
| Tooltip | `Tooltip.js` | Hover to reveal; props: content, side (top/bottom/left/right) |

Import from `components/ui` or `components/ui/Button` etc. Use `cn()` for conditional or overridable classes.

## Usage

```js
import { cn } from '../lib/utils';
import { Button, Card, Badge } from '../components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge variant="secondary">New</Badge>
    <Button variant="destructive">Delete</Button>
  </CardContent>
</Card>
```

## Entries table

The Entries list and single-entry views use Tailwind utility classes and (where applicable) the UI components above so the admin app consistently uses shadcn + Tailwind.
