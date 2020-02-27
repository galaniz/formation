
/*
 * Generate unique id
 * ------------------
 *
 * Source: https://gist.github.com/gordonbrander/2230317
 *
 * @return [string]
 */

export const generateId = () => {
    return '_' + Math.random().toString( 36 ).substr( 2, 9 );
};
