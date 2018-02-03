$(() => {
  $("#user-basic-info-submit").click((event) => {
    event.preventDefault();
    const groupName = $.trim($("#groupname").val());
    const jobName = $.trim($("#jobname").val());
    const introduce = $.trim($("#introduce").val());
    $.ajax({
      type: "POST",
      url: "/user/profile/basic",
      data: JSON.stringify({groupName, jobName, introduce}),
      contentType: "application/json; charset=utf-8",
      success: () => {
        toastr.success("保存信息成功");
        setTimeout(() => {
          window
            .location
            .reload();
        }, 1000);
      },
      failure: () => {
        toastr.error("保存信息失败");
      }
    });
  });
  $("#user-basic-skill-submit").click((event) => {
    event.preventDefault();
    const skills = $("#user-skill-select-input").val();
    $.ajax({
      type: "POST",
      url: "/user/skill",
      data: JSON.stringify({skills}),
      contentType: "application/json; charset=utf-8",
      success: () => {
        toastr.success("保存信息成功");
        setTimeout(() => {
          window
            .location
            .reload();
        }, 1000);
      },
      failure: () => {
        toastr.error("保存信息失败");
      }
    });
  });

  $("#user-profile-link-submit").click((event) => {
    event.preventDefault();
    const globe_url = $.trim($("#globe_url").val());
    const github_url = $.trim($("#github_url").val());
    const facebook_url = $.trim($("#facebook_url").val());
    const weibo_url = $.trim($("#weibo_url").val());
    const twitter_url = $.trim($("#twitter_url").val());
    $.ajax({
      type: "POST",
      url: "/user/links",
      data: JSON.stringify({globe_url, github_url, facebook_url, weibo_url, twitter_url}),
      contentType: "application/json; charset=utf-8",
      success: () => {
        toastr.success("保存信息成功");
        setTimeout(() => {
          window
            .location
            .reload();
        }, 1000);
      },
      failure: () => {
        toastr.error("保存信息失败");
      }
    });
  });

  $("#user-skill-select-input").select2({
    tags: true,
    tokenSeparators: [","],
    ajax: {
      url: "/skills",
      delay: 250,
      dataType: "json",
      processResults: (data) => {
        return {results: data.data};
      },
      cache: true
    },
    createTag: (params) => {
      const term = $.trim(params.term);
      if (term === "") {
        return null;
      }
      return {
        id: term,
        text: term + " (新增)"
      };
    }
  });
});
