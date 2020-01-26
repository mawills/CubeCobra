const express = require('express');
const router = express.Router();
var util = require('../serverjs/util.ts');

const { ensureAuth, csrfProtection } = require('./middleware');

// Bring in models
let User = require('../models/user');
let Blog = require('../models/blog');

router.use(csrfProtection);

router.get('/blog', function(req, res) {
  res.redirect('/dev/blog/0');
});

router.get('/blog/:id', function(req, res) {
  if (!req.user) {
    req.user = {
      _id: '',
    };
  }
  User.findById(req.user._id, function(err, user) {
    var admin = util.isAdmin(user);

    Blog.find({
      dev: 'true',
    })
      .sort('date')
      .exec(function(err, blogs) {
        blogs.forEach(function(item, index) {
          if (!item.date_formatted) {
            item.date_formatted = item.date.toLocaleString('en-US');
          }
        });
        var pages = [];
        blogs.reverse();
        if (blogs.length > 10) {
          var page = parseInt(req.params.id);
          if (!page) {
            page = 0;
          }
          for (i = 0; i < blogs.length / 10; i++) {
            if (page == i) {
              pages.push({
                url: '/dev/blog/' + i,
                content: i + 1,
                active: true,
              });
            } else {
              pages.push({
                url: '/dev/blog/' + i,
                content: i + 1,
              });
            }
          }
          blog_page = [];
          for (i = 0; i < 10; i++) {
            if (blogs[i + page * 10]) {
              blog_page.push(blogs[i + page * 10]);
            }
          }

          if (admin) {
            res.render('blog/devblog', {
              blogs: blog_page,
              pages: pages,
              admin: 'true',
              loginCallback: '/dev/blog/' + req.params.id,
            });
          } else {
            res.render('blog/devblog', {
              blogs: blog_page,
              pages: pages,
              loginCallback: '/dev/blog/' + req.params.id,
            });
          }
        } else {
          if (admin) {
            res.render('blog/devblog', {
              blogs: blogs,
              admin: 'true',
              loginCallback: '/dev/blog/' + req.params.id,
            });
          } else {
            res.render('blog/devblog', {
              blogs: blogs,
              loginCallback: '/dev/blog/' + req.params.id,
            });
          }
        }
      });
  });
});

router.post('/blogpost', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && util.isAdmin(user)) {
      var blogpost = new Blog();
      blogpost.title = req.body.title;
      if (req.body.html && req.body.html.length > 0) {
        blogpost.html = req.body.html;
      } else {
        blogpost.body = req.body.body;
      }
      blogpost.owner = user._id;
      blogpost.date = Date.now();
      blogpost.dev = 'true';
      blogpost.date_formatted = blogpost.date.toLocaleString('en-US');

      await blogpost.save();

      req.flash('success', 'Blog post successful');
      res.redirect('/dev/blog');
    }
  } catch (err) {
    res.status(500).send({
      success: 'false',
      message: err,
    });
    console.error(err);
  }
});

module.exports = router;
