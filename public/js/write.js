$(() => {
  $("#article-cover-upload")
    .fileupload({
      url: "/article/uploadcoverimg",
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
    .on("fileuploadadd", () => {
      $("#article-cover-upload-btn")
        .prop("disabled", true)
        .text("上传中,请稍候...");
    })
    .on("fileuploaddone", (e, data) => {
      $("#article-cover-upload-btn")
        .prop("disabled", false)
        .text("修改封面");
      if (data.result && data.result.files && data.result.files.length > 0) {
        const fileInfo = data.result.files[0];
        $(".article-cover-img").css(
          "background-image",
          "url(" + fileInfo.url + ")"
        );
        $(".article-cover-img").attr(
          "data-thumbnail-img",
          fileInfo.thumbnailUrl
        );
      } else {
        toastr.success("上传封面失败，请重新上传");
      }
    })
    .on("fileuploadfail", e => {
      $("#article-cover-upload-btn").prop("disabled", false);
      toastr.error("上传头像文件失败");
    });
  $("#article-cover-upload-btn").click(() => {
    $("#article-cover-upload").click();
  });

  $("#article-new-submit").click(e => {
    e.preventDefault();
    const title = $.trim($("#article-title").val());
    const content = $.trim($("#article-content").val());
    const bg_url = $(".article-cover-img").css("background-image");
    const cover_url_list = /^url\((['"]?)(.*)\1\)$/.exec(bg_url);
    const tags = $("#article-tags-select-input").val();

    const cover_img = cover_url_list ? cover_url_list[2] : "";
    const cover_img_thumbnail =
      $(".article-cover-img").data("thumbnail-img") || "";
    $.ajax({
      type: "POST",
      url: "/articles",
      data: JSON.stringify({
        title,
        content,
        cover_img,
        cover_img_thumbnail,
        tags
      }),
      contentType: "application/json; charset=utf-8",
      success: data => {
        const id = data.data;
        if (typeof id !== "number") {
          toastr.error("保存信息失败");
        } else {
          toastr.success("保存信息成功");
          setTimeout(() => {
            window.location.replace(`/articles/${id}`);
          }, 1000);
        }
      },
      failure: () => {
        toastr.error("保存信息失败");
      }
    });
  });
});
