import { tourPackages } from "./data";

export function PackagesSection() {
  return (
    <section className="packages-section">
      <div className="sl-container-fluid">
        <p className="uppercase-subtitle border-after">Your Gateway to Authentic Sri Lankan Adventures</p>
        <h2 className="section-title">Tour Packages</h2>
        <div className="sl-row main-package-list-container">
          {tourPackages.map((pkg) => (
            <article key={pkg.slug} className="sl-col-lg-4 sl-col-12 mainpack-container">
              <div className="sl-row inner-container sl-flex sl-flex-1">
                <div
                  className="sl-col-12 bg-image-container"
                  role="img"
                  aria-label={pkg.title}
                  style={{ backgroundImage: `url('${pkg.image}')` }}
                >
                  <span />
                </div>
                <div className="sl-col-12 text-content">
                  <h3>{pkg.title}</h3>
                  <a target="_blank" className="post-readmore-link" href={pkg.href}>
                    <span>Read More</span>
                    <span className="sr-only"> about {pkg.title}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
