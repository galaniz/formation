export default /* html */`
  <frm-pagination-filter
    id="pag-filter-change"
    load-on="change"
    loader="pag-loader"
    error="pag-error"
  >
    <form novalidate>
      <div>
        <label for="pag-filter-change-search">Search</label>
        <input id="pag-filter-change-search" type="text" name="q" data-pag-filter>
      </div>
      <div>
        <label for="pag-filter-change-sort">Sort</label>
        <select id="pag-filter-change-sort" name="sort" data-pag-filter data-testid="pag-filter-change-sort">
          <option value="">Default</option>
          <option value="desc">Latest</option>
          <option value="title">Title</option>
        </select>
      </div>
      <fieldset>
        <legend>Category</legend>
        <div>
          <input id="pag-filter-change-cat-1" type="checkbox" name="cat" value="cat-1" data-pag-filter>
          <label for="pag-filter-change-cat-1">Cat 1</label>
        </div>
        <div>
          <input id="pag-filter-change-cat-2" type="checkbox" name="cat" value="cat-2" data-pag-filter>
          <label for="pag-filter-change-cat-2" data-testid="pag-filter-change-cat-2-label">Cat 2</label>
        </div>
      </fieldset>
      <button type="reset">Clear filters</button>
    </form>
    <ul data-pag-slot="entry">
      <li>
        <a href="/blog/post-1/">Post 1</a>
      </li>
      <li>
        <a href="/blog/post-2/">Post 2</a>
      </li>
    </ul>
    <nav aria-label="Pagination">
      <ol data-pag-slot="nav">
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
      </ol>
    </nav>
  </frm-pagination-filter>
`
