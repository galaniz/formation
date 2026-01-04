export default /* html */`
  <frm-pagination
    id="pag"
    url="http://localhost:3000/blog/"
    loader="pag-loader"
    error="pag-error"
    none="pag-none"
  >
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
    </ul>
    <nav aria-label="Pagination">
      <ol data-pag-slot="nav">
        <li data-pag-nav="prev-text">
          <span aria-hidden="true">&larr;</span>
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
  </frm-pagination>
  <template id="pag-loader">
    <div tabindex="-1">Pagination loader</div>
  </template>
  <template id="pag-error">
    <div tabindex="-1">
      <p>Sorry, there is a problem with the service.</p>
    </div>
  </template>
  <template id="pag-none">
    <div tabindex="-1">
      <p>Looks like no posts were found.</p>
    </div>
  </template>
`
