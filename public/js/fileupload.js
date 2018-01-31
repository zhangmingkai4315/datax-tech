// 定义file上传的逻辑

$(function() {
  "use strict";
  var url = "/upload",
    uploadButton = $("<button/>")
      .addClass("btn btn-datax")
      .prop("disabled", true)
      .text("处理中,请稍候...")
      .on("click", function() {
        var $this = $(this),
          data = $this.data();
        $this
          .off("click")
          .text("已终止")
          .on("click", function() {
            $this.remove();
            data.abort();
          });
        data.submit().always(function() {
          $this.remove();
        });
      });
  $("#user-header-photo-upload")
    .fileupload({
      url: "/upload/userimg",
      dataType: "json",
      autoUpload: false,
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
      maxFileSize: 999000,
      disableImageResize: /Android(?!.*Chrome)|Opera/.test(
        window.navigator.userAgent
      ),
      previewMaxWidth: 100,
      previewMaxHeight: 100,
      previewCrop: true
    })
    .on("fileuploadadd", function(e, data) {
      $("#user-header-photo").hide();
      data.context = $("<div/>").appendTo("#files");
      $.each(data.files, function(index, file) {
        var node = $("<p/>").append($("<span/>").text(""));
        if (!index) {
          node.append("<br>").append(uploadButton.clone(true).data(data));
        }
        node.appendTo(data.context);
      });
    })
    .on("fileuploadprocessalways", function(e, data) {
      var index = data.index,
        file = data.files[index],
        node = $(data.context.children()[index]);
      if (file.preview) {
        node.prepend("<br>").prepend(file.preview);
      }
      if (file.error) {
        node
          .append("<br>")
          .append($('<span class="text-danger"/>').text(file.error));
      }
      if (index + 1 === data.files.length) {
        data.context
          .find("button")
          .text("上传头像")
          .prop("disabled", !!data.files.error);
        $("#progress").removeClass("hide");
      }
    })
    .on("fileuploadprogressall", function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      $("#progress .progress-bar").css("width", progress + "%");
    })
    .on("fileuploaddone", function(e, data) {
      $.each(data.result.files, function(index, file) {
        if (file.url) {
          var link = $("<a>")
            .attr("target", "_blank")
            .prop("href", file.url);
          $(data.context.children()[index]).wrap(link);
          // $('.profile-user-card img').attr("src", file.url);
          // $('.user-thumbnail-img').attr("src", file.url);
        } else if (file.error) {
          var error = $('<span class="text-danger"/>').text(file.error);
          $(data.context.children()[index])
            .append("<br>")
            .append(error);
        }
      });
      setTimeout(function() {
        window.location.reload();
      }, 2000);
      toastr.success("上传头像文件成功");
    })
    .on("fileuploadfail", function(e, data) {
      $.each(data.files, function(index) {
        var error = $('<span class="text-danger"/>').text("文件上传失败.");
        $(data.context.children()[index])
          .append("<br>")
          .append(error);
      });
      toastr.error("上传头像文件失败");
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
});
