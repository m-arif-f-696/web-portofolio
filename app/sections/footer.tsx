import { navigation } from "./data";

export function FooterSection() {
  return (
    <footer>
      <div>
        <a className="footer-name" href="#home">Arif</a>
        <nav aria-label="Footer navigation">
          {navigation.map(([label, id]) => (
            <a href={`#${id}`} key={id}>{label}</a>
          ))}
        </nav>
      </div>
      <p>© 2026 Arif. All rights reserved.</p>
    </footer>
  );
}
