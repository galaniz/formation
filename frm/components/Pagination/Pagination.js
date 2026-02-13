export default /* html */`
  <frm-pagination
    id="pag"
    loader="pag-loader"
    error="pag-error"
  >
    <ul data-pag-slot="entry" data-testid="pag-entry">
      <li>
        <a href="/blog/post-1/">Post 1</a>
      </li>
      <li>
        <a href="/blog/post-2/">Post 2</a>
      </li>
      <li>
        <a href="/blog/post-3/">Post 3</a>
      </li>
      <li>
        <a href="/blog/post-4/">Post 4</a>
      </li>
    </ul>
    <nav aria-label="Pagination">
      <ol data-pag-slot="nav" data-testid="pag-nav">
        <li>
          <span aria-hidden="true">&larr;</span>
        </li>
        <li>
          <span>
            <span class="a-hide-vis">Current page </span>
            <span>1</span>
          </span>
        </li>
        <li>
          <a href="/blog/?page=2" data-testid="pag-2">
            <span class="a-hide-vis">Page </span>
            <span>2</span>
          </a>
        </li>
        <li>
          <a href="/blog/?page=3" data-testid="pag-3">
            <span class="a-hide-vis">Page </span>
            <span>3</span>
          </a>
        </li>
        <li>
          <a href="/blog/?page=2" aria-label="Next page" data-testid="pag-next">
            &rarr;
          </a>
        </li>
      </ol>
    </nav>
  </frm-pagination>
`
