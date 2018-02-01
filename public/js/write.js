$(function() {
  $("#article-cover-upload")
    .fileupload({
      url: "/upload/articlecover",
      dataType: "json",
      autoUpload: true,
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
      maxFileSize: 1000000,
      disableImageResize: /Android(?!.*Chrome)|Opera/.test(
        window.navigator.userAgent
      ),
      previewMaxWidth: 400,
      previewMaxHeight: 300,
      previewCrop: true
    })
    .on("fileuploadadd", function(e, data) {
      $("#article-cover-upload-btn")
        .prop("disabled", true)
        .text("上传中,请稍候...");
    })
    .on("fileuploaddone", function(e, data) {
      $("#article-cover-upload-btn")
        .prop("disabled", false)
        .text("修改封面");
      if (data.result && data.result.files && data.result.files.length > 0) {
        const fileInfo = data.result.files[0];
        $(".article-cover-img").css(
          "background-image",
          "url(" + fileInfo.url + ")"
        );
      } else {
        toastr.success("上传封面失败，请重新上传");
      }
    })
    .on("fileuploadfail", function(e, data) {
      $("#article-cover-upload-btn").prop("disabled", false);
      toastr.error("上传头像文件失败");
    });
  $("#article-cover-upload-btn").click(function() {
    $("#article-cover-upload").click();
  });

  $("#article-new-submit").click(function(e) {
    e.preventDefault();
    const title = $.trim($("#article-title").val());
    const content = $.trim($("#article-content").val());
    const bg_url = $(".article-cover-img").css("background-image");
    const cover_url_list = /^url\((['"]?)(.*)\1\)$/.exec(bg_url);
    const head_img = cover_url_list ? cover_url_list[2] : "";
    console.log(cover_url_list);
    debugger;
    $.ajax({
      type: "POST",
      url: "/api/articles",
      data: JSON.stringify({ title, content, head_img }),
      contentType: "application/json; charset=utf-8",
      success: function() {
        toastr.success("保存信息成功");
      },
      failure: function() {
        toastr.error("保存信息失败");
      }
    });
  });
});
