## Underscore Arity Iterators

This package extends underscore to add arity-bound equivalents of many of the collection iterators Underscore provides.

*a.k.a* `map1` and friends.

### Installation

```
npm install underscore-arity-iterators
```

Or, download the single `underscore.arity-iterators.js` file.

The file, when included on the page or `require`d by Node, will mix itself into Underscore which it expects to find either as `require('underscore')` or a global `_` variable. In CommonJS environments, it re-exports Underscore.

### Why?

Because of situations like this old chestnut:

```js
// Let's parse these strings into integers...
var res = _.map(['10', '20', '30'], parseInt);

// res = [10, NaN, NaN]

// OMGWTFBBQ JAVASCRIPT IS THE WROST!!!!!!``1
```

Of course, what's happening here is that in calls to `.map` and others like it (eg: `filter`, `each`, and so on), the iterator function is passed three arguments: `(value, index, array)`. Sometimes these extra arguments are useful. Sometimes they just get in the way. In the example above, it essentially translated to this:

```js
res = [
  parseInt('10', 0, ['10', '20', '30']),
  parseInt('20', 1, ['10', '20', '30']),
  parseInt('30', 2, ['10', '20', '30'])
];
```

*('20' and '30' are not valid numbers in base 1 and 2 respectively, so the result is `NaN`)*

What you obviously want in a situation like this is an iterator which only receives the first argument. This is what this package provides.

```js
// map1 == map which takes one argument
_.map1(['10', '20', '30'], parseInt); // [10, 20, 30]
```

In some cases, it might be important to only get the first two arguments, so that exists as well with a `2` suffix.

### What's included?

All the underscore methods which take an iteratee or predicate have a `1`- and a `2`-suffixed version. `reduce` and `reduceRight` have a slightly different signature (the function receives `(memo, value, index, array)`), so they have `reduce2` and `reduce3`.

Here's the list:

- `map1`, `map2`
- `each1`, `each2`
- `reduce2`, `reduce3`
- `reduceRight2`, `reduceRight3`
- `filter1`, `filter2`
- `find1`, `find2`
- `reject1`, `reject2`
- `every1`, `every2`
- `some1`, `some2`
- `sortBy1`, `sortBy2`
- `groupBy1`, `groupBy2`
- `indexBy1`, `indexBy2`
- `countBy1`, `countBy2`
- `partition1`, `partition2`

All of these also exist under the aliases which Underscore provides, for example `collect1` is the same as `map1`.

These also work with chaining:

```js
_.chain(['hey', 'sup', '10', '0', '-5'])
 .map1(parseInt)
 .compact()
 .value();  // [10, -5]
```

### Can't you do this another way?

Totally, yes. For example, lodash provides a function called [`ary`](https://lodash.com/docs#ary) which you could use like this:

```js
_.map(['6', '8', '10'], _.ary(parseInt, 1))
```

Underscore contrib has quite a few functions which do similar, for example [`unary`](http://documentcloud.github.io/underscore-contrib/#unary).

Since I only have a need for tweaking the arity of functions when using these iterators, I thought it cleaner to bake it directly into them with a special name.

Under the covers, the exact same thing is happening when the code is executed, so it's just a matter of taste which you prefer.

### Happy hacking.
