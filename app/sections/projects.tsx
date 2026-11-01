import { projects } from "./data";
import { ASSET_PATH, Arrow, SectionTitle } from "./shared";

export function ProjectsSection() {
  return (
    <section className="works" id="projects">
      <SectionTitle eyebrow="/ Best Projects">Selected Works</SectionTitle>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div
              className="project-preview"
              style={{
                backgroundImage: `url("${ASSET_PATH}/93773.png")`,
                backgroundPosition: project.position,
              }}
            />
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="category">{project.category}</p>
              <span className="chip">Tech stack — confirm</span>
              <p>{project.description}</p>
              <div className="project-links">
                <a href="#contact">
                  Case study <Arrow />
                </a>
                <a href="#contact">
                  Live / Repo <Arrow />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
