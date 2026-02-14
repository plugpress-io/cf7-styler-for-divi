export function HeroSection({
	ariaLabel,
	title,
	description,
	features = [],
	media,
}) {
	return (
		<section className="cf7m-dashboard-hero" aria-label={ariaLabel || null}>
			<div className="cf7m-dashboard-hero__content">
				{title && (
					<h1 className="cf7m-dashboard-hero__title">{title}</h1>
				)}
				{description && (
					<p className="cf7m-dashboard-hero__text">{description}</p>
				)}
				{features.length > 0 && (
					<ul
						className="cf7m-dashboard-hero__features"
						aria-hidden="true"
					>
						{features.map((feature) => (
							<li key={feature}>{feature}</li>
						))}
					</ul>
				)}
			</div>
			{media != null && (
				<div className="cf7m-dashboard-hero__media" aria-hidden="true">
					{media}
				</div>
			)}
		</section>
	);
}
