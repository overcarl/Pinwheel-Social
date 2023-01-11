$(function() {
  $("#postapost").submit(async (e) => {
    e.preventDefault();
    const datau = await fetch("/api/user/info");
    const user = await datau.json();
    console.log(user)
    if (!user) return window.location.href = "/api/auth/callback";

    $.post("/api/v1/post", {
      content: e.target[0].value
    }, function(data, error) {
      if (error) return;
    })
    lastposts()
    e.target[0].value = ""
  })
})