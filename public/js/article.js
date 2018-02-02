$(function() {
  $("#comment-submit-btn").click(function() {
    const comment = $.trim($("#comment-content").val());
    const article_id = parseInt($("#comment-submit-btn").data("id"));
    if (comment === "") {
      toastr.error("评论内容为空");
      return;
    }
    if (isNaN(article_id) || article_id <= 0) {
      toastr.error("文章ID不存在");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/api/comments",
      data: JSON.stringify({
        article_id: article_id,
        comment: comment
      }),
      contentType: "application/json; charset=utf-8",
      success: function() {
        toastr.success("提交评论成功");
        setTimeout(function() {
          window.location.reload();
        }, 1000);
      },
      failure: function() {
        toastr.error("提交评论失败");
      }
    });
  });
});
