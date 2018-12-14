(function () {
  'use strict';
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
  }
})();
$(document).ready(function () {
  let commentEditor = null;

  function layout() {
    // 加载瀑布流
    let windowWidth = $(window).width()
    if (windowWidth <= 576) {
      $('.cards').css({
        "width": "488px"
      })
      $('.cards').masonry({
        // set itemSelector so .grid-sizer is not used in layout
        itemSelector: '.card',
        // use element for option
        columnWidth: '.card',
        percentPosition: true,
        gutter: 16,
        resize: false
      })
    } else if (windowWidth <= 739) {
      $('.cards').css({
        "width": "488px"
      })
      $('.cards').masonry({
        // set itemSelector so .grid-sizer is not used in layout
        itemSelector: '.card',
        // use element for option
        columnWidth: '.card',
        percentPosition: false,
        gutter: 16,
        resize: false
      })
    } else {
      $('.cards').css({
        "width": "100%"
      })
      $('.cards').masonry({
        // set itemSelector so .grid-sizer is not used in layout
        itemSelector: '.card',
        // use element for option
        columnWidth: 236,
        percentPosition: true,
        gutter: 16,
        resize: false
      })
    }
    //$('body').css("min-width",$(window).width()+"px")
  }
  layout()
  $(window).resize(function () {
    layout()
  })

  window.showLoginForm = function () {
    $("#loginForm").modal('show')
    $("#registerForm").modal('hide')
  }
  window.showRegisterForm = function () {
    $("#registerForm").modal('show')
    $("#loginForm").modal('hide')
  }
  window.isLogin = function () {
    if (window.user) {
      return true
    }
    return false
  }

  function testEmail(str) {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (!str.trim()) { //输入不能为空
      //提示错误
      swal({
        title: '错误',
        text: "邮箱不能为空",
        icon: 'error',
        button: '确定',
      })
      return false;
    } else if (!reg.test(str)) { //正则验证不通过，格式不对
      //提示错误
      swal({
        title: '错误',
        text: "请输入正确的邮箱",
        icon: 'error',
        button: '确定',
      })
      return false;
    }
    return true
  }

  function testStrLen(key, str, min, max) {
    if (str.length < min || str.length > max) {
      //提示错误
      swal({
        title: '错误',
        text: key + "的长度应该在" + min + "和" + max + "之间",
        icon: 'error',
        button: '确定',
      })
      return false
    }
    return true
  }
  window.login = function () {
    let email = $("#login_email").val()
    if (!testEmail(email)) {
      return
    }
    let password = $("#login_password").val()
    if (!testStrLen("密码", password, 8, 20)) {
      return
    }
    $.ajax({
      type: "POST",
      url: "/api/v1/login/email",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        email: email,
        password: password
      }),
      dataType: "json",
      success: function (comment) {
        //TODO:获取用户的信息
        //隐藏
        $("#loginForm").modal('hide')
        //启用commentEditor
        enableCommentEditor(commentEditor)
      },
      error: function (message) {
        //提示错误
        swal({
          title: '错误',
          text: message.error,
          icon: 'error',
          button: '确定',
        })
      }
    });
  }
  window.regiter = function () {
    let username = $("#register_username").val()
    if (!testStrLen("用户名", username, 4, 20)) {
      return
    }
    let email = $("#register_email").val()
    if (!testEmail(email)) {
      return
    }
    let password = $("#register_password").val()
    if (!testStrLen("密码", password, 8, 20)) {
      return
    }
    $.ajax({
      type: "POST",
      url: "/api/v1/register/email",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
      dataType: "json",
      success: function (comment) {
        //隐藏
        $("#loginForm").modal('hide')
        //提示用户激活邮箱
        swal({
          title: '消息',
          text: '恭喜你，激活你的邮箱后就注册成功了',
          icon: 'success',
          button: '确定',
        })
      },
      error: function (message) {
        //提示错误
        swal({
          title: '错误',
          text: message.error,
          icon: 'error',
          button: '确定',
        })
      }
    });
  }
  window.like = function (id) {
    if (isLogin()) {
      $.ajax({
        type: "GET",
        url: "/api/v1/blogs/" + id + "/like",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          //提示用户激活邮箱
          swal({
            title: '消息',
            text: result.message,
            icon: 'success',
            button: '确定',
          })
        },
        error: function (result) {
          //提示错误
          swal({
            title: '错误',
            text: result.error,
            icon: 'error',
            button: '确定',
          })
        }
      });
    }else{
      //提示错误
      swal({
        title: '警告',
        text: '登录后才能点赞收藏',
        icon: 'warning',
        button: '确定',
      })
    }
  }
  window.unlike = function (id) {
    if (isLogin()) {
      $.ajax({
        type: "GET",
        url: "/api/v1/blogs/" + id + "/unlike",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          //提示用户激活邮箱
          swal({
            title: '消息',
            text: result.message,
            icon: 'success',
            button: '确定',
          })
        },
        error: function (result) {
          //提示错误
          swal({
            title: '错误',
            text: result.error,
            icon: 'error',
            button: '确定',
          })
        }
      });
    } else {
      //提示错误
      swal({
        title: '警告',
        text: '登录后才能取消点赞收藏',
        icon: 'warning',
        button: '确定',
      })
    }
  }
  function initListener(){
      //点赞
      $(".btn-like").click(function(e){
           let $ele=$(e.target)
           let blogId=$ele.prop("blog-id")
           if($ele.hasClass("liked")){
              $ele.removeClass("liked")
              $ele.text("点个赞吧")   
              like(blogId)
           }else{
              $ele.addClass("liked")
              $ele.text("已点赞") 
              unlike(blogId)  
           }
      });
  }
  initListener() 
  // 开启编辑功能 
  function enableCommentEditor(editor) {
    if ($("#comment_editor").length<0) {
      return
    }
    $("#new_comment").prop({
      disabled: false
    })
    editor.$textElem.attr('contenteditable', true)
    $("#comment_editor_body .comment_editor_placeholder").text("请输入内容")
    //点击提交
    $("#new_comment").click(function () {
      //如果已经登录
      if (window.user && window.blogId) {
        let commentText = editor.txt.text()
        if (commentText.length > 5) {
          $.ajax({
            type: "POST",
            url: "/api/v1/comments",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
              blog_id: window.blogId,
              content: commentText
            }),
            dataType: "json",
            success: function (comment) {
              //TODO:add to comment list
              //隐藏
              $("#comment_editor").css("display", "none")
            },
            error: function (message) {
              //提示错误
              swal({
                title: '错误',
                text: message.error,
                icon: 'error',
                button: '确定',
              })
            }
          });
        } else {
          //提示错误
          swal({
            title: '警告',
            text: '请输入至少5个字符！！！',
            icon: 'warning',
            button: '确定',
          })
        }
      }
    })
  }
  // 禁用编辑功能
  function disableCommentEditor(editor) {
    if ($("#comment_editor").length<0) {
      return
    }
    $("#new_comment").prop({
      disabled: true
    })
    editor.$textElem.attr('contenteditable', false)
    $("#comment_editor_body .comment_editor_placeholder").html("请先<a href='javascript:showLoginForm()'>登录</a>或<a href='javascript:showRegisterForm()'>注册</a>")
  }

  function initCommentEditor() {
    if ($("#comment_editor").length<0) {
      return
    }
    var E = window.wangEditor
    var commentEditor = new E('#comment_editor_header', '#comment_editor_body') // 两个参数也可以传入 elem 对象，class 选择器
    // 自定义菜单配置
    commentEditor.customConfig.menus = [
      'head',
      'bold',
      'italic',
      'underline',
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
    ]
    commentEditor.customConfig.zIndex = 1049
    commentEditor.create()
    if (!window.user) {
      disableCommentEditor(commentEditor)
    } else {
      enableCommentEditor(commentEditor)
    }

  }
  initCommentEditor()
});
