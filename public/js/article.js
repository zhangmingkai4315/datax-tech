$(() => {
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
      url: "/api/comments",
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
