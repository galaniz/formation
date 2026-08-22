export default /* html */`
  <frm-pagination-filter
    id="pag-filter"
    loader="pag-loader"
    error="pag-error"
  >
    <form novalidate>
      <div>
        <label for="pag-filter-search">Search</label>
        <input id="pag-filter-search" type="text" name="q" data-pag-filter data-testid="pag-filter-search">
      </div>
      <div>
        <label for="pag-filter-sort">Sort</label>
        <select id="pag-filter-sort" name="sort" data-pag-filter data-testid="pag-filter-sort">
          <option value="">Default</option>
          <option value="desc">Latest</option>
          <option value="title">Title</option>
          <option value="popular">Popularity</option>
        </select>
      </div>
      <fieldset>
        <legend>Category</legend>
        <div>
          <input id="pag-filter-cat-1" type="checkbox" name="cat" value="cat-1" data-pag-filter>
          <label for="pag-filter-cat-1" data-testid="pag-filter-cat-1-label">Cat 1</label>
        </div>
        <div>
          <input id="pag-filter-cat-2" type="checkbox" name="cat" value="cat-2" data-pag-filter data-testid="pag-filter-cat-2">
          <label for="pag-filter-cat-2" data-testid="pag-filter-cat-2-label">Cat 2</label>
        </div>
        <div>
          <input id="pag-filter-cat-3" type="checkbox" name="cat" value="cat-3" data-pag-filter>
          <label for="pag-filter-cat-3" data-testid="pag-filter-cat-3-label">Cat 3</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Year</legend>
        <div>
          <input id="pag-filter-2025" type="radio" name="year" value="2025" data-pag-filter>
          <label for="pag-filter-2025" data-testid="pag-filter-2025-label">2025</label>
        </div>
        <div>
          <input id="pag-filter-2024" type="radio" name="year" value="2024" data-pag-filter>
          <label for="pag-filter-2024" data-testid="pag-filter-2024-label">2024</label>
        </div>
        <div>
          <input id="pag-filter-2023" type="radio" name="year" value="2023" data-pag-filter data-testid="pag-filter-2023">
          <label for="pag-filter-2023" data-testid="pag-filter-2023-label">2023</label>
        </div>
      </fieldset>
      <button type="submit" data-testid="pag-filter-submit">Apply filters</button>
      <button type="reset" data-testid="pag-filter-reset">Clear filters</button>
    </form>
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
