export default /* html */`
  <frm-pagination-filter
    id="pag-filter-partial"
    loader="pag-loader"
    error="pag-error"
  >
    <form novalidate></form>
    <ul data-pag-slot="entry">
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
      <ol data-pag-slot="nav">
        <li>
          <span>&larr;</span>
        </li>
        <li>
          <span>
            <span class="a-hide-vis">Current page </span>
            <span>1</span>
          </span>
        </li>
        <li>
          <a href="/blog/?page=2">
            <span class="a-hide-vis">Page </span>
            <span>2</span>
          </a>
        </li>
        <li>
          <a href="/blog/?page=3">
            <span class="a-hide-vis">Page </span>
            <span>3</span>
          </a>
        </li>
        <li>
          <a href="/blog/?page=2" aria-label="Next page">&rarr;</a>
        </li>
      </ol>
    </nav>
  </frm-pagination-filter>
`
