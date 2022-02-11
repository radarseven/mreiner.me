# Craft CMS / LEMP Setup

## Gotchas
- [MySQL issue](http://craftcms.stackexchange.com/questions/12084/getting-this-sql-error-group-by-incompatible-with-sql-mode-only-full-group-by)
- [`nginx` site block](https://github.com/nystudio107/nginx-craft)

# Deployments with [Capistrano 3.8](http://capistranorb.com)



-----

# Gulp Front-end Build Automation

## Prerequisites

- NPM ([https://www.npmjs.com/])(https://www.npmjs.com/)
- Gulp ([http://gulpjs.com/](http://gulpjs.com/))

## Installation

    npm install; 

## What It Does


### Build Automation

(Needs to be updated)

## What Goes Where

Project Boilerplate makes some assumptions about where assets files are stored.

### Public Directory

All content viewable in a web browser is in the `public` directory. This is the public "root".

### Source Files
The "source" asset files are unminifed and uncompressed - they are meant to be read by humans.

'Source' assets files hierarchy:

~~~
src
 - img
 - js
 - scss
~~~

### Build Files
These files are minified, combined, uglified, etc. The goal for these files is to optimize for speed so pages load faster.

'Build' assets files hierarchy:

~~~
public
 - assets
   - css
   - img
   - js
~~~

## Bourbon, Neat and Normalize

The fantastic [Bourbon](http://bourbon.io/) and [Neat](http://neat.bourbon.io/) are used to jumpstart the styling of the site.

Bourbon is 'a simple and lightweight mixin library for Sass' and Neat is 'a lightweight semantic grid framework for Sass and Bourbon'.

To make sure we start with a blank slate, [normalize.scss](https://github.com/kristerkari/normalize.scss) is used.
