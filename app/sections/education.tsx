import { SectionTitle } from "./shared";

export function EducationSection() {
  return (
    <section className="education" id="education">
      <SectionTitle eyebrow="/ My Journey">Where I studied</SectionTitle>
      <div className="timeline">
        <article>
          <span className="step">01</span>
          <div>
            <div className="row">
              <h3>University — Gadjah Mada University </h3>
              <span className="status current">Current</span>
            </div>
            <p>Bachelor’s Degree — Software Engineering Technology</p>
            <small>2025 — On Going</small>
          </div>
        </article>
        <article>
          <span className="step">02</span>
          <div>
            <div className="row">
              <h3>High school — SMAN 1 Sindangkasih</h3>
              <span className="status">Completed</span>
            </div>
            <p>Major — Science</p>
            <small>2022 — 2025</small>
          </div>
        </article>
      </div>
    </section>
  );
}
