export default /* html */`
  <frm-pagination-filter
    id="pag-filter"
    url="http://localhost:3000/blog/"
    loader="pag-loader"
    error="pag-error"
    none="pag-none"
  >
    <form novalidate>
      <div>
        <label for="pag-sort">Sort</label>
        <select id="pag-sort" name="sort" data-pag-filter>
          <option value="">Default</option>
          <option value="desc">Latest</option>
          <option value="title">Title</option>
          <option value="popular">Popularity</option>
        </select>
      </div>
      <fieldset>
        <legend>Category</legend>
        <div>
          <input id="pag-cat-1" type="checkbox" name="cat" value="cat-1" data-pag-filter>
          <label for="pag-cat-1">Cat 1</label>
        </div>
        <div>
          <input id="pag-cat-2" type="checkbox" name="cat" value="cat-2" data-pag-filter>
          <label for="pag-cat-2">Cat 2</label>
        </div>
        <div>
          <input id="pag-cat-3" type="checkbox" name="cat" value="cat-3" data-pag-filter>
          <label for="pag-cat-3">Cat 3</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Year</legend>
        <div>
          <input id="pag-2025" type="radio" name="year" value="2025" data-pag-filter>
          <label for="pag-2025">2025</label>
        </div>
        <div>
          <input id="pag-2024" type="radio" name="year" value="2024" data-pag-filter>
          <label for="pag-2024">2024</label>
        </div>
        <div>
          <input id="pag-2023" type="radio" name="year" value="2023" data-pag-filter>
          <label for="pag-2023">2023</label>
        </div>
      </fieldset>
      <button type="submit">Apply filters</button>
      <button type="reset">Clear filters</button>
    </form>
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
