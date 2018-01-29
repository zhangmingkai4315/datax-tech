const middleware = require('../../authenticate/middleware');
const db = require('../../models')

module.exports = (app, passport) => {
    app.get('/user/:username', middleware.authenticationMiddle, (req, res) => {
        // console.log(req.user) console.log(req.params)
        const username = req.params.username
        if (!username) {
            res.render('common/500.ejs');
        }
        db
            .User
            .findOne({where: {
                    username
                }})
            .then((user) => {
                if (user) {
                    res.render('user/profile.ejs', {
                        user: user,
                        title: `用户:${user.username}`,
                        editable: req.user.username === username
                    });
                } else {
                    res.render('common/404.ejs', {title: 'Error 404'})
                }
            })
            .catch(() => {
                res.render('common/500.ejs', {title: 'Error 500'});
            })
    });
    app.get('/user/:username/edit', middleware.authenticationMiddle, (req, res) => {
        // console.log(req.user) console.log(req.params)
        const username = req.params.username
        if (!username) {
            res.render('common/500.ejs');
        }
        db
            .User
            .findOne({where: {
                    username
                }})
            .then((user) => {
                if (user) {
                    res.render('user/edit.ejs', {
                        user: user,
                        title: `用户:${user.username}`,
                        editable: req.user.username === username
                    });
                } else {
                    res.render('common/404.ejs', {title: 'Error 404'})
                }
            })
            .catch(() => {
                res.render('common/500.ejs', {title: 'Error 500'});
            })
    });

};
