const Uploader = require('jquery-file-upload-middleware');
const middleware = require('../../authenticate/middleware');
const db = require('../../models')
const utils = require('../utils')
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
    app.post('/profile/baisc', middleware.authenticationMiddle, (req, res) => {
        db
            .User
            .update({
                group_name: req.body.groupName || '',
                job_name: req.body.jobName || ''
            }, {
                where: {
                    id: req.user.id
                }
            })
            .then((result) => {
                res.json({data: result})
            })
            .catch((err) => {
                res
                    .status(500)
                    .json({error: err})
            })
    });

    app.get('/api/user/skill', middleware.authenticationMiddle, (req, res) => {
        req
            .user
            .getSkill()
            .then(skill => {
                console.log(skill)
                return res.json({data: skill})
            })
            .catch(err => {
                return res
                    .status(500)
                    .json({error: err})
            })
    })

    app.post('/api/user/skill', middleware.authenticationMiddle, (req, res) => {
        const skills = req.body.skills;
        const newSkills = skills.filter(s => typeof s === 'string')
        const oldSkills = skills.filter(s => typeof s === 'number')
        console.log(utils.getMethods(req.user))

        req
            .user
            .setSkills([])
            .then(() => {
                if (skills.length === 0) {
                    res.json({data: "remove all skills"})
                }
                const newSkillObject = newSkills.map(n => db.Skill.create({name: n}))
                return db
                    .Skill
                    .bulkCreate(newSkillObject)
            })
            .then(skills => {
                return req
                    .user
                    .setSkills(skills)
            })
            .then(() => {
                return db
                    .Skill
                    .findAll({
                        where: {
                            id: {
                                $in: oldSkills
                            }
                        }
                    })
            })
            .then((oldSkills) => {
                return req
                    .user
                    .setSkills(oldSkills)
            })
            .then(() => {
                return res.json({data: 'success'})
            })
            .catch(err => {
                console.log(err)
                return res.json({error: 'error'})
            })
    })
    app.use('/upload/userimg', middleware.authenticationMiddle, function (req, res, next) {

        Uploader
            .on('end', function (fileinfo, req, res) {
                console.log(fileinfo)
                db
                    .User
                    .update({
                        image_url: fileinfo.url || '',
                        thunbnail_url: fileinfo.thumbnailUrl || ''
                    }, {
                        where: {
                            id: req.user.id
                        }
                    })
                    .then(() => {
                        console.log('update user img success')
                    })
                    .catch(err => console.log(err))
            })
        Uploader.fileHandler({
            uploadDir: function () {
                return req
                    .app
                    .get('uploadPath') + req.user.username
            },
            uploadUrl: function () {
                return '/uploads/' + req.user.username
            }
        })(req, res, next);
    });
};
