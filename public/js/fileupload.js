// 定义file上传的逻辑

$(() => {
  const uploadButton = $("<button/>")
    .addClass("btn btn-datax")
    .prop("disabled", true)
    .text("处理中,请稍候...")
    .on("click", function () {
      const self = $(this);
      const data = self.data();
      self
        .off("click")
        .text("已终止")
        .on("click", () => {
          self.remove();
          data.abort();
        });
      data
        .submit()
        .always(() => {
          self.remove();
        });
    });
  $("#user-header-photo-upload").fileupload({
    url: "/user/upload/profileimg",
    dataType: "json",
    autoUpload: false,
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
    maxFileSize: 999000,
    disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
    previewMaxWidth: 100,
    previewMaxHeight: 100,
    previewCrop: true
  }).on("fileuploadadd", (e, data) => {
    $("#user-header-photo").hide();
    data.context = $("<div/>").appendTo("#files");
    $.each(data.files, (index) => {
      const node = $("<p/>").append($("<span/>").text(""));
      if (!index) {
        node
          .append("<br>")
          .append(uploadButton.clone(true).data(data));
      }
      node.appendTo(data.context);
    });
  }).on("fileuploadprocessalways", (e, data) => {
    const index = data.index;
    const file = data.files[index];
    const node = $(data.context.children()[index]);
    if (file.preview) {
      node
        .prepend("<br>")
        .prepend(file.preview);
    }
    if (file.error) {
      node
        .append("<br>")
        .append($("<span class='text-danger'/>").text(file.error));
    }
    if (index + 1 === data.files.length) {
      data
        .context
        .find("button")
        .text("上传头像")
        .prop("disabled", !!data.files.error);
      $("#progress").removeClass("hide");
    }
  }).on("fileuploadprogressall", (e, data) => {
    const progress = parseInt(data.loaded / data.total * 100, 10);
    $("#progress .progress-bar").css("width", progress + "%");
  }).on("fileuploaddone", (e, data) => {
    $.each(data.result.files, (index, file) => {
      if (file.url) {
        const link = $("<a>")
          .attr("target", "_blank")
          .prop("href", file.url);
        $(data.context.children()[index]).wrap(link);
      } else if (file.error) {
        const error = $("<span class='text-danger'/>").text(file.error);
        $(data.context.children()[index])
          .append("<br>")
          .append(error);
      }
    });
    setTimeout(() => {
      window
        .location
        .reload();
    }, 2000);
    toastr.success("上传头像文件成功");
  }).on("fileuploadfail", (e, data) => {
    $.each(data.files, (index) => {
      const error = $("<span class='text-danger'/>").text("文件上传失败.");
      $(data.context.children()[index])
        .append("<br>")
        .append(error);
    });
    toastr.error("上传头像文件失败");
  })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput
      ? undefined
      : "disabled");
});
