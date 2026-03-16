// src/app/renderers/partials/pageFooter.partial.ts

const renderPageFooter = (): string => {
  return `
<footer class="l-footer">
  <h2 class="u-sr-only">Page footer</h2>
  <div class="l-page__frame">
    <div class="l-footer__grid">
      <section class="l-footer__group">
        <h3 class="l-footer__heading">Site</h3>
        <ul class="l-footer__list">
          <li><a href="/journal">Journal</a></li>
          <li><a href="/photos">Photos</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </section>

      <section class="l-footer__group">
        <h3 class="l-footer__heading">Practice</h3>
        <ul class="l-footer__list">
          <li><a href="/equipment">Equipment</a></li>
          <li><a href="/field-notes">Field Notes</a></li>
        </ul>
      </section>

      <section class="l-footer__group">
        <h3 class="l-footer__heading">Elsewhere</h3>
        <ul class="l-footer__list">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Instagram</a></li>
        </ul>
      </section>
    </div>

    <section class="l-footer__conservation" aria-labelledby="footer-conservation-heading">
      <h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3>
      <p class="l-footer__intro">
        Supporting organisations that protect habitats, species, and access to nature.
      </p>

      <ul class="l-footer__logos" aria-label="Supported organisations">
        <li>
          <a href="#" aria-label="RSPB">
            <svg class="l-footer__icon l-footer__icon--rspb" aria-hidden="true" width="1" height="1">
              <use href="#logo-rspb"></use>
            </svg>
          </a>
        </li>
        <li>
          <a href="#" aria-label="National Trust">
            <svg class="l-footer__icon l-footer__icon--national-trust" aria-hidden="true" width="1" height="1">
              <use href="#logo-national-trust"></use>
            </svg>
          </a>
        </li>
        <li>
          <a href="#" aria-label="Vogelbescherming Nederland">
            <svg class="l-footer__icon l-footer__icon--vogelbescherming" aria-hidden="true" width="829" height="292">
              <use href="#logo-vogelbescherming-nederland"></use>
            </svg>
          </a>
        </li>
      </ul>
    </section>

    <div class="l-footer__meta">
      <p>© 2026 Kevin Ellen</p>
    </div>
  </div>
</footer>
`;
};
export default renderPageFooter;
