import { whyItems } from "./data";

export function WhySection() {
  return (
    <section className="why-showlanka">
      <div className="sl-container">
        <p className="uppercase-subtitle border-after">Why travel with Show Lanka?</p>
        <h2 className="section-title">Explore Sri Lanka Like a Local</h2>
        <div className="sl-row bordered-posts">
          {whyItems.map((item) => (
            <article key={item.title} className="sl-col-lg-4 sl-col-12 threecol-container">
              <div className="sl-row threecol-inner sl-flex sl-flex-1">
                <div className="sl-col-12 text-content">
                  <h3>{item.title}</h3>
                  {"emptyQuote" in item ? <blockquote className="wp-block-quote" /> : null}
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                  <p>{item.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
