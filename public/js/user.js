$(function () {
    $('#user-basic-info-submit')
        .click(function (event) {
            event.preventDefault();
            const groupName = $.trim($('#groupname').val())
            const jobName = $.trim($('#jobname').val())
            const introduce = $.trim($('#introduce').val())
            $.ajax({
                type: "POST",
                url: '/profile/baisc',
                data: JSON.stringify({groupName, jobName, introduce}),
                contentType: "application/json; charset=utf-8",
                success: function () {
                    toastr.success("保存信息成功")
                    setTimeout(function () {
                        window
                            .location
                            .reload()
                    }, 1000)
                },
                failure: function () {
                    toastr.error("保存信息失败")
                }
            })
        });
    $('#user-basic-skill-submit').click(function (event) {
        event.preventDefault();
        const skills = $('#user-skill-select-input').val();
        $.ajax({
            type: "POST",
            url: '/api/user/skill',
            data: JSON.stringify({skills}),
            contentType: "application/json; charset=utf-8",
            success: function () {
                toastr.success("保存信息成功")
                setTimeout(function () {
                    window
                        .location
                        .reload()
                }, 1000)

            },
            failure: function () {
                toastr.error("保存信息失败")
            }
        })
    })

    $('#user-profile-link-submit').click(function (event) {
        event.preventDefault();
        const globe_url = $.trim($('#globe_url').val())
        const github_url = $.trim($('#github_url').val())
        const facebook_url = $.trim($('#facebook_url').val())
        const weibo_url = $.trim($('#weibo_url').val())
        const twitter_url = $.trim($('#twitter_url').val())
        $.ajax({
            type: "POST",
            url: '/api/user/links',
            data: JSON.stringify({globe_url, github_url, facebook_url, weibo_url, twitter_url}),
            contentType: "application/json; charset=utf-8",
            success: function () {
                toastr.success("保存信息成功")
                setTimeout(function () {
                    window
                        .location
                        .reload()
                }, 1000)

            },
            failure: function () {
                toastr.error("保存信息失败")
            }
        })
    })

    $("#user-skill-select-input").select2({
        tags: true,
        tokenSeparators: [','],
        ajax: {
            url: '/api/skills',
            delay: 250,
            dataType: 'json',
            processResults: function (data) {
                console.log(data)
                return {results: data.data}
            },
            cache: true
        },
        createTag: function (params) {
            console.log(params)
            var term = $.trim(params.term);
            if (term === '') {
                return null;
            }
            return {
                id: term,
                text: term + ' (新增)'
            };
        }
    });
})