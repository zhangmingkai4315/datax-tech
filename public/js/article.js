$(() => {
  // 载入统计信息

  (function loadStaticInfo() {
    if (!$("#web-static-info").length) {
      return;
    }
    $.ajax({
      type: "GET",
      url: "/articles/stats",
      contentType: "application/json; charset=utf-8",
      success: data => {
        try {
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
          const info = data.data[0];
          if (info["count(*)"] && !isNaN(parseInt(info["count(*)"]))) {
            $("#articles-number").html(parseInt(info["count(*)"]));
          }
          if (
            info["sum(like_counter)"] &&
            !isNaN(parseInt(info["sum(like_counter)"]))
          ) {
            $("#like_counter").html(parseInt(info["sum(like_counter)"]));
          }
          if (
            info["sum(collected_counter)"] &&
            !isNaN(parseInt(info["sum(collected_counter)"]))
          ) {
            $("#collected_counter").html(
              parseInt(info["sum(collected_counter)"])
            );
          }
          if (
            info["sum(read_counter)"] &&
            !isNaN(parseInt(info["sum(read_counter)"]))
          ) {
            $("#read_counter").html(parseInt(info["sum(read_counter)"]));
          }
        } catch (err) {
          console.error(err);
        }
      },
      failure: err => {
        console.error(err);
      }
    });
  })();

  const modal = $("#cover-modal");
  const modalImg = $("#cover-modal-img");
  $(".article-cover-img").click(function() {
    let bg = $(this).css("background-image");
    bg = bg
      .replace("url(", "")
      .replace(")", "")
      .replace(/\"/gi, "");
    modal.removeClass("hidden");
    console.log(bg);
    modalImg.attr("src", bg);
  });
  $("#cover-modal-close").click(function() {
    modal.addClass("hidden");
  });
  $("#hover-for-user-info").hover(
    _.debounce(function(event) {
      const left = event.pageX;
      const top = event.pageY;
      $("#user-profile-abs-hover")
        .css({ top: top, left: left })
        .removeClass("hidden");
    }, 200),
    () => {
      $("#user-profile-abs-hover").addClass("hidden");
    }
  );

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
      data: JSON.stringify({ articleId, comment }),
      contentType: "application/json; charset=utf-8",
      success: () => {
        toastr.success("提交评论成功");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      failure: () => {
        toastr.error("提交评论失败");
      }
    });
  });

  $(".comment-reply").click(function(e) {
    const parentId = parseInt($(this).data("comment-id"), 10);
    if (isNaN(parentId) || parentId <= 0) {
      toastr.error("无法获取评论ID,请刷新页面");
      return;
    }

    if ($(this).hasClass("will-submit")) {
      // 执行提交流程
      const articleId = parseInt($("#comment-submit-btn").data("id"), 10);
      if (isNaN(articleId)) {
        toastr.error("文章ID不能为空");
        return;
      }
      const comment = $.trim($("#reply-comment-content").val());
      if (comment === "") {
        toastr.error("评论内容不能为空");
        return;
      }
      $.ajax({
        type: "POST",
        url: "/comments",
        data: JSON.stringify({ articleId, comment, parentId }),
        contentType: "application/json; charset=utf-8",
        success: () => {
          toastr.success("提交评论成功");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        failure: () => {
          toastr.error("提交评论失败");
        }
      });
    } else {
      // 执行切换输入框操
      $(".will-submit")
        .text("回复")
        .removeClass("will-submit");

      $(this)
        .closest(".comment-block")
        .append($("#reply-comment-box"));
      $("#reply-comment-box").removeClass("hidden");
      $("#reply-comment-box textarea").val("");
      $(this)
        .addClass("will-submit")
        .text("提交");
    }
  });
  function submitLike(like) {
    const articleId = parseInt($("#comment-submit-btn").data("id"), 10);
    if (isNaN(articleId)) {
      toastr.error("文章ID不能为空");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/article/like",
      data: JSON.stringify({ articleId, like }),
      contentType: "application/json; charset=utf-8",
      failure: () => {
        toastr.error("提交操作失败");
      },
      success: data => {
        const newValue = data.data;
        if (!isNaN(newValue)) {
          $("#like_number").html(data.data);
        }
      }
    });
  }

  function submitCollection(collected) {
    const articleId = parseInt($("#comment-submit-btn").data("id"), 10);
    if (isNaN(articleId)) {
      toastr.error("文章ID不能为空");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/article/collection",
      data: JSON.stringify({ articleId, collected }),
      contentType: "application/json; charset=utf-8",
      failure: () => {
        toastr.error("提交操作失败");
      },
      success: data => {
        const newValue = data.data;
        if (!isNaN(newValue)) {
          $("#collection_number").html(data.data);
        }
      }
    });
  }

  $(".heart i").on("click", function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      submitLike(false);
      return;
    }
    submitLike(true);
    $(this).addClass("active");
  });

  $(".collection i").on("click", function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      submitCollection(false);
      return;
    }
    submitCollection(true);
    $(this).addClass("active");
  });

  $("#article-tags-select-input").select2({
    tags: true,
    tokenSeparators: [","],
    ajax: {
      url: "/tags",
      delay: 250,
      dataType: "json",
      processResults: data => {
        return { results: data.data };
      },
      cache: true
    },
    createTag: params => {
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
