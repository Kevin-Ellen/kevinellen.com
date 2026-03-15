// src/app/pages/home.page.ts

const htmlContent = `
<main class="l-frame">
      <article>

        <header class="l-content m-article-heading">
          <p class="m-article-heading__eyebrow">Field Notes</p>
          <h1 class="m-article-heading__title">Why quiet structure matters in a photography portfolio</h1>
          <p class="m-article-heading__intro">A thoughtful portfolio does more than display images. It gives them space, context, and rhythm, allowing the work to feel intentional rather than simply uploaded.</p>
        </header>

        <figure class="m-photo m-photo--immersive" >
          <img class="m-photo__object" src="https://placecats.com/600/400" alt="alt" width="3" height="2" loading="eager" decoding="async">
          <figcaption class="m-photo__annotation">
            <p class="m-photo__caption">A full-width image acts as the visual anchor for the article, with caption and metadata supporting the photograph rather than competing with it.</p>
            <dl class="m-photo__meta">

              <div class="m-photo__meta-item">
                <dt class="m-photo__meta-term">Location</dt>
                <dd class="m-photo__meta-detail">Walthamstow Wetlands, United Kingdom</dd>
              </div>

              <div class="m-photo__meta-item">
                <dt class="m-photo__meta-term">Settings</dt>
                <dd class="m-photo__meta-detail">1/1000 sec · f/7.1 · 500mm  · ISO 800</dd>
              </div>
            </dl>
          </figcaption>
        </figure>
        <section class="l-content">
          <h2>The difference between showing and presenting</h2>
          <p>A gallery of strong photographs can still feel flat if every image is treated the same way. Presentation is what turns a collection into a body of work. Structure, spacing, typography, and sequencing all influence how a viewer reads an image before they have fully understood what they are looking at. In that sense, design does not compete with photography; it frames attention and helps the work land with more clarity.</p>
          <p>That distinction matters even more on a personal site. Without care, a portfolio can quickly become a storage layer: useful, but emotionally thin. With a considered reading experience, however, the same images begin to feel deliberate. The viewer understands not only <em>what</em> was photographed, but also why it mattered enough to be included.</p>
        </section>

        <section class="l-content">
          <h2>Letting the content breathe</h2>
          <p>Editorial content benefits from restraint. A clear heading, a well-paced introduction, and body text that is comfortable to read create trust immediately. When the structure is calm, the photographs gain authority. They are not fighting against decorative layout decisions or inconsistent text treatments. Instead, the page feels deliberate, as though each image and paragraph has earned its place.</p>
          <p>This is especially important for nature photography, where tone matters as much as detail. A quiet visual system can support a sense of patience, observation, and care. It allows technical information, personal reflection, and imagery to sit alongside one another without the experience becoming busy. That balance is often what separates a personal archive from a considered portfolio.</p>

          <blockquote>
            <p>A strong photograph does not always need a loud presentation. More often, it needs space, rhythm, and just enough structure to let the viewer stay with it a little longer.</p>
            <cite>Field note on editorial presentation</cite>
          </blockquote>

          <p>When the page settles down, the image has room to work. Fine detail, gesture, atmosphere, and scale all become easier to notice. That is valuable in wildlife and landscape work alike, because both depend on observation. The design should support that act of looking, not interrupt it.</p>
        </section>

        <section class="l-content">
          <h2>Building hierarchy without noise</h2>
          <p>A good typographic system does not rely on constant novelty. It creates a hierarchy that the reader can learn almost immediately. Large headings signal entry points, subheadings narrow the topic, and body text carries the substance. Once this pattern becomes familiar, the interface starts to disappear and the content becomes easier to inhabit.</p>

          <h3>Why heading rhythm matters</h3>
          <p>Headings should do more than increase in size from one level to the next. They need to signal purpose. A page title anchors the whole piece, while section headings break the article into meaningful turns. Lower-level headings should become progressively quieter, tightening the structure without creating visual chatter.</p>
          <p>This is one reason a restrained palette and disciplined spacing matter so much. If the hierarchy is built carefully, the reader should never need to stop and decode the page. They should simply move through it.</p>

          <h3>Supporting detail without clutter</h3>
          <p>Photography pages often need to carry supporting information: location, equipment, settings, dates, perhaps even environmental conditions or personal observations. That information is useful, but it should remain secondary to the image and the writing. Good hierarchy ensures that metadata feels available rather than demanding.</p>

          <h4>Useful signals for the reader</h4>
          <p>Even a simple article benefits from a few reliable structural cues. For example:</p>
          <ul>
            <li>a short eyebrow to frame the type of content,</li>
            <li>a clear title that anchors the page,</li>
            <li>an introduction that sets tone and context,</li>
            <li>section headings that guide longer reading, and</li>
            <li>captions and metadata that support, rather than dominate.</li>
          </ul>
        </section>

        <section class="l-content">
          <h2>Why this matters for a portfolio site</h2>
          <p>A portfolio is rarely judged only on the quality of its best image. It is judged on the total experience: how the work is sequenced, how the pages feel, how the writing sounds, and whether the whole system gives the impression of care. That does not mean over-designing everything. In fact, it usually means the opposite. The more thoughtful the structure, the less it needs to announce itself.</p>
          <p><strong>Quiet consistency</strong> is often what makes a site feel trustworthy. The same body rhythm, the same heading logic, and the same approach to captions and supporting text all help create that trust. Over time, the typography becomes part of the site’s identity, just as much as the photography itself.</p>
          <p>For a portfolio rooted in nature, reflection, and technical clarity, that consistency matters. It lets the work feel personal without becoming messy, and professional without becoming cold. The result is not simply a place to host images, but a platform that gives them an appropriate voice.</p>
        </section>

        <footer class="l-content m-article-footer">
          <h2 class="u-sr-only">Article footer</h2>
          <section class="m-article-footer__group">
            <h3 class="m-article-footer__heading">Publication</h3>
            <dl class="m-article-footer__list">
              <div class="m-article-footer__item">
                <dt class="m-article-footer__label">Written by</dt>
                <dd class="m-article-footer__value">Kevin Ellen</dd>
              </div>
              <div class="m-article-footer__item">
                <dt class="m-article-footer__label">Published</dt>
                <dd class="m-article-footer__value">15 March 2026</dd>
              </div>
              <div class="m-article-footer__item">
                <dt class="m-article-footer__label">Last update</dt>
                <dd class="m-article-footer__value">15 March 2026</dd>
              </div>
            </dl>
          </section>

          <section class="m-article-footer__group">
            <h3 class="m-article-footer__heading">Field notes</h3>
            <dl class="m-article-footer__list">
              <div class="m-article-footer__item">
                <dt class="m-article-footer__label">Camera</dt>
                <dd class="m-article-footer__value">Canon EOS R7</dd>
              </div>
              <div class="m-article-footer__item">
                <dt class="m-article-footer__label">Lens</dt>
                <dd class="m-article-footer__value">RF 100–500mm</dd>
              </div>
            </dl>
          </section>

          <section class="m-article-footer__group">
            <h3 class="m-article-footer__heading">Tags</h3>
            <ul class="m-article-footer__tags">
              <li><a href="/">Tag 1</a></li>
              <li><a href="/">Tag 2</a></li>
              <li><a href="/">Tag 3</a></li>
              <li><a href="/">Tag 4</a></li>
              <li><a href="/">Tag 5</a></li>
            </ul>
          </section>
        </footer>

      </article>
    </main>
    `;

export default {
  id: "home",
  title: "Home",
  content: htmlContent,
  noindex: true,
};
