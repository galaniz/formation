export default /* html */`
  <frm-pagination-filter
    id="pag-filter-partial"
    url="http://localhost:3000/blog/"
    loader="pag-loader"
    error="pag-error"
  >
    <form novalidate></form>
    <ul data-pag-slot="entry">
      <li data-pag-entry>
        <a href="http://localhost:3000/blog/post-1/">Post 1</a>
      </li>
      <li data-pag-entry>
        <a href="http://localhost:3000/blog/post-2/">Post 2</a>
      </li>
      <li data-pag-entry>
        <a href="http://localhost:3000/blog/post-3/">Post 3</a>
      </li>
      <li data-pag-entry>
        <a href="http://localhost:3000/blog/post-4/">Post 4</a>
      </li>
      <li data-pag-entry>
        <a href="http://localhost:3000/blog/post-5/">Post 5</a>
      </li>
    </ul>
    <nav aria-label="Pagination">
      <ol data-pag-slot="nav">
        <li data-pag-nav="prev-text">
          <span>&larr;</span>
        </li>
        <li data-pag-nav="current">
          <span>
            <span class="a-hide-vis">Current page </span>
            <span data-pag-num>1</span>
          </span>
        </li>
        <li data-pag-nav="item">
          <a href="http://localhost:3000/blog/?page=2">
            <span class="a-hide-vis">Page </span>
            <span data-pag-num>2</span>
          </a>
        </li>
        <li data-pag-nav="item">
          <a href="http://localhost:3000/blog/?page=3">
            <span class="a-hide-vis">Page </span>
            <span data-pag-num>3</span>
          </a>
        </li>
        <li data-pag-nav="ellipsis">
          <span aria-hidden="true">&hellip;</span>
        </li>
        <li data-pag-nav="next">
          <a href="http://localhost:3000/blog/?page=2" aria-label="Next page">&rarr;</a>
        </li>
      </ol>
    </nav>
  </frm-pagination-filter>
`
