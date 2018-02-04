$(() => {
  const modal = $("#cover-modal");
  const modalImg = $("#cover-modal-img");
  $(".article-cover-img").click(function () {
    let bg = $(this).css('background-image');
    bg = bg
      .replace('url(', '')
      .replace(')', '')
      .replace(/\"/gi, "");
    modal.removeClass("hidden");
    console.log(bg)
    modalImg.attr("src", bg);
  });
  $("#cover-modal-close").click(function () {
    modal.addClass("hidden");
  })
  $("#hover-for-user-info").hover(_.debounce(function (event) {
    const left = event.pageX;
    const top = event.pageY;
    $("#user-profile-abs-hover")
      .css({top: top, left: left})
      .removeClass("hidden");
  }, 200), () => {
    $("#user-profile-abs-hover").addClass("hidden");
  });

  $("#comment-submit-btn").click(() => {
    const comment = $.trim($("#comment-content").val());
    const articleId = parseInt($("#comment-submit-btn").data("id"), 10);
    if (comment === "") {
      toastr.error("评论内容为空");
      return;
    }
    if (isNaN(articleId) || articleId <= 0) {
      toastr.error("文章ID不存在");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/comments",
      data: JSON.stringify({articleId, comment}),
      contentType: "application/json; charset=utf-8",
      success: () => {
        toastr.success("提交评论成功");
        setTimeout(() => {
          window
            .location
            .reload();
        }, 1000);
      },
      failure: () => {
        toastr.error("提交评论失败");
      }
    });
  });
});
